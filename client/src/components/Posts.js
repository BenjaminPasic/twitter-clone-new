import { useInfiniteQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";
import Post from "./Post";
import "../css/Posts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, useEffect } from "react";

export default function Posts({ localPost }) {
  const { isFetching, data, fetchNextPage } = useInfiniteQuery(
    "getRecentPosts",
    getRecentPosts,
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1].data.recentPosts.length < 10) {
        } else {
          return pages.length + 1;
        }
      },
    }
  );

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
    </div>
  );
}
