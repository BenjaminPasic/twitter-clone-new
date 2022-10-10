import axios from "axios";
import { redirect } from "react-router-dom";

const customAxios = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.data === "Invalid token") {
      console.log("true");
      return redirect("/login");
    }
  }
);

export default customAxios;
