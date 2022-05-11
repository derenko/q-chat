export enum ChatEvents {
  ChatOpen = "chat_open",
  ChatClosed = "chat_closed",
  ChatMessage = "chat_message",

  AgentGetChats = "agent_get_chats",
  AgentSetChats = "agent_set_chats",
  AgentChatUpdated = "agent_chat_updated",
  AgentTakeChat = "agent_take_chat",
  AgentJoinChat = "agent_join_chat",
  AgentCloseChat = "agent_close_chat",
  AgentLeaveChat = "agent_leave_chat",
  AgentSendMessage = "agent_send_message",
  AgentSeenMessage = "agent_seen_message",
  AgentStartTyping = "agent_start_typing",
  AgentStopTyping = "agent_stop_typing",
  AgentGetFeedback = "agent_get_feedback",

  ClientJoinChat = "client_join_chat",
  ClientChatUpdated = "client_chat_updated",
  ClientSetChat = "client_set_chat",
  ClientLeaveChat = "client_leave_chat",
  ClientSeenMessage = "client_seen_message",
  ClientSendMessage = "client_send_message",
  ClientStartTyping = "client_start_typing",
  ClientStopTyping = "client_stop_typing",
  ClientSendFeedback = "client_send_feedback"
}
