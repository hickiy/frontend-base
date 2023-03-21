import { RouteLocationNormalizedLoaded, NavigationGuardNext } from 'vue-router/dist/vue-router';
import NProgress from 'nprogress';
import { getToken } from '@/utils/cookies.js';
import user from '@/store/user';

export function beforeEach(to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) {
  NProgress.start();
  if (to.path !== '/login') {
    if (getToken()) {
      const userStore = user();
      userStore.init().then(next);
    } else {
      next('/login');
    }
  } else {
    next();
  }
}

export function afterEach() {
  NProgress.done();
}