import NProgress from "nprogress";
import { getToken } from "@/utils/cookies.js";

import {
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
} from "vue-router/dist/vue-router";

export function beforeEach(
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext
) {
  NProgress.start();
  if (to.path !== "/login") {
    if (getToken()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next()
  }
}

export function afterEach() {
  NProgress.done();
}
