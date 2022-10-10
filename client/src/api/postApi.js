import customAxios from "./customAxios";

export const newPost = (postData) => {
  return customAxios.post("/post/new", postData);
};
