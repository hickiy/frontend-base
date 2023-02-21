import { createRouter, createWebHistory } from 'vue-router';
import main from '@/components/main/index.vue';
import home from '@/views/home/index.vue'

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