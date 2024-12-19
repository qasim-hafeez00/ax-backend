import { PrismaClient } from '@prisma/client';
import { FAQModel, BannerModel } from './content.model';
import prisma from '@/lib/prisma'

export class ContentService {
  // FAQ Management
  async createFAQ(data: Omit<FAQModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<FAQModel> {
    return prisma.fAQ.create({ data });
  }

  async updateFAQ(id: string, data: Partial<FAQModel>): Promise<FAQModel> {
    return prisma.fAQ.update({
      where: { id },
      data,
    });
  }

  async deleteFAQ(id: string): Promise<FAQModel> {
    return prisma.fAQ.delete({ where: { id } });
  }

  async getFAQs(category?: string): Promise<FAQModel[]> {
    return prisma.fAQ.findMany({
      where: category ? { category } : undefined,
      orderBy: { category: 'asc' },
    });
  }

  // Banner Management
  async createBanner(data: Omit<BannerModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<BannerModel> {
    return prisma.banner.create({ data });
  }

  async updateBanner(id: string, data: Partial<BannerModel>): Promise<BannerModel> {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async deleteBanner(id: string): Promise<BannerModel> {
    return prisma.banner.delete({ where: { id } });
  }

  async getActiveBanners(): Promise<BannerModel[]> {
    const now = new Date();
    return prisma.banner.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: 'desc' },
    });
  }
}

