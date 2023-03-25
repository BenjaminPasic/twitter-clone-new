const User = require("../models/User");
const dbConnection = require("../config/dbConnection");
const { encryptPassword, decryptPassword } = require("../utils/bcrypt");
const {
  createJwtToken,
  verifyJwtToken,
  decodeJwtToken,
} = require("../utils/jwt");
const { QueryTypes } = require("sequelize");

const registerUser = async (req, res) => {
  const doesUserExist = await User.findOne({
    where: {
      username: req.body.username,
    },
    raw: true,
  });
  if (doesUserExist === null) {
    try {
      const hashedPassword = await encryptPassword(req.body.password);
      await User.create({ ...req.body, password: hashedPassword });
      return res.status(200).json("successfully registered");
    } catch (error) {
      return res.status(500).end();
    }
  } else {
    return res.status(403).json("Username already exists").end();
  }
};

const loginUser = async (req, res) => {
  const { password, username } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
      raw: true,
    });
    if (user === null) throw "Invalid username";
    const doPasswordsMatch = await decryptPassword(password, user.password);
    if (doPasswordsMatch === false) throw "Passwords do not match";
    const payload = {
      user_id: user.id,
      username: user.username,
    };
    const jwtToken = await createJwtToken(payload);
    return res
      .status(200)
      .cookie("token", jwtToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(user.username);
  } catch (error) {
    res.status(401).json(error);
  }
};

const logoutUser = (req, res) => {
  res.status(200).clearCookie("token").end();
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (token === undefined || token === null) {
    res.status(200).json({ isTokenValid: false }).end();
  } else {
    const isTokenValid = await verifyJwtToken(token);
    res.status(200).json({ isTokenValid });
  }
};

const getUsername = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    const user = await User.findOne({
      attributes: ["username"],
      where: { id: userData.user_id },
      raw: true,
    });
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const getUserProfile = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  const currentUsername = req.query.username;
  try {
    const [user] = await dbConnection.query(
      `select id, name, surname, location, bio, createdAt,
       (SELECT COUNT(*) FROM follows WHERE follows_user_id = ${userData.user_id}) as follows,
       (SELECT COUNT(*) FROM follows WHERE user_id = ${userData.user_id}) as followers,
       EXISTS(SELECT 1 FROM follows f left join users u on f.follows_user_id = u.id where u.username = "${currentUsername}" AND f.user_id = ${userData.user_id}) as is_following
        from users u
        where username = "${currentUsername}";`,
      { type: QueryTypes.SELECT }
    );
    if (!user) {
      return res.status(200).json("No user found").end();
    }
    const {
      name,
      surname,
      id,
      createdAt,
      location,
      bio,
      followers,
      follows,
      is_following,
    } = user;
    let returnData = {
      name,
      surname,
      id,
      location,
      bio,
      followers,
      follows,
      is_current_user: false,
      is_following,
      createdAt,
    };
    if (userData.user_id === id) {
      return res.status(200).json({ ...returnData, is_current_user: true });
    }
    return res.status(200).json(returnData);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const profileUpdate = async (req, res) => {
  const { bio, location, updateUserId } = req.body;
  try {
    const userData = await decodeJwtToken(req.cookies.token);
    if (updateUserId !== userData.user_id) {
      return res
        .status(401)
        .json({ error: "You can't update a profile that isn't your own." });
    }
    await User.update({ bio, location }, { where: { id: updateUserId } });
    res.status(200).json({
      message: "Successfully updated",
    });
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const getUserBySearchParam = async (req, res) => {
  const { searchParam } = req.query;
  const filteredSearhParam = searchParam.trim().toLowerCase();
  try {
    const users = await dbConnection.query(
      `SELECT id, name, surname, username, bio, location FROM users
         where username LIKE "%${filteredSearhParam}%" 
         or name LIKE "%${filteredSearhParam}%" 
         or surname LIKE "%${filteredSearhParam}%"`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(users).end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

const checkIfFollows = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  let { otherUserId } = req.query;
  otherUserId = +otherUserId;
  if (otherUserId === userData.user_id) {
    return res.status(200).json("You").end();
  }
  try {
    const result = await dbConnection.query(
      `SELECT
            CASE WHEN EXISTS
            (
                select * from follows where user_id=${userData.user_id} and follows_user_id=${otherUserId}
            )
            THEN 1
            ELSE 0
        END as does_follow`,
      { type: QueryTypes.SELECT }
    );
    return res
      .status(200)
      .json(result[0].does_follow ? true : false)
      .end();
  } catch (e) {
    return res.status(503).end();
  }
};

const getCurrentUserPosts = async (req, res) => {
  const { user_id: currentUserId } = await decodeJwtToken(req.cookies.token);
  const { username } = req.query;
  try {
    let recentPosts = await dbConnection.query(
      `SELECT p.id AS post_id,
            u.id AS user_id,
            p.post, p.old_post, p.createdAt, u.username, p.updatedAt,
            l.user_id as liked_by_user_id,
            count(l.user_id) as total_likes,
            count(c.comment) as total_comments
            FROM posts p
            JOIN users u on p.user_id = u.id
            LEFT JOIN likes l ON l.post_id = p.id
            LEFT JOIN comments c on c.written_on_post_id = p.id
            WHERE u.username = "${username}"
            GROUP BY p.id, l.user_id
            ORDER BY total_likes desc
            LIMIT 10`,
      { type: QueryTypes.SELECT }
    );
    recentPosts = recentPosts.map((post) => {
      let editedPost = { ...post };
      if (post.liked_by_user_id === currentUserId) {
        editedPost = { ...editedPost, liked_by_current_user: true };
      }
      if (post.user_id === currentUserId) {
        editedPost = { ...editedPost, created_by_current_user: true };
        return editedPost;
      }
      return editedPost;
    });
    res.status(200).json({ recentPosts }).end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  logoutUser,
  getUserProfile,
  profileUpdate,
  getUsername,
  getUserBySearchParam,
  checkIfFollows,
  getCurrentUserPosts,
};
