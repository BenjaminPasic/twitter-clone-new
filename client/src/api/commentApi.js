import customAxios from "./customAxios";

export const addNewComment = (postData) => {
  console.log(postData);
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
