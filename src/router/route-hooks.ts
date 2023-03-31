import { RouteLocationNormalizedLoaded, NavigationGuardNext } from 'vue-router/dist/vue-router';
import NProgress from 'nprogress';
import { getToken, removeToken } from '@/utils/cookies';
import user from '@/store/user';
import registerDynamicRoute from '@/router/register-route';

let isRegistedOfDynamicRoute = false;

export function beforeEach(to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next('/');
    } else if (!isRegistedOfDynamicRoute) {
      const userStore = user();
      Promise.all([userStore.getUserInfo(), userStore.getMenu()])
        .then(() => {
          registerDynamicRoute();
          isRegistedOfDynamicRoute = true;
          next({ ...to, replace: true });
        })
        .catch(() => {
          removeToken();
          next('/login');
        });
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
    }
  }
}

export function afterEach() {
  NProgress.done();
}
