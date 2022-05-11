<script setup lang="ts">
  import LoginForm from "@/components/LoginForm.vue";
  import { QScrollArea } from "quasar";
  import { reactive, ref } from "vue";
  import messageSound from "@/assets/sound/message.mp3";
  import moment from "moment";
  import FeedbackForm from "@/components/FeedbackForm.vue";
  import EmojiPicker from "@/components/EmojiPicker.vue";
  import { ChatEvents, type Chat, type Client, type Message } from "@/types";
  import { useSocket } from "@/composables";
  import { mapTextMessageToArray } from "@/utils";

  const { typedEmit } = useSocket({
    listeners: {
      [ChatEvents.ChatOpen]: (c: Chat) => {
        onChatOpen(c);
      },
      [ChatEvents.ClientChatUpdated]: (c: Chat) => {
        chat.value = c;
      },
      [ChatEvents.ChatMessage]: (message: Message) => {
        onChatMessage(message);
      },
      [ChatEvents.ClientSetChat]: (c: Chat) => {
        onClientSetChat(c);
      },
      [ChatEvents.AgentStartTyping]: () => {
        isAgentTyping.value = true;
      },
      [ChatEvents.AgentStopTyping]: () => {
        isAgentTyping.value = false;
      },
      [ChatEvents.ChatClosed]: () => {
        onChatClosed();
      }
    }
  });

  const audio = new Audio(messageSound);
  const isOpen = ref(false);
  const text = ref("");
  const chat = ref<null | Chat>(null);
  const chatMessagesRef = ref<null | QScrollArea>(null);
  const client = ref<null | Client>(null);
  const isSubmited = ref(false);
  const isAgentTyping = ref(false);
  const isChatClosed = ref(false);

  const PROJECT_KEY = "3e99c370-2e08-4c9f-9580-d37d49f8244e";

  function onSendMessage() {
    if (chat.value && client.value) {
      typedEmit(ChatEvents.ClientSendMessage, {
        clientId: client.value.id,
        text: text.value,
        chatId: chat.value.id
      });

      text.value = "";

      chatMessagesRef.value?.setScrollPercentage("vertical", 100, 300);
    }
  }

  function onSubmit(values: { name: string; email: string; phone?: string }) {
    typedEmit(ChatEvents.ClientJoinChat, { ...values, projectId: PROJECT_KEY });
    console.log({ values });
    isSubmited.value = true;
  }

  function onChatOpen(с: Chat) {
    chat.value = с;
    client.value = с.client;

    localStorage.setItem("user", JSON.stringify(client.value));
  }

  function onChatClosed() {
    isChatClosed.value = true;
    audio.play();
    chatMessagesRef.value?.setScrollPercentage("vertical", 100, 300);
  }

  function onChatMessage(message: Message) {
    if (chat.value) {
      chat.value.messages.push(message);
      chatMessagesRef.value?.setScrollPercentage("vertical", 100, 300);
      if (message.from !== "CLIENT") {
        audio.play();
      }
    }
  }

  function onClientSetChat(c: Chat) {
    chat.value = c;
    client.value = c.client;

    isSubmited.value = true;
  }

  function onClientStartTyping() {
    typedEmit(ChatEvents.ClientStartTyping, { chatId: chat.value?.id });
  }

  function onClientStopTyping() {
    typedEmit(ChatEvents.ClientStopTyping, { chatId: chat.value?.id });
  }

  function onClientSendFeedback(rating: number) {
    typedEmit(ChatEvents.ClientSendFeedback, {
      rating: rating,
      chatId: chat.value?.id,
      clientId: client.value?.id,
      agentId: chat.value?.agent.id
    });
  }

  function onSelectEmoji(emoji: string) {
    text.value += emoji;
  }

  function onToggleOpen() {
    isOpen.value = !isOpen.value;
    chatMessagesRef.value?.setScrollPercentage("vertical", 100, 100);
  }
</script>

<template>
  <div class="open-icon" @click="onToggleOpen">
    <q-icon name="chat_bubble" size="35px" />
  </div>
  <div class="chat" :style="{ visibility: isOpen ? 'visible' : 'hidden' }">
    <div class="close-icon" @click="onToggleOpen">
      <q-icon name="close" size="25px" />
    </div>
    <div class="chat__header">
      <p class="q-mb-sm"><b>Напишіть ваше повідомлення!</b></p>
      <p class="q-mt-sm">Оператори онлайн!</p>
    </div>

    <div class="chat__body q-mt-md">
      <q-scroll-area
        style="height: 310px; max-width: 3500px"
        :thumb-style="{ height: '5px', width: '5px' }"
        ref="chatMessagesRef"
      >
        <LoginForm
          :initial-values="client"
          @submit="onSubmit"
          :is-submited="isSubmited"
        />

        <div v-if="chat">
          <div v-for="message in chat.messages" :key="message.id">
            <div v-if="message.from === 'BOT'" class="text-center q-my-md">
              {{ message.text }}
            </div>
            <q-chat-message
              v-else
              :avatar="
                message.from === 'CLIENT'
                  ? chat.client.avatar
                  : chat.agent.avatar
              "
              :text="mapTextMessageToArray(message.text)"
              :sent="message.from === 'CLIENT'"
              :bg-color="message.from === 'CLIENT' ? 'blue-grey-9' : 'grey-2'"
              :text-color="message.from === 'CLIENT' ? 'white' : 'black'"
              :stamp="moment(message.createdAt).format('HH:mm')"
            />
          </div>
        </div>

        <q-chat-message
          v-if="isAgentTyping"
          :avatar="chat?.agent.avatar"
          bg-color="grey-2"
          text-color="black"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>

        <FeedbackForm v-if="isChatClosed" @submit="onClientSendFeedback" />
      </q-scroll-area>
    </div>
    <q-separator color="grey" />

    <div class="chat__footer q-mt-md">
      <EmojiPicker class="emoji" @select="onSelectEmoji" v-if="isOpen" />

      <q-scroll-area
        style="height: 70px; width: 250px"
        :thumb-style="{ height: '5px', width: '2px' }"
      >
        <q-input
          v-model="text"
          borderless
          placeholder="Введіть повідомлення"
          type="textarea"
          autogrow
          @focus="onClientStartTyping"
          @blur="onClientStopTyping"
        />
      </q-scroll-area>
      <q-btn
        round
        color="blue-grey-9"
        icon="send"
        class="button"
        :disabled="!text.length || !isSubmited"
        @click="onSendMessage"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .open-icon {
    width: 65px;
    height: 65px;
    position: fixed;
    bottom: 15px;
    right: 15px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .chat {
    width: 350px;
    height: 500px;

    background: #fefefe;
    margin: 50px auto 0;
    border-radius: 10px 25px 10px 10px;
    position: fixed;
    right: 15px;
    bottom: 15px;

    .close-icon {
      cursor: pointer;
      display: block;
      height: 28px;
      opacity: 0.85;
      width: 28px;
      background: #fff;
      position: absolute;
      left: -38px;
      top: 0;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__header,
    &__body,
    &__footer {
      padding: 0 15px;
    }

    &__header {
      padding: 15px 15px 0;
      position: relative;
      overflow: hidden;
      border-radius: 0 25px 0 0;

      &::before {
        content: "";
        background: #17c038;
        width: 32px;
        height: 32px;
        position: absolute;
        border-radius: 50%;
        right: -8px;
        top: -8px;
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      position: relative;
      padding-bottom: 5px;
      padding-left: 50px;

      :deep(.q-field) {
        width: 100%;
      }

      .button {
        position: absolute;
        top: 5px;
        right: 15px;
        width: 35px;
        height: 35px;
      }

      .emoji {
        position: absolute;
        top: -5px;
        left: 15px;
        width: 35px;
        height: 35px;
      }
    }
  }
</style>
