import { useInfiniteQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";
import Post from "./Post";
import "../css/Posts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment } from "react";

export default function Posts({ localPost }) {
  const { isLoading, isFetching, data, fetchNextPage } = useInfiniteQuery(
    "getRecentPosts",
    getRecentPosts,
    {
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
    }
  );

  return (
    <div className="posts">
      {localPost.length !== 0 &&
        localPost.map((post, i) => {
          return <Post key={i} post={post} />;
        })}
      {data &&
        data.pages.map((collection, i) => {
          return (
            <Fragment key={i}>
              {collection.data.recentPosts.map((post) => {
                return <Post key={post.post_id} post={post} />;
              })}
            </Fragment>
          );
        })}
      {isFetching ? <CircularProgress /> : null}
      <button onClick={fetchNextPage}>Fetch more</button>
    </div>
  );
}
