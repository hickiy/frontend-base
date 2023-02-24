import { createRouter, createWebHistory } from 'vue-router';
import main from '@/components/layout/index.vue';
import user from '@/views/system/user/index.vue';

const routes = [
  {
    path: '/',
    component: main,
    children: [
      {
        path: '',
        component: user,
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})