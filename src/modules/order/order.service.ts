import { PrismaClient, OrderStatus } from '@prisma/client';
import { OrderModel } from './order.model';
import { TransactionStatus } from './transaction.model';
import redisClient from '../../lib/redis';
import prisma from '@/lib/prisma'

//const prisma = new PrismaClient();

export class OrderService {
  async createOrder(userId: string, items: { productId: string; quantity: number }[]): Promise<OrderModel> {
    const order = await prisma.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0, // We'll update this with the actual price later
          })),
        },
      },
      include: {
        items: true,
      },
    });
    await redisClient.del(`user:${userId}:orders`);
    return order;
  }

  async getOrderById(id: string): Promise<OrderModel | null> {
    const cachedOrder = await redisClient.get(`order:${id}`);
    if (cachedOrder) {
      return JSON.parse(cachedOrder);
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (order) {
      await redisClient.set(`order:${id}`, JSON.stringify(order), {
        EX: 3600, // 1 hour
      });
    }
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderModel> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    await redisClient.set(`order:${id}`, JSON.stringify(order), {
      EX: 3600, // 1 hour
    });
    await redisClient.del(`user:${order.userId}:orders`);
    return order;
  }

  async getUserOrders(userId: string): Promise<OrderModel[]> {
    const cachedOrders = await redisClient.get(`user:${userId}:orders`);
    if (cachedOrders) {
      return JSON.parse(cachedOrders);
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    await redisClient.set(`user:${userId}:orders`, JSON.stringify(orders), {
      EX: 3600, // 1 hour
    });
    return orders;
  }

  async getAllOrders(page: number = 1, limit: number = 10): Promise<OrderModel[]> {
    return prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async placeOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
    shippingMethod: string,
    paymentMethodId: string
  ): Promise<OrderModel> {
    // Start a transaction
    return prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          shippingMethod,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          orderId: order.id,
          amount: order.items.reduce((total, item) => total + item.price * item.quantity, 0),
          status: TransactionStatus.PENDING,
          paymentMethodId,
        },
      });

      return order;
    });
  }
}

