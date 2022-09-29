import axios from "axios";

export const newPost = (postData) => {
  return axios.post("/post/new", postData);
};
