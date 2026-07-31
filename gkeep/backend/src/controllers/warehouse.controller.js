import { catchAsync } from '../utils/catchAsync.js';
import {
  WarehouseRequestDTO, WarehouseResponseDTO,
  WarehouseCreateRequestDTO, WarehouseCreateResponseDTO,
  WarehouseUpdateRequestDTO, WarehouseUpdateResponseDTO,
} from '../dtos/warehouse.dto.js';

class WarehouseController {
  constructor(repository) {
    this.repository = repository;
  }
  
  // Получить весь список склада
  getAll = catchAsync(async (req, res) => {
    const rows = await this.repository.getAll();
    res.json(rows.map(row => new WarehouseResponseDTO(row)));
  });

  // Метод создания новой позиции на складе (/api/warehouse/create)
  create = catchAsync(async (req, res) => {
    const dto = new WarehouseCreateRequestDTO(req.body);
    
    const id = await this.repository.create(dto);

    res.status(201).json({ data:  null});
  });

  update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dto = new WarehouseUpdateRequestDTO(req.body, id);

    const data = await this.repository.update(dto);

    if (!data) {
      throw new NotFoundError('Позиция на складе не найдена');
    }

    res.json({ data: null });
  });
}

import warehouseRepository from '../repositories/warehouse.repository.js';
export default new WarehouseController(warehouseRepository);
