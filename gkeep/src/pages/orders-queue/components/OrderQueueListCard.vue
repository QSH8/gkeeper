<template>
  <div class="order-card" @click="$router.push({ path: `/order/${order.id}` })">
    <div class="order-header">
      <span class="order-id">#{{ order.id }}</span>
      <span class="customer-name">{{ order.customer }}</span>
    </div>

    <div class="order-body">
      <p class="order-items">{{ order.items }}</p>
    </div>

    <div class="order-footer">
      <span class="order-price">{{ order.price }} ₽</span>
      <button class="details-btn" @click.stop="showConfirmModal(order.id)">
        Завершить
      </button>
    </div>
  </div>
  <ConfirmModal :isOpen="showConfirm" title="Завершение заказа"
    message="Точно завершить? Перед завершением проверь оплату" confirmText="Завершить" @confirm="finishOrder"
    @close="showConfirm = false" />
</template>

<script>
import { toast } from 'vue3-toastify';
import { onFinishOrderAPI } from "@api"
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

export default {
  name: 'OrderQueueListCard',
  components: {
    ConfirmModal,
  },
  emits: ['finish-order'],
  data() {
    return {
      showConfirm: false,
      confirmModalData: null
    }
  },
  props: {
    order: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    showConfirmModal(orderId) {
      this.confirmModalData = orderId
      this.showConfirm = true
    },
    finishOrder() {
      this.$emit('finish-order', this.confirmModalData);

      this.$nextTick(() => {
        toast(`Заказ #${this.confirmModalData} завершён`, { autoClose: 1000, type: 'success', position: 'top-center' })
      })

      onFinishOrderAPI(this.confirmModalData)
    }
  }
}
</script>

<style lang="css" scoped>
/* Стили карточки */
.order-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 0.6rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  transition: transform 0.2s ease;
}

.order-card:active {
  transform: scale(0.98);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-id {
  font-weight: bold;
  color: #888;
  font-size: 0.8rem;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.order-body {
  margin-bottom: 16px;
}

.customer-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #222;
}

.order-items {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.order-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2e7d32;
}

.details-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>