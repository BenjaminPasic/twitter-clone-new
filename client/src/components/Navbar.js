import "../css/Navbar.css";
import logo from "../assets/Chitter-logos/Chatter.png";
import logoutIcon from "../assets/icons/log-out.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "react-query";
import { logout } from "../api/userApi";

export default function Navbar() {
  const { isLoading, isFetching, refetch } = useQuery("logout", logout, {
    enabled: false,
  });
  const { setIsAuth } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchInput) {
        console.log(searchInput);
      }
    }
  };

  const handleSignout = () => {
    refetch();
    setIsAuth(false);
  };

  if (isLoading || isFetching) {
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="navbar">
      <nav>
        <img src={logo} alt="Chitter logo temp" />
        <input
          placeholder="Search"
          onKeyDown={(e) => handleKeyPress(e)}
          onChange={(e) => handleChange(e)}
        />
        <div>
          <Avatar sx={{ bgcolor: "red" }}>B</Avatar>
          <img
            src={logoutIcon}
            alt="logout icon"
            className="logout-icon"
            onClick={handleSignout}
          />
        </div>
      </nav>
    </div>
  );
}
