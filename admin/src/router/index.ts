import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import AgentLayout from "@/layouts/AgentLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ProjectLayout from "@/layouts/ProjectLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({
    top: 0
  }),
  routes: [
    {
      path: "/registration",
      name: "registration",
      component: () => import("@/views/RegistrationView.vue"),
      meta: {
        layout: DefaultLayout
      }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        layout: DefaultLayout
      }
    },
    {
      path: "/chats",
      name: "chats",
      component: () => import("@/views/agents/ChatsView.vue"),
      meta: {
        roles: ["AGENT"],
        layout: AgentLayout
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/agents/ProfileView.vue"),
      meta: {
        roles: ["AGENT"],
        layout: AgentLayout
      }
    },
    {
      path: "/templates",
      name: "templates",
      component: () => import("@/views/agents/TemplatesView.vue"),
      meta: {
        roles: ["AGENT"],
        layout: AgentLayout
      }
    },
    {
      path: "/handbook",
      name: "handbook",
      component: () => import("@/views/agents/HandbookView.vue"),
      meta: {
        roles: ["AGENT"],
        layout: AgentLayout
      }
    },
    {
      path: "/agents",
      name: "agents",
      component: () => import("@/views/projects/AgentsView.vue"),
      meta: {
        roles: ["PROJECT"],
        layout: ProjectLayout
      }
    },
    {
      path: "/clients",
      name: "clients",
      component: () => import("@/views/projects/ClientsView.vue"),
      meta: {
        roles: ["PROJECT"],
        layout: ProjectLayout
      }
    },
    {
      path: "/statistic",
      name: "statistic",
      component: () => import("@/views/projects/StatisticView.vue"),
      meta: {
        roles: ["PROJECT"],
        layout: ProjectLayout
      }
    },
    {
      path: "/company-profile",
      name: "company-profile",
      component: () => import("@/views/projects/ProjectView.vue"),
      meta: {
        roles: ["PROJECT"],
        layout: ProjectLayout
      }
    },
    {
      path: "/company-handbook",
      name: "company-handbook",
      component: () => import("@/views/projects/HandbookView.vue"),
      meta: {
        roles: ["PROJECT"],
        layout: ProjectLayout
      }
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        layout: DefaultLayout
      }
    }
  ]
});

router.beforeEach(async (to, _, next) => {
  const routeRequiredRoles = (to.meta?.roles as Array<string>) || [];

  const hasRequiredRole = (role: string) => routeRequiredRoles.includes(role);

  if (routeRequiredRoles.length) {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    if (user.value && hasRequiredRole(user.value.role)) {
      return next();
    } else {
      await userStore.getUser();

      return user.value && hasRequiredRole(user.value.role)
        ? next()
        : next("/login");
    }
  } else {
    return next();
  }
});

export default router;
