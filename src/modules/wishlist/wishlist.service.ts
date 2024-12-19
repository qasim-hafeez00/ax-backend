import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma'

export class WishlistService {
  async addToWishlist(userId: string, productId: string) {
    return prisma.wishlist.upsert({
      where: { userId },
      create: {
        userId,
        products: {
          connect: { id: productId },
        },
      },
      update: {
        products: {
          connect: { id: productId },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return prisma.wishlist.update({
      where: { userId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async getWishlist(userId: string) {
    return prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: true,
      },
    });
  }

  async addToComparison(userId: string, productId: string) {
    return prisma.productComparison.create({
      data: {
        userId,
        products: {
          connect: { id: productId },
        },
      },
      include: {
        products: true,
      },
    });
  }

  async removeFromComparison(userId: string, productId: string) {
    return prisma.productComparison.updateMany({
      where: { userId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });
  }

  async getComparisons(userId: string) {
    return prisma.productComparison.findMany({
      where: { userId },
      include: {
        products: true,
      },
    });
  }
}

