import customAxios from "./customAxios";

export const addNewLike = (postInfo) => {
  return customAxios.post("/like/new", postInfo);
};

export const countLikes = (postId) => {
  return customAxios.get("/like/count", {
    params: {
      post_id: postId,
    },
  });
};

export const checkIfUserLikedPost = (postData) => {
  return customAxios.get("/like/checkIfLiked", {
    params: {
      post: postData,
    },
  });
};
