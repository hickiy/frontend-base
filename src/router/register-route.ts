import user from '@/store/user';
import router from '@/router';

const modules = import.meta.glob('@/views/**/*.vue');

function loadComponent(view: string) {
  return modules[`/src/views/${view}.vue`];
}

function addRoute(route: any) {
  if (Array.isArray(route.children) && route.children.length > 0) {
    route.children.forEach((child: any) => {
      addRoute(child);
    });
  } else {
    router.addRoute('Main', { ...route, path: route.component, component: loadComponent(route.component) });
  }
}

export default function registerDynamicRoute() {
  const userStore = user();
  const routes = userStore.menus;
  routes.forEach((route: any) => {
    addRoute(route);
  });
}
