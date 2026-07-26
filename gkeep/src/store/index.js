import { createStore } from 'vuex';
import { toast } from 'vue3-toastify';
import { mergeArraysByQuantity, formatNewOrderRequest } from '../services/index.js'
import { addNewOrderToQueueAPI } from '../api/index.js'
export default createStore({
  state() {
    return {
      orderItems: [],
      preOrderItems: [],
      orderInfo: {},
      isActiveCreate: false,
    };
  },
  
  getters: {
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
      
      state.orderItems.splice(index, 1)
    },

    ADD_TO_ORDER(state) {
      const newOrderItems = mergeArraysByQuantity(state.orderItems, state.preOrderItems)

      state.orderItems = newOrderItems
    },

    UPDATE_ORDER_INFO(state, { fieldName, fieldValue }) {
      state.orderInfo[fieldName] = fieldValue
    }
  },
  
  actions: {
    async addNewOrderToQueue({ state }) {
      console.log('addNewOrderToQueue')
      
      const newOrderId = await addNewOrderToQueueAPI(formatNewOrderRequest({ orderInfo: state.orderInfo, orderItems: state.orderItems }))
      
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

      if (fieldValue) {
        commit('UPDATE_ORDER_INFO', { fieldName, fieldValue })
      }
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
