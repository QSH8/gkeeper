<template>
  <div class="orders-container">
    <div class="orders-wrapper">
      <!-- Список карточек -->
      <div v-if="ordersQueueList.length > 0" class="orders-list">
        <template v-for="order in ordersQueueList" :key="order.id">
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
import { ORDER_STATUSES } from '../../../constants/index.js'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OrdersQueueList',
  components: {
    OrderQueueListCard,
  },

  data() {
    return {
      ORDER_STATUSES,
    };
  },

  computed: {
    ...mapGetters(['ordersQueueList'],)
  },

  methods: {
    ...mapActions({
      fetchOrdersList: 'fetchOrdersList',
    })
  },

  async mounted() {
    await this.fetchOrdersList()
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
  margin-top: 10px;
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