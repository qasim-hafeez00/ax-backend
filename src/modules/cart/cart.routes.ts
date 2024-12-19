import express from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const cartController = new CartController();
export const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, cartController.getCart);
cartRouter.post('/', authMiddleware, cartController.addToCart);
cartRouter.put('/:id', authMiddleware, cartController.updateCartItem);
cartRouter.delete('/:id', authMiddleware, cartController.removeFromCart);
cartRouter.delete('/', authMiddleware, cartController.clearCart);

