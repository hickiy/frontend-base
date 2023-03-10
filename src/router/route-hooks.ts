import NProgress from "nprogress";
import { getToken } from "@/utils/cookies.js";

import {
  RouteLocationRaw,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
} from "vue-router/dist/vue-router";

export function beforeEach(
  to: RouteLocationRaw,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext
) {
  NProgress.start();
  if (getToken()) {
  } else {
  }
}

export function afterEach() {
  NProgress.done();
}
