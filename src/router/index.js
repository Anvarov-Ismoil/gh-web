import {
  createRouter,
  createWebHistory
} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products/:id',
      query: {
        lang: 'lang',
        category: 'category'
      },
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/cart',
      query: {
        lang: 'lang',
        id: 'id',
      },
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
  ]
})

export default router