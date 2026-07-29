import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';

const router = Router();

router.get('/list', menuController.getAll);
// router.get('/:id', menuController.getById);
// router.post('/сreate', menuController.create);
// router.post('/update', menuController.update);
// router.post('/delete', menuController.delete);

export default router;
