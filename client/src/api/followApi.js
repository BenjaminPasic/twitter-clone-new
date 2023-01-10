import customAxios from "./customAxios";

export const addNewFollow = (profile_id) => {
  return customAxios.post("/follow/new", { profile_id });
};

export const findEveryoneUserFollows = () => {
  return customAxios.get("/follow/find");
};
