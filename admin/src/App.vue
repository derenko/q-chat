<script setup lang="ts">
  import { RouterView, useRoute } from "vue-router";

  const route = useRoute();

  console.log(import.meta.env.VITE_API_URL);
</script>

<template>
  <component :is="route.meta.layout">
    <RouterView />
  </component>
</template>
