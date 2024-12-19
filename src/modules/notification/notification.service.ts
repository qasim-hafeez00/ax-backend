import { PrismaClient, NotificationType } from '@prisma/client';
import prisma from '@/lib/prisma'

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    message: string
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async sendOrderUpdateNotification(orderId: string, status: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (order) {
      await this.createNotification(
        order.userId,
        NotificationType.ORDER_UPDATE,
        `Your order #${orderId} has been updated to ${status}`
      );
    }
  }

  async sendLowStockNotification(productId: string, sellerId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (product) {
      await this.createNotification(
        sellerId,
        NotificationType.LOW_STOCK,
        `Your product "${product.title}" is running low on stock`
      );
    }
  }

  async sendNewDisputeNotification(disputeId: string, sellerId: string) {
    await this.createNotification(
      sellerId,
      NotificationType.NEW_DISPUTE,
      `A new dispute has been opened for one of your orders (Dispute ID: ${disputeId})`
    );
  }

  async sendAdminAlertNotification(adminId: string, message: string) {
    await this.createNotification(
      adminId,
      NotificationType.ADMIN_ALERT,
      message
    );
  }
}

