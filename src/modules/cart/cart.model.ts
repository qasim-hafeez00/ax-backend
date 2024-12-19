import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma'

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

export class CartModel {
  static async getCart(userId: string): Promise<CartItem[]> {
    return prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  static async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });
  }

  static async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  static async removeFromCart(id: string): Promise<CartItem> {
    return prisma.cartItem.delete({
      where: { id },
    });
  }

  static async clearCart(userId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}

