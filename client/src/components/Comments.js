import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import Post from "./Post";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useMutation } from "react-query";
import { addNewComment } from "../api/commentApi";

//todo infinite query comments on post

function Comments() {
  const [comment, setComment] = useState("");
  const { mutate } = useMutation(addNewComment);
  const { id } = useParams();
  const location = useLocation();
  location.state.singlePost = true;

  const handleSubmit = () => {
    mutate({
      post_id: id,
      comment,
    });
    setComment("");
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="comments">
      <Post post={location.state} />
      <div className="add-comment">
        <textarea
          onChange={(e) => handleChange(e)}
          className="input-box"
          placeholder="Add a comment here..."
        />
        <Button
          variant="contained"
          className="submit-button"
          margin="normal"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Comments;
