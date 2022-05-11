import type { MessageFrom } from "../enums/message-from";
import type { MessageStatus } from "../enums/message-status";

export interface Message {
  id: string;
  text: string;
  chatId: string;
  status: MessageStatus;
  from: MessageFrom;

  createdAt: Date;
  updatedAt: Date;
}
