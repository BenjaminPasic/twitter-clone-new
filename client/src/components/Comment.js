import "../css/Comment.css";
import { Avatar } from "@mui/material";
import dateFormat from "../utils/DateFormatter";
import { useMutation } from "react-query";
import { commentLike } from "../api/commentLikeApi";
import customAxios from "../api/customAxios";
import { useState } from "react";
import Reply from "./Reply";

const Comment = ({ comment, defineDialogData, handleOpenDialog }) => {
  const [offset, setOffset] = useState(0);
  const [replies, setReplies] = useState([]);
  const [isReplyHidden, setIsReplyHidden] = useState(true);
  const { mutate } = useMutation(commentLike);

  const handleLike = () => {
    mutate({ comment_id: comment.id, post_id: comment.post_id });
  };

  const handleOpenComment = () => {
    defineDialogData(comment);
    handleOpenDialog();
  };

  const handleHideReplies = () => {
    setIsReplyHidden(true);
  };

  const handleShowReply = () => {
    setIsReplyHidden(false);
    customAxios
      .get("/commentreply/recent/" + offset, {
        params: {
          comment_id: comment.id,
        },
      })
      .then(({ data }) => {
        console.log(data);
        setReplies((prevState) => [...prevState, ...data]);
        setOffset((prevState) => prevState + 10);
      });
  };

  return (
    <div className="single-comment-wrapper">
      <div className="single-comment">
        <Avatar>B</Avatar>
        <div className="upper-part">
          <span className="username">{comment.username}</span>
          <span className="seperator">&#183;</span>
          <span className="date">{dateFormat(comment.createdAt)}</span>
          <p>{comment.comment}</p>
          {comment.liked_by_current_user ? (
            <button onClick={handleLike}>Dislike</button>
          ) : (
            <button onClick={handleLike}>Like</button>
          )}
          <span>{comment.total_likes}</span>
          <button onClick={handleOpenComment}>Comment</button>
          <div className="modal"></div>
        </div>
      </div>
      <div className="reply-count">
        {comment.total_replies > 0 ? (
          <span className="wrapper">
            {isReplyHidden ? (
              <span onClick={handleShowReply}>
                Show {comment.total_replies}{" "}
                {comment.total_replies > 1 ? "replies" : "reply"}
              </span>
            ) : (
              <span onClick={handleHideReplies}>Hide replies</span>
            )}
          </span>
        ) : null}
      </div>
      <div className={`replies ${isReplyHidden ? "hide" : ""}`}>
        {replies.map((reply) => {
          return (
            <Reply key={reply.id} reply={reply} username={comment.username} />
          );
        })}
        <div className="reply-count">
          <span className="wrapper" onClick={handleShowReply}>
            Load more
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
