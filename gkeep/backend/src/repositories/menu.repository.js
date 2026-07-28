import BaseRepository from './base.repository.js';

class MenuRepository extends BaseRepository {
  constructor() {
    super('menu'); // Просто передаем имя таблицы в базовый класс
  }
}

export default new MenuRepository();