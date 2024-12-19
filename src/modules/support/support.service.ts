import { PrismaClient, TicketStatus, TicketPriority } from '@prisma/client';
import { SupportTicketModel, MessageModel } from './support.model';
import prisma from '@/lib/prisma'

export class SupportService {
  async createTicket(
    userId: string,
    data: { subject: string; description: string; priority: TicketPriority }
  ): Promise<SupportTicketModel> {
    return prisma.supportTicket.create({
      data: {
        ...data,
        userId,
        status: TicketStatus.OPEN,
      },
      include: {
        messages: true,
      },
    });
  }

  async getTicket(id: string): Promise<SupportTicketModel | null> {
    return prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: true,
      },
    });
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicketModel> {
    return prisma.supportTicket.update({
      where: { id },
      data: { status },
      include: {
        messages: true,
      },
    });
  }

  async addMessage(ticketId: string, senderId: string, content: string): Promise<MessageModel> {
    return prisma.message.create({
      data: {
        senderId,
        content,
        supportTicketId: ticketId,
      },
    });
  }

  async getUserTickets(userId: string): Promise<SupportTicketModel[]> {
    return prisma.supportTicket.findMany({
      where: { userId },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

