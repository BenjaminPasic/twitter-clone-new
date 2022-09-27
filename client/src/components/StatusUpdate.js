import "../css/StatusUpdate.css";
import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

export default function StatusUpdate() {
  const [status, setStatus] = useState("");
  const [statusCharCount, setStatusCharCount] = useState(0);

  const handleInput = (e) => {
    if (e.target.textContent.length < 180 || e.key === "Backspace") {
      setStatus(e.target.textContent);
      setStatusCharCount(e.target.textContent.length);
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className="status-update">
      <div
        contentEditable="true"
        className="status-input"
        onKeyDown={handleInput}
      ></div>
      <div className="second-row">
        <CircularProgress
          size={25}
          variant="determinate"
          value={statusCharCount * 0.555}
        />
        <Button
          variant="contained"
          type="submit"
          className="button"
          margin="normal"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
