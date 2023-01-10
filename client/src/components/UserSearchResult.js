import { Avatar } from "@mui/material";
import "../css/UserSearchResult.css";
import Button from "@mui/material/Button";
import { useQuery, useMutation } from "react-query";
import { checkIfFollows } from "../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import { addNewFollow } from "../api/followApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserSearchResult = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(undefined);
  const navigate = useNavigate();
  const { data, isFetching } = useQuery(
    "user" + user.username,
    () => checkIfFollows(user.id),
    {
      onSuccess: ({ data }) => {
        setIsFollowing(data);
      },
    }
  );
  const { mutate: followMutate } = useMutation(addNewFollow);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    followMutate(user.id);
  };

  const handleUsernameClick = () => {
    navigate("/profile/" + user.username);
  };

  if (isFetching) {
    return (
      <div className="user-search-result">
        <CircularProgress sx={{ margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <div className="user-search-result">
      <Avatar onClick={handleUsernameClick}>{user.username.charAt(0)}</Avatar>
      <div className="flex-row-2">
        <p className="full-name" onClick={handleUsernameClick}>
          {user.name + " " + user.surname}
        </p>
        <p className="username" onClick={handleUsernameClick}>
          @{user.username}
        </p>
        <p className="bio">{user.bio}</p>
        {isFollowing === "You" ? (
          <Button
            variant="contained"
            size="small"
            sx={{ position: "absolute", top: "0", right: "0" }}
            onClick={handleUsernameClick}
          >
            Profile
          </Button>
        ) : isFollowing ? (
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{ position: "absolute", top: "0", right: "0" }}
            onClick={handleFollow}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            color="success"
            sx={{ position: "absolute", top: "0", right: "0" }}
            onClick={handleFollow}
          >
            Follow
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSearchResult;
