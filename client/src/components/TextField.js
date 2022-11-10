import Button from "@mui/material/Button";
import "../css/TextField.css";
import { useState } from "react";

const TextField = ({ handleSubmit }) => {
  const [text, setText] = useState("");

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <div className="text-field">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className="input-box"
        placeholder="Add a comment here..."
      />
      {text && (
        <Button
          variant="contained"
          className="submit-button"
          margin="normal"
          onClick={() => {
            handleSubmit(text);
            setText("");
          }}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default TextField;
