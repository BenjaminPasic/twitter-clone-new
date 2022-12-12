import "../css/Post.css";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import { useEffect, useState } from "react";
import { dateFormat } from "../utils/DateFormatter";
import commentIcon from "../assets/icons/comment.svg";

const Post = ({ post, isLocalPost }) => {
  const { mutate } = useMutation(addNewLike);
  const [likeCount, setLikeCount] = useState(undefined);
  const [commentCount, setCommentCount] = useState(undefined);
  const [hasUserLiked, setHasUserLiked] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setCommentCount(post.total_comments);
      setLikeCount(post.total_likes);
      setHasUserLiked(post.liked_by_current_user);
    }
  }, []);

  const handleLike = () => {
    if (isLocalPost) {
      setHasUserLiked((prev) => !prev);
      if (hasUserLiked) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }
    } else {
      mutate({
        post_id: post?.post_id,
      });
      setHasUserLiked((prev) => !prev);
      if (hasUserLiked) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }
    }
  };

  const handleCommentClick = () => {
    navigate(`/comments/${post.post_id}`, {
      state: post,
    });
  };

  const handleRedirect = () => {
    navigate("/profile/" + post.username);
  };

  return (
    <div
      className="post"
      style={{
        width: post.singlePost && "70%",
        margin: post.singlePost && "0 auto",
      }}
    >
      <Avatar onClick={handleRedirect}>{post.username.charAt(0)}</Avatar>
      <div className="wrapper">
        <div className="top-portion">
          <span className="username" onClick={handleRedirect}>
            {post.username}
          </span>
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
