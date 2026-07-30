<template>
  <OrdersQueueList />
  <div class="order-button-wrapper">
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
  </div>
</template>
<script>
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

import OrdersQueueList from './components/OrdersQueueList.vue';
export default {
  name: 'OrdersQueue',

  components: {
    OrdersQueueList,
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
.order-button-wrapper {
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
  padding: 12px 16px;
  /* Безопасные отступы для безрамочных экранов (iPhone с Notch / Dynamic Island) */
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%);
  box-sizing: border-box;
  z-index: 100;
}

/* Сама зеленая кнопка во всю ширину */
.create-order-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 52px; /* Оптимальная высота для мобильного тапа пальцем */
  background-color: #34c759; /* Приятный, нативный зеленый цвет (iOS Apple Green) */
  color: #ffffff;
  border: none;
  border-radius: 16px; /* Современное мобильное скругление, как у карточек */
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.2);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  -webkit-tap-highlight-color: transparent; /* Убирает стандартную синюю рамку тапа в Safari */
}

/* Мобильный визуальный отклик при нажатии (кнопка слегка темнеет и утапливается) */
.create-order-btn:active {
  background-color: #28a745;
  transform: scale(0.98); 
  box-shadow: 0 2px 6px rgba(52, 199, 89, 0.2);
}

/* Стиль для заблокированного состояния */
.create-order-btn:disabled {
  background-color: #e5e5ea;
  color: #aeaea3;
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

/* Минималистичная SVG иконка */
.btn-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s;
}
.btn-text {
 font-size: 1rem;
}

/* Эффект движения стрелочки при нажатии */
.create-order-btn:active .btn-icon {
  transform: translateX(2px);
}

/* Ограничение ширины для планшетов, чтобы кнопка не растягивалась бесконечно */
@media (min-width: 768px) {
  .order-button-wrapper {
    left: 50%;
    transform: translateX(-50%);
    max-width: 480px;
    background: transparent;
    padding-bottom: 24px;
  }
}
</style>