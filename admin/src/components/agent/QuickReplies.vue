<script setup lang="ts">
  import { ref, defineEmits } from "vue";

  const props = defineProps({
    replies: {
      type: Array,
      default: () => []
    }
  });

  interface Emits {
    (e: "select", reply: any): void;
  }

  const emit = defineEmits<Emits>();

  const isVisibleQuickReply = ref(false);

  function onSelectQuickReply(reply: any) {
    emit("select", reply);
    isVisibleQuickReply.value = false;
  }
</script>
<template>
  <div class="quick-reply">
    <q-fab color="primary" text-color="white" icon="bolt" direction="up" flat>
      <q-fab-action
        color="primary"
        text-color="white"
        v-for="reply in props.replies"
        :key="reply.id"
        @click="onSelectQuickReply(reply)"
        flat
      >
        <span class="q-pl-sm">{{ reply.text }}</span>
      </q-fab-action>
    </q-fab>
  </div>
</template>
<style lang="scss" scoped>
  .quick-reply {
    position: absolute;
    bottom: 20px;
    left: 15px;
  }
</style>
