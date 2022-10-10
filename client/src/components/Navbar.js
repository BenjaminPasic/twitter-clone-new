import "../css/Navbar.css";
import logo from "../assets/Chitter-logos/Chatter.png";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "react-query";
import { logout } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoading, isFetching, refetch } = useQuery("logout", logout, {
    enabled: false,
  });
  const { setIsAuth, isAuth } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate("/login");
  //   }
  // }, [isAuth]);

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
          <IconButton onClick={handleSignout}>
            <LogoutOutlinedIcon
              className="logout-icon"
              sx={{ "&:hover": { bgcolor: "#2c2633", cursor: "pointer" } }}
            />
          </IconButton>
        </div>
      </nav>
    </div>
  );
}
