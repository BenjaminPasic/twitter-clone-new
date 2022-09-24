import axios from "axios";

export const logout = () => {
  return axios.get("/user/logout");
};

export const login = (loginData) => {
  return axios.post("/user/login", loginData);
};

export const register = (registerData) => {
  return axios.post("/user/register", registerData);
};
