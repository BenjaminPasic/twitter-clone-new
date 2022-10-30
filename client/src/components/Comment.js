import "../css/Comment.css";
import { Avatar } from "@mui/material";
import { dateFormat } from "../utils/DateFormatter";

const Comment = ({ comment }) => {
  return (
    <div className="single-comment">
      <Avatar>B</Avatar>
      <div className="upper-part">
        <span className="username">{comment.username}</span>
        <span className="seperator">&#183;</span>
        <span className="date">{dateFormat(comment.createdAt)}</span>
        <p>{comment.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
