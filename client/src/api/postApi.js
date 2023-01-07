import customAxios from "./customAxios";

export const newPost = (postData) => {
  return customAxios.post("/post/new", postData);
};

export const getRecentPosts = ({ pageParam = 1 }) => {
  return customAxios.get("/post/recent/" + pageParam);
};

export const deletePost = ({ post_id, user_id }) => {
  return customAxios.delete("/post/delete", {
    params: {
      post_id,
      user_id,
    },
  });
};

export const editPost = ({ post_id, user_id, editInput, post }) => {
  //check why some variables end up as undefined...
  return customAxios.put("/post/edit", { post_id, user_id, editInput, post });
};
