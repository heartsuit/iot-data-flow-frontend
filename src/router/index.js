import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ElementUIDemo from '../views/ElementUIDemo.vue'
import AxiosDemo from '../views/AxiosDemo.vue'
import EchartsDemo from '../views/EchartsDemo.vue'
import PowerView from '../views/PowerView.vue'

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
  },
  {
    path: '/power',
    name: 'PowerView',
    component: PowerView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
