import { createRouter, createWebHistory } from 'vue-router'

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
          },
          component: () => import('../pages/orders-queue/index.vue'),
        },
        {
          path: '/order/:id',
          name: 'TheOrder',
          meta: {
            translation: 'Заказ',
          },
          component: () => import('../pages/order/index.vue'),
        },
        {
          path: '/orders-history',
          name: 'OrdersHistory',
          meta: {
            translation: 'История заказов',
          },
          component: () => import('../pages/orders-history/index.vue'),
        },
        {
          path: '/menu',
          name: 'Menu',
          meta: {
            translation: 'Меню',
          },
          component: () => import('../pages/menu/index.vue'),
        },
        {
          path: '/warehouse',
          name: 'Warehouse',
          meta: {
            translation: 'Склад',
          },
          component: () => import('../pages/warehouse/index.vue'),
        },
        {
          path: '/profile',
          name: 'Profile',
          meta: {
            translation: 'Профиль',
          },
          component: () => import('../pages/profile/index.vue'),
        },
      ],
    },
  ],
})

export default router
