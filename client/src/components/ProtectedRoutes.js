import { useQuery } from "react-query";
import Login from "../components/Login";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const verifyToken = () => {
  return axios.get("/user/verifyToken");
};

export default function ProtectedRoutes() {
  const { setIsAuth, isAuth } = useAuth();
  const { isFetching, isLoading } = useQuery("verifyToken", verifyToken, {
    onSuccess: (data) => {
      //If the user has a valid token, deny access to login and register page
      if (data.data.isTokenValid) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    },
  });

  if (isFetching || isLoading)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return isAuth === true ? <Outlet /> : <Login />;
}
