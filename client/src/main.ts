import { createApp } from "vue";
import { createPinia } from "pinia";

import { Quasar } from "quasar";

import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import App from "./App.vue";
import "@/styles/index.scss";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: {},
  config: {
    brand: {
      "app-primary": "#37474F",
      "app-secondary": "#F5F5F5"
    }
  }
});

app.mount("#app");
