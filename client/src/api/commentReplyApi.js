import customAxios from "./customAxios";

export const addNewCommentReply = (data) => {
  return customAxios.post("/commentreply/new", data);
};

export const getTenRecentReplies = (offset, comment_id) => {
  return customAxios.get("/commentreply/recent/" + offset, {
    params: {
      comment_id,
    },
  });
};
