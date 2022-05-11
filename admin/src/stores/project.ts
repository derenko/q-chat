import { API } from "@/api";
import type { Agent, Client, Handbook } from "@/types";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

interface ProjectState {
  agents: Agent[];
  clients: Client[];
  statistic: {
    chats: { createdAt: Date }[];
    clients: [];
  };
  handbooks: Handbook[];
}

export const useProjectStore = defineStore({
  id: "project",
  state: (): ProjectState => ({
    agents: [],
    clients: [],
    statistic: {
      chats: [],
      clients: []
    },
    handbooks: []
  }),
  getters: {},
  actions: {
    async getAgents() {
      const response = await API.project.getAgentsForProject();

      this.agents = response.data;
    },

    async createAgent(form: { name: string; email: string; password: string }) {
      const response = await API.project.createAgentForProject(form);

      this.agents.push(response.data);
    },

    async getClients() {
      const response = await API.project.getClientsForProject();

      this.clients = response.data;
    },

    async getStatistic() {
      const response = await API.project.getStatisticForProject();

      this.statistic = response.data;
    },

    async getHandbooks() {
      const response = await API.project.getHandbooksForProject();
      this.handbooks = response.data;
    },

    async deleteHandbook(id: number) {
      await API.project.deleteHandbookForProject(id);

      this.handbooks = this.handbooks.filter(handbook => handbook.id !== id);
    },

    async updateHandbook(id: number, handbook: Handbook) {
      const response = await API.project.updateHandbookForProject(id, handbook);
      this.handbooks = this.handbooks.map(handbook =>
        handbook.id === id ? response.data : handbook
      );
    },

    async updateProject(form: { name: string; website: string }) {
      const userStore = useUserStore();
      await API.project.updateProject(form);
      await userStore.getUser();
    }
  }
});
