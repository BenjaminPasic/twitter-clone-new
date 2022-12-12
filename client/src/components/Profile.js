import { useQuery, useMutation } from "react-query";
import "../css/Profile.css";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../api/userApi";
import Button from "@mui/material/Button";
import Posts from "./Posts";
import { useEffect, useState } from "react";
import EditFormDialog from "./EditFormDialog";
import { addNewFollow } from "../api/followApi";
import placeholderBanner from "../assets/images/banner-placeholder.jpeg";
import calendarIcon from "../assets/icons/calendar-icon.png";
import mapMarkerIcon from "../assets/icons/map-marker-icon.png";
import { dateFormatMonthYear } from "../utils/DateFormatter";

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

  return (
    <>
      <div className="profile">
        <img
          src={placeholderBanner}
          className="banner"
          alt="placeholder banner"
        />
        <div className="row-1">
          <span className="avatar">B</span>
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
            {`${profileData?.data?.name} ${profileData?.data?.surname}`}
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
        <h2 className="posts-h2">Posts</h2>
        <Posts localPost={[]} isProfile={true} />
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
