import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

const isLoggedIn = () => {
  return axios.get("/user/verifyToken");
};

export default function LoginCheck() {
  const [canContinue, setCanContinue] = useState(false);
  const navigate = useNavigate();
  const { isFetching } = useQuery("isLoggedIn", isLoggedIn, {
    onSuccess: (data) => {
      //If the user has a valid token, deny access to login or register pages
      if (data.data.isTokenValid) {
        navigate("/");
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

  if (canContinue) return <Outlet />;
}
