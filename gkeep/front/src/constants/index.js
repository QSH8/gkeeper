const ORDER_STATUSES = {
  'in_progress': 'В работе',
  'completed': 'Завершён',
  'deleted': 'Удалён',
}

const UNIT_OPTIONS = [
  { key: 'ml', value: 'мл' },
  { key: 'g', value: 'г' },
  { key: 'entity', value: 'шт' },
]

const UNITS = {
  'ml': 'мл',
  'g': 'г',
  'entity': 'шт',
}

export {
  ORDER_STATUSES,
  UNITS,
  UNIT_OPTIONS,
}