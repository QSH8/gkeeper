<template>
  <div class="warehouse-container">
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
    <div v-if="filteredItems.length === 0" class="menu-list-empty">
      <p v-if="searchQuery">Ничего не найдено по запросу «{{ searchQuery }}»</p>
      <p v-else>В этой категории пока нет позиций</p>
    </div>
    <!-- Таблица/список данных -->
    <div v-else class="table-container">
      <table class="warehouse-table">
        <thead>
          <tr>
            <th class="col-name">Наименование</th>
            <th class="col-qty">Кол-во</th>
            <th class="col-unit">Ед. изм.</th>
          </tr>
        </thead>
        
        <tbody>
          <!-- Состояние загрузки -->
          <tr v-if="loading">
            <td colspan="3" class="loading-state">Загрузка данных...</td>
          </tr>

          <!-- Вывод строк таблицы -->
          <tr 
            v-else 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="table-row"
            @click="openEditModal(item)"
          >
            <td class="col-name"><div class="text-ellipsis">{{ item.name }}</div></td>
            <td class="col-qty text-bold">{{ item.quantity }}</td>
            <td class="col-unit text-muted">{{ item.units }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Фиксированная кнопка добавления -->
    <div class="fab-container">
      <button class="btn-primary btn-block" @click="openCreateModal">
        Добавить позицию
      </button>
    </div>

    <!-- Модальное окно на чистой реактивности (без тега form) -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3 class="modal-title">
          {{ isEditMode ? 'Редактировать' : 'Добавить новый элемент' }}
        </h3>

        <!-- Блок инпутов -->
        <div class="modal-body">
          <div class="form-group">
            <label for="name">Наименование</label>
            <input
              class="form-input"
              id="name"
              v-model.trim="formName" 
              type="text" 
            />
          </div>

          <div class="form-group">
            <label for="quantity">Количество</label>
            <input
              class="form-input"
              id="quantity"
              v-model.trim="formQuantity" 
              type="text" 
            />
          </div>

          <!-- Поле рендерится только в режиме создания нового элемента -->
          <div class="form-group">
            <div class="select-wrapper">
              <label>Единица измерения</label>
              <select
                :value="formUnits"
                @change="formUnits = $event.target.value"
                class="custom-select"
              >
                <option value="" disabled selected hidden></option>
                <option 
                  v-for="option in unitOptions" 
                  :key="option.key" 
                  :value="option.value"
                >
                  {{ option.value }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Ошибки валидации (замена стандартной HTML5 валидации) -->
        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>

        <!-- Действия -->
        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="closeModal">
            Отмена
          </button>
          <button 
            type="button" 
            class="btn-primary" 
            :disabled="submitting" 
            @click="submitData"
          >
            {{ submitting ? 'Сохранение...' : 'Подтвердить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UNITS, UNIT_OPTIONS } from '@/constants';
import { toast } from 'vue3-toastify';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'WarehouseList',
  
  data() {
    return {
      loading: false,
      submitting: false,
      isModalOpen: false,
      isEditMode: false,
      validationError: '',
      searchQuery: '',
      
      // Каждое поле — отдельное реактивное свойство (без единого объекта form)
      formId: null,
      formName: '',
      formQuantity: '',
      formUnits: '',
      unitOptions: UNIT_OPTIONS,
      UNITS,
    };
  },

  computed: {
    ...mapState({
      warehouseItems: state => state.warehouseItems
    }),

    filteredItems() {
      const query = this.searchQuery.trim().toLowerCase();

      if (query) {
        return this.warehouseItems.filter(item => 
          item.name && item.name.toLowerCase().includes(query)
        );
      }
      
      return this.warehouseItems
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions({
      getWarehouseList: 'fetchWarehouseList',
      editWarehouseItem: 'editWarehouseItem',
      createWarehouseItem: 'createWarehouseItem'
    }),

    async fetchData() {
      this.loading = true;
      try {
        await this.getWarehouseList();
      } catch (error) {
        alert('Ошибка при загрузке данных склада');
      } finally {
        this.loading = false;
      }
    },

    openEditModal(item) {
      this.isEditMode = true;
      this.validationError = '';
      
      // Наполняем реактивные свойства значениями
      this.formId = item.id;
      this.formName = item.name;
      this.formQuantity = item.quantity;
      this.formUnits = item.units;
      
      this.isModalOpen = true;
    },

    openCreateModal() {
      this.isEditMode = false;
      this.validationError = '';
      
      // Сбрасываем реактивные свойства к дефолту
      this.formId = null;
      this.formName = '';
      this.formQuantity = '';
      this.formUnits = '';
      
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    // Ручная валидация перед сборкой DTO
    validateFields() {
      if (!this.formName) {
        this.validationError = 'Заполните наименование позиции';
        return false;
      }
      if (this.formQuantity === '' || this.formQuantity === null || isNaN(Number(this.formQuantity))) {
        this.validationError = 'Введите корректное количество';
        return false;
      }
      if (!this.isEditMode && !this.formUnits) {
        this.validationError = 'Выберите единицу измерения';
        return false;
      }
      this.validationError = '';
      return true;
    },

    async submitData() {
      if (!this.validateFields()) return;

      this.submitting = true;
      try {
        if (this.isEditMode) {
          const updateDto = {
            id: Number(this.formId),
            name: String(this.formName),
            quantity: Number(this.formQuantity),
            units: String(this.formUnits),
          };
          
          await this.editWarehouseItem(updateDto);
          toast(`Позиция ${updateDto.name} обновлена. Количество: ${updateDto.quantity}`, { autoClose: 1500, type: 'success', position: 'top-center' })

        } else {
          // Форматируем строго под CreateWarehouseItemDto
          const createDto = {
            name: String(this.formName),
            quantity: Number(this.formQuantity),
            units: String(this.formUnits)
          };
          
          await this.createWarehouseItem(createDto);
          toast(`Позиция ${createDto.name} добавлена в количестве ${createDto.quantity}`, { autoClose: 1500, type: 'success', position: 'top-center' })
        }
        
        this.closeModal();
        await this.fetchData()
      } catch (error) {
        alert('Не удалось сохранить изменения на сервере', error);
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Контейнер для позиционирования кастомной стрелочки */
.select-wrapper {
  position: relative;
  width: 100%;
}

/* Стили селекта, полностью повторяющие ваш input text */
.custom-select {
  width: 100%;
  background-color: #f2f2f7;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  /* Дополнительный правый паддинг, чтобы текст не наезжал на стрелочку */
  padding-right: 40px; 
  font-size: 15px;
  color: #1c1c1e;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s, background-color 0.2s;
  
  /* Сброс стандартного внешнего вида браузера */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

/* Эффекты при фокусе и ховере */
.custom-select:focus {
  background-color: #ffffff;
  border-color: #007ff5; /* Аккуратный синий фокус, можно заменить на ваш */
}

/* Кастомная стрелочка drop-down (аккуратный мобильный SVG-треугольник) */
.select-wrapper::after {
  content: "";
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  /* SVG иконка стрелочки вниз цвета #1c1c1e */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://w3.org' viewBox='0 0 24 24' fill='none' stroke='%231c1c1e' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none; /* Клик проходит сквозь стрелку в селект */
}

.warehouse-container {
  padding: 16px;
  padding-bottom: 90px;
  font-family: sans-serif;
  margin: 0 auto;
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



.page-title {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}
/* Контейнер таблицы с закруглениями */
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Стилизация HTML таблицы */
.warehouse-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
}

/* Центровка всех ячеек в шапке и теле */
.warehouse-table th, 
.warehouse-table td {
  padding: 1rem 1rem;
  text-align: center; /* Центрирование контента во всех колонках */
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.warehouse-table th {
  background: #f8f9fa;
  font-weight: bold;
  font-size: 0.8rem;
  color: #666;
}

.table-row {
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.8rem;
  -webkit-tap-highlight-color: transparent;
}

.table-row:active {
  background: #f0f0f0;
}

/* Ширина колонок (можно настроить пропорции) */
.col-name { width: 33.3%; }
.col-qty { width: 33.3%; }
.col-unit { width: 33.3%; }

.text-ellipsis {
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-bold { font-weight: 600; }
.text-muted { color: #888; }
.loading-state { padding: 30px; text-align: center; color: #666; }

.fab-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(255,255,255,1) 80%, rgba(255,255,255,0));
  z-index: 10;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-block {
  width: 100%;
  display: block;
}

.btn-secondary {
  background: #e4e6eb;
  color: #333;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

@media (min-width: 480px) {
  .modal-overlay { align-items: center; }
}

.modal-content {
  background: white;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  box-sizing: border-box;
}

@media (min-width: 480px) {
  .modal-content { border-radius: 12px; }
}

.modal-title { margin-top: 0; margin-bottom: 20px; font-size: 18px; }
.modal-body { display: block; }

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #555;
}

.form-group input, .form-group select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.form-input {
  border: 1px solid transparent;
  outline: none;
  box-sizing: border-box;
}
.form-input:focus {
  background-color: #ffffff;
  border-color: #007aff; /* Синий акцент при фокусе */
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: -8px;
  font-weight: 500;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
}
</style>
