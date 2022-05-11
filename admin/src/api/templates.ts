import { http } from "@/utils";

const get = async () => {
  return http.get("/agents/templates");
};

const create = async (text: string) => {
  return http.post("/agents/templates", { text });
};

const deleteOne = async (id: number) => {
  return http.delete(`/agents/templates/${id}`);
};

const update = async (data: { id: number; text: string }) => {
  return http.patch("/agents/templates", {
    templateId: data.id,
    text: data.text
  });
};

export const templates = {
  get,
  create,
  deleteOne,
  update
};
