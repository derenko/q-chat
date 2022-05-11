import type { Agent } from "./agent";
import type { Client } from "./client";
import type { Message } from "./message";

export interface Chat {
  id: string;
  messages: Array<Message>;
  client: Client;
  agent: Agent;
  createdAt: Date;
}
