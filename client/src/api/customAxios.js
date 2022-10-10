import axios from "axios";

const customAxios = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Figure out how to do it without redownloading the entire document later...
    if (error.response.data === "Invalid token") {
      window.location.href = "/login";
    }
  }
);

export default customAxios;
