import axios from "axios";
import { tokens, config } from "@/utils";

export const http = axios.create({
  baseURL: config.get<string>("VITE_API_URL")
});

http.interceptors.request.use(
  config => {
    const token = tokens.get("accessToken");

    if (token) {
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/refresh-tokens" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const response = await http.post("/auth/refresh-tokens", {
            refreshToken: tokens.get("refreshToken")
          });

          const { accessToken, refreshToken } = response.data;

          tokens.update("accessToken", accessToken);
          tokens.update("refreshToken", refreshToken);

          return http(originalConfig);
        } catch (_error) {
          tokens.delete("accessToken");
          tokens.delete("refreshToken");
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);
