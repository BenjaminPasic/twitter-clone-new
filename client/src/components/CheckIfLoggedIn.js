import useAuth from "../hooks/useAuth";
import { verifyToken } from "../api/userApi";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function CheckIfLoggedIn() {
  const { isAuth, setIsAuth } = useAuth();

  const { isFetching, isLoading, data } = useQuery("verifyToken", verifyToken, {
    onSuccess: (data) => {
      if (data.data.isTokenValid) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    },
  });

  if (isFetching || isLoading) {
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );
  }

  return isAuth === true ? <Navigate to="/" replace={true} /> : <Outlet />;
}
