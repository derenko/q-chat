import { API } from "@/api";
import { tokens } from "@/utils/tokens";
import { defineStore } from "pinia";
import router from "@/router";
import type { User } from "@/types/interfaces/user";

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    user: null
  }),
  getters: {
    isAuthenticated: state => !!state.user,
    agent: state => state.user?.agent,
    project: state => state.user?.project
  },
  actions: {
    async getUser() {
      try {
        const response = await API.user.getUser();

        this.user = response.data;
      } catch (e) {
        router.push("/login");
      }
    },

    async signIn(credentials: { email: string; password: string }) {
      try {
        const response = await API.user.signIn(credentials);
        const { accessToken, refreshToken, role } = response.data;

        tokens.update("accessToken", accessToken);
        tokens.update("refreshToken", refreshToken);

        await this.getUser();

        if (role === "AGENT") {
          router.push("/chats");
        } else {
          router.push("/agents");
        }
      } catch (e) {
        console.error(e);
      }
    },

    async signUp(credentials: {
      email: string;
      password: string;
      name: string;
      website: string;
    }) {
      try {
        const response = await API.user.signUp(credentials);
        const { accessToken, refreshToken, role } = response.data;

        tokens.update("accessToken", accessToken);
        tokens.update("refreshToken", refreshToken);

        await this.getUser();

        if (role === "AGENT") {
          router.push("/chats");
        } else {
          router.push("/agents");
        }
      } catch (e) {
        console.error(e);
      }
    },

    async logout() {
      await API.user.logout();

      tokens.delete("accessToken");
      tokens.delete("refreshToken");

      router.push("/login");

      return;
    }
  }
});
