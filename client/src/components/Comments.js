import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import Post from "./Post";
import Button from "@mui/material/Button";
import Comment from "./Comment";
import { Fragment, useEffect, useState } from "react";
import { useMutation, useInfiniteQuery } from "react-query";
import { addNewComment, getRecentComments } from "../api/commentApi";

function Comments() {
  const { data, fetchNextPage } = useInfiniteQuery(
    "getRecentComments",
    getRecentComments,
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1].data.recentComments.length < 10) {
        } else {
          return pages.length + 1;
        }
      },
    }
  );
  const [comment, setComment] = useState("");
  const { mutate } = useMutation(addNewComment);
  const { id } = useParams();
  const location = useLocation();
  location.state.singlePost = true;

  //scroll listener
  useEffect(() => {
    const handleScrollListener = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        fetchNextPage();
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
      {data &&
        data.pages.map((collection, i) => {
          return (
            <Fragment key={i}>
              {collection.data.recentComments.map((comment) => {
                return <Comment key={comment.id} comment={comment} />;
              })}
            </Fragment>
          );
        })}
    </div>
  );
}

export default Comments;
