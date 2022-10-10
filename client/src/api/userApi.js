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
