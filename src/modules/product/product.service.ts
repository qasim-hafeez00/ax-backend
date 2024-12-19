import { PrismaClient, Product } from '@prisma/client';
import { ProductModel } from './product.model';
import redisClient from '../../lib/redis';
import prisma from '@/lib/prisma'

//const prisma = new PrismaClient();

export class ProductService {
  async createProduct(data: Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductModel> {
    const product = await prisma.product.create({ data });
    await redisClient.del('products');
    return product;
  }

  async getProductById(id: string): Promise<ProductModel | null> {
    const cachedProduct = await redisClient.get(`product:${id}`);
    if (cachedProduct) {
      return JSON.parse(cachedProduct);
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      await redisClient.set(`product:${id}`, JSON.stringify(product), {
        EX: 3600, // 1 hour
      });
    }
    return product;
  }

  async updateProduct(id: string, data: Partial<ProductModel>): Promise<ProductModel> {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    await redisClient.set(`product:${id}`, JSON.stringify(product), {
      EX: 3600, // 1 hour
    });
    await redisClient.del('products');
    return product;
  }

  async deleteProduct(id: string): Promise<ProductModel> {
    const product = await prisma.product.delete({ where: { id } });
    await redisClient.del(`product:${id}`);
    await redisClient.del('products');
    return product;
  }

  async getAllProducts(page: number = 1, limit: number = 10): Promise<ProductModel[]> {
    const cachedProducts = await redisClient.get('products');
    if (cachedProducts) {
      const products = JSON.parse(cachedProducts);
      return products.slice((page - 1) * limit, page * limit);
    }

    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    await redisClient.set('products', JSON.stringify(products), {
      EX: 3600, // 1 hour
    });
    return products;
  }

  async searchProducts(query: string, page: number = 1, limit: number = 10): Promise<ProductModel[]> {
    return prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getSellerProducts(sellerId: string, page: number = 1, limit: number = 10): Promise<ProductModel[]> {
    return prisma.product.findMany({
      where: { sellerId },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updateProductStock(id: string, stock: number): Promise<ProductModel> {
    return prisma.product.update({
      where: { id },
      data: { stock },
    });
  }

  async createProductVariant(productId: string, data: { name: string; price: number; stock: number }): Promise<ProductModel> {
    return prisma.product.update({
      where: { id: productId },
      data: {
        variants: {
          create: data,
        },
      },
      include: {
        variants: true,
      },
    });
  }

  async updateProductVariant(variantId: string, data: Partial<{ name: string; price: number; stock: number }>): Promise<ProductModel> {
    return prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  }

  async deleteProductVariant(variantId: string): Promise<ProductModel> {
    return prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  async searchProducts(
    query: string,
    filters: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      sellerLocation?: string;
    },
    sort: 'price_asc' | 'price_desc' | 'rating_desc',
    page: number = 1,
    limit: number = 10
  ): Promise<ProductModel[]> {
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (filters.category) where.category = filters.category;
    if (filters.minPrice) where.price = { ...where.price, gte: filters.minPrice };
    if (filters.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters.rating) where.rating = { gte: filters.rating };
    if (filters.sellerLocation) where.seller = { location: filters.sellerLocation };

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'rating_desc') orderBy.rating = 'desc';

    return prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            sellerProfile: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}

