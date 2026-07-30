import BaseRepository from './base.repository.js';

class OrdersRepository extends BaseRepository {
  constructor() {
    super('orders'); // Просто передаем имя таблицы в базовый класс
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
          ${this.tableName}.*, 
          users.name AS created_by
      FROM 
          orders
      LEFT JOIN 
          users ON orders.created_by = users.id;`
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
      INSERT INTO orders (customer_name, comments, payment_method, is_priority, created_by, modified_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await dbClient.query(query, [
      dto.customer_name, 
      dto.comments, 
      dto.payment_method, 
      dto.is_priority,
      dto.created_by,
      dto.modified_by,
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