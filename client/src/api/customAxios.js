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
    if (error.response.status === 403) {
      return Promise.reject(error.response.data);
    }
    if (error.response.data === "Invalid token") {
      window.location.href = "/login";
    }
    console.log("Interceptor:", error);
  }
);

export default customAxios;
