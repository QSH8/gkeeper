import { catchAsync } from '../utils/catchAsync.js';
import { MenuListResponseDTO } from '../dtos/menu.dto.js';
import { NotFoundError } from '../utils/appErrors.js'

class MenuController {
  constructor(repository) {
    this.repository = repository;
  }

  getAll = catchAsync(async (req, res) => {
    const rows = await this.repository.getAll();
    res.json(rows.map(row => new MenuListResponseDTO(row)));
  });

  // getById = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  //   const row = await this.repository.findById(id);
    
  //   if (!row) {
  //     throw new NotFoundError('Позиция меню не найдена');
  //   }
    
  //   res.json(new MenuResponseDTO(row));
  // });

  // create = catchAsync(async (req, res) => {
  //   const row = await this.menuRepository.create(req.body);
  //   res.status(201).json(new MenuResponseDTO(row));
  // });

  // update = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  //   const row = await this.menuRepository.update(id, req.body);
    
  //   if (!row) {
  //     throw new NotFoundError('Позиция меню для обновления не найдена');
  //   }
    
  //   res.json(new MenuResponseDTO(row));
  // });

  // delete = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  //   const isDeleted = await this.menuRepository.delete(id);
    
  //   if (!isDeleted) {
  //     throw new NotFoundError('Позиция меню для удаления не найдена');
  //   }
    
  //   res.json({ success: true, message: 'Позиция удалена из меню' });
  // });
}

import menuRepository from '../repositories/menu.repository.js';
export default new MenuController(menuRepository);
