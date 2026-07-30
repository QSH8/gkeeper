import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/orders-queue',
      children: [
        {
          path: '/orders-queue',
          name: 'OrdersQueue',
          meta: {
            translation: 'Очередь заказов',
            requiresAuth: true,
          },
          component: () => import('../pages/orders-queue/index.vue'),
          beforeEnter: async () => {
            await store.dispatch('setInactiveCreate')
          } 
        },
        {
          path: '/order/:id',
          name: 'TheOrder',
          meta: {
            translation: 'Заказ',
            requiresAuth: true,
          },
          component: () => import('../pages/order/index.vue'),
          beforeEnter: async () => {
            await store.dispatch('setInactiveCreate')
          } 
        },
        {
          path: '/order/create',
          name: 'OrderCreate',
          meta: {
            translation: 'Создание заказа',
            requiresAuth: true,
          },
          component: () => import('../pages/order/components/OrderCreate.vue'),
          beforeEnter: async () => {
            await store.dispatch('setActiveCreate')
          } 
        },
        {
          path: '/orders-history',
          name: 'OrdersHistory',
          meta: {
            translation: 'История заказов',
            requiresAuth: true,
          },
          component: () => import('../pages/orders-history/index.vue'),
          beforeEnter: async () => {
            await store.dispatch('setInactiveCreate')
          } 
        },
        {
          path: '/menu',
          name: 'Menu',
          meta: {
            translation: 'Меню',
            requiresAuth: true,
          },
          component: () => import('../pages/menu/index.vue'),
        },
        {
          path: '/warehouse',
          name: 'Warehouse',
          meta: {
            translation: 'Склад',
            requiresAuth: true,
          },
          component: () => import('../pages/warehouse/index.vue'),
          beforeEnter: async () => {
            await store.dispatch('setInactiveCreate')
          } 
        },
        {
          path: '/login',
          name: 'Login',
          meta: {
            translation: 'Авторизация',
          },
          component: () => import('../pages/login/index.vue'),
          beforeEnter: async () => {
            await store.dispatch('setInactiveCreate')
          } 
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    // Если страница требует авторизации, а токена нет — отправляем на /login
    next('/login');
  } else if (to.path === '/login' && token) {
    // Если пользователь уже авторизован, но пытается зайти на /login — пускаем на главную
    next('/');
  } else {
    next();
  }
});

export default router
