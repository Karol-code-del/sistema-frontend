import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/productos'
  },
  {
    path: '/productos',
    name: 'Productos',
    component: () => import('../views/productos/Inventario.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compras',
    name: 'Compras',
    component: () => import('../views/Compras.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/ventas',
    name: 'Ventas',
    component: () => import('../views/Ventas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de rutas para protección
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.estaAutenticado) {
      next('/login')
    } else if (to.meta.requiresAdmin && !authStore.esAdmin) {
      next('/productos')
    } else {
      next()
    }
  } else if (to.path === '/login' && authStore.estaAutenticado) {
    next('/productos')
  } else {
    next()
  }
})

export default router