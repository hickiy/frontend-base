import { createWebHistory, createRouter } from 'vue-router';
import { beforeEach, afterEach, beforeResolve } from './permission';
import Layout from '@/layout/index.vue';
import detailPageRoutes from './detail-page-routes';

/**
 * Note: 路由配置项
 *
 * hidden: true                     当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' 访问路由的默认传递参数
 * roles: ['admin', 'common']       访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  访问路由的菜单权限
 * meta : {
    noCache: true                   如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                设置该路由的图标，对应路径src/assets/icons/svg
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '',
    name: 'default',
    redirect: '/revenue-manage/index',
    component: Layout,
    hidden: true,
    children: []
  },
  // {
  //   path: '/index',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/index',
  //       component: () => import('@/views/index'),
  //       name: 'Index',
  //       meta: { title: '首页', icon: 'shouye', routeType: 'menu' }
  //     }
  //   ]
  // }
];

// 静态路由，基于用户权限动态去加载
export const staticRoutes = detailPageRoutes;

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由守卫
router.beforeEach(beforeEach);
router.beforeResolve(beforeResolve);
router.afterEach(afterEach);

export default router;
