import "../css/Comment.css";
import { Avatar } from "@mui/material";
import { dateFormat } from "../utils/DateFormatter";
import { useMutation } from "react-query";
import { commentLike } from "../api/commentLikeApi";
import { deleteComment } from "../api/commentApi";
import customAxios from "../api/customAxios";
import { useEffect, useState } from "react";
import Reply from "./Reply";
import trashIcon from "../assets/icons/trash-icon.png";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import CommentFormDialog from "./CommentFormDialog";
import CircularProgress from "@mui/material/CircularProgress";

const Comment = ({ comment, filterDeletedCommentById }) => {
  const [offset, setOffset] = useState(0);
  const [replies, setReplies] = useState([]);
  const [isReplyHidden, setIsReplyHidden] = useState(true);
  const [recentlyAdded, setRecentlyAdded] = useState(false);
  const [isFetchingReplies, setIsFetchingReplies] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [commentReplyCount, setCommentReplyCount] = useState(0);
  const [isLiked, setIsLiked] = useState(undefined);
  const { mutate } = useMutation(commentLike);
  const { mutate: deleteCommentMutate } = useMutation(deleteComment, {
    onSuccess: () => {
      filterDeletedCommentById(comment.id);
    },
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    setCommentReplyCount(comment.total_replies);
    setIsLiked(comment.liked_by_current_user);
  }, []);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleLike = () => {
    mutate({ comment_id: comment.id, post_id: comment.post_id });
    setIsLiked(!isLiked);
  };

  const handleHideReplies = () => {
    setIsReplyHidden(true);
  };

  const handleDeleteComment = () => {
    deleteCommentMutate({
      commentId: comment.id,
      writtenByUserId: comment.written_by_user_id,
    });
    handleCloseConfirmDialog();
  };

  const handleCloseCommentDialog = () => {
    setOpenDialog(false);
  };

  const handleShowReply = () => {
    setIsReplyHidden(false);
    setIsFetchingReplies(true);
    customAxios
      .get("/commentreply/recent/" + offset, {
        params: {
          comment_id: comment.id,
        },
      })
      .then(({ data }) => {
        setReplies((prevState) => [...data, ...prevState]);
        setOffset((prevState) => prevState + data.length);
        setRecentlyAdded(false);
        setIsFetchingReplies(false);
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
            {comment.can_delete && (
              <span className="delete-icon" onClick={handleOpenConfirmDialog}>
                <img src={trashIcon} alt="trash icon" />
              </span>
            )}
          </div>
          <p>{comment.comment}</p>
          {isLiked ? (
            <Button
              color="error"
              variant="contained"
              size="small"
              sx={{
                height: "25px",
                minWidth: "0px",
                paddingRight: "5px",
                paddingLeft: "5px",
                fontSize: "12px",
              }}
              onClick={handleLike}
            >
              Dislike
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{
                height: "25px",
                minWidth: "0px",
                paddingRight: "15px",
                paddingLeft: "15px",
                fontSize: "12px",
              }}
              onClick={handleLike}
            >
              Like
            </Button>
          )}
          <span style={{ margin: "0 5px 0 5px" }}>
            {isLiked ? comment.total_likes + 1 : comment.total_likes}
          </span>
          <Button
            variant="contained"
            color="success"
            sx={{
              height: "25px",
              minWidth: "0px",
              paddingRight: "15px",
              paddingLeft: "15px",
              fontSize: "12px",
            }}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Reply
          </Button>
          <div className="modal"></div>
        </div>
      </div>
      <div className="reply-count">
        {commentReplyCount > 0 && (
          <span className="wrapper">
            {isReplyHidden ? (
              <span onClick={handleShowReply}>
                Show {commentReplyCount}{" "}
                {commentReplyCount > 1 ? "replies" : "reply"}
                {isFetchingReplies && <CircularProgress />}
              </span>
            ) : (
              <span onClick={handleHideReplies}>Hide replies</span>
            )}
          </span>
        )}
      </div>
      <div className={`replies ${isReplyHidden ? "hide" : ""}`}>
        {replies.map((reply) => {
          return <Reply key={reply.id} reply={reply} />;
        })}
        <div className="reply-count">
          {(commentReplyCount % 10 === 0 || recentlyAdded) && (
            <span className="wrapper" onClick={handleShowReply}>
              Load more
            </span>
          )}
        </div>
      </div>
      <CommentFormDialog
        handleClose={handleCloseCommentDialog}
        open={openDialog}
        dialogData={comment}
        setCommentReplyCount={setCommentReplyCount}
        setRecentlyAdded={setRecentlyAdded}
      />
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
