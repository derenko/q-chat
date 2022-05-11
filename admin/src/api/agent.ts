import { http } from "@/utils/http";

const getProfile = async () => {
  return http.get("/agents/profile");
};

const updateProfile = async (data: { name: string }) => {
  return http.patch("/agents/profile", data);
};

const changeOnlineStatus = async (status: boolean) => {
  return http.patch("/agents/online-status", { status });
};

export const agent = {
  getProfile,
  updateProfile,
  changeOnlineStatus
};
