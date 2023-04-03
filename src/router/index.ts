import { createRouter, createWebHistory } from "vue-router";
import { beforeEach } from "./route-hooks";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: () => import("@/components/layout/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404/index.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(beforeEach);

export default router;
