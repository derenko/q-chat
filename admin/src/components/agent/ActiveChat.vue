<script setup lang="ts">
  import { useQuasar, type QScrollArea } from "quasar";
  import moment from "moment";
  import { computed, onMounted, ref, watch } from "vue";
  import EmojiPicker from "./EmojiPicker.vue";
  import QuickReplies from "./QuickReplies.vue";

  const text = ref("");
  const chatMessagesRef = ref<null | QScrollArea>(null);
  const $q = useQuasar();
  const isLoading = ref(true);

  // onMounted(() => {
  //   setTimeout(() => {
  //     isLoading.value = false;
  //   }, 500);
  // });

  const props = defineProps({
    activeChat: null,
    isClientTyping: {
      type: Boolean,
      defualt: false
    },
    templates: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  });

  interface Emits {
    (
      e: "send-message",
      { text, chatId }: { text: string; chatId: string }
    ): void;
    (e: "start-typing"): void;
    (e: "stop-typing"): void;
    (e: "close-chat", chatId: string): void;
    (e: "join-chat", chatId: string): void;
  }

  const emit = defineEmits<Emits>();

  watch(
    () => props.activeChat,
    () => {
      setTimeout(() => {
        chatMessagesRef.value?.setScrollPercentage("vertical", 100, 300);
      }, 100);
    }
  );

  const sendMessage = () => {
    emit("send-message", {
      text: text.value,
      chatId: props.activeChat.id
    });

    text.value = "";

    chatMessagesRef.value?.setScrollPercentage("vertical", 100, 300);
  };

  const acceptChat = () => {
    emit("join-chat", props.activeChat.id);
  };

  const isChatAccepted = computed(() => {
    const agent = props.activeChat.agent;

    if (agent) {
      return true;
    }

    return false;
  });

  const clientDataDialog = ref(false);

  const getFormattedMessageText = (text: string) => {
    return text.split("\n").filter(Boolean);
  };

  const onAgentStopChat = () => {
    $q.dialog({
      title: "Завершити чат",
      message: "Ви спраді хочете завершити чат?",
      persistent: true,
      ok: "Так",
      cancel: {
        label: "Ні",
        color: "red",
        flat: true
      }
    })
      .onOk(() => {
        emit("close-chat", props.activeChat.id);
      })
      .onDismiss(() => {
        return;
      });
  };

  function onSelectEmoji(emoji: string) {
    text.value += emoji;
  }

  function onSelectTemplate(template: { id: number; text: string }) {
    text.value = template.text;
  }
</script>
<template>
  <div class="chat" tabindex="0" v-if="props.activeChat">
    <q-dialog v-model="clientDataDialog">
      <q-card style="width: 400px">
        <q-card-section class="q-pt-none">
          <q-input
            :model-value="props.activeChat.client.name"
            placeholder="Ім'я"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            :model-value="props.activeChat.client.email"
            placeholder="E-мейл"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input
            :model-value="props.activeChat.client?.phone"
            placeholder="Телефон"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Закрити" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="chat__header">
      <q-avatar>
        <img :src="props.activeChat.client.avatar" />
      </q-avatar>
      <b class="name">{{ props.activeChat.client.name }}</b>
      <div>
        <q-btn flat rounded>
          <q-icon name="more_vert" size="30px" />
          <q-menu>
            <q-list style="width: 220px">
              <q-item clickable v-close-popup @click="clientDataDialog = true">
                <q-item-section avatar>
                  <q-icon name="contact_page" />
                </q-item-section>
                <q-item-section>Інформація</q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="delete" color="red" />
                </q-item-section>
                <q-item-section class="text-red" @click="onAgentStopChat"
                  >Завершити</q-item-section
                >
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div class="chat__messages">
      <q-scroll-area
        style="height: calc(100vh - 255px)"
        :thumb-style="{ height: '5px', width: '2px' }"
        ref="chatMessagesRef"
      >
        <div v-for="message in props.activeChat.messages" :key="message.id">
          <div
            v-if="message.from === 'BOT'"
            class="text-center q-my-md text-white"
          >
            {{ message.text }}
          </div>
          <q-chat-message
            v-else
            :avatar="
              message.from === 'AGENT'
                ? props.activeChat.agent.avatar
                : props.activeChat.client.avatar
            "
            :text="getFormattedMessageText(message.text)"
            :sent="message.from === 'AGENT'"
            :stamp="moment(message.createdAt).format('HH:mm')"
            class="received"
          />
        </div>
        <q-chat-message
          v-if="props.isClientTyping"
          :avatar="props.activeChat.client.avatar"
          bg-color="grey-2"
          text-color="black"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </q-scroll-area>

      <QuickReplies
        v-if="templates.length && isChatAccepted"
        :replies="templates"
        @select="onSelectTemplate"
      />
    </div>

    <div class="chat__form" v-if="isChatAccepted">
      <EmojiPicker class="emoji" @select="onSelectEmoji" />

      <q-scroll-area
        style="height: 60px; width: calc(100% - 60px)"
        :thumb-style="{ height: '5px', width: '2px' }"
      >
        <q-input
          v-model="text"
          class="input"
          color="white"
          placeholder="Написати повідомленя..."
          borderless
          type="textarea"
          autogrow
          @focus="$emit('start-typing')"
          @blur="$emit('stop-typing')"
        />
      </q-scroll-area>
      <q-btn
        round
        color="primary"
        icon="send"
        class="button"
        :disabled="!text.length"
        @click="sendMessage"
      />
    </div>
    <div class="chat__actions" v-else>
      <q-btn
        color="primary"
        label="Розпочати спілкування"
        @click="acceptChat"
      />
    </div>
  </div>
  <div v-else class="empty">
    <span>Виберіть чат щоб почати спілкування</span>
  </div>
</template>
<style lang="scss" scoped>
  .chat {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
    position: relative;

    &__header {
      background: #17212b;
      padding: 15px 15px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 28px;
      }
    }

    &__messages {
      padding: 15px 15px 0;
      position: relative;
    }

    &__form {
      background: #17212b;
      padding: 5px 15px 5px 55px;
      display: flex;
      align-items: center;
      position: relative;

      .emoji {
        position: absolute;
        top: 0px;
        left: 15px;
        width: 35px;
        height: 35px;
        z-index: 9999;
      }

      :deep(.q-field__native) {
        color: #fff;
      }

      :deep(.q-field) {
        width: 100%;
      }

      .button {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 35px;
        height: 35px;
      }
    }

    &__actions {
      background: #17212b;
      padding: 17px 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  }

  .empty {
    height: calc(100vh - 100px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    span {
      background: #1e2c3a;
      padding: 5px 15px;
      border-radius: 15px;
    }
  }
</style>
