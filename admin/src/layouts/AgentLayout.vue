<script setup lang="ts">
  import AppNavigation from "@/components/agent/AppNavigation.vue";
  import AppHeader from "@/components/agent/AppHeader.vue";
</script>

<template>
  <div class="layout">
    <AppHeader />
    <div class="layout__inner">
      <AppNavigation />

      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .layout {
    min-height: calc(100vh - 90px);
    &__inner {
      display: flex;
      height: 100%;

      .content {
        padding: 90px 0 0;
        flex: 2;
      }
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
