import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import customAxios from "../api/customAxios";
import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { addNewComment } from "../api/commentApi";
import TextField from "./TextField";

function Comments() {
  const [offset, setOffset] = useState(0);
  const [dbComments, setDbComments] = useState([]);
  const { mutate } = useMutation(addNewComment, {
    onSuccess: ({ data }) => {
      setDbComments((prevState) => [
        { ...data, total_likes: 0, createdAt: "now" },
        ...prevState,
      ]);
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
        setDbComments((prevState) => [...prevState, ...data.recentComments]);
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

  const filterDeletedCommentById = (commentId) => {
    setDbComments(dbComments.filter((comment) => comment.id !== commentId));
  };

  return (
    <div className="comments">
      <Post post={location.state} />
      <div>
        <TextField handleSubmit={handlePostReply} />
      </div>
      <h2>Comments</h2>
      {dbComments &&
        dbComments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={{ ...comment, post_id: location.state.post_id }}
              filterDeletedCommentById={filterDeletedCommentById}
            />
          );
        })}
    </div>
  );
}

export default Comments;
