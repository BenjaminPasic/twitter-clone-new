import useAuth from "../hooks/useAuth";
import { verifyToken } from "../api/userApi";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";

export default function CheckIfLoggedIn() {
  const { isAuth, setIsAuth } = useAuth();

  const { isFetching, isLoading } = useQuery("verifyToken", verifyToken, {
    onSuccess: (data) => {
      console.log(data);
      if (data.data.isTokenValid) {
        console.log("tru");
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

  return isAuth === true ? <Navigate to="" replace={true} /> : <Outlet />;
}
