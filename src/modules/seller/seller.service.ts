import { PrismaClient, SellerProfile, Promotion, PromotionType, User, Product, Order, OrderItem, OrderStatus } from '@prisma/client';
import { SellerProfileModel, PromotionModel, ProductModel, OrderModel } from './seller.model';

import prisma from '@/lib/prisma'

export class SellerService {
  async createSellerProfile(userId: string, data: Omit<SellerProfileModel, 'id' | 'userId' | 'isVerified' | 'createdAt' | 'updatedAt'>): Promise<SellerProfileModel> {
    return prisma.sellerProfile.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getSellerProfile(userId: string): Promise<SellerProfileModel | null> {
    return prisma.sellerProfile.findUnique({
      where: { userId },
    });
  }

  async updateSellerProfile(userId: string, data: Partial<SellerProfileModel>): Promise<SellerProfileModel> {
    return prisma.sellerProfile.update({
      where: { userId },
      data,
    });
  }

  async verifySellerProfile(userId: string): Promise<SellerProfileModel> {
    return prisma.sellerProfile.update({
      where: { userId },
      data: { isVerified: true },
    });
  }

  async createPromotion(sellerId: string, data: {
    type: PromotionType;
    value: number;
    code?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<PromotionModel> {
    return prisma.promotion.create({
      data: {
        ...data,
        sellerId,
      },
    });
  }

  async getSellerPromotions(sellerId: string): Promise<PromotionModel[]> {
    return prisma.promotion.findMany({
      where: { sellerId },
    });
  }

  async updatePromotion(id: string, data: Partial<PromotionModel>): Promise<PromotionModel> {
    return prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async deletePromotion(id: string): Promise<PromotionModel> {
    return prisma.promotion.delete({
      where: { id },
    });
  }

  async uploadBulkProducts(sellerId: string, products: Omit<ProductModel, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>[]): Promise<ProductModel[]> {
    return prisma.$transaction(
      products.map((product) =>
        prisma.product.create({
          data: {
            ...product,
            sellerId,
          },
        })
      )
    );
  }

  async generateShippingLabel(orderId: string): Promise<string> {
    // This is a placeholder. In a real-world scenario, you'd integrate with a shipping API.
    return `SHIPPING_LABEL_${orderId}`;
  }

  async updateOrderTracking(orderId: string, trackingNumber: string): Promise<OrderModel> {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        status: OrderStatus.SHIPPED,
      },
      include: { items: true },
    });
  }

  async getSellerAnalytics(sellerId: string, startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
    }, 0);

    const totalOrders = orders.length;

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          sellerId,
        },
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    return {
      totalRevenue,
      totalOrders,
      topProducts,
    };
  }
}

