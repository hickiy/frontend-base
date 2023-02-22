import { createRouter, createWebHistory } from 'vue-router';
import main from '@/components/layout/index.vue';
import home from '@/views/index/index.vue'

const routes = [
  {
    path: '/', 
    component: main,
    children: [
      {
        path: '',
        component: home,
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})