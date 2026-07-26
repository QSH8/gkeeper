<template>
  <div class="order-form">
    <!-- 1. Поле: Приоритетный -->
    <div class="form-group">
      <label class="form-checkbox-label">
        <input v-model="form.isPriority" type="checkbox" class="form-checkbox-real">
        <span class="form-checkbox-custom" />
        <span class="form-checkbox-text">Приоритетный</span>
      </label>
    </div>
    
    <!-- 2. Поле: Имя клиента -->
    <div class="form-group">
      <label for="client-name" class="form-label">Имя клиента</label>
      <input
        id="client-name"
        v-model="form.clientName"
        type="text"
        class="form-input"
        required
        @blur="updateOrderInfo('clientName')"
      />
    </div>

 
    <!-- 3. Поле: Комментарий к заказу -->
    <div class="form-group">
      <label for="order-comment" class="form-label">Комментарий к заказу</label>
      <textarea
        id="order-comment"
        v-model="form.comment"
        class="form-textarea"
        rows="2"
        @blur="updateOrderInfo('comment')"
      ></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Позиции в заказе</label>
      
      <div v-if="orderItems.length > 0" class="added-items-list">
        <div 
          v-for="(item, index) in orderItems" 
          :key="item.id + '-' + index" 
          class="added-item-row"
        >
          <div class="item-info">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-price">{{ item.price }} ₽</span>
          </div>
          
          <button 
            type="button" 
            class="delete-item-btn" 
            @click="handleRemoveItem(index)"
            aria-label="Удалить позицию"
          >
            <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Сообщение, если корзина пока пуста -->
      <div v-else class="empty-items-placeholder">
        Вы пока не добавили ни одной позиции
      </div>

      <!-- Кнопка (+) для перехода на страницу меню -->
      <button 
        type="button" 
        class="add-more-btn" 
        @click="goToMenu"
        aria-label="Добавить позиции из меню"
      >
        <span>Добавить позицию</span>
      </button>
    </div>

    <div class="order-button-wrapper">
    <button
      type="button" 

      class="add-to-queue-order-btn"
      :class="{ 'disabled': disabledAddToQueueButton }"
      @click="showConfirmAddToQueue = true"
      aria-label="Поместить в очередь"
    >
      <span class="btn-text">Поместить в очередь</span>
    </button>
    <ConfirmModal :isOpen="showConfirmAddToQueue" title="Создание нового заказа"
      message="Хотите создать новый заказ?" confirmText="Да" @confirm="addNewOrderToQueue"
      @close="showConfirmAddToQueue = false"
    />
  </div>
  </div>
</template>

<script>
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import { mapState } from 'vuex';
export default {
  name: 'OrderForm',
  components: {
    ConfirmModal
  },

  emits: ['remove-item'],

  data() {
    return {
      form: {
        clientName: '',
        comment: '',
        isPriority: false,
      },
      showConfirmAddToQueue: false,
    };
  },
  computed: {
    ...mapState({
      orderItems: (state) => state.orderItems,
      orderInfo: (state) => state.orderInfo,
    }),

    hasClientName() {
      return !!this.form?.clientName?.trim()
    },

    disabledAddToQueueButton() {
      return !this.hasClientName || !this.orderItems.length
    }
  },
  methods: {
    addNewOrderToQueue() {
      this.$store.dispatch('addNewOrderToQueue')

      this.goToOrdersQueue()
    },

    goToOrdersQueue() {
      this.$router.push('/orders-queue')
    },

    load() {
      Object.keys(this.form).forEach(fieldName => this.form[fieldName] = this.orderInfo[fieldName])
    },

    updateOrderInfo(fieldName) {
      this.$store.dispatch('updateOrderInfo', { fieldName, fieldValue: this.form[fieldName] })
    },
    // Удаление позиции по ее индексу в массиве
    handleRemoveItem(index) {
      this.$emit('remove-item', index);
    },
    // Клик по кнопке (+) транслирует родителю команду переключить экран/страницу
    goToMenu() {
      this.$router.push('/menu')      
    },
  },

  mounted() {
    this.load() 
  },
};
</script>

<style scoped>
.order-button-wrapper {
  position: fixed;
  bottom: 0;
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
.add-to-queue-order-btn {
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

.add-to-queue-order-btn.disabled {
  background-color: #b7b5b5;
  pointer-events: none;
}

/* Мобильный визуальный отклик при нажатии (кнопка слегка темнеет и утапливается) */
.add-to-queue-order-btn:active {
  background-color: #28a745;
  transform: scale(0.98); 
  box-shadow: 0 2px 6px rgba(52, 199, 89, 0.2);
}

/* Стиль для заблокированного состояния */
.add-to-queue-order-btn:disabled {
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
.add-to-queue-order-btn:active .btn-icon {
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
/* Основной контейнер формы с мобильными отступами */
.order-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}

/* Контейнер для всего элемента (строка) */
.form-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 12px; /* Отступ между чекбоксом и текстом */
  cursor: pointer;
  user-select: none;
  font-family: inherit;
  font-size: 15px;
  color: #1c1c1e;
}

/* Скрываем реальный чекбокс, но оставляем его доступным для скринридеров */
.form-checkbox-real {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

/* Кастомный чекбокс — повторяет стиль .form-input */
.form-checkbox-custom {
  position: relative;
  flex-shrink: 0;
  width: 24px; /* Фиксированный размер для мобильного интерфейса */
  height: 24px;
  background-color: #f2f2f7; /* Ваш светло-серый фон */
  border: 1px solid transparent;
  border-radius: 6px; /* Чуть меньше 12px, чтобы квадрат выглядел гармонично */
  box-sizing: border-box;
  transition: border-color 0.2s, background-color 0.2s;
}

/* Иконка галочки внутри (скрыта по умолчанию) */
.form-checkbox-custom::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 4px;
  width: 6px;
  height: 11px;
  border: solid #1c1c1e; /* Цвет галочки совпадает с вашим цветом текста */
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.2s;
}

.form-checkbox-text {
  font-size: 14px;
  font-weight: 600;
  color: #3a3a3c;
  padding-left: 4px;
}

/* Состояние при наведении (эффект как у текстовых полей) */
.form-checkbox-label:hover .form-checkbox-custom {
  background-color: #e5e5ea; /* Слегка темнее при ховере */
}

/* Стили при фокусе с клавиатуры (для доступности) */
.form-checkbox-real:focus-visible + .form-checkbox-custom {
  border-color: #007aff; /* Классический синий фокус, можно заменить на ваш */
}

/* Состояние, когда чекбокс выбран */
.form-checkbox-real:checked + .form-checkbox-custom {
  background-color: #e5e5ea; /* Сохраняем фон или можно сделать его акцентным */
}

/* Показываем галочку при активации */
.form-checkbox-real:checked + .form-checkbox-custom::after {
  transform: rotate(45deg) scale(1);
}


/* Группа полей */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* Метки полей (заголовки) */
.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #3a3a3c;
  padding-left: 4px;
}

/* Мобильные текстовые инпуты */
.form-input,
.form-textarea {
  width: 100%;
  background-color: #f2f2f7; /* Приятный светло-серый мобильный фон */
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 15px;
  color: #1c1c1e;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s, background-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  background-color: #ffffff;
  border-color: #007aff; /* Синий акцент при фокусе */
}

/* Фикс для плавного изменения размера textarea */
.form-textarea {
  resize: none;
}

/* Список добавленных блюд */
.added-items-list {
  display: flex;
  flex-direction: column;
  background-color: #f2f2f7;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

/* Строка одной позиции */
.added-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e5ea;
}

.added-item-row:last-child {
  border-bottom: none;
}

/* Информация о блюде внутри строки */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #1c1c1e;
}

.item-price {
  font-size: 13px;
  color: #8e8e93;
}

/* Компактная монохромная кнопка удаления */
.delete-item-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #8e8e93;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.delete-item-btn:active {
  background-color: #ffe5e5;
  color: #ff3b30;
}

.delete-icon {
  width: 16px;
  height: 16px;
}

/* Заглушка для пустой корзины */
.empty-items-placeholder {
  background-color: #f2f2f7;
  border: 1px dashed #c7c7cc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 8px;
}

/* Кнопка (+) во всю ширину для перехода в меню */
.add-more-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  background-color: #ffffff;
  border: 1px dashed #007aff; /* Синий пунктир в стиле iOS списков */
  border-radius: 12px;
  color: #007aff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s;
}

.add-more-btn:active {
  background-color: #f2f2f7;
}

/* Стилизация под планшеты/десктоп, чтобы инпуты не расползались */
@media (min-width: 768px) {
  .order-form {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
