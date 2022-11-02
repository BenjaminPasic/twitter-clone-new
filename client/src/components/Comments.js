import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import customAxios from "../api/customAxios";
import Post from "./Post";
import Button from "@mui/material/Button";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { addNewComment } from "../api/commentApi";

function Comments() {
  const [offset, setOffset] = useState(0);
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [dbComments, setDbComments] = useState([]);
  const { mutate } = useMutation(addNewComment, {
    onSuccess: (data) => {
      const lastComment = data.data;
      setLocalComments((prevState) => [lastComment, ...prevState]);
    },
  });
  const { id } = useParams();
  const location = useLocation();
  location.state.singlePost = true;

  useEffect(() => {
    customAxios
      .get("/comment/recent/" + offset, {
        params: {
          post_id: id,
        },
      })
      .then((data) => {
        setDbComments((prevState) => [...prevState, data.data.recentComments]);
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
          value={comment}
          onChange={(e) => handleChange(e)}
          className="input-box"
          placeholder="Add a comment here..."
        />
        {comment && (
          <Button
            variant="contained"
            className="submit-button"
            margin="normal"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
      <h2>Comments</h2>
      {localComments.length > 0
        ? localComments.map((comment, i) => {
            return <Comment key={i} comment={comment} />;
          })
        : null}
      {dbComments &&
        dbComments.map((collection) => {
          return collection.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          });
        })}
    </div>
  );
}

export default Comments;
