import { http } from "@/utils";

const get = async () => {
  return http.get("/agents/handbooks");
};

export const handbooks = { get };
