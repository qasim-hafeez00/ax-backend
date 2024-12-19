import { Request, Response } from 'express';
import { CartModel } from './cart.model';

export class CartController {
  async getCart(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const cart = await CartModel.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get cart' });
    }
  }

  async addToCart(req: Request, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const cartItem = await CartModel.addToCart(userId, productId, quantity);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: 'Failed to add item to cart' });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const cartItem = await CartModel.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update cart item' });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await CartModel.removeFromCart(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to remove item from cart' });
    }
  }

  async clearCart(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await CartModel.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to clear cart' });
    }
  }
}

