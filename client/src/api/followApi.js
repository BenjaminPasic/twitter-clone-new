import customAxios from "./customAxios";

export const addNewFollow = (profile_id) => {
  customAxios.post("/follow/new", { profile_id });
};
