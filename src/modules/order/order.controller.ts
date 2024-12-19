import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { OrderStatus } from '@prisma/client';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const order = await orderService.createOrder(userId, items);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create order' });
    }
  }

  async getOrder(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await orderService.getOrderById(id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to get order' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const order = await orderService.updateOrderStatus(id, status as OrderStatus);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update order status' });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const orders = await orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get user orders' });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const orders = await orderService.getAllOrders(page, limit);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get all orders' });
    }
  }
}

