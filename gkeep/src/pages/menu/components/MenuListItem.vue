<template>
  <div class="menu-item-card">
    <header class="menu-item-header">
      <h3 class="menu-item-title">{{ itemData.title }}</h3>
    </header>

    <!-- Тело карточки: Ингредиенты -->
    <div class="menu-item-body">
      <ul v-if="itemData.ingredients && itemData.ingredients.length" class="ingredients-list">
        <li 
          v-for="(ing, index) in itemData.ingredients" 
          :key="index" 
          class="ingredient-tag"
        >
          {{ ing.name }} <span class="ingredient-amount">({{ ing.amount }})</span>
        </li>
      </ul>
      <p v-else class="no-ingredients">Состав не указан</p>
    </div>

    <!-- Футер карточки: Цена -->
    <footer class="menu-item-footer">
      <span class="menu-item-price">{{ itemData.price }} ₽</span>

      <div v-if="isActiveCreate" class="menu-item-counter-wrapper">
        <button 
          v-if="quantity === 0" 
          class="add-initial-btn" 
          @click.stop="incrementCount"
        >
          Добавить
        </button>

        <div v-else class="counter-control">
          <button class="counter-btn" @click.stop="decrementCount" aria-label="Уменьшить">
            <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <span class="counter-value">{{ quantity }}</span>
          
          <button class="counter-btn" @click.stop="incrementCount" aria-label="Увеличить">
            <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MenuListItem',
  props: {
    itemData: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        title: '',
        price: 0,
        ingredients: []
      })
    }
  },

  computed: {
    quantity() {
      return this.$store.getters.getItemQuantity(this.itemData.id)
    },

    isActiveCreate() {
      return this.$store.state.isActiveCreate
    },

    isItemInOrder() {
      return this.$store.getters.isItemInOrder(this.itemData.id)
    },
  },
  emits: ['change-preorder'],
  methods: {
    handleEdit() {
      this.$emit('edit-item', this.itemData.id);
    },
    handleDelete() {
      this.$emit('delete-item', this.itemData.id);
    },

    // Плюс один к заказу
    incrementCount() {
      if (this.isItemInOrder) {
        this.$store.dispatch('updatePreOrderItemQuantity', { itemId: this.itemData.id, quantity: this.quantity + 1 });
      } else {
        this.$store.dispatch('addNewItemInPreOrder', { ...this.itemData, quantity: 1 })
      }
    },
    // Минус один из заказа
    decrementCount() {
      if (this.quantity === 1) {
        this.$store.dispatch('removePreOrderItem', this.itemData.id);
      } else {
        this.$store.dispatch('updatePreOrderItemQuantity', { itemId: this.itemData.id, quantity: this.quantity - 1 });
      }
    },
  }
};
</script>

<style scoped>
.menu-item-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid #e5e5ea;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 160px;
}

/* Шапка: название и кнопки в одну строку */
.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 8px;
}

/* Ограничение названия, чтобы оно не ломало верстку */
.menu-item-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1e;
  line-height: 1.2;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Тело: Список ингредиентов */
.menu-item-body {
  flex-grow: 1;
  margin-bottom: 12px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Компактные элементы состава */
.ingredient-tag {
  font-size: 12px;
  color: #3a3a3c;
  line-height: 1.3;
}

.ingredient-amount {
  color: #8e8e93;
  font-size: 11px;
}

.no-ingredients {
  margin: 0;
  font-size: 12px;
  color: #aeaea3;
  font-style: italic;
}

/* Футер: Выделенная цена */
.menu-item-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #f2f2f7;
  padding-top: 8px;
}

.menu-item-price {
  font-size: 16px;
  font-weight: 700;
  color: #007aff; /* Акцентный синий цвет */
}

.menu-item-footer {
  display: flex;
  justify-content: space-between; /* Распределяем цену влево, счетчик вправо */
  align-items: center;
  border-top: 1px solid #f2f2f7;
  padding-top: 8px;
  gap: 4px;
}

.menu-item-price {
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1e; /* Сделали чуть нейтральнее, так как акцент ушел кнопке */
  white-space: nowrap;
}

/* Обертка для фиксированного размера зоны счетчика */
.menu-item-counter-wrapper {
  min-width: 85px;
  min-height: 35px;
  display: flex;
  justify-content: flex-end;
}

/* Стартовая кнопка "Добавить" */
.add-initial-btn {
  background-color: #f2f2f7;
  color: #007aff;
  border: none;
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.add-initial-btn:active {
  background-color: #e5e5ea;
}

/* Составной счетчик (Контейнер) */
.counter-control {
  display: flex;
  align-items: center;
  background-color: #007aff; /* Акцентный синий цвет */
  border-radius: 14px;
  font-size: 13px;
  padding: 2px;
}

/* Кнопки Плюс и Минус */
.counter-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  width: 26px;
  height: 26px;
  color: #ffffff;
  cursor: pointer;
  border-radius: 50%;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.counter-btn:active {
  background-color: rgba(255, 255, 255, 0.2); /* Легкий нативный отсвет */
}

.counter-icon {
  width: 12px;
  height: 12px;
}

/* Текст самого числа счетчика */
.counter-value {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  min-width: 20px;
  text-align: center;
  user-select: none;
}
</style>
