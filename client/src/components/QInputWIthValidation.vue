<script setup lang="ts">
  import type { QInputProps } from "quasar";
  import { useField } from "vee-validate";

  const props = defineProps<{
    name: string;
  }>();

  const { errorMessage, value } = useField<QInputProps["modelValue"]>(
    props.name
  );
</script>
<template>
  <q-input
    v-model="value"
    :error-message="errorMessage"
    :error="!!errorMessage"
  />
</template>
