import { SupportTicket, Message, TicketStatus, TicketPriority } from '@prisma/client';

export type SupportTicketModel = SupportTicket & {
  messages: Message[];
};

export type MessageModel = Message;

