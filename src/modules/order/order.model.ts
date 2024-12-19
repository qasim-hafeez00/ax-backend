import { Order, OrderItem } from '@prisma/client';

export type OrderModel = Order & { items: OrderItem[] };

