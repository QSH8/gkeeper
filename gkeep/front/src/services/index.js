import CoreDate from '@/utils/coreDate';

function sortArrayByCreatedAtDate(items, order = 'DESC') {
  const sortItems = items.filter(item => item?.info?.status !== 'in_progress')
  if (order === 'DESC') return sortItems.toSorted((a, b) => CoreDate.toDate(b?.info?.createdAt) - CoreDate.toDate(a?.info?.createdAt))
  else if (order === 'ASC') return sortItems.toSorted((a, b) => CoreDate.toDate(a?.info?.createdAt) - CoreDate.toDate(b?.info?.createdAt))
}

function sortWithPriorityAndDate(items) {
  console.log('items', items);
  
  return items.filter(item => item.info.status === 'in_progress')
    .toSorted((a, b) => {
      const priorityDiff = (b?.info?.isPriority || false) - (a?.info?.isPriority || false)
      
      if (priorityDiff !== 0) {
        return priorityDiff
      }
      return CoreDate.toDate(a?.info?.createdAt) - CoreDate.toDate(b?.info?.createdAt)
    })
}

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  return CoreDate.toStringByFormat(value, 'HH:mm dd, D MMM')
}

function formatNewOrderRequest(orderInfo, orderItems) {
  const price = getTotalPrice(orderItems)

  console.log('price', price);

  return {
    customerName: orderInfo?.clientName ?? '',
    comments: orderInfo?.comments ?? '',
    paymentMethod: orderInfo?.paymentMethod ?? '',
    isPriority: !!orderInfo?.isPriority,
    price,
    items: orderItems,
  }
}

function mergeArraysByQuantity(X, Y) {
  const registry = new Map(X.map(item => [item.id, { ...item }]));

  for (const itemY of Y) {
    if (registry.has(itemY.id)) {
      const existingItem = registry.get(itemY.id);
      existingItem.quantity = (existingItem.quantity || 0) + (itemY.quantity || 0);
    } else {
      registry.set(itemY.id, { ...itemY });
    }
  }

  return Array.from(registry.values());
}

function getTotalPrice(items) {
  return items.reduce((acc, cur) => {
    acc += (cur.price * cur.quantity)
    return acc
  }, 0)
}

export {
  formatPrice,
  formatDate,
  formatNewOrderRequest,
  mergeArraysByQuantity,
  sortArrayByCreatedAtDate,
  sortWithPriorityAndDate,
  getTotalPrice,
}
