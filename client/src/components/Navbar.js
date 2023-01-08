import "../css/Navbar.css";
import logo from "../assets/Chitter-logos/Chatter.png";
import CircularProgress from "@mui/material/CircularProgress";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ListItemIcon } from "@mui/material";
import { logout } from "../api/userApi";
import { Logout } from "@mui/icons-material";

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
              {username ? username.charAt(0) : null}
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
          <Avatar /> Profile
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
