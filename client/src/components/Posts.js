import { useQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";
import Post from "./Post";
import "../css/Posts.css";

export default function Posts() {
  const { isLoading, isFetching, data } = useQuery(
    "getRecentPosts",
    getRecentPosts
  );

  return (
    <div className="posts">
      {data &&
        data.data.recentPosts.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
}
