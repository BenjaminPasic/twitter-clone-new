import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { verifyToken } from "../api/userApi";

export default function ProtectedRoutes() {
  const { setIsAuth, isAuth } = useAuth();

  const { isFetching, isLoading } = useQuery("verifyToken", verifyToken, {
    enabled: false,
    onSuccess: (data) => {
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

  return isAuth === true ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
