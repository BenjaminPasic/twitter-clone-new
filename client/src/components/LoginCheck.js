import { useQuery } from "react-query";
import Home from "../components/Home";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const isLoggedIn = () => {
  return axios.get("/user/verifyToken");
};

export default function LoginCheck() {
  const [canContinue, setCanContinue] = useState(null);
  const { isFetching } = useQuery("isLoggedIn", isLoggedIn, {
    onSuccess: (data) => {
      //If the user has a valid token, deny access to login or register pages
      if (data.data.isTokenValid) {
        setCanContinue(false);
      } else {
        setCanContinue(true);
      }
    },
  });

  if (isFetching)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return canContinue === true ? <Outlet /> : <Home />;
}
