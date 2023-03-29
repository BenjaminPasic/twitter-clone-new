import customAxios from "./customAxios";

export const logout = () => {
  return customAxios.get("/user/logout");
};

export const login = (loginData) => {
  return customAxios.post("/user/login", loginData);
};

export const register = (registerData) => {
  return customAxios.post("/user/register", registerData);
};

export const verifyToken = () => {
  return customAxios.get("/user/verifyToken");
};

export const getUserProfile = (username) => {
  return customAxios.get("/user/profile", {
    params: {
      username,
    },
  });
};

export const getUsername = () => {
  return customAxios.get("/user/username");
};

export const updateUserProfile = (updateData) => {
  return customAxios.put("/user/profileUpdate", updateData);
};

export const getUsersBySearchParam = (searchParam) => {
  return customAxios.get("/user/userSearch", {
    params: {
      searchParam,
    },
  });
};

export const checkIfFollows = (otherUserId) => {
  return customAxios.get("/user/checkIfFollows", {
    params: {
      otherUserId,
    },
  });
};

export const getCurrentUserPosts = (username) => {
  return customAxios.get("/user/currentUserPosts", {
    params: {
      username,
    },
  });
};
