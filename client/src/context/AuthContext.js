import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("");
  const navigate = useNavigate();

  if (tokenStatus === "Invalid token") {
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
