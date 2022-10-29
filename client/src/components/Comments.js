import "../css/Comments.css";
import { useParams, useLocation } from "react-router-dom";
import Post from "./Post";
import Button from "@mui/material/Button";

function Comments() {
  const { id } = useParams();
  const location = useLocation();
  location.state.singlePost = true;

  console.log(location, id);

  return (
    <div className="comments">
      <Post post={location.state} />
      <div className="add-comment">
        <textarea className="input-box" placeholder="Add a comment here..." />
        <Button variant="contained" className="submit-button" margin="normal">
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Comments;
