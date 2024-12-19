import { User, Wishlist, ProductComparison, SupportTicket } from '@prisma/client';

export type UserModel = Omit<User, 'password'> & {
  wishlist?: Wishlist;
  comparisons?: ProductComparison[];
  supportTickets?: SupportTicket[];
};

