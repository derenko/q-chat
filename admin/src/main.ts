import { createApp } from "vue";
import { createPinia } from "pinia";

import { Quasar, Dialog, Notify } from "quasar";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import App from "./App.vue";
import "@/styles/index.scss";
import router from "./router";

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(Quasar, {
  plugins: {
    Dialog,
    Notify
  },
  config: {
    brand: {}
  }
});

app.mount("#app");
