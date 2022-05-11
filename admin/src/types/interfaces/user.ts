import type { Agent } from "./agent";
import type { Role } from "../enums";
import type { Project } from "./project";

export interface User {
  id: number;
  email: string;
  role: Role;
  project: Project;
  agent: Agent;
}
