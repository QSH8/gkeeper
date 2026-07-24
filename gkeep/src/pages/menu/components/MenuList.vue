<template>
  <div class="menu-list-container">
    <!-- Блок вкладок (Табы) с горизонтальным скроллом для мобильных -->
    <div class="tabs-container">
      <div class="tabs-scroll-wrapper">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ 'tab-button--active': tab.value === activeCategory }"
          @click="handleTabClick(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Поле поиска -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск по названию..." 
          class="search-input"
          aria-label="Поиск по названию"
        />
        <button 
          v-if="searchQuery" 
          class="clear-button" 
          @click="searchQuery = ''"
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Состояния загрузки и ошибки -->
    <div v-if="isLoading" class="menu-list-loading">
      <div class="spinner"></div>
      <p>Обновляем меню...</p>
    </div>

    <div v-else-if="error" class="menu-list-error">
      <p>{{ error }}</p>
      <button @click="fetchItems" class="retry-button">Повторить попытку</button>
    </div>

    <!-- Заглушка, если ничего не найдено -->
    <div v-else-if="filteredItems.length === 0" class="menu-list-empty">
      <p v-if="searchQuery">Ничего не найдено по запросу «{{ searchQuery }}»</p>
      <p v-else>В этой категории пока нет позиций</p>
    </div>

    <!-- Анимированная сетка -->
    <transition-group 
      v-else 
      name="menu-fade" 
      tag="div" 
      class="menu-list-grid"
    >
      <menu-list-item
        v-for="item in filteredItems"
        :key="item.id"
        :item-data="item"
        @click="handleItemClick(item)"
      />
    </transition-group>
  </div>
</template>

<script>
import MenuListItem from './MenuListItem.vue';

export default {
  name: 'MenuList',
  components: {
    MenuListItem
  },
  props: {
    // Пропс для текущей активной категории меню
    activeCategory: {
      type: String,
      required: true,
      default: 'all'
    }
  },
  emits: ['select-item', 'update:activeCategory'],
  data() {
    return {
      items: [],
      searchQuery: '',
      isLoading: false,
      error: null,
      // Локальный список табов для отображения сверху
      tabs: [
        { id: 1, label: 'Всё меню', value: 'all' },
        { id: 2, label: 'Пицца', value: 'pizza' },
        { id: 3, label: 'Бургеры', value: 'burgers' },
        { id: 4, label: 'Закуски', value: 'snacks' },
        { id: 5, label: 'Напитки', value: 'drinks' }
      ]
    };
  },
  computed: {
    // Двойная фильтрация: сначала по табу, затем по поисковой строке
    filteredItems() {
      let result = this.items;

      // 1. Фильтрация по табу (если выбран не 'all')
      if (this.activeCategory !== 'all') {
        result = result.filter(item => item.category === this.activeCategory);
      }

      // 2. Фильтрация по поиску
      const query = this.searchQuery.trim().toLowerCase();
      if (query) {
        result = result.filter(item => 
          item.title && item.title.toLowerCase().includes(query)
        );
      }

      return result;
    }
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      this.isLoading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // В мок-данные добавлено поле category, под которое подстраивается фильтр
        this.items = [
          {
            id: 1,
            title: 'Пицца Маргарита',
            price: 450,
            category: 'pizza',
            ingredients: [{ name: 'Моцарелла', amount: '150г' }, { name: 'Томаты', amount: '100г' }]
          },
          {
            id: 2,
            title: 'Бургер Классический',
            price: 380,
            category: 'burgers',
            ingredients: [{ name: 'Котлета', amount: '120г' }, { name: 'Чеддер', amount: '1 шт' }]
          },
          {
            id: 3,
            title: 'Салат Цезарь',
            price: 320,
            category: 'snacks',
            ingredients: [{ name: 'Курица', amount: '100г' }, { name: 'Пармезан', amount: '20г' }]
          },
          {
            id: 4,
            title: 'Картофель Фри',
            price: 150,
            category: 'snacks',
            ingredients: [{ name: 'Картофель', amount: '150г' }]
          },
          {
            id: 5,
            title: 'Лимонад Домашний',
            price: 180,
            category: 'drinks',
            ingredients: [{ name: 'Лимон', amount: '50г' }, { name: 'Мята', amount: '5г' }]
          }
        ];
      } catch (err) {
        this.error = 'Ошибка загрузки';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    // Клик по табу сообщает родителю о смене пропса через паттерн v-model
    handleTabClick(categoryValue) {
      this.$emit('update:activeCategory', categoryValue);
    },
    handleItemClick(item) {
      this.$emit('select-item', item);
    }
  }
};
</script>

<style scoped>
.menu-list-container {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* --- Мобильные табы --- */
.tabs-container {
  width: 100%;
  margin-bottom: 12px;
  overflow: hidden;
}

.tabs-scroll-wrapper {
  display: flex;
  gap: 8px;
  overflow-x: auto; /* Позволяет скроллить табы пальцем по горизонтали */
  scrollbar-width: none; /* Прячет стандартный скроллбар в Firefox */
  padding-bottom: 4px;
}

.tabs-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Прячет стандартный скроллбар в Chrome/Safari/iOS */
}

.tab-button {
  white-space: nowrap; /* Не дает тексту внутри кнопок переноситься */
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #8e8e93;
  background-color: #f2f2f7;
  border: none;
  border-radius: 20px; /* Круглые нативные кнопочки */
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

/* Стили активного таба */
.tab-button--active {
  color: #ffffff;
  background-color: #007aff; /* Акцентный синий */
  font-weight: 600;
}

/* --- Поиск --- */
.search-box {
  width: 100%;
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #8e8e93;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 36px;
  font-size: 15px;
  background-color: #f2f2f7;
  border: none;
  border-radius: 12px;
  color: #1c1c1e;
  outline: none;
  box-sizing: border-box;
}

.clear-button {
  position: absolute;
  right: 10px;
  background: #c7c7cc;
  border: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* --- Сетка --- */
.menu-list-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

/* --- Системные состояния --- */
.menu-list-loading,
.menu-list-error,
.menu-list-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #8e8e93;
  font-size: 15px;
  text-align: center;
  padding: 20px;
}

.retry-button {
  margin-top: 16px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 12px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Анимации --- */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.menu-fade-move {
  transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.menu-fade-leave-active {
  position: absolute;
  width: calc(50% - 6px);
}

@media (min-width: 768px) {
  .menu-list-grid, .search-box, .tabs-container {
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
