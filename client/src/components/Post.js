import "../css/Post.css";
import { Avatar } from "@mui/material";
import customAxios from "../api/customAxios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import { useEffect, useState } from "react";
import commentIcon from "../assets/icons/comment.svg";

const Post = ({ post }) => {
  const { mutate } = useMutation(addNewLike);
  const [likeCount, setLikeCount] = useState(undefined);
  const [hasUserLiked, setHasUserLiked] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!post.isLocalPost) {
      customAxios
        .get("/like/count", {
          params: {
            post_id: post.post_id,
          },
        })
        .then((res) => {
          console.log(res);
          setLikeCount(res.data.postLikes);
        })
        .catch((err) => {
          console.log(err);
        });

      customAxios
        .get("/like/checkIfLiked", {
          params: {
            post_id: post.post_id,
          },
        })
        .then((res) => {
          setHasUserLiked(res.data.hasUserLiked);
        });
    }
  }, []);

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

  const handleLike = () => {
    mutate({
      post_id: post.post_id,
    });
    setHasUserLiked(true);
    setLikeCount((prev) => prev + 1);
  };

  const handleCommentClick = () => {
    navigate(`/comments/${post.post_id}`, {
      state: post,
    });
  };

  console.log(post);

  return (
    <div
      className="post"
      style={{
        width: post.singlePost && "70%",
        margin: post.singlePost && "0 auto",
      }}
    >
      <Avatar>{post.username.charAt(0)}</Avatar>
      <div className="wrapper">
        <div className="top-portion">
          <span className="username">{post.username}</span>
          <span className="separator">&#183;</span>
          <span className="date">{dateFormat(post.createdAt)}</span>
        </div>
        <p style={{ fontSize: post.singlePost && "18px" }}>{post.post}</p>
        <div className="bottom-portion">
          {hasUserLiked ? (
            <button disabled>already liked</button>
          ) : (
            <button onClick={handleLike}>U can like</button>
          )}
          <span className="like-counter">{likeCount ? likeCount : 0}</span>
          {post.singlePost ? null : (
            <img
              src={commentIcon}
              alt="comment icon"
              className="comment-icon"
              onClick={handleCommentClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
