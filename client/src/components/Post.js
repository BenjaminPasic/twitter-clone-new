import "../css/Post.css";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { addNewLike } from "../api/likeApi";
import { useEffect, useState } from "react";
import { dateFormat } from "../utils/DateFormatter";
import { deletePost } from "../api/postApi";
import commentIcon from "../assets/icons/comment.svg";
import downIcon from "../assets/icons/down-button.png";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Post = ({ post, isLocalPost, filterDeletedPost }) => {
  const { mutate } = useMutation(addNewLike);
  const { mutate: deletePostMutate } = useMutation(deletePost, {
    onSuccess: (res) => {
      filterDeletedPost(res.data);
    },
  });
  const [likeCount, setLikeCount] = useState(undefined);
  const [commentCount, setCommentCount] = useState(undefined);
  const [hasUserLiked, setHasUserLiked] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setCommentCount(post.total_comments);
      setLikeCount(post.total_likes);
      setHasUserLiked(post.liked_by_current_user);
      console.log(post);
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

  const handleDotsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    //edit show editable text
  };

  const handleDeleteClick = () => {
    let { post_id, user_id } = post;
    deletePostMutate({ post_id, user_id });
    //delete post user created, check if it's truly the user that made the post
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
    </div>
  );
};

export default Post;
