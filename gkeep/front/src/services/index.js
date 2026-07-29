import CoreDate from '@/utils/coreDate';

function sortArrayByCreatedAtDate(items, order = 'DESC') {
  if (order === 'DESC') return items.toSorted((a, b) => CoreDate.toDate(b.createdAt) - CoreDate.toDate(a.createdAt))
  else if (order === 'ASC') return items.toSorted((a, b) => CoreDate.toDate(a.createdAt) - CoreDate.toDate(b.createdAt))
}

function sortWithPriorityAndDate(items) {
  return items.toSorted((a, b) => {
    const priorityDiff = (b.priority || false) - (a.priority || false)
    
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    return CoreDate.toDate(a.createdAt) - CoreDate.toDate(b.createdAt)
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
  return {
    customerName: orderInfo?.clientName ?? '',
    comments: orderInfo?.comments ?? '',
    paymentMethod: orderInfo?.paymentMethod ?? '',
    isPriority: !!orderInfo?.isPriority,
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

export {
  formatPrice,
  formatDate,
  formatNewOrderRequest,
  mergeArraysByQuantity,
  sortArrayByCreatedAtDate,
  sortWithPriorityAndDate
}
