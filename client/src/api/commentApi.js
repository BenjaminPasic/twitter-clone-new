import customAxios from "./customAxios";

export const addNewComment = (postData) => {
  return customAxios.post("/comment/new", postData);
};

export const deleteComment = ({ commentId, writtenByUserId }) => {
  return customAxios.delete("/comment/delete", {
    params: {
      commentId,
      writtenByUserId,
    },
  });
};

export const getRecentComments = ({ pageParam = 1 }) => {
  return customAxios.get("/comment/recent/" + pageParam);
};
