<template>
  <div class="orders-container">
    <div class="orders-wrapper">
      <!-- Список карточек -->
      <div v-if="orders.length > 0" class="orders-list">
        <template v-for="order in orders" :key="order.id">
          <OrderQueueListCard :order="order" />
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
import OrderQueueListCard from './OrderQueueListCard.vue';

export default {
  name: 'OrdersQueueList',
  components: {
    OrderQueueListCard,
  },
  data() {
    return {
      // Имитация данных
      orders: [
        { id: 101, customer: 'Иван Иванов', items: '2x Бургер, 1x Кола', price: 850, status: 'В процессе' },
        { id: 102, customer: 'Анна Петрова', items: '1x Пицца Маргарита', price: 620, status: 'Готовится' },
        { id: 103, customer: 'Дмитрий Сидоров', items: '3x Сет роллов', price: 1500, status: 'Ожидание' },
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
  gap: 16px;
}



.empty-state {
  text-align: center;
  color: #999;
  margin-top: 40px;
}
</style>