import "../css/Post.css";
import { Avatar } from "@mui/material";
import customAxios from "../api/customAxios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import { useEffect, useState } from "react";
import { dateFormat } from "../utils/DateFormatter";
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

  const handleLike = () => {
    mutate({
      post_id: post.post_id,
    });
    setHasUserLiked(true);
    setLikeCount((prev) => prev + 1);
  };

  const handleCommentClick = () => {
    console.log("test", post);
    navigate(`/comments/${post.post_id}`, {
      state: post,
    });
  };

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
