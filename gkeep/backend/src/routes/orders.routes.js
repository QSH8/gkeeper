import { Router } from 'express';
import ordersController from '../controllers/orders.controller.js';

const router = Router();

router.get('/list', ordersController.getAll);
router.post('/get-order', ordersController.getOne);
router.post('/create', ordersController.create);
router.post('/update', ordersController.update);
router.post('/finish', ordersController.finish);

export default router;
