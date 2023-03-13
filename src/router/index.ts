import { createRouter, createWebHistory } from "vue-router";
import { beforeEach } from "./route-hooks";
import main from "@/components/layout/index.vue";
import user from "@/views/system/user/index.vue";
import login from "@/views/login/login.vue";

const routes = [
  {
    path: "/login",
    component: login,
  },
  {
    path: "/",
    component: main,
    children: [
      {
        path: "",
        component: user,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(beforeEach);

export default router;
