import { Router } from 'express';
import warehouseController from '../controllers/warehouse.controller.js';

const router = Router();

router.get('/list', warehouseController.getAll);
router.post('/create', warehouseController.create);
router.post('/update', warehouseController.update);

export default router;
