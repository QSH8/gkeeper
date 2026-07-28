import { catchAsync } from '../utils/catchAsync.js';
import {
  WarehouseCreateRequestDTO, WarehouseCreateResponseDTO,
  WarehouseResponseDTO, WarehouseResponseDTO,
  WarehouseUpdateRequestDTO, WarehouseUpdateResponseDTO,
} from '../dtos/warehouse.dto.js';

class WarehouseController {
  constructor(warehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }
  
  // Получить весь список склада
  getAll = catchAsync(async (req, res) => {
    const rows = await this.warehouseRepository.findAll();
    res.json(rows.map(row => new WarehouseResponseDTO(row)));
  });

  // Метод создания новой позиции на складе (/api/warehouse/create)
  create = catchAsync(async (req, res) => {
    const dto = new WarehouseCreateRequestDTO(req.body);

    const currentUserId = req.user?.id || 5; 
    
    const [newIngredient] = await this.warehouseRepository.create(dto, currentUserId);

    res.status(201).json(new WarehouseCreateResponseDTO(newIngredient));
  });

  update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dto = new WarehouseUpdateRequestDTO(req.body);

    const [updatedIngredient] = await this.warehouseRepository.update(id, dto);

    if (!updatedIngredient) {
      throw new NotFoundError('Позиция на складе не найдена');
    }

    res.json(new WarehouseUpdateResponseDTO(updatedIngredient));
  });
}

import warehouseRepository from '../repositories/warehouse.repository.js';
export default new WarehouseController(warehouseRepository);
