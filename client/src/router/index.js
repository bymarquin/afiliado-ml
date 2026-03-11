import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/HomePageView.vue'),
    },
    {
      path: '/product/:id',
      name: 'ProductDetails',
      component: () => import('../views/ProductDetailsView.vue'),
    },
    {
      path: '/admin',
      name: 'AdminScreen',
      component: () => import('../views/AdminScreenView.vue'),
      meta: { hideLayout: true },
    }
  ]
})

export default router
