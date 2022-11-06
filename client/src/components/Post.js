import "../css/Post.css";
import { Avatar } from "@mui/material";
import customAxios from "../api/customAxios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import { useEffect, useState } from "react";
import dateFormat from "../utils/DateFormatter";
import commentIcon from "../assets/icons/comment.svg";

const Post = ({ post }) => {
  const { mutate } = useMutation(addNewLike);
  const [likeCount, setLikeCount] = useState(undefined);
  const [commentCount, setCommentCount] = useState(undefined);
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
        .get("/like/checkifliked", {
          params: {
            post_id: post.post_id,
          },
        })
        .then((res) => {
          setHasUserLiked(res.data.hasUserLiked);
        });

      customAxios
        .get("/comment/count", {
          params: {
            post_id: post.post_id,
          },
        })
        .then((data) => setCommentCount(data.data));
    }
  }, []);

  const handleLike = () => {
    mutate({
      post_id: post.post_id,
    });
    setHasUserLiked((prev) => !prev);
    if (hasUserLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleCommentClick = () => {
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
            <button onClick={handleLike}>Dislike</button>
          ) : (
            <button onClick={handleLike}>Like</button>
          )}
          <span className="like-counter">{likeCount ? likeCount : 0}</span>
          {post.singlePost ? null : (
            <>
              <img
                src={commentIcon}
                alt="comment icon"
                className="comment-icon"
                onClick={handleCommentClick}
              />
              <span>{commentCount}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
