import express from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const orderController = new OrderController();
export const orderRouter = express.Router();

orderRouter.post('/', authMiddleware, orderController.createOrder);
orderRouter.get('/:id', authMiddleware, orderController.getOrder);
orderRouter.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
orderRouter.get('/user/orders', authMiddleware, orderController.getUserOrders);
orderRouter.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);

