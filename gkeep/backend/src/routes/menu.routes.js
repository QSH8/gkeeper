import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';

class MenuRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', menuController.getAll);
    this.router.get('/:id', menuController.getById);
    this.router.post('/сreate', menuController.create);
    this.router.post('/update', menuController.update);
    this.router.post('/delete', menuController.delete);
  }
}

export default new MenuRouter().router;
