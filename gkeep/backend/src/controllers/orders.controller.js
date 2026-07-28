import { catchAsync } from '../utils/catchAsync.js';
import orderService from '../services/order.service.js';
import {
  OrderCreateRequestDTO, OrderCreateResponseDTO,
  OrderUpdateRequestDTO, OrderUpdateResponseDTO,
} from '../dtos/order.dto.js';

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  create = catchAsync(async (req, res) => {
    // Имитируем, что ID сотрудника равен 5 (если мидлвар авторизации еще не написан) // TODO!!!
    const currentUserId = req.user?.id || 5; 
    
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

export default new OrderController(orderService);
