import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

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
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('../views/AdminLoginView.vue'),
      meta: { hideLayout: true, public: true },
    },
    {
      path: '/admin',
      name: 'AdminScreen',
      component: () => import('../views/AdminScreenView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/admin/produtos',
      name: 'AdminProducts',
      component: () => import('../views/AdminProductsView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/admin/produtos/cadastrar',
      name: 'AdminProductCreate',
      component: () => import('../views/AdminProductCreateView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/admin/categorias/cadastrar',
      name: 'AdminCategoryCreate',
      component: () => import('../views/AdminCategoryCreateView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/admin/perfil',
      name: 'AdminProfile',
      component: () => import('../views/AdminProfileView.vue'),
      meta: { hideLayout: true },
    },
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore(pinia)
  const isAdminRoute = to.path.startsWith('/admin')
  const isPublic = to.meta?.public === true

  if (!isAdminRoute) return true

  await authStore.ensureSession()

  if (to.path === '/admin/login') {
    if (authStore.isAuthenticated) {
      return '/admin'
    }
    return true
  }

  if (!isPublic && !authStore.isAuthenticated) {
    return {
      path: '/admin/login',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

export default router
