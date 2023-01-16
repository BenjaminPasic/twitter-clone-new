import "../css/Post.css";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { dateFormat, fullDate } from "../utils/DateFormatter";
import { deletePost, editPost } from "../api/postApi";
import commentIcon from "../assets/icons/comment.svg";
import downIcon from "../assets/icons/down-button.png";
import editIcon from "../assets/icons/edit-icon.png";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

const Post = ({ post, isLocalPost, filterDeletedPost }) => {
  const { mutate } = useMutation(addNewLike);
  const { mutate: deletePostMutate } = useMutation(deletePost, {
    onSuccess: (res) => {
      filterDeletedPost(res.data);
    },
  });
  const { mutate: editPostMutate } = useMutation(editPost, {
    onSuccess: () => {
      post.post = editInput;
      setEditInput("");
      toast.success("Successfuly edited your post.");
    },
    onError: (res) => {
      toast.error("You already edited this post once.");
    },
  });
  const [likeCount, setLikeCount] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [editError, setEditError] = useState("");
  const [commentCount, setCommentCount] = useState(undefined);
  const [hasUserLiked, setHasUserLiked] = useState(undefined);
  const [showPreviousEdit, setShowPreviousEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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

  const handleFinishEditClick = () => {
    setIsEditing(false);
    if (post.post !== editInput && post) {
      const { post_id, user_id } = post;
      editPostMutate({ post_id, user_id, editInput, post: post.post });
    }
  };

  const handleRedirect = () => {
    navigate("/profile/" + post.username);
  };

  const handleDotsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    //edit show editable text
    setIsEditing(true);
    setEditInput(post.post);
  };

  const handleDeleteClick = () => {
    let { post_id, user_id } = post;
    deletePostMutate({ post_id, user_id });
  };

  const handleEditInput = (value) => {
    if (value.length >= 250) {
      setEditError("Too many characters.");
    } else {
      setEditInput(value);
      if (editError) setEditError("");
    }
  };

  const handleShowEditedPost = () => {
    setShowPreviousEdit(!showPreviousEdit);
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
          {post.created_by_current_user && (
            <span className="dot-icon" onClick={(e) => handleDotsClick(e)}>
              <img src={downIcon} />
            </span>
          )}
        </div>
        {isEditing ? (
          <>
            <textarea
              value={editInput}
              onChange={(e) => handleEditInput(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              {editError && <p style={{ color: "red" }}>Too many characters</p>}
              <Button
                sx={{ marginLeft: "auto" }}
                variant="contained"
                className="button"
                onClick={handleFinishEditClick}
                margin="normal"
              >
                Done
              </Button>
            </div>
          </>
        ) : (
          <p style={{ fontSize: post.singlePost && "18px" }}>{post.post}</p>
        )}
        {post.old_post && (
          <p className="is-edited" onClick={handleShowEditedPost}>
            <img src={editIcon} alt="edit icon" />
            Last edited: {fullDate(post.updatedAt)}
          </p>
        )}
        {showPreviousEdit && (
          <div className="previous-edit">{post.old_post}</div>
        )}
        <div className="bottom-portion">
          {hasUserLiked ? (
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
          <span className="like-counter">{likeCount ? likeCount : 0}</span>
          {post.singlePost ? null : (
            <>
              <Button
                onClick={handleCommentClick}
                sx={{
                  height: "25px",
                  minWidth: "0px",
                  paddingRight: "5px",
                  paddingLeft: "5px",
                  marginLeft: "3px",
                  fontSize: "12px",
                }}
                variant="contained"
                color="success"
              >
                Comments
              </Button>
              <span className="comment-counter">{commentCount}</span>
            </>
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditClick} disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} disableRipple>
          <DeleteIcon />
          Delete
        </MenuItem>
      </Menu>
      <Toaster />
    </div>
  );
};

export default Post;
