import { Router } from 'express';
import ordersController from '../controllers/orders.controller.js';

const router = Router();

// Создать заказ: POST /api/orders/create
router.post('/create', ordersController.create);

// Обновить заказ: PUT /api/orders/1
router.put('/update', ordersController.update);

export default router;
