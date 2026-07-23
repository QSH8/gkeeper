import { coreDate } from '@utils'

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  return coreDate.toStringByFormat(value, 'HH:mm dddd, D MMM')
}

export { formatPrice, formatDate }
