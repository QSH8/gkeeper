<template>
  <div class="orders-container">
    <div class="orders-wrapper">
      <!-- Список карточек -->
      <div v-if="orders.length > 0" class="orders-list">
        <template v-for="order in orders" :key="order.id">
          <OrderHistoryListCard :order="order" />
        </template>
      </div>

      <!-- Состояние, если заказов нет -->
      <div v-else class="empty-state">
        Нет активных заказов
      </div>
    </div>
  </div>
</template>

<script>
import OrderHistoryListCard from './OrderHistoryListCard.vue';
import { ORDER_STATUSES } from '../../../constants/index.js'

export default {
  name: 'OrdersHistoryList',
  components: {
    OrderHistoryListCard,
  },
  data() {
    return {
      ORDER_STATUSES,
      orders: [ // MOCKS!
        { id: 101, customer: 'Иван Иванов', items: '2x Бургер, 1x Кола', price: 850, status: 'in_progress', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T19:05:26',whoCreate: 'Дима', whoFinish: 'Дима', priority: true },
        { id: 102, customer: 'Анна Петрова', items: '1x Пицца Маргарита', price: 620, status: 'completed', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T20:00:26',whoCreate: 'Дима', whoFinish: 'Саша' },
        { id: 103, customer: 'Дмитрий Сидоров', items: '3x Сет роллов', price: 1500, status: 'completed', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Миша' },
        { id: 104, customer: 'Дмитрий 1', items: '3x Сет роллов', price: 1500, status: 'deleted', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Саша' },
        { id: 105, customer: 'Дмитрий 2', items: '3x Сет роллов', price: 1500, status: 'deleted', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Дима' },
        { id: 106, customer: 'Дмитрий 3', items: '3x Сет роллов', price: 1500, status: 'completed', createdAt: '2026-07-09T19:05:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Захар' },
      ]
    };
  },

};
</script>

<style lang="css" scoped>
.orders-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.orders-wrapper {
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-title {
  width: 100%;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.orders-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5rem;
  gap: 16px;
}



.empty-state {
  text-align: center;
  color: #999;
  margin-top: 40px;
}
</style>