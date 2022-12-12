import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import customAxios from "../api/customAxios";
import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { addNewComment } from "../api/commentApi";
import CommentFormDialog from "./CommentFormDialog";
import TextField from "./TextField";

function Comments() {
  const [offset, setOffset] = useState(0);
  const [localComments, setLocalComments] = useState([]);
  const [dbComments, setDbComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(undefined);
  const { mutate } = useMutation(addNewComment, {
    onSuccess: ({ data }) => {
      const lastComment = data;
      setLocalComments((prevState) => [lastComment, ...prevState]);
    },
  });
  const { id } = useParams();
  const location = useLocation();

  //If we're showing the post with comments, then set as single post
  location.state.singlePost = true;

  useEffect(() => {
    customAxios
      .get("/comment/recent/" + offset, {
        params: {
          post_id: id,
        },
      })
      .then(({ data }) => {
        setDbComments((prevState) => [...prevState, data.recentComments]);
      });
  }, [offset]);

  //scroll listener
  useEffect(() => {
    const handleScrollListener = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setOffset((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScrollListener);

    return () => {
      window.removeEventListener("scroll", handleScrollListener);
    };
  }, []);

  const handlePostReply = (comment) => {
    mutate({
      post_id: id,
      comment,
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const defineDialogData = (data) => {
    setDialogData(data);
  };

  return (
    <div className="comments">
      <Post post={location.state} />
      <div>
        <TextField handleSubmit={handlePostReply} />
      </div>
      <h2>Comments</h2>
      {localComments.length > 0
        ? localComments.map((comment, i) => {
            return (
              <Comment
                key={i}
                comment={{ ...comment, post_id: location.state.post_id }}
                handleOpenDialog={handleOpenDialog}
                defineDialogData={defineDialogData}
              />
            );
          })
        : null}
      {dbComments &&
        dbComments.map((collection) => {
          return collection.map((comment) => {
            return (
              <Comment
                key={comment.id}
                comment={{ ...comment, post_id: location.state.post_id }}
                handleOpenDialog={handleOpenDialog}
                defineDialogData={defineDialogData}
              />
            );
          });
        })}
      <CommentFormDialog
        handleClose={handleCloseDialog}
        open={openDialog}
        dialogData={dialogData}
      />
    </div>
  );
}

export default Comments;
