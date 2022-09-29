import "../css/StatusUpdate.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { newPost } from "../api/postApi";

export default function StatusUpdate() {
  const CHAR_LIMIT = 200;
  const [status, setStatus] = useState("");
  const [statusCharCount, setStatusCharCount] = useState(0);
  const { isFetching, mutate } = useMutation(newPost);

  const handleChange = (e) => {
    setStatus(e.target.value.slice(0, CHAR_LIMIT));
    if (e.target.value.length < CHAR_LIMIT) {
      setStatusCharCount(e.target.value.length);
    }
  };

  //Continue from here, you submit it to backend
  const handleClick = () => {
    mutate({ post: status });
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
        <Button
          variant="contained"
          type="submit"
          className="button"
          margin="normal"
          onClick={handleClick}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
