import customAxios from "./customAxios";

export const addNewComment = (postData) => {
  return customAxios.post("/comment/new", postData);
};

export const getRecentComments = ({ pageParam = 1 }) => {
  return customAxios.get("/comment/recent/" + pageParam);
};
