import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },

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
      path: '/produtos',
      name: 'CatalogView',
      component: () => import('../views/TopClickedProductsView.vue'),
    },
    {
      path: '/categorias',
      name: 'CategoriesView',
      component: () => import('../views/CategoriesView.vue'),
    },
    {
      path: '/auth/login',
      name: 'AppLogin',
      component: () => import('../views/AppLoginView.vue'),
      meta: { hideLayout: true, public: true },
    },
    {
      path: '/app',
      name: 'AppScreen',
      component: () => import('../views/AppScreenView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/produtos',
      name: 'AppProducts',
      component: () => import('../views/AppProductsView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/produtos/cadastrar',
      name: 'AppProductCreate',
      component: () => import('../views/AppProductCreateView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/produtos/editar/:id',
      name: 'AppProductEdit',
      component: () => import('../views/AppProductEditView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/categorias',
      name: 'AppCategories',
      component: () => import('../views/AppCategoriesView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/categorias/cadastrar',
      name: 'AppCategoryCreate',
      component: () => import('../views/AppCategoryCreateView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/categorias/editar/:id',
      name: 'AppCategoryEdit',
      component: () => import('../views/AppCategoryEditView.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/app/perfil',
      name: 'AppProfile',
      component: () => import('../views/AppProfileView.vue'),
      meta: { hideLayout: true },
    },
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore(pinia)
  const isAppRoute = to.path.startsWith('/app')
  const isAuthLoginRoute = to.path === '/auth/login'
  const isPublic = to.meta?.public === true

  if (!isAppRoute && !isAuthLoginRoute) return true

  await authStore.ensureSession()

  if (isAuthLoginRoute) {
    if (authStore.isAuthenticated) {
      return '/app'
    }
    return true
  }

  if (!isPublic && !authStore.isAuthenticated) {
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

export default router



