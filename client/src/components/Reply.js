import { Avatar } from "@mui/material";
import dateFormat from "../utils/DateFormatter";
import "../css/Reply.css";

const Reply = ({ reply, username }) => {
  return (
    <div className="reply">
      <div
        className="single-comment"
        style={{
          width: "95%",
          marginLeft: "auto",
          borderLeft: "1px solid dodgerblue",
        }}
      >
        <Avatar>{username.charAt(0)}</Avatar>
        <div className="upper-part">
          <span className="username">{username}</span>
          <span className="seperator">&#183;</span>
          <span className="date">{dateFormat(reply.createdAt)}</span>
          <p>{reply.reply}</p>
        </div>
      </div>
    </div>
  );
};

export default Reply;
