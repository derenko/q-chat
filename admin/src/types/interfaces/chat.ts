import type { Agent } from "./agent";
import type { ChatStatus } from "../enums";
import type { Client } from "./client";
import type { Message } from "./message";

export interface Chat {
  id: string;
  messages: Array<Message>;
  agentId: null | number;
  status: ChatStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  agent: Agent;
}
