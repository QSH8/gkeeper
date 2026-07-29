import BaseRepository from './base.repository.js';

class MenuRepository extends BaseRepository {
  constructor() {
    super('menu'); // Просто передаем имя таблицы в базовый класс
  }

  async getAll() {
    const { rows } = await this.pool.query(
      `
        SELECT 
          m.id AS id,
          m.name AS name,
          m.price AS price,
          m.is_available AS is_available,
          m.category AS category,
          m.sub_category AS sub_category,
          json_agg(
              json_build_object(
                  'id', w.id,
                  'name', w.name,
                  'quantity', mi.quantity_required
              )
          ) FILTER (WHERE w.id IS NOT NULL) AS ingredients
        FROM menu m
        LEFT JOIN menu_ingredients mi ON m.id = mi.menu_id
        LEFT JOIN warehouse w ON mi.ingredient_id = w.id
        GROUP BY m.id, m.name;
      `
    );

    console.log('rows ->', rows);
    
    return rows;
  }

  async getIngredientsInMenuItem(menu_id) {

  }
}

export default new MenuRepository();