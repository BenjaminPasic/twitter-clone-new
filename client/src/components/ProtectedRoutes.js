import { useQuery } from "react-query";
import Login from "../components/Login";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useState } from "react";
const verifyToken = () => {
  return axios.get("/user/verifyToken");
};

export default function ProtectedRoutes() {
  const [isTokenValid, setIsTokenValid] = useState(null);
  const { isFetching } = useQuery("verifyToken", verifyToken, {
    onSuccess: (data) => {
      //If the user has a valid token, deny access to login or register pages
      if (data.data.isTokenValid) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
      }
    },
  });

  if (isFetching)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return isTokenValid === true ? <Outlet /> : <Login />;
}
