import "../css/Post.css";
import { Avatar } from "@mui/material";

const Post = ({ post }) => {
  const dateFormat = (date) => {
    if (date === "now") return "now";

    const currentTime = new Date();
    const datePostedAt = new Date(date);
    const whenWasPostCreatedInSeconds = Math.floor(
      Math.abs((currentTime - datePostedAt) / 1000)
    );

    if (whenWasPostCreatedInSeconds < 60) {
      return whenWasPostCreatedInSeconds + "s";
    }
    if (
      whenWasPostCreatedInSeconds > 60 &&
      whenWasPostCreatedInSeconds < 3600
    ) {
      return Math.floor(whenWasPostCreatedInSeconds / 60) + "m";
    }
    if (whenWasPostCreatedInSeconds < 86400) {
      return Math.floor(whenWasPostCreatedInSeconds / 60 / 60) + "h";
    }

    const day = datePostedAt.getDay() + 1;
    const month = datePostedAt.toLocaleString("default", { month: "short" });

    if (whenWasPostCreatedInSeconds > 525600) {
      const year = datePostedAt.getFullYear();
      return day + " " + month + " " + year;
    }

    return day + " " + month;
  };

  return (
    <div className="post">
      <Avatar>{post.username.charAt(0)}</Avatar>
      <div className="wrapper">
        <div className="top-portion">
          <span className="username">{post.username}</span>
          <span className="seperator">&#183;</span>
          <span className="date">{dateFormat(post.createdAt)}</span>
        </div>
        <p>{post.post}</p>
      </div>
    </div>
  );
};

export default Post;
