<script lang="ts" setup>
  import { ref } from "vue";

  const isVisible = ref(false);

  interface Emits {
    (e: "select", emoji: string): void;
  }

  const emit = defineEmits<Emits>();

  const emojis = [
    "😇",
    "😀",
    "🥰",
    "😩",
    "😘",
    "😋",
    "😪",
    "🙄",
    "😁",
    "😎",
    "😉",
    "😐",
    "😮",
    "🤪",
    "😡",
    "😈",
    "✋",
    "✌️",
    "👍",
    "👎"
  ];

  const onSelectEmoji = (emoji: string) => {
    isVisible.value = !isVisible.value;
    emit("select", emoji);
  };
</script>
<template>
  <div class="picker">
    <div class="list" v-show="isVisible">
      <div
        class="item"
        v-for="(emoji, i) in emojis"
        :key="i"
        @click="onSelectEmoji(emoji)"
      >
        {{ emoji }}
      </div>
    </div>
    <div class="button" @click="isVisible = !isVisible">
      <q-icon name="mood" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .picker {
    position: relative;
    margin: 20px 0;
    z-index: 5;
  }

  .list {
    width: 250px;
    background-color: #17212b;
    border: 1px solid #0e1621;
    border-radius: 3px !important;
    box-shadow: 0 7px 14px 0 rgb(0 0 0 / 12%);
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    left: -49px;
    bottom: 175%;

    &::after {
      position: absolute;
      content: "";
      width: 20px;
      height: 20px;
      background: #17212b;
      bottom: -10px;
      left: 50px;
      transform: rotate(45deg);
    }

    .item {
      font-size: 25px;
      width: 20%;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        background: #0e1621;
      }
    }
  }

  .button {
    font-size: 24px;
    border-radius: 50%;
    transition: 0.3s;
    cursor: pointer;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a2a9b4;
    padding: 5px;
  }
</style>
