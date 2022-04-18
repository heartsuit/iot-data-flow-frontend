import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ElementUIDemo from '../views/ElementUIDemo.vue'
import AxiosDemo from '../views/AxiosDemo.vue'
import EchartsDemo from '../views/EchartsDemo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/element',
    name: 'ElementUIDemo',
    component: ElementUIDemo
  },
  {
    path: '/axios',
    name: 'AxiosDemo',
    component: AxiosDemo
  },
  {
    path: '/echarts',
    name: 'EchartsDemo',
    component: EchartsDemo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
