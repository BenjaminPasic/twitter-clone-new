import customAxios from "./customAxios";

export const addNewCommentReply = (data) => {
  return customAxios.post("/commentreply/new", data);
};
