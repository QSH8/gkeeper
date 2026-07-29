<template>
  <div class="order-card" :class="{'priority': order.priority}" @click="$router.push({ path: `/order/${order.id}` })">
    <div class="order-header">
      <div>
        <span class="order-id">#{{ order.id }}</span> | <span class="order-status">{{ ORDER_STATUSES?.[order.status] || 'Завершён' }}</span>
        <span v-if="order.priority" class="order-status_priority">{{ 'Приоритет' || '' }}</span>
      </div>
      <span class="customer-name">{{ order.customer }}</span>
    </div>

    <div class="order-body">
      <p v-for="item in order.items" :key="item.id" class="order-item">
        <span class="order-body__quantity">{{ item.quantity }}x</span> <span>{{ item.name }}</span>
      </p>
    </div>

    <div class="order-body__info">
      <div class="order-body__info-wrapper">
        <p class="order-body__info-item">Принят: <span>{{ formatDate(order.createdAt)  }}, {{ order.createdBy }}</span></p>
        <!-- <p class="order-body__info-item">Завершён: <span>{{ formatDate(order.finishedAt)  }}, {{ order.whoFinish }}</span></p> -->
      </div>
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
import { formatDate } from '@/services';
import { ORDER_STATUSES } from '@/constants';

export default {
  name: 'OrderQueueListCard',
  components: {
    ConfirmModal,
  },
  emits: ['finish-order'],
  data() {
    return {
      showConfirm: false,
      confirmModalData: null,
      formatDate,
      ORDER_STATUSES,
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

.order-card.priority {
  border: 2px solid gold;
  box-shadow: 0 4px 12px gold(0, 0, 0, 0.2);
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
  font-size: 0.7rem;
}

.order-status {
  font-weight: bold;
  color: #dc3545;
  font-size: 0.7rem;
}

.order-status_priority {
  display: inline-block;
  font-weight: bold;
  color: #414141;
  margin-left: 8px;
  border-radius: 10px;
  padding: 0 0.5rem;
  background-color: gold;
  font-size: 0.7rem;
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
.order-body__quantity {
  font-weight: 600;
}

.order-body__info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  text-align: end;
  font-size: 0.7rem;
  color: #666;
}

.order-body__info-item span {
  font-weight: 700;
}

.customer-name {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: end;
  color: #222;
}

.order-item {
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