import { PrismaClient, User, Product, Transaction } from '@prisma/client';
import prisma from '@/lib/prisma'

export class AdminService {
  async approveUser(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { status: 'APPROVED' },
    });
  }

  async approveSeller(sellerId: string): Promise<User> {
    return prisma.user.update({
      where: { id: sellerId },
      data: {
        status: 'APPROVED',
        role: 'SELLER',
      },
    });
  }

  async suspendUser(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });
  }

  async approveProduct(productId: string): Promise<Product> {
    return prisma.product.update({
      where: { id: productId },
      data: { status: 'APPROVED' },
    });
  }

  async rejectProduct(productId: string, reason: string): Promise<Product> {
    return prisma.product.update({
      where: { id: productId },
      data: { status: 'REJECTED', rejectionReason: reason },
    });
  }

  async getFlaggedTransactions(): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { flagged: true },
      include: { order: true },
    });
  }

  async generatePlatformReport(startDate: Date, endDate: Date) {
    const users = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        return itemSum + item.price * item.quantity;
      }, 0);
    }, 0);

    const topSellers = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        products: {
          some: {
            orderItems: {
              some: {
                order: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        products: {
          select: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              },
              select: {
                quantity: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return {
      newUsers: users,
      totalOrders: orders.length,
      totalRevenue,
      topSellers: topSellers.map((seller) => ({
        id: seller.id,
        email: seller.email,
        revenue: seller.products.reduce((sum, product) => {
          return sum + product.orderItems.reduce((itemSum, item) => {
            return itemSum + item.price * item.quantity;
          }, 0);
        }, 0),
      })),
    };
  }
}

