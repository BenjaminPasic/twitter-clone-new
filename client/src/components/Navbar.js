import "../css/Navbar.css";
import logo from "../assets/Chitter-logos/Chatter.png";
import logoutIcon from "../assets/icons/log-out.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/userApi";

export default function Navbar() {
  const { isLoading, isFetching, refetch } = useQuery("logout", logout, {
    enabled: false,
  });
  const { setIsAuth, username } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

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

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAvatarClick = () => {
    navigate("/profile/" + username);
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
        <img onClick={handleLogoClick} src={logo} alt="Chitter logo temp" />
        <input
          placeholder="Search"
          onKeyDown={(e) => handleKeyPress(e)}
          onChange={(e) => handleChange(e)}
        />
        <div>
          <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "red" }}>
            {username ? username.charAt(0) : null}
          </Avatar>
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
