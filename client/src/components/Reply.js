import { Avatar } from "@mui/material";
import { dateFormat } from "../utils/DateFormatter";
import "../css/Reply.css";
import { useNavigate } from "react-router-dom";

const Reply = ({ reply }) => {
  const navigate = useNavigate();
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
        <Avatar>{reply.username.charAt(0)}</Avatar>
        <div className="upper-part">
          <span
            className="username"
            onClick={() => navigate("/profile/" + reply.username)}
          >
            {reply.username}
          </span>
          <span className="seperator">&#183;</span>
          <span className="date">
            {reply.createdAt === "now" ? "now" : dateFormat(reply.createdAt)}
          </span>
          <span className="">aa</span>
          <p>{reply.reply}</p>
        </div>
      </div>
    </div>
  );
};

export default Reply;
