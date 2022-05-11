<script setup lang="ts">
  import { computed } from "vue";
  import { ChatStatus, type Chat } from "@/types";
  import moment from "moment";

  const props = defineProps({
    chats: {
      type: Array as () => Array<Chat>,
      default: () => []
    },
    activeChat: null,
    tab: {
      type: String,
      default: "ACTIVE"
    }
  });

  interface Emits {
    (e: "select", chatId: string): void;
    (e: "update:tab", tab: string): void;
  }

  const emit = defineEmits<Emits>();

  const filteredChats = computed(() =>
    props.chats.filter(chat => {
      switch (tab.value) {
        case ChatStatus.Active:
          return chat.status === ChatStatus.Active;
        case ChatStatus.Open:
          return chat.status === ChatStatus.Open;
        default:
          return true;
      }
    })
  );

  const tab = computed({
    get: () => {
      return props.tab;
    },
    set: (value: string) => {
      emit("update:tab", value);
    }
  });

  const onSelectChat = (chatId: string) => {
    emit("select", chatId);
  };
</script>
<template>
  <div class="chats-list">
    <q-tabs
      v-model="tab"
      no-caps
      outside-arrows
      mobile-arrows
      class="text-white q-pb-lg"
    >
      <q-tab name="ALL" label="Усі">
        <q-badge color="primary" rounded floating>{{
          props.chats.length
        }}</q-badge>
      </q-tab>

      <q-tab name="ACTIVE" label="Активні">
        <q-badge color="primary" rounded floating>{{
          props.chats.filter(chat => chat.status === "ACTIVE").length
        }}</q-badge>
      </q-tab>
      <q-tab name="OPEN" label="Нові">
        <q-badge color="primary" rounded floating>{{
          props.chats.filter(chat => chat.status === "OPEN").length
        }}</q-badge>
      </q-tab>
    </q-tabs>
    <q-scroll-area
      style="height: calc(100vh - 190px)"
      :thumb-style="{ height: '5px', width: '2px' }"
    >
      <q-list v-if="filteredChats.length">
        <q-item
          clickable
          class="chat-item"
          v-for="chat in filteredChats"
          :key="chat.id"
          :class="{ active: props.activeChat?.id === chat.id }"
          @click="onSelectChat(chat.id)"
        >
          <q-item-section top avatar>
            <q-avatar rounded>
              <img :src="chat.client.avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="name">{{ chat.client.name }}</q-item-label>
            <q-item-label
              caption
              :lines="2"
              class="message"
              v-if="chat.messages.length"
              >{{ chat.messages[chat.messages.length - 1].text }}</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption class="time" v-if="chat.messages.length">{{
              moment(chat.messages[chat.messages.length - 1].createdAt).format(
                "HH:mm"
              )
            }}</q-item-label>
            <q-badge
              color="primary"
              class="q-mt-md"
              rounded
              v-if="chat.messages.filter((m: any) => m.status === 'SENT' && m.from === 'CLIENT')
                  .length"
              :label="
                chat.messages.filter((m: any) => m.status === 'SENT' && m.from === 'CLIENT')
                  .length
              "
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="empty">
        <span>Немає чатів</span>
      </div>
    </q-scroll-area>
  </div>
</template>
<style lang="scss" scoped>
  .chats-list {
    background: #17212b;
    width: 400px;
    height: calc(100vh - 90px);
    overflow: auto;
    border-right: 2px solid #0a121b;

    .chat-item {
      padding: 10px;

      .name,
      .message,
      .time {
        color: #fff;
      }
    }

    .chat-item.active {
      background: #2b5278;
    }

    .empty {
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
  }
</style>
