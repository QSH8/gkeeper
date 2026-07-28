import BaseRepository from './base.repository.js';

class OrdersRepository extends BaseRepository {
  constructor() {
    super('orders'); // Просто передаем имя таблицы в базовый класс
  }

  async create(dto, dbClient = this.pool) {
    const query = `
      INSERT INTO orders (customer_name, comments, payment_method, is_priority, created_by, created_at, modified_by, modified_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), $5, NOW())
      RETURNING *
    `;
    const { rows } = await dbClient.query(query, [
      dto.customerName, 
      dto.comments, 
      dto.paymentMethod, 
      dto.isPriority,
      dto.createdBy
    ]);
    return rows[0];
  }


  async createOrderItems(orderId, items, dbClient = this.pool) {
    for (const item of items) {
      await dbClient.query(
        'INSERT INTO order_items (order_id, menu_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.id, item.quantity]
      );
    }
  }
}

export default new OrdersRepository();