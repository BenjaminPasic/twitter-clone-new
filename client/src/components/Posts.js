import { useInfiniteQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";
import Post from "./Post";
import "../css/Posts.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, useEffect, useState } from "react";

export default function Posts({ localPost, isProfile }) {
  const [posts, setPosts] = useState(undefined);
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

  const filterDeletedPost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((posts) => posts.post_id !== postId)
    );
  };

  useEffect(() => {
    let combinedArray = data?.pages.reduce(
      (acc, collection) => acc.concat(collection.data.recentPosts),
      []
    );
    setPosts(combinedArray);
  }, [data]);

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
    <div className="posts" style={isProfile && { width: "90%" }}>
      {localPost.length !== 0 &&
        localPost.map((post, i) => {
          return <Post key={i} post={post} isLocalPost={true} />;
        })}
      {posts &&
        posts.map((post, i) => {
          return (
            <Post
              key={post.post_id}
              post={post}
              filterDeletedPost={filterDeletedPost}
            />
          );
        })}
      {isFetching ? <CircularProgress /> : null}
    </div>
  );
}
