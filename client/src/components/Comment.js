import "../css/Comment.css";
import { Avatar } from "@mui/material";
import { dateFormat } from "../utils/DateFormatter";
import { useMutation } from "react-query";
import { commentLike } from "../api/commentLikeApi";
import customAxios from "../api/customAxios";
import { useState } from "react";
import Reply from "./Reply";
import useAuth from "../hooks/useAuth";

const Comment = ({
  comment,
  defineDialogData,
  handleOpenDialog,
  localReplies,
  isReplyComment,
}) => {
  const [offset, setOffset] = useState(0);
  const [replies, setReplies] = useState([]);
  const [isReplyHidden, setIsReplyHidden] = useState(true);
  const { mutate } = useMutation(commentLike);
  const { username } = useAuth();

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
        setReplies((prevState) => [...data, ...prevState]);
        setOffset((prevState) => prevState + 10);
      });
  };

  return (
    <div className="single-comment-wrapper">
      <div className="single-comment">
        <Avatar>{comment.username.charAt(0)}</Avatar>
        <div className="upper-part">
          <div style={{ display: "flex" }}>
            <span className="username">{comment.username}</span>
            <span className="seperator">&#183;</span>
            <span className="date">{dateFormat(comment.createdAt)}</span>
            <span className="delete-icon">
              //todo Add delete icon, and delete the thing.
              <img src="https://via.placeholder.com/10" />
            </span>
          </div>
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
        {!isReplyComment &&
          localReplies?.length > 0 &&
          localReplies.map((reply, index) => {
            return (
              <Reply
                key={index}
                reply={{
                  username,
                  createdAt: "now",
                  reply,
                }}
              />
            );
          })}
        {replies.map((reply) => {
          return <Reply key={reply.id} reply={reply} />;
        })}
        <div className="reply-count">
          {comment.total_replies > 0 && (
            <span className="wrapper" onClick={handleShowReply}>
              Load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
