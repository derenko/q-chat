<script setup lang="ts">
  import AppLogo from "@/components/shared/AppLogo.vue";
  import { useAgentStore } from "@/stores/agent";
  import { useUserStore } from "@/stores/user";
  import { computed } from "vue";

  const userStore = useUserStore();
  const agentStore = useAgentStore();

  const label = computed(() =>
    userStore.user?.agent.isOnline ? "Онлайн" : "Офлайн"
  );
  const color = computed(() =>
    userStore.user?.agent.isOnline ? "green" : "red"
  );

  const isOnline = computed({
    get() {
      return !!userStore.user?.agent.isOnline;
    },
    set(value: boolean) {
      agentStore.changeOnlineStatus(value);
    }
  });
</script>
<template>
  <header class="header">
    <AppLogo />
    <q-btn flat rounded>
      <q-avatar>
        <img :src="userStore.user?.agent.avatar" />
        <q-badge rounded :color="color" class="badge" />
      </q-avatar>

      <span class="text-white q-pl-md">{{ userStore.user?.agent.name }}</span>
      <q-menu>
        <q-list style="width: 150px">
          <q-separator />
          <q-item>
            <q-item-section
              ><q-toggle
                v-model="isOnline"
                :label="label"
                keep-color
                :color="color"
            /></q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-btn color="red" flat @click="userStore.logout"> Вихід </q-btn>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-menu>
    </q-btn>
  </header>
</template>
<style lang="scss" scoped>
  .header {
    padding: 5px 15px;
    background: #1f2936;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    .switch {
      :deep(.q-toggle__label) {
        color: v-bind(color);
      }
    }

    .badge {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
