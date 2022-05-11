import { createRouter, createWebHistory } from "vue-router";
import ClientChat from "@/views/ClientChat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "chat",
      component: ClientChat
    }
  ]
});

export default router;
