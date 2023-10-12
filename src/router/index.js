import {
  createRouter,
  createWebHistory
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      query: {
        userId: 'id',
      },
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: (to, from, next) => {
        const userId = to.query.userId;
        if (!userId) {
          next('/error');
        } else {
          next();
        }
      }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue')
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