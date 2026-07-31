import { createStore } from 'vuex';
import { toast } from 'vue3-toastify';
import { mergeArraysByQuantity, formatNewOrderRequest, sortWithPriorityAndDate, sortArrayByCreatedAtDate } from '../services/index.js'
import {
  addNewOrderToQueueAPI,
  createWarehouseItemAPI,
  editWarehouseItemAPI,
  fetchWarehouseListAPI,
  fetchOrdersListAPI,
  fetchMenuListAPI,
} from '../api/index.js'

export default createStore({
  state() {
    return {
      orderItems: [],
      preOrderItems: [],
      orderInfo: {},
      isActiveCreate: false,
      ordersList: [],

      // Warehouse
      warehouseItems: [],

      // Menu
      menuItems: [],
    };
  },
  
  getters: {
    // //Warehouse
    // // Возвращает весь список товаров на складе
    // allWarehouseItems: (state) => state.warehouseItems,
    
    // // Пример полезного геттера: поиск конкретного ингредиента по ID
    // getIngredientById: (state) => (id) => {
    //   return state.warehouseItems.find(item => item.id === id);
    // },

    ordersQueueList: (state) => {
      return sortWithPriorityAndDate(state.ordersList)
    },

    ordersHistoryList: (state) => {
      return sortArrayByCreatedAtDate(state.ordersList, 'DESC')
    },

    getItemById: (state) => (itemId) => {
      return state.preOrderItems.find(item => item.id === itemId)
    },

    getItemByIdIndex: (state) => (itemId) => {
      return state.preOrderItems.findIndex(item => item.id === itemId)
    },

    getItemQuantity: (_, getters) => (itemId) => {
      const orderItem = getters.getItemById(itemId)

      return orderItem ? orderItem.quantity : 0
    },

    isItemInOrder: (_, getters) => (itemId) => {
      const item = getters.getItemById(itemId)

      return !!item
    },
  },
  
  mutations: {
    // Warehouse start

    // Запись всего списка в state после успешного GET-запроса
    SET_WAREHOUSE_ITEMS(state, items) {
      state.warehouseItems = items;
    },

    SET_MENU_ITEMS(state, items) {
      state.menuItems = items;
    },

    // Опционально: локальное обновление одного элемента (для оптимизации, если нужно)
    UPDATE_WAREHOUSE_ITEM(state, updatedItem) {
      const index = state.warehouseItems.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.warehouseItems[index] = { ...state.warehouseItems[index], ...updatedItem };
      }
    },

    // Опционально: локальное добавление элемента в массив
    ADD_WAREHOUSE_ITEM(state, newItem) {
      state.warehouseItems.push(newItem);
    },

    // Warehouse end

    SET_ACTIVE_CREATE(state) {
      state.isActiveCreate = true;
    },

    SET_INACTIVE_CREATE(state) {
      state.isActiveCreate = false;
      state.preOrderItems = []
      state.orderItems = []
      state.orderInfo = {}
    },

    CLEAR_PREORDER_ITEMS(state) {
      state.preOrderItems = []
    },

    UPDATE_PRE_ORDER_ITEM_QUANTITY(state, { itemIndex, quantity }) {
      const item = state.preOrderItems[itemIndex]
      item.quantity = quantity
    },

    ADD_NEW_ITEM_IN_PREORDER(state, item) {
      state.preOrderItems.push(item)
    },

    REMOVE_PREORDER_ITEM(state, index) {
      console.log('index ->', index);
      
      state.preOrderItems.splice(index, 1)
    },

    ADD_TO_ORDER(state) {
      const newOrderItems = mergeArraysByQuantity(state.orderItems, state.preOrderItems)

      state.orderItems = newOrderItems
    },

    UPDATE_ORDER_INFO(state, { fieldName, fieldValue }) {
      state.orderInfo[fieldName] = fieldValue
    },

    SET_ORDERS_LIST(state, ordersList) {
      state.ordersList = ordersList
    },
  },
  
  actions: {
    async fetchOrdersList({ commit }) {
      try {
        const response = await fetchOrdersListAPI()

        console.log('fetchOrdersList, response ->', response)

        if (response.data) {
          commit('SET_ORDERS_LIST', response.data)
        }
      } catch (e) {
        console.error('Ошибка при загрузке списка заказов:', e);
      }
    },

    //Warehouse
    // 1. Получение списка ингредиентов (GET /warehouse/list)
    async fetchWarehouseList({ commit }) {
      try {
        const response = await fetchWarehouseListAPI();
        // Передаем полученные данные в мутацию
        commit('SET_WAREHOUSE_ITEMS', response);
      } catch (error) {
        console.error('Ошибка при загрузке склада:', error);
        throw error; // Пробрасываем ошибку, чтобы компонент её отловил
      }
    },

    async fetchMenuList({ commit }) {
      try {
        const response = await fetchMenuListAPI();
        console.log('response ->', response);
        
        commit('SET_MENU_ITEMS', response);
      } catch (error) {
        console.error('Ошибка при загрузке Меню:', error);
        throw error; 
      }
    },

    // 2. Редактирование ингредиента (POST /warehouse/edit)
    // Ожидает объект: { id, name, quantity }
    async editWarehouseItem({ commit }, payload) {
      try {
        await editWarehouseItemAPI({
          id: payload.id,
          name: payload.name,
          quantity: payload.quantity,
          units: payload.units,
        });
      } catch (error) {
        console.error('Ошибка при редактировании:', error);
        throw error;
      }
    },

    // 3. Создание нового ингредиента (POST /warehouse/create)
    // Ожидает объект: { name, quantity, unit }
    async createWarehouseItem({ commit }, payload) {
      try {
        await createWarehouseItemAPI({
          name: payload.name,
          quantity: payload.quantity,
          units: payload.units
        });
      } catch (error) {
        console.error('Ошибка при создании элемента:', error);
        throw error;
      }
    },
    // Warehouse end
    

    async addNewOrderToQueue({ state }) {
      console.log('addNewOrderToQueue')
      
      const newOrderId = await addNewOrderToQueueAPI(formatNewOrderRequest(state.orderInfo, state.orderItems))
      
      toast(`Новый заказ #${newOrderId} добавлен в очередь`, { autoClose: 1000, type: 'success', position: 'top-center' })
    },

    clearPreOrderItems({ commit }) {
      console.log('clearPreOrderItems')

      commit('CLEAR_PREORDER_ITEMS')
    },

    addToOrder({ commit }) {
      console.log('addToOrder')

      commit('ADD_TO_ORDER')
    },

    updateOrderInfo({ commit }, { fieldName, fieldValue }) {
      console.log('updateOrderInfo')

      commit('UPDATE_ORDER_INFO', { fieldName, fieldValue })
    },

    addNewItemInPreOrder({ commit }, item) {
      console.log('addNewItemInPreOrder fire')
      commit('ADD_NEW_ITEM_IN_PREORDER', item)
    },
    updatePreOrderItemQuantity({ commit, getters }, { itemId, quantity }) {
      console.log('updatePreOrderItemQuantity fire')
      const itemIndex = getters.getItemByIdIndex(itemId)

      commit('UPDATE_PRE_ORDER_ITEM_QUANTITY', { itemIndex, quantity })
    },

    setActiveCreate({ commit }) {
      console.log('setActiveCreate fire')
      commit('SET_ACTIVE_CREATE');
    },

    setInactiveCreate({ commit }) {
      console.log('setInactiveCreate fire')
      commit('SET_INACTIVE_CREATE');
    },
    removePreOrderItem({ commit, getters }, itemId) {
      console.log('removeOrderItem fire')
      
      const itemIndex = getters.getItemByIdIndex(itemId)
      commit('REMOVE_PREORDER_ITEM', itemIndex)
    },
  }
});
