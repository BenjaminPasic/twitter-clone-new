import { Logout } from "@mui/icons-material";
import Chat from "@mui/icons-material/Chat";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/userApi";
import logo from "../assets/Chitter-logos/Chatter.png";
import "../css/Navbar.css";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { isLoading, isFetching, refetch } = useQuery("logout", logout, {
    enabled: false,
  });
  const { setIsAuth, username } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchInput) {
        navigate("/search/" + searchInput);
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

  const handleChatClick = () => {
    navigate("/chat");
  };

  const handleIconClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <IconButton onClick={(e) => handleIconClick(e)} size="small">
            <Avatar sx={{ bgcolor: "red" }}>
              {username && username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </div>
      </nav>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleAvatarClick}>
          <Avatar>{username && username.charAt(0)}</Avatar>
          Profile
        </MenuItem>
        <MenuItem onClick={handleChatClick}>
          <ListItemIcon>
            <Chat fontSize="small" />
          </ListItemIcon>
          Chat
        </MenuItem>
        <MenuItem onClick={handleSignout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
