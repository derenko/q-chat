<script setup lang="ts">
  import { ref, watch } from "vue";

  interface Emits {
    (e: "submit", rating: number): void;
  }

  const emit = defineEmits<Emits>();

  const isDisabled = ref(false);
  const rating = ref(0);

  watch(rating, () => {
    isDisabled.value = true;
    emit("submit", rating.value);
  });
</script>
<template>
  <q-form class="form">
    <h6 class="text-grey text-center q-my-sm text-body2">
      Будь ласка, оцініть роботу оператора.
    </h6>
    <div class="rating">
      <q-rating
        v-model="rating"
        size="2.5em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        :disable="isDisabled"
      />
    </div>
  </q-form>
</template>
<style lang="scss" scoped>
  .form {
    max-width: 285px;
    margin: 25px auto 15px;
    background: #fefefe;
    border-radius: 12px;
    box-shadow: 0 3px 10px 0 rgb(0 0 0 / 8%), 0 0 1px 0 rgb(0 0 0 / 22%),
      inset 0 2px 0 0 #445669;
    padding: 10px 15px 20px;

    .rating {
      display: flex;
      justify-content: center;
    }

    .submit {
      width: 100%;
      margin: 20px 0 0;
      border-radius: 5px;
    }
  }
</style>
