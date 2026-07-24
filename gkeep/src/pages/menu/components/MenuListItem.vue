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
  emits: ['edit-item', 'delete-item'],
  methods: {
    handleEdit() {
      this.$emit('edit-item', this.itemData.id);
    },
    handleDelete() {
      this.$emit('delete-item', this.itemData.id);
    }
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
</style>
