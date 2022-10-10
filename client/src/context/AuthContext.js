import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  if (redirect === true) {
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, setRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
