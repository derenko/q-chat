<script setup lang="ts">
  import Navigation from "@/components/employee/Navigation.vue";
  import Header from "@/components/employee/Header.vue";
</script>

<template>
  <div class="layout">
    <Header />
    <div class="layout__inner">
      <Navigation />
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .layout {
    min-height: calc(100vh - 70px);
    &__inner {
      display: flex;
      height: 100%;

      .content {
        padding: 70px 0 0;
        flex: 2;
      }
    }
  }
</style>
