import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/games',
      name: 'GamesView',
      component: () => import('../views/AllGamesView.vue')
    },
    {
      path: '/games/:id',
      name: 'GamesDetailView',
      component: () => import('../views/GameDetailView.vue')
    },
    {
      path: '/search',
      name: 'searchView',
      component: () => import('../views/SearchView.vue')
    }
  ]
})

export default router
