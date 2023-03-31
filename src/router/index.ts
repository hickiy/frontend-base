import { createRouter, createWebHistory } from "vue-router";
import { beforeEach } from "./route-hooks";
import main from "@/components/layout/index.vue";
import login from "@/views/login/login.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: login,
  },
  {
    path: "/",
    name: "Main",
    component: main,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(beforeEach);

export default router;
