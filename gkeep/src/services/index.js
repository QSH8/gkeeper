import { coreDate } from '@utils'

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  return coreDate.toStringByFormat(value, 'HH:mm dd, D MMM')
}

function formatNewOrderRequest({ orderInfo, orderItems }) {
  return {
    info: {
      clientName: orderInfo?.clientName ?? '',
      comments: orderInfo?.comments ?? '',
      isPriority: !!orderInfo?.isPriority,
    },
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

export { formatPrice, formatDate, formatNewOrderRequest, mergeArraysByQuantity }
