const Conversation = require("../models/Conversation");
const { decodeJwtToken } = require("../utils/jwt");
const randomstring = require("randomstring");
const { Op } = require("sequelize");

const getConvoInfo = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  let { followeeId } = req.query;
  followeeId = +followeeId;
  try {
    let result = await Conversation.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: userData.user_id,
            receiver_id: followeeId,
          },
          {
            sender_id: followeeId,
            receiver_id: userData.user_id,
          },
        ],
      },
      raw: true,
    });
    if (result === null || result.length === 0) {
      const roomId = await createNewConversation(userData.user_id, followeeId);
      return res
        .status(200)
        .json([{ room_id: roomId }])
        .end();
    } else {
      result = result
        .map((res) => {
          if (res.sender_id === userData.user_id) {
            return { ...res, received: false };
          } else {
            return { ...res, received: true };
          }
        })
      return res.status(200).json(result).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

const createNewConversation = async (senderId, receiverId) => {
  const newRoomId = randomstring.generate();
  try {
    await Conversation.create({
      sender_id: senderId,
      receiver_id: receiverId,
      room_id: newRoomId,
    });
    return newRoomId;
  } catch (e) {
    throw Error("Server error");
  }
};

module.exports = {
  getConvoInfo,
};
