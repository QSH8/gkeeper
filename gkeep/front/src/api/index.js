import API from '@/utils/api/index.js'


async function loginAPI({ login, password }) {
  console.log('API: fetchOrdersListAPI')

  return new Promise((resolve, reject) => {
    API.QUERY({
      method: 'post',
      url: `/api/login`,
      data: { login, password },
    })
      .then((response) => resolve(response))
      .catch((error) => console.log(error))
  })
}

async function fetchOrderByIdAPI(orderId) {
  // '/order' by id
  console.log('API: fetchOrderByIdAPI, orderId ->', orderId)

  // return new Promise((resolve, reject) => {
  //   API.QUERY({
  //     method: 'get',
  //     url: `/orders/list`,
  //   })
  //     .then((response) => resolve(response.data.data))
  //     .catch((error) => reject(error))
  // })
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
  console.log('API: fetchOrdersListAPI')

  return new Promise((resolve, reject) => {
    API.QUERY({
      method: 'get',
      url: `/api/orders/list`,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}

async function fetchMenuListAPI() {
  console.log('API: fetchMenuListAPI')

  return new Promise((resolve, reject) => {
    API.QUERY({
      method: 'get',
      url: `/api/menu/list`,
    })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
}

async function onFinishOrderAPI(orderId) {
  console.log('API: onFinishOrderAPI, orderId ->', orderId)
}

async function addNewOrderToQueueAPI(order) {
  console.log('API: addNewOrderToQueueAPI, order ->', order)

  return new Promise((resolve, reject) => {
    API.QUERY({
      method: 'post',
      url: `/api/orders/create`,
      data: order,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
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
  loginAPI,
  onFinishOrderAPI,
  addNewOrderToQueueAPI,
  createWarehouseItemAPI,
  editWarehouseItemAPI,
  fetchWarehouseListAPI,
  fetchOrdersListAPI,
  fetchOrderByIdAPI,
  fetchMenuListAPI,
}
