import express from 'express';
import menuRouter from './routes/menu.routes.js';
import warehouseRouter from './routes/warehouse.routes.js';
import orderRouter from './routes/order.routes.js';
import { catchAsync } from './utils/catchAsync.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { initDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

// Подключение роутеров сущностей
app.use('/api/menu', menuRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/orders', orderRouter);

// Проверочный роут (Health-check)
app.get('/api/status', catchAsync(async (req, res) => {
    const rows = await await query('SELECT NOW()');

    res.json({
      status: 'Server is running',
      db_time: dbStatus.rows[0].now
    });
  })
);

app.use(errorMiddleware);

const startServer = async () => {
  await initDatabase()

  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}

startServer();
