import { api } from '@utils'

async function onFinishOrderAPI(orderId) {
  console.log('API: onFinishOrderAPI, orderId ->', orderId)
}

async function addNewOrderToQueueAPI(order) {
  console.log('API: addNewOrderToQueueAPI, order ->', order)
  return 'MOCK_ID'
}

export { onFinishOrderAPI, addNewOrderToQueueAPI }
