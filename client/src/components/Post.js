import "../css/Post.css";
import { Avatar } from "@mui/material";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import likeIcon from "../assets/PostIcons/like-icon.png";
import { useEffect } from "react";

const Post = ({ post }) => {
  const { mutate, isLoading } = useMutation(addNewLike, {
    onSuccess: (data) => {
      if (data.data.isSuccess) {
        console.log(data);
      }
    },
  });

  const dateFormat = (date) => {
    if (date === "now") return "now";

    const currentTime = new Date();
    const datePostedAt = new Date(date);
    const whenWasPostCreatedInSeconds = Math.floor(
      Math.abs((currentTime - datePostedAt) / 1000)
    );

    if (whenWasPostCreatedInSeconds < 60) {
      return whenWasPostCreatedInSeconds + "s";
    }
    if (
      whenWasPostCreatedInSeconds > 60 &&
      whenWasPostCreatedInSeconds < 3600
    ) {
      return Math.floor(whenWasPostCreatedInSeconds / 60) + "m";
    }
    if (whenWasPostCreatedInSeconds < 86400) {
      return Math.floor(whenWasPostCreatedInSeconds / 60 / 60) + "h";
    }

    const day = datePostedAt.getDay() + 1;
    const month = datePostedAt.toLocaleString("default", { month: "short" });

    if (whenWasPostCreatedInSeconds > 525600) {
      const year = datePostedAt.getFullYear();
      return day + " " + month + " " + year;
    }

    return day + " " + month;
  };

  console.log(post);

  const handleLike = () => {
    mutate({
      post_id: post.post_id,
    });
  };

  return (
    <div className="post">
      <Avatar>{post.username.charAt(0)}</Avatar>
      <div className="wrapper">
        <div className="top-portion">
          <span className="username">{post.username}</span>
          <span className="seperator">&#183;</span>
          <span className="date">{dateFormat(post.createdAt)}</span>
        </div>
        <p>{post.post}</p>
        <div className="bottom-portion">
          <button onClick={handleLike}>tempLike</button>
          <span className="like-counter">0</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
