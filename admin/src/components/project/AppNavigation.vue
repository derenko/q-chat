<script setup lang="ts"></script>
<template>
  <div class="navigation">
    <div class="navigation__inner">
      <q-list style="width: 100%">
        <q-item
          to="/agents"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <b>Агенти</b>
          </q-item-section>
        </q-item>

        <q-item
          to="/clients"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <b>Клієнти</b>
          </q-item-section>
        </q-item>

        <q-item
          to="/statistic"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>
            <b>Статистика</b>
          </q-item-section>
        </q-item>

        <q-item
          to="/company-profile"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <b>Профіль</b>
          </q-item-section>
        </q-item>

        <q-item
          to="/company-handbook"
          clickable
          v-ripple
          class="link"
          active-class="active"
        >
          <q-item-section avatar>
            <q-icon name="menu_book" />
          </q-item-section>
          <q-item-section>
            <b>Довідник</b>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .navigation {
    width: 200px;
    height: 100vh;
    border-right: 2px solid #0a121b;

    &__inner {
      position: fixed;
      top: 90px;
      height: 100%;
      display: flex;
      width: 200px;
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
