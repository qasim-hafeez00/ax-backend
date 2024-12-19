import { PrismaClient } from '@prisma/client';
import { ReviewModel } from './review.model';
import prisma from '@/lib/prisma'

export class ReviewService {
  async createReview(data: Omit<ReviewModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewModel> {
    return prisma.review.create({ data });
  }

  async getReviewById(id: string): Promise<ReviewModel | null> {
    return prisma.review.findUnique({ where: { id } });
  }

  async updateReview(id: string, data: Partial<ReviewModel>): Promise<ReviewModel> {
    return prisma.review.update({
      where: { id },
      data,
    });
  }

  async deleteReview(id: string): Promise<ReviewModel> {
    return prisma.review.delete({ where: { id } });
  }

  async getProductReviews(productId: string): Promise<ReviewModel[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProductReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string
  ): Promise<ReviewModel> {
    return prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });
  }
}

