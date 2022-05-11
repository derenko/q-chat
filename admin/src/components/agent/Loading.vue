<script setup lang="ts">
  const props = defineProps({
    showing: {
      type: Boolean,
      default: false
    }
  });
</script>

<template>
  <q-inner-loading
    :showing="props.showing"
    style="background: #fff; border-radius: 15px; z-index: 999"
  >
    <q-spinner color="grey" size="3em" :thickness="4" />
  </q-inner-loading>
</template>
