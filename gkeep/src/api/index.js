import { api } from '@utils'

async function fetchOrderByIdAPI(orderId) {
  // '/order' by id
  console.log('API: fetchOrderByIdAPI, orderId ->', orderId)

  return ({
    data: {
      info: {
        id: Number(orderId),
        status: 'in_progress',
        isFinished: false,
        createdAt: '2026-07-22T14:30:00',
        finishedAt: null,
        customerName: 'Александр Волков',
        acceptedBy: 'Мария (Администратор)',
        finishedBy: null,
        priority: true,
      },
      items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ]
    }
  })
}

async function fetchOrdersListAPI() {
  '/orders/list'
  console.log('API: fetchOrdersListAPI')
  return ({
    data: [
      { id: 101, customer: 'Иван Иванов',
        items:  [
          { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
          { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
          { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
        ],
        price: 850, status: 'in_progress', createdAt: '2026-07-09T19:00:26', finishedAt: '2026-07-09T19:05:26',whoCreate: 'Дима', whoFinish: 'Дима'
      },
      { id: 102, customer: 'Анна Петрова', items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ], price: 620, status: 'completed', createdAt: '2026-07-09T19:00:26', finishedAt: '2026-07-09T20:00:26',whoCreate: 'Дима', whoFinish: 'Саша' },
      { id: 103, customer: 'Дмитрий Сидоров', items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ], price: 1500, status: 'completed', createdAt: '2026-07-09T19:20:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Миша', priority: true },
      { id: 104, customer: 'Дмитрий 1', items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ], price: 1500, status: 'deleted', createdAt: '2026-07-09T19:10:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Саша' },
      { id: 105, customer: 'Дмитрий 2', items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ], price: 1500, status: 'deleted', createdAt: '2026-07-09T19:00:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Дима' },
      { id: 106, customer: 'Дмитрий 3', items:  [
        { id: 1, name: 'Стейк Рибай', quantity: 1, price: 1200 },
        { id: 2, name: 'Салат Цезарь', quantity: 2, price: 450 },
        { id: 3, name: 'Вино сухое', quantity: 1, price: 2100 },
      ], price: 1500, status: 'completed', createdAt: '2026-07-09T19:00:26', finishedAt: '2026-07-09T21:05:26',whoCreate: 'Дима', whoFinish: 'Захар' },
    ]
  })
}

async function onFinishOrderAPI(orderId) {
  console.log('API: onFinishOrderAPI, orderId ->', orderId)
}

async function addNewOrderToQueueAPI(order) {
  console.log('API: addNewOrderToQueueAPI, order ->', order)
  return 'MOCK_ID'
}

// Warehouse
async function fetchWarehouseListAPI() {
  // '/warehouse/list'
  console.log('API: fetchWarehouseListAPI')
  return ({
    data: 
      [
        {
          id: 1,
          name: 'Водка',
          quantity: 20,
          unit: 'l',
        },
        {
          id: 2,
          name: 'Джин',
          quantity: 10,
          unit: 'l',
        },
        {
          id: 3,
          name: 'Ром',
          quantity: 10,
          unit: 'l',
        },
        {
          id: 4,
          name: 'Вода',
          quantity: 100,
          unit: 'l',
        },
        {
          id: 5,
          name: 'Стакан пластик 400',
          quantity: 100,
          unit: 'entity',
        },
      ]
    })
}
async function createWarehouseItemAPI(newWarehouseItem) {
  // 'warehouse/create'
  console.log('API: createWarehouseItemAPI, newWarehouseItem ->', newWarehouseItem)
  return 'MOCK_ID'
}
async function editWarehouseItemAPI(warehouseItem) {
  // '/warehouse/edit',
  console.log('API: editWarehouseItemAPI, warehouseItem ->', warehouseItem)
  return 'MOCK_ID'
}

export {
  onFinishOrderAPI,
  addNewOrderToQueueAPI,
  createWarehouseItemAPI,
  editWarehouseItemAPI,
  fetchWarehouseListAPI,
  fetchOrdersListAPI,
  fetchOrderByIdAPI,
}
