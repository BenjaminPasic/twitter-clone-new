import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { verifyToken, getUsername } from "../api/userApi";

export default function ProtectedRoutes() {
  const { setIsAuth, isAuth, username, setUsername } = useAuth();

  const {
    data,
    refetch,
    isFetching: isFetchingUsername,
  } = useQuery("getUsername", getUsername, {
    onSuccess: ({ data }) => {
      setUsername(data?.username);
    },
    enabled: false,
  });

  const { isFetching, isLoading } = useQuery("verifyToken", verifyToken, {
    onSuccess: ({ data }) => {
      if (data.isTokenValid) {
        setIsAuth(true);
        if (username === undefined) {
          refetch();
        }
      } else {
        setIsAuth(false);
      }
    },
    cacheTime: 0,
    staleTime: 0,
  });

  if (isFetching || isLoading || isFetchingUsername)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return isAuth === true ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
