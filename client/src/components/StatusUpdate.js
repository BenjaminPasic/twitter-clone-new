import "../css/StatusUpdate.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { newPost } from "../api/postApi";
import useAuth from "../hooks/useAuth";

export default function StatusUpdate({ addRecentlyCreatedPost }) {
  const CHAR_LIMIT = 200;
  const [status, setStatus] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [statusCharCount, setStatusCharCount] = useState(0);
  const { isLoading, mutate, data } = useMutation(newPost);

  useEffect(() => {
    if (data) {
      const { username, id, user_id, post } = data.data;
      addRecentlyCreatedPost({
        username,
        createdAt: "now",
        post,
        post_id: id,
        user_id,
        total_likes: 0,
        total_comments: 0,
      });
    }
  }, [data, tempStatus]);

  const handleChange = (e) => {
    setStatus(e.target.value.slice(0, CHAR_LIMIT));
    if (e.target.value.length < CHAR_LIMIT) {
      setStatusCharCount(e.target.value.length);
    }
  };

  const handleClick = () => {
    mutate({ post: status.trim() });
    setTempStatus(status);
    setStatusCharCount(0);
    setStatus("");
  };

  return (
    <div className="status-update">
      <textarea
        placeholder="What's on your mind today?"
        className="status-input"
        onChange={handleChange}
        value={status}
      ></textarea>
      <div className="second-row">
        <CircularProgress
          size={25}
          variant="determinate"
          value={statusCharCount * 0.5}
        />
        {isLoading ? (
          <p>Waiting.</p>
        ) : (
          <Button
            variant="contained"
            type="submit"
            className="button"
            margin="normal"
            onClick={handleClick}
          >
            Post
          </Button>
        )}
      </div>
    </div>
  );
}
