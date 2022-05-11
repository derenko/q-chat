<script setup lang="ts"></script>
<template>
  <div class="navigation">
    <div class="navigation__inner">
      <q-list>
        <q-item
          to="/chats"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <b>Чати</b>
          </q-item-section>
        </q-item>

        <q-item
          to="/handbook"
          exact
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="menu_book" />
          </q-item-section>
          <q-item-section><b>Довідник</b></q-item-section>
        </q-item>
        <q-item
          to="/templates"
          exact
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="bolt" />
          </q-item-section>
          <q-item-section><b>Шаблони</b></q-item-section>
        </q-item>
        <q-item
          to="/profile"
          exact
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section><b>Профіль</b></q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .navigation {
    width: 150px;
    height: 100vh;
    border-right: 2px solid #0a121b;

    &__inner {
      position: fixed;
      top: 90px;
      height: 100%;
      display: flex;
    }

    .link {
      color: #768c9e;
    }

    .active {
      color: #5eb5f7;
      background: #25303e;
    }
  }
</style>
