import { http } from "@/utils/http";

const getUser = async () => {
  return http.get("/auth/me");
};

const signIn = async (credentials: { email: string; password: string }) => {
  return http.post("/auth/local/sign-in", credentials);
};

const signUp = async (credetials: {
  email: string;
  password: string;
  name: string;
  website: string;
}) => {
  return http.post("/auth/local/sign-up", credetials);
};

const logout = async () => {
  return http.post("/auth/logout");
};

export const user = {
  getUser,
  signIn,
  signUp,
  logout
};
