export interface Message {
  id: number;
  text: string;
  from: "BOT" | "CLIENT" | "AGENT";
  createdAt: Date;
}
