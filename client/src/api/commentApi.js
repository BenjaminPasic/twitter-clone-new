import customAxios from "./customAxios";

export const addNewComment = (postData) => {
  return customAxios.post("/comment/new", postData);
};
