import customAxios from "./customAxios";

export const getConvoInfo = (followeeId) => {
  const data = followeeId?.queryKey[1].id;
  return customAxios.get("/conversation/convoInfo", {
    params: {
      followeeId: data,
    },
  });
};
