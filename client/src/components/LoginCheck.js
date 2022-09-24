import { useQuery } from "react-query";
import Home from "../components/Home";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const isLoggedIn = () => {
  return axios.get("/user/verifyToken");
};

export default function LoginCheck() {
  const { setIsAuth, isAuth } = useAuth();
  const { isFetching } = useQuery("isLoggedIn", isLoggedIn, {
    onSuccess: (data) => {
      //If the user has a valid token, deny access to login or register pages
      if (data.data.isTokenValid) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    },
  });

  if (isFetching)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return isAuth === false ? <Outlet /> : <Home />;
}
