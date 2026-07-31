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
      <div v-if="activeCategorySubtabs.length" class="subtabs-scroll-wrapper">
        <button
          v-for="subtab in activeCategorySubtabs"
          :key="subtab.id"
          class="subtab-button"
          :class="{ 'subtab-button--active': subtab.value === activeSubCategory }"
          @click="handleSubtabClick(subtab.value)"
        >
          {{ subtab.label }}
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

    <div v-if="isActiveCreate" class="order-button-wrapper">
      <button
        type="button"
        class="order-btn cancel-order-btn" 
        @click="goBackToOrder"
        aria-label="Назад"
      >
        <span class="btn-text">← Назад</span>
      </button>
      <button
        type="button"
        class="order-btn create-order-btn" 
        :class="{ 'disabled': disabledAddToOrderButton }"
        @click="addToOrder"
        aria-label="Добавить в заказ"
      >
        <span class="btn-text">Добавить в заказ</span>
      </button>
      <!-- <ConfirmModal :isOpen="showConfirmCreate" title="Добавление позиций в заказ"
        message="Добавить в заказ?" confirmText="Да" @confirm="goBackToOrder"
        @close="showConfirmCreate = false"
      /> -->
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';
import MenuListItem from './MenuListItem.vue';
// import ConfirmModal from '@/components/ui/ConfirmModal.vue';

export default {
  name: 'MenuList',
  components: {
    MenuListItem,
    // ConfirmModal,
  },
  emits: ['select-item', 'update:activeCategory'],
  data() {
    return {
      activeCategory: 'all',
      activeSubCategory: '',
      items: [],
      searchQuery: '',
      isLoading: false,
      error: null,
      // Локальный список табов для отображения сверху
      tabs: [
        { id: 1, label: 'Всё меню', value: 'all'},
        { id: 2, label: 'Коктейли', value: 'cocktails' },
        { id: 3, label: 'Безалкогольные', value: 'non-alc' },
        { id: 4, label: 'Стопки', value: 'stacks',
          subtabs: [
            { id: 1, label: 'Алко на выбор', value: 'choose' },
            { id: 2, label: 'Шоты', value: 'shots' },
            { id: 3, label: 'Настойки', value: 'tinctures' },
          ]
        },
        { id: 5, label: 'Кухня', value: 'kitchen' },
        { id: 6, label: 'Разное', value: 'another' },
      ],

      preorder: [],
    };
  },
  computed: {
    ...mapState({
      menuItems: (state) => state.menuItems,
    }),

    activeTab() {
      return this.tabs.find(tab => tab.value === this.activeCategory) ?? {}
    },

    activeCategorySubtabs() {
      return this.activeTab?.subtabs ?? []
    },

    disabledAddToOrderButton() {
      return !this.$store.state.preOrderItems.length
    },

    isActiveCreate() {
      return this.$store.state.isActiveCreate
    },

    // Двойная фильтрация: сначала по табу, затем по поисковой строке
    filteredItems() {
      let result = this.menuItems;

      // 1. Фильтрация по табу (если выбран не 'all')
      if (this.activeCategory !== 'all') {
        result = result.filter(item => item.category === this.activeCategory);
      }

      // 1. Фильтрация по табу (если выбран не 'all')
      if (this.activeSubCategory !== '') {
        result = result.filter(item => item.subCategory === this.activeSubCategory);
      }

      // 2. Фильтрация по поиску
      const query = this.searchQuery.trim().toLowerCase();
      if (query) {
        result = result.filter(item => 
          item.name && item.name.toLowerCase().includes(query)
        );
      }

      return result;
    }
  },

  methods: {
    ...mapActions({
      fetchMenuList: 'fetchMenuList',
    }),

    async fetchItems() {
      this.isLoading = true;
      await this.fetchMenuList()
      this.isLoading = false;
    },

    goBackToOrder() {
      console.log('goBackToOrder');
      this.$store.dispatch('clearPreOrderItems')
      this.$router.push('/order/create')
    },

    addToOrder() {
      console.log('addToOrder');
      this.$store.dispatch('addToOrder')
      this.goBackToOrder()
    },


    // Клик по табу сообщает родителю о смене пропса через паттерн v-model
    handleTabClick(categoryValue) {
      this.activeCategory = categoryValue;
      if (this.activeCategorySubtabs.length) {
        this.activeSubCategory = this.activeCategorySubtabs[0]?.value ?? ''
      } else {
        this.activeSubCategory = ''
      }
    },
    handleSubtabClick(subCategoryValue) {
      this.activeSubCategory = subCategoryValue;
    },
    handleItemClick(item) {
      this.$emit('select-item', item);
    }
  },

  async mounted() {
    await this.fetchItems();
  },
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

.tabs-scroll-wrapper, .subtabs-scroll-wrapper {
  display: flex;
  gap: 8px;
  overflow-x: auto; /* Позволяет скроллить табы пальцем по горизонтали */
  scrollbar-width: none; /* Прячет стандартный скроллбар в Firefox */
  padding-bottom: 4px;
}

.tabs-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Прячет стандартный скроллбар в Chrome/Safari/iOS */
}

.tab-button, .subtab-button {
  white-space: nowrap; /* Не дает тексту внутри кнопок переноситься */
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #8e8e93;
  background-color: #f2f2f7;
  border: none;
  border-radius: 20px; /* Круглые нативные кнопочки */
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.subtab-button {
  margin-top: 0.8rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* Стили активного таба */
.tab-button--active, .subtab-button--active {
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
  margin-bottom: 4rem;
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

.order-button-wrapper {
  display: flex;
  position: sticky;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  bottom: 10px;
  /* Безопасные отступы для безрамочных экранов (iPhone с Notch / Dynamic Island) */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%);
  box-sizing: border-box;
  z-index: 100;
}

.order-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: fit-content;
  color: #ffffff;
  border: none;
  border-radius: 16px; /* Современное мобильное скругление, как у карточек */
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.2);
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s, transform 0.1s;
  -webkit-tap-highlight-color: transparent; /* Убирает стандартную синюю рамку тапа в Safari */
}
.cancel-order-btn {
  background-color: red; /* Приятный, нативный зеленый цвет (iOS Apple Green) */
}

/* Сама зеленая кнопка во всю ширину */
.create-order-btn {
  background-color: #34c759; /* Приятный, нативный зеленый цвет (iOS Apple Green) */
}

.create-order-btn.disabled {
  background-color: #b7b5b5;
  pointer-events: none;
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
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
