import pool from '../config/db.js';
import orderRepository from '../repositories/orders.repository.js';
import warehouseRepository from '../repositories/warehouse.repository.js';
import { BadRequestError } from '../utils/appErrors.js';

class OrderService {
  async createOrder(orderDto) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const newOrder = await orderRepository.create(orderDto, client);

      await orderRepository.createOrderItems(newOrder.id, orderDto.items, client);

      // 5. Списываем ингредиенты со склада для каждой позиции в заказе
      for (const item of orderDto.items) {
        // Находим, из чего состоит это блюдо
        const ingredients = await warehouseRepository.getIngredientsForMenuProduct(item.id, client);
        
        for (const ing of ingredients) {
          // Вычисляем, сколько нужно списать с учетом количества заказанных порций (quantity)
          const totalRequired = ing.quantity_required * item.quantity;
          
          // Списываем. Если на складе мало — этот метод выбросит ошибку
          await warehouseRepository.decreaseIngredientStock(ing.ingredient_id, totalRequired, client);
        }
      }

      // 6. Если всё прошло успешно — фиксируем изменения в БД
      await client.query('COMMIT');
      return newOrder;

    } catch (error) {
      // 7. Если где-то произошел сбой — откатываем ВСЕ изменения назад
      await client.query('ROLLBACK');
      
      // Переворачиваем техническую ошибку склада в понятную пользователю ошибку 400 Bad Request
      throw new BadRequestError(`Не удалось создать заказ: ${error.message}`);
    } finally {
      // 8. Обязательно возвращаем клиента обратно в пул, иначе пул "задохнется"
      client.release();
    }
  }
}

export default new OrderService();
