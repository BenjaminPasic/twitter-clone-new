import "../css/Comment.css";
import { Avatar } from "@mui/material";
import dateFormat from "../utils/DateFormatter";
import { useMutation } from "react-query";
import { commentLike } from "../api/commentLikeApi";
import customAxios from "../api/customAxios";
import { useState, useEffect } from "react";

const Comment = ({ comment }) => {
  const { mutate } = useMutation(commentLike);
  const [commentLikes, setCommentLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  //todo add dislike comment

  useEffect(() => {
    customAxios
      .get("/commentlike/count", {
        params: {
          comment_id: comment.id,
        },
      })
      .then((data) => setCommentLikes(data.data.commentLikes));

    customAxios
      .get("/commentlike/checkifliked", {
        params: {
          comment_id: comment.id,
        },
      })
      .then((data) => setHasLiked(data.data.hasUserLiked));
  }, []);

  const handleLike = () => {
    mutate({ comment_id: comment.id, post_id: comment.post_id });
    if (hasLiked) {
      setCommentLikes((prev) => prev - 1);
      setHasLiked(!hasLiked);
    } else {
      setCommentLikes((prev) => prev + 1);
      setHasLiked(!hasLiked);
    }
  };

  return (
    <div className="single-comment">
      <Avatar>B</Avatar>
      <div className="upper-part">
        <span className="username">{comment.username}</span>
        <span className="seperator">&#183;</span>
        <span className="date">{dateFormat(comment.createdAt)}</span>
        <p>{comment.comment}</p>
        {hasLiked ? (
          <button onClick={handleLike}>Dislike</button>
        ) : (
          <button onClick={handleLike}>Like</button>
        )}
        <span>{commentLikes}</span>
      </div>
    </div>
  );
};

export default Comment;
