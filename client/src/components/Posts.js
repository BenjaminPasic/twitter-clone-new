import { useInfiniteQuery } from "react-query";
import { getRecentPosts } from "../api/postApi";
import Post from "./Post";
import "../css/Posts.css";
import { Fragment } from "react";

export default function Posts() {
  const { isLoading, isFetching, data, fetchNextPage } = useInfiniteQuery(
    "getRecentPosts",
    getRecentPosts,
    {
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
    }
  );

  if (data) {
    console.log(data);
  }

  const handleFetchPost = () => {
    try {
      fetchNextPage();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="posts">
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
      <button onClick={handleFetchPost}>Fetch more</button>
    </div>
  );
}
