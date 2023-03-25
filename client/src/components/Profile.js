import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { addNewFollow } from "../api/followApi";
import { getCurrentUserPosts, getUserProfile } from "../api/userApi";
import calendarIcon from "../assets/icons/calendar-icon.png";
import mapMarkerIcon from "../assets/icons/map-marker-icon.png";
import placeholderBanner from "../assets/images/banner-placeholder.jpeg";
import "../css/Profile.css";
import { dateFormatMonthYear } from "../utils/DateFormatter";
import EditFormDialog from "./EditFormDialog";
import Posts from "./Posts";

const Profile = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(undefined);
  const { username } = useParams();
  const {
    data: profileData,
    isFetching,
    refetch,
  } = useQuery(["profile", username], () => getUserProfile(username), {
    onSuccess: ({ data }) => {
      setIsFollowing(data.is_following === 1);
    },
  });

  const { data: profilePosts, isFetching: isFetchingPosts } = useQuery(
    ["userPosts", username],
    () => getCurrentUserPosts(username)
  );

  const { mutate } = useMutation(addNewFollow);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    mutate(profileData.data.id);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (isFetchingPosts || isFetching) {
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );
  }

  if (profileData.data === "No user found") {
    return (
      <h1 style={{ color: "white" }}>No user found, redirecting back...</h1>
    );
  }

  return (
    <>
      <div className="profile">
        <img
          src={placeholderBanner}
          className="banner"
          alt="placeholder banner"
        />
        <div className="row-1">
          <span className="avatar">{username.charAt(0).toUpperCase()}</span>
          {profileData?.data?.is_current_user ? (
            <Button
              onClick={handleOpenDialog}
              color="success"
              sx={{ maxHeight: 36, marginLeft: "auto" }}
              variant="contained"
            >
              Edit Profile
            </Button>
          ) : isFollowing ? (
            <Button
              onClick={handleFollow}
              sx={{ maxHeight: 36, marginLeft: "auto" }}
              variant="contained"
              color="error"
            >
              Unfollow
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              sx={{ maxHeight: 36, marginLeft: "auto" }}
              variant="contained"
            >
              Follow
            </Button>
          )}
        </div>
        <div className="username-container">
          <span className="fullname">
            {`${profileData?.data.name} ${profileData?.data?.surname}`}
          </span>
          <span className="username">@{username}</span>
          <div className="icons">
            <img
              style={{ color: "white" }}
              src={calendarIcon}
              alt="Calendar icon"
            />
            <span className="join-date">
              Joined {dateFormatMonthYear(profileData?.data?.createdAt)}
            </span>
            {profileData?.data?.location && (
              <>
                <img src={mapMarkerIcon} alt="Map marker icon" />
                <span className="location">{profileData?.data?.location}</span>
              </>
            )}
          </div>
          <p className="bio">{profileData?.data?.bio}</p>
          <div className="follows">
            <span>{profileData?.data?.followers} </span>
            <span className="follow-color">Followers</span>
            <span>{profileData?.data?.follows} </span>
            <span className="follow-color">Following</span>
          </div>
        </div>
        {profilePosts.data.recentPosts.length > 0 ? (
          <>
            <h2 className="posts-h2">Top posts</h2>
            <Posts posts={profilePosts.data.recentPosts} />
          </>
        ) : (
          <h1 style={{ color: "white" }}>This user hasn't posted anything</h1>
        )}
      </div>
      <EditFormDialog
        user={profileData?.data}
        handleOpen={handleOpenDialog}
        handleClose={handleCloseDialog}
        open={openDialog}
        refetch={refetch}
      />
    </>
  );
};

export default Profile;
