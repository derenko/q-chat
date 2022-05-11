<script setup lang="ts">
  import AppLogo from "@/components/shared/AppLogo.vue";
</script>
<template>
  <div class="error">
    <div class="error__inner">
      <div class="logo-container">
        <AppLogo width="300px" height="120px" />
      </div>
      <h1 class="text-white text-center q-my-sm">
        <div class="text-h1 text-center">
          <q-icon name="error_outlined" size="60px" />
          <span>404</span>
        </div>
        <div class="text-h6 q-my-lg text-grey">Ой... Сторінка не знайдена.</div>
      </h1>
      <p class="text-body1 text-center text-grey"></p>
      <p class="text-center">
        <q-btn color="primary" style="width: 100%" to="/login">
          <q-icon name="login" class="q-mr-md" /> <span>Логін</span>
        </q-btn>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;

    &__inner {
      max-width: 50%;
    }

    .logo-container {
      display: flex;
      justify-content: center;
    }
  }
</style>
