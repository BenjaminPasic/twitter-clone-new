import customAxios from "./customAxios";

export const commentLike = (likeInfo) => {
  return customAxios.post("/commentlike/add", likeInfo);
};
