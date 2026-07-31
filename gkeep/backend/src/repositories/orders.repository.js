import BaseRepository from './base.repository.js';

class OrdersRepository extends BaseRepository {
  constructor() {
    super('orders'); // Просто передаем имя таблицы в базовый класс
  }

  async finishOrder(orderId) {
    const { rows } = await this.pool.query(
      `UPDATE ${this.tableName} SET status = 'completed', finished_at = NOW() WHERE id = ${orderId}`
    );

    return rows;
  }
  async getOrderById(orderId) {
    const { rows } = await this.pool.query(
      `SELECT 
          ${this.tableName}.*
      FROM 
          ${this.tableName}
      WHERE
          ${this.tableName}.id = ${orderId};`
    );

    return rows;
  }

  async getAllSortByCreatedAt() {
    const { rows } = await this.pool.query(
      `SELECT 
          ${this.tableName}.*, 
          users.name AS created_by
      FROM 
          orders
      LEFT JOIN 
          users ON orders.created_by = users.id;`
    );
    return rows;
  }

  async getAllSortByCreatedAtAndStatus() {
    const { rows } = await this.pool.query(
      `SELECT 
          ${this.tableName}.*, 
          users.name AS created_by
      FROM 
          orders
      LEFT JOIN 
          users ON orders.created_by = users.id;`
    );
    return rows;
  }

  async getQueue() {
    const { rows } = await this.pool.query(
      `SELECT 
        o.* AS info,
        o.items AS items
      FROM orders o
      ORDER BY o.created_at ASC;`
    );
    return rows;
  }

  async getAll() {
    const { rows } = await this.pool.query(
      `SELECT 
          ${this.tableName}.*, 
          users.name AS created_by
      FROM 
          orders
      LEFT JOIN 
          users ON orders.created_by = users.id;`
    );
    return rows;
  }

  async create(dto, dbClient = this.pool) {
    const query = `
      INSERT INTO orders (items, price, customer_name, comments, payment_method, is_priority)
      VALUES ($1::jsonb, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await dbClient.query(query, [
      JSON.stringify(dto.items),
      dto.price,
      dto.customer_name, 
      dto.comments, 
      dto.payment_method, 
      dto.is_priority,
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