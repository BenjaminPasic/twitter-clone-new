import "../css/Comment.css";
import { Avatar } from "@mui/material";
import { dateFormat } from "../utils/DateFormatter";
import { useMutation } from "react-query";
import { commentLike } from "../api/commentLikeApi";
import { deleteComment } from "../api/commentApi";
import customAxios from "../api/customAxios";
import { useState } from "react";
import Reply from "./Reply";
import useAuth from "../hooks/useAuth";
import trashIcon from "../assets/icons/trash-icon.png";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

const Comment = ({
  comment,
  defineDialogData,
  handleOpenDialog,
  localReplies,
  isReplyComment,
  filterDeletedCommentById,
}) => {
  const [offset, setOffset] = useState(0);
  const [replies, setReplies] = useState([]);
  const [isReplyHidden, setIsReplyHidden] = useState(true);
  const { mutate } = useMutation(commentLike);
  const { mutate: deleteCommentMutate } = useMutation(deleteComment, {
    onSuccess: () => {
      filterDeletedCommentById(comment.id);
    },
  });
  const { username } = useAuth();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

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

  const handleDeleteComment = () => {
    deleteCommentMutate(comment.id);
    handleCloseConfirmDialog();
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
            <span className="delete-icon" onClick={handleOpenConfirmDialog}>
              <img src={trashIcon} alt="trash icon" />
            </span>
          </div>
          <p>{comment.comment}</p>
          {comment.liked_by_current_user ? (
            <button onClick={handleLike}>Dislike</button>
          ) : (
            <button onClick={handleLike}>Like</button>
          )}
          <span>{comment.total_likes}</span>f
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
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Close</Button>
          <Button onClick={handleDeleteComment} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Comment;
