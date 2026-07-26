<template>
  <OrdersHistoryList />
  <!-- <div class="order-button-wrapper">
    <button
      type="button"
      class="create-order-btn" 
      @click="showConfirmCreate = true"
      aria-label="Создать заказ"
    >
      <span class="btn-text">Создать заказ</span>
    </button>
    <ConfirmModal :isOpen="showConfirmCreate" title="Создание нового заказа"
      message="Хотите создать новый заказ?" confirmText="Да" @confirm="goToCreateOrder"
      @close="showConfirmCreate = false"
    />
  </div> -->
</template>
<script>
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

import OrdersHistoryList from './components/OrdersHistoryList.vue';
export default {
  name: 'OrdersHistory',

  components: {
    OrdersHistoryList,
    ConfirmModal,
  },

  data() {
    return {
      showConfirmCreate: false,
    }
  },

  methods: {
    goToCreateOrder() {
      this.$router.push('/order/create')
    },
  }
}
</script>

<style lang="css" scoped>
</style>