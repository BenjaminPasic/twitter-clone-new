import customAxios from "./customAxios";

export const addNewLike = (postInfo) => {
  return customAxios.post("/like/new", postInfo);
};
