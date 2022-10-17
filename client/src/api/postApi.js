import customAxios from "./customAxios";

export const newPost = (postData) => {
  return customAxios.post("/post/new", postData);
};

export const getRecentPosts = () => {
  return customAxios.get("/post/recent");
};
