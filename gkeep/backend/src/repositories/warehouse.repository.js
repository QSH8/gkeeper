import BaseRepository from './base.repository.js';
class WarehouseRepository extends BaseRepository {
  constructor() {
    super('warehouse'); // Просто передаем имя таблицы в базовый класс
  }

  async create(dto, dbClient = this.pool) {
    const query = `
      INSERT INTO warehouse (name, quantity, units)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await dbClient.query(query, [
      dto.name, 
      dto.quantity, 
      dto.units,
    ]);
    return rows[0];
  }

  async update(dto, dbClient = this.pool) {
    const query = `
      UPDATE warehouse
      SET
        name = $1,
        quantity = $2,
        units = $3
      WHERE
        id = $4
      RETURNING *;
    `;
    const { rows } = await dbClient.query(query, [
      dto.name,
      dto.quantity, 
      dto.units,
      dto.id,
    ]);
    return rows[0];
  }

  async getIngredientsForMenuProduct(menuId, dbClient = this.pool) {
    const query = `
      SELECT ingredient_id, quantity_required 
      FROM menu_ingredients 
      WHERE menu_id = $1;
    `;
    const { rows } = await dbClient.query(query, [menuId]);
    return rows;
  }

  // Списать ингредиент со склада с проверкой остатка
  async decreaseIngredientStock(ingredientId, amountToDecrease, dbClient = this.pool) {
    // FOR UPDATE блокирует строку на складе, чтобы два параллельных заказа не списали один и тот же остаток одновременно
    const checkQuery = `
      SELECT quantity FROM warehouse WHERE id = $1 FOR UPDATE;
    `;
    const { rows } = await dbClient.query(checkQuery, [ingredientId]);
    
    if (!rows[0] || rows[0].quantity < amountToDecrease) {
      // Бросаем ошибку, транзакция в Сервисе её поймает и сделает ROLLBACK
      throw new Error(`Недостаточно ингредиента на складе (ID: ${ingredientId})`);
    }

    const updateQuery = `
      UPDATE warehouse 
      SET quantity = quantity - $1 
      WHERE id = $2;
    `;
    await dbClient.query(updateQuery, [amountToDecrease, ingredientId]);
  }
}

export default new WarehouseRepository();