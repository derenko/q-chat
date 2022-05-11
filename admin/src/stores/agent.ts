import { API } from "@/api";
import type { Handbook } from "@/types";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

interface UserState {
  profile: {
    chatsCount: number;
    rating: number;
  } | null;
  templates: Array<{ id: number; text: string }>;
  handbooks: Array<Handbook>;
}

export const useAgentStore = defineStore({
  id: "agent",
  state: (): UserState => ({
    profile: null,
    templates: [],
    handbooks: []
  }),
  getters: {},
  actions: {
    async getProfile() {
      const response = await API.agent.getProfile();
      this.profile = response.data;
    },

    async updateProfile(data: { name: string }) {
      const userStore = useUserStore();

      await API.agent.updateProfile(data);
      await userStore.getUser();
    },

    async getTemplates() {
      const response = await API.templates.get();

      this.templates = response.data;
    },

    async createTemplate(text: string) {
      const response = await API.templates.create(text);
      this.templates.push(response.data);
    },

    async updateTemplate(data: { id: number; text: string }) {
      const response = await API.templates.update(data);

      this.templates = this.templates.map(template =>
        template.id === data.id ? response.data : template
      );
    },

    async deleteTemplate(id: number) {
      await API.templates.deleteOne(id);

      this.templates = this.templates.filter(template => template.id !== id);
    },

    async getHandbooks() {
      const response = await API.handbooks.get();

      this.handbooks = response.data;
    },

    async changeOnlineStatus(status: boolean) {
      const userStore = useUserStore();

      await API.agent.changeOnlineStatus(status);

      await userStore.getUser();
    }
  }
});
