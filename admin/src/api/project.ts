import type { Agent, Handbook } from "@/types";
import { http } from "@/utils";

const getAgentsForProject = () => {
  return http.get("/projects/agents");
};

const createAgentForProject = (form: {
  name: string;
  email: string;
  password: string;
}) => {
  return http.post("/projects/agents", form);
};

const getClientsForProject = () => {
  return http.get("/projects/clients");
};

const getStatisticForProject = () => {
  return http.get("/projects/statistic");
};

const getHandbooksForProject = () => {
  return http.get("/projects/handbooks");
};

const deleteHandbookForProject = async (id: number) => {
  return http.delete(`/projects/handbooks/${id}`);
};

const createHandbookForProject = async (
  form: Pick<Handbook, "question" | "answer">
) => {
  return http.post("/projects/handbooks", form);
};

const updateHandbookForProject = async (id: number, handbook: any) => {
  return http.patch(`/projects/handbooks/${id}`, handbook);
};

const updateProject = async (
  id: string,
  form: { name: string; website: string }
) => {
  return http.patch(`/projects`, form);
};

export const project = {
  getAgentsForProject,
  createAgentForProject,
  getClientsForProject,
  getStatisticForProject,
  getHandbooksForProject,
  deleteHandbookForProject,
  createHandbookForProject,
  updateHandbookForProject,
  updateProject
};
