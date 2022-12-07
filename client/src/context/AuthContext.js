import { useState, createContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState(undefined);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
