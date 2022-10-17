import "../css/StatusUpdate.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { newPost } from "../api/postApi";
import useAuth from "../hooks/useAuth";

export default function StatusUpdate() {
  const CHAR_LIMIT = 200;
  const [status, setStatus] = useState("");
  const [statusCharCount, setStatusCharCount] = useState(0);
  const { isLoading, mutate, error } = useMutation(newPost);
  const { setIsAuth } = useAuth();

  useEffect(() => {
    if (error === "Invalid token") {
      setIsAuth(false);
    }
  }, [error]);

  const handleChange = (e) => {
    setStatus(e.target.value.slice(0, CHAR_LIMIT));
    if (e.target.value.length < CHAR_LIMIT) {
      setStatusCharCount(e.target.value.length);
    }
  };

  const handleClick = () => {
    mutate({ post: status.trim() });
    setStatus("");
    setStatusCharCount(0);
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
