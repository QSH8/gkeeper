import { catchAsync } from '../utils/catchAsync.js';
import orderService from '../services/orders.service.js';
import orderRepository from '../repositories/orders.repository.js';

import {
  OrderResponseDTO,
  OrderCreateRequestDTO, OrderCreateResponseDTO,
  OrderUpdateRequestDTO, OrderUpdateResponseDTO,
} from '../dtos/orders.dto.js';

class OrderController {
  constructor(orderService, repository) {
    this.orderService = orderService;
    this.repository = repository;
  }

  getAll = catchAsync(async (req, res) => {
    const rows = await this.repository.getAll();
    res.json(rows.map(row => new OrderResponseDTO(row)));
  });

  create = catchAsync(async (req, res) => {
    // Имитируем, что ID сотрудника равен 5 (если мидлвар авторизации еще не написан) // TODO!!!
    const currentUserId = req.user?.id || 1; 
    
    // Передаем body и ID пользователя в DTO
    const dto = new OrderCreateRequestDTO(req.body, currentUserId);
    
    const createdOrder = await this.orderService.createOrder(dto);
    res.status(201).json(new OrderCreateResponseDTO(createdOrder));
  });

  update = catchAsync(async (req, res) => {
    // Имитируем, что ID сотрудника равен 5 (если мидлвар авторизации еще не написан) // TODO!!!
    const currentUserId = req.user?.id || 5; 
    
    // Передаем body и ID пользователя в DTO
    const dto = new OrderUpdateRequestDTO(req.body, currentUserId);
    
    const createdOrder = await this.orderService.createOrder(dto);
    res.status(201).json(new OrderCreateResponseDTO(createdOrder));
  });
}

export default new OrderController(orderService, orderRepository);
