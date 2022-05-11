<script setup lang="ts">
  import AppLogo from "@/components/shared/AppLogo.vue";
  import { useUserStore } from "@/stores/user";

  const userStore = useUserStore();
</script>
<template>
  <header class="header">
    <AppLogo />

    <q-btn flat rounded color="primary">
      <span class="text-white q-pl-md"
        >Адміністратор {{ userStore.user?.project.name }}</span
      >
      <q-menu>
        <q-list style="width: 220px">
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
    z-index: 999;
  }
</style>
