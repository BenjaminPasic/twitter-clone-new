import Post from "./Post";
import "../css/Posts.css";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

export default function Posts({
  filterDeletedPost,
  fetchNextPage,
  isFetching,
  posts,
}) {
  useEffect(() => {
    const handleScrollListener = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScrollListener);

    return () => {
      window.removeEventListener("scroll", handleScrollListener);
    };
  }, []);

  if (isFetching) {
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="posts">
      {posts &&
        posts.map((post) => {
          return (
            <Post
              key={post.post_id}
              post={post}
              filterDeletedPost={filterDeletedPost}
            />
          );
        })}
    </div>
  );
}
