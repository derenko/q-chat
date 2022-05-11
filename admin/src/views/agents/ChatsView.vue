<script setup lang="ts">
  import ChatsList from "@/components/agent/ChatsList.vue";
  import ActiveChat from "@/components/agent/ActiveChat.vue";

  import { onMounted, ref } from "vue";
  import { useUserStore } from "@/stores/user";
  import { useChatsStore } from "@/stores/chats";
  import { useSocket } from "@/composables";
  import { ChatEvents, ChatStatus, type Chat, type Message } from "@/types";
  import { useQuasar } from "quasar";
  import { useAgentStore } from "@/stores/agent";
  import { storeToRefs } from "pinia";

  const isClientTyping = ref(false);
  const tab = ref(ChatStatus.Active);

  const isLoading = ref(false);

  const userStore = useUserStore();
  const chatsStore = useChatsStore();

  const agentStore = useAgentStore();

  onMounted(async () => {
    isLoading.value = true;
    await agentStore.getTemplates();
    isLoading.value = false;
  });

  const { templates } = storeToRefs(agentStore);

  const $q = useQuasar();

  const { typedEmit } = useSocket({
    listeners: {
      [ChatEvents.AgentSetChats]: (chats: Array<Chat>) => {
        chatsStore.setChats(chats);
      },
      [ChatEvents.ChatOpen]: (chat: Chat) => {
        chatsStore.addChat(chat);
      },
      [ChatEvents.AgentChatUpdated]: (chat: Chat) => {
        chatsStore.updateChat(chat);
      },
      [ChatEvents.ChatMessage]: (message: Message) => {
        chatsStore.updateChatMessages(message);
      },
      [ChatEvents.AgentTakeChat]: (chat: Chat) => {
        chatsStore.removeTakedChat(chat);
      },
      [ChatEvents.ClientStartTyping]: () => {
        isClientTyping.value = true;
      },
      [ChatEvents.ClientStopTyping]: () => {
        isClientTyping.value = false;
      },
      [ChatEvents.AgentGetFeedback]: (rating: number) => {
        onAgentGetFeedback(rating);
      }
    },
    emitOnConnect: [
      {
        event: ChatEvents.AgentGetChats,
        data: { agentId: userStore.agent?.id }
      }
    ]
  });

  function onSendMessage({ text, chatId }: { text: string; chatId: string }) {
    typedEmit(ChatEvents.AgentSendMessage, {
      chatId,
      text
    });
  }

  function onJoinChat(chatId: string) {
    typedEmit(ChatEvents.AgentJoinChat, {
      chatId,
      agentId: userStore?.user?.agent.id
    });

    tab.value = ChatStatus.Active;
  }

  function onSetActiveChat(chatId: string) {
    typedEmit(ChatEvents.AgentSeenMessage, {
      chatId
    });

    chatsStore.setActiveChat(chatId);
  }

  function onRemoveActiveChat() {
    chatsStore.removeActiveChat();
  }

  function onAgentStartTyping() {
    typedEmit(ChatEvents.AgentStartTyping, { chatId: chatsStore.activeChatId });
  }

  function onAgentStopTyping() {
    typedEmit(ChatEvents.AgentStopTyping, { chatId: chatsStore.activeChatId });
  }

  function onAgentCloseChat() {
    typedEmit(ChatEvents.AgentCloseChat, { chatId: chatsStore.activeChatId });

    if (chatsStore.activeChatId) {
      chatsStore.closeChat(chatsStore.activeChatId);
    }
  }

  function onAgentGetFeedback(rating: number) {
    $q.notify({
      message: `Вас оцінили на  ${rating}  зірок.`,
      color: "#1F2936",
      icon: "star",
      position: "top",
      iconColor: "yellow",
      actions: [
        {
          label: "ОК",
          color: "white"
        }
      ]
    });
  }
</script>

<template>
  <div class="chats" tabindex="0" @keydown.esc="onRemoveActiveChat">
    <ChatsList
      v-model:tab="tab"
      :chats="chatsStore.chatsOrderedByDate"
      :active-chat="chatsStore.activeChat"
      @select="onSetActiveChat"
    />

    <ActiveChat
      :active-chat="chatsStore.activeChat"
      :is-client-typing="isClientTyping"
      :templates="templates"
      :is-loading="isLoading"
      @send-message="onSendMessage"
      @join-chat="onJoinChat"
      @start-typing="onAgentStartTyping"
      @stop-typing="onAgentStopTyping"
      @close-chat="onAgentCloseChat"
    />
  </div>
</template>
<style lang="scss" scoped>
  .text-brand {
    color: #242f3d !important;
  }
  .bg-brand {
    background: #242f3d !important;
  }

  .chats {
    display: flex;
  }

  .accept-chat {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    .button {
      width: 50%;
    }
  }
</style>
