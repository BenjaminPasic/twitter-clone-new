import "../css/Home.css";
import StatusUpdate from "./StatusUpdate";
import Posts from "./Posts";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";

export default function Home() {
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
      cacheTime: 0,
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

  const addRecentlyCreatedPost = (post) => {
    setPosts((prevData) => [post, ...prevData]);
  };

  return (
    <div className="home">
      <StatusUpdate addRecentlyCreatedPost={addRecentlyCreatedPost} />
      <Posts
        filterDeletedPost={filterDeletedPost}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        posts={posts}
      />
    </div>
  );
}
