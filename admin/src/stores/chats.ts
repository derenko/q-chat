import type { Chat } from "@/types/interfaces/chat";
import type { Message } from "@/types/interfaces/message";
import moment from "moment";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

interface ChatsStore {
  chats: Chat[];
  activeChatId: null | string;
}

export const useChatsStore = defineStore({
  id: "chats",
  state: (): ChatsStore => ({
    chats: [],
    activeChatId: null
  }),
  getters: {
    activeChat: state => {
      return state.chats.find(chat => chat.id === state.activeChatId);
    },
    chatsOrderedByDate: state => {
      return state.chats.sort((left, right) => {
        const leftLastMessage = left.messages[left.messages.length - 1];
        const rightLastMessage = right.messages[right.messages.length - 1];

        return moment(rightLastMessage.createdAt).diff(
          leftLastMessage.createdAt
        );
      });
    }
  },
  actions: {
    setChats(chats: Array<Chat>) {
      this.chats = chats;
    },

    setActiveChat(chatId: string) {
      this.activeChatId = chatId;
    },

    removeActiveChat() {
      this.activeChatId = null;
    },

    addChat(chat: Chat) {
      this.chats.push(chat);
    },

    updateChat(updatedChat: Chat) {
      const chatId = updatedChat.id;

      this.chats = this.chats.map(chat =>
        chat.id === chatId ? updatedChat : chat
      );
    },

    closeChat(chatId: string) {
      this.chats = this.chats.filter(chat => chat.id !== chatId);
      this.activeChatId = null;
    },

    joinChat(chatId: string) {
      const { user, agent } = useUserStore();

      const chat = this.chats.find(chat => chat.id === chatId);

      if (chat && user && agent) {
        chat.agentId = agent.id;
      }

      return;
    },

    updateChatMessages(message: Message) {
      const chatId = message.chatId;

      this.chats = this.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message]
          };
        } else {
          return chat;
        }
      });
    },

    removeTakedChat(takedChat: Chat) {
      const { agent } = useUserStore();
      if (takedChat.agent.id !== agent?.id) {
        this.chats = this.chats.filter(chat => chat.id !== takedChat.id);
      }
    }
  }
});
