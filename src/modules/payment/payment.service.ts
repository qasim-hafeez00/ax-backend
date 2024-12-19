import { PrismaClient, TransactionStatus } from '@prisma/client';
import { PaymentMethodModel, TransactionModel } from './payment.model';
import prisma from '@/lib/prisma'

export class PaymentService {
  async addPaymentMethod(userId: string, data: Omit<PaymentMethodModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethodModel> {
    return prisma.paymentMethod.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getUserPaymentMethods(userId: string): Promise<PaymentMethodModel[]> {
    return prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethodModel> {
    // First, unset any existing default
    await prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Then set the new default
    return prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });
  }

  async createTransaction(orderId: string, data: Omit<TransactionModel, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>): Promise<TransactionModel> {
    return prisma.transaction.create({
      data: {
        ...data,
        orderId,
      },
    });
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<TransactionModel> {
    return prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async getOrderTransactions(orderId: string): Promise<TransactionModel[]> {
    return prisma.transaction.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processMultiSellerPayment(
    orderId: string,
    paymentMethodId: string,
    items: { sellerId: string; amount: number }[]
  ): Promise<TransactionModel> {
    return prisma.$transaction(async (prisma) => {
      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

      // Create the main transaction
      const transaction = await prisma.transaction.create({
        data: {
          orderId,
          amount: totalAmount,
          status: TransactionStatus.COMPLETED,
          paymentMethodId,
        },
      });

      // Create seller payouts
      for (const item of items) {
        await prisma.sellerPayout.create({
          data: {
            sellerId: item.sellerId,
            amount: item.amount,
            transactionId: transaction.id,
          },
        });
      }

      return transaction;
    });
  }
}

