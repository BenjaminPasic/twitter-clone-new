import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginCheck() {
  const { isAuth, setIsAuth } = useAuth();

  return isAuth === false ? <Outlet /> : <Navigate to="/home" replace={true} />;
}
