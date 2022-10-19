import customAxios from "./customAxios";

export const newPost = (postData) => {
  return customAxios.post("/post/new", postData);
};

export const getRecentPosts = ({ pageParam = 1 }) => {
  return customAxios.get("/post/recent/" + pageParam);
};
