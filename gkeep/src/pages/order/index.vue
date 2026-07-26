<template>
  <div class="order-page">
    <button type="button" class="back-btn" @click="$router.back()">← Назад</button>
    <h1 class="page-title">Заказ #{{ orderDetail.id }}</h1>

    <div v-if="orderDetail.id" class="order-content">
      <div class="info-container">
        <ul class="info-list">
          <div class="info-list__title">
            <h3 class="info-list__title-text">Информация о заказе</h3>
            <div class="info-list__title-status">{{ ORDER_STATUSES?.[orderDetail.status] ?? '-' }}</div>
          </div>

          <li class="info-list__item">
            <p class="info-list__item-label">Купил:</p>
            <p class="info-list__item-value">{{ orderDetail.customerName }}</p>
          </li>
          <li class="info-list__item">
            <p class="info-list__item-label">Создан:</p>
            <p class="info-list__item-value">{{ formatDate(orderDetail.createdAt) }}</p>
          </li>
          <li class="info-list__item">
            <p class="info-list__item-label">Принял:</p>
            <p class="info-list__item-value">{{ orderDetail.acceptedBy }}</p>
          </li>
          <li class="info-list__item">
            <p class="info-list__item-label">Завершен:</p>
            <p class="info-list__item-value">{{ formatDate(orderDetail.finishedAt) ?? '-' }}</p>
          </li>
          <li class="info-list__item">
            <p class="info-list__item-label">Завершил:</p>
            <p class="info-list__item-value">{{ orderDetail.finishedBy ?? '-' }}</p>
          </li>
        </ul>
      </div>
      <!-- Тело заказа (Позиции) -->
      <div class="items-section">
        <div class="items-list">
          <h3 class="items-list__title">Состав заказа</h3>
          <div v-for="item in orderItems" :key="item.id" class="item-row">
            <div class="item-main">
              <span class="item-name">{{ item.name }}: </span>
              <span class="item-qty">{{ item.quantity }}x</span>
            </div>
            <div class="item-price">
              {{ (item.price * item.quantity).toFixed(2) }} ₽
            </div>
          </div>
        </div>

        <div class="total-row">
          <span class="total-label">Итого к оплате:</span>
          <span class="total-amount">{{ calculateTotal() }} ₽</span>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="actions-footer">
        <button v-if="!orderDetail.isFinished" class="btn btn-complete" @click="showConfirmModal(orderDetail.id)">
          Завершить заказ
        </button>
        <button v-else class="btn btn-return" @click="returnOrder">
          Вернуть заказ
        </button>
      </div>
    </div>

    <div v-else class="empty-state">Заказ не найден</div>

    <ConfirmModal :isOpen="showConfirm" title="Завершение заказа"
      message="Точно завершить? Перед завершением проверь оплату" confirmText="Завершить" @confirm="finishOrder"
      @close="showConfirm = false" />
  </div>
</template>

<script>
import { formatDate } from '@services';
import { coreDate } from '@utils';
import { toast } from 'vue3-toastify';
import { onFinishOrderAPI } from "../../api/index.js"
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import { ORDER_STATUSES } from '@/constants';

export default {
  name: 'TheOrder',
  components: {
    ConfirmModal,
  },

  data() {
    return {
      confirmModalData: null,
      showConfirm: false,
      orderDetail: {},
      orderItems: [],
      coreDate,
      formatDate,
      ORDER_STATUSES,
    };
  },

  computed: {
  },

  // 3. ЖИЗНЕННЫЙ ЦИКЛ
  created() {
    this.fetchOrder();
  },

  methods: {
    showConfirmModal(orderId) {
      this.confirmModalData = orderId
      this.showConfirm = true
    },

    async finishOrder() {
      this.$nextTick(() => {
        toast(`Заказ #${this.confirmModalData} завершён`, { autoClose: 1000, type: 'success', position: 'top-center' })
      })

      await onFinishOrderAPI(this.confirmModalData)

      this.$router.push('/orders-queue')
    },

    fetchOrder() {
      const idFromUrl = this.$route.params.id;

      setTimeout(() => {
        this.orderDetail = {
          id: Number(idFromUrl),
          status: 'on_',
          isFinished: false,
          createdAt: '2026-07-22T14:30:00',
          finishedAt: null,
          customerName: 'Александр Волков',
          acceptedBy: 'Мария (Администратор)',
          finishedBy: null,
        }

        this.orderItems = [
          { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
          { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
          { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
        ]
      }, 500);
    },

    calculateTotal() {
      if (!this.orderDetail) return 0;
      return this.orderItems.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
      }, 0);
    },

    getStatusClass(status) {
      if (status === 'В процессе') return 'status-active';
      if (status === 'Завершен') return 'status-done';
      return 'status-default';
    },
  }
};

</script>

<style lang="css" scoped>
.back-btn {
  padding: 0.25rem 0.8rem;
  border-radius: 0.5rem;
  border: none;
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.212);
  font-size: 0.8rem;
}

.back-btn:active {
  background-color: rgba(128, 128, 128, 0.226);
}

.info-container {
  border-radius: 8px;
  margin-bottom: 1rem;
}

.info-list {
  list-style-type: none;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.info-list__title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.8rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid #dfe6e9;
}

.info-list__title-text {}

.info-list__title-status {
  border-radius: 0.3rem;
  padding: 0.25rem 0.5rem;

  background-color: rgb(93, 129, 206);
  font-size: 0.8rem;
  color: white;
}

.info-list__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 1rem;
  border-bottom: 1px solid #dfe6e9;
}

.info-list__item-label {
  font-size: 0.9rem;
}

.info-list__item-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.order-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #2d3436;
  background-color: #f9f9f9;
  border-radius: 12px;
}

.status-active {
  background-color: #e1f5fe;
  color: #0288d1;
}

.status-done {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-default {
  background-color: #eee;
  color: #666;
}

.items-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-bottom: 24px;
}

.items-list__title {
  border-bottom: 1px solid #dfe6e9;
  padding-left: 1rem;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 16px;
  border-bottom: 1px solid #f1f2f6;
  align-items: center;
}


.item-row:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
}

.item-info {
  text-align: center;
  color: #636e72;
}

.item-price {
  text-align: right;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
}

.total-row {
  text-align: right;
  margin-bottom: 1rem;
}

.total-label {
  font-size: 1rem;
  color: #636e72;
}

.total-amount {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3436;
}

.order-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  padding: 16px;
  background: #f1f2f6;
  border-radius: 8px;
  font-size: 0.9rem;
}

.detail-item span {
  display: block;
  color: #636e72;
  margin-bottom: 4px;
}

.detail-item strong {
  color: #2d3436;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  width: 100%;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-complete {
  background-color: #00b894;
  color: white;
}

.btn-complete:hover {
  background-color: #00a383;
  transform: translateY(-1px);
}

.btn-return {
  background-color: #ff7675;
  color: white;
}

.btn-return:hover {
  background-color: #ee5253;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .item-row {
    grid-template-columns: 1fr 1fr;
  }

  .item-price {
    grid-column: span 2;
    text-align: left;
    padding-top: 8px;
    border-top: 1px dashed #eee;
  }

  .order-details {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>