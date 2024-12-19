import { Request, Response } from 'express';
import { SellerService } from './seller.service';

const sellerService = new SellerService();

export class SellerController {
  async createSellerProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const sellerProfile = await sellerService.createSellerProfile(userId, req.body);
      res.status(201).json(sellerProfile);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create seller profile' });
    }
  }

  async getSellerProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const sellerProfile = await sellerService.getSellerProfile(userId);
      if (sellerProfile) {
        res.json(sellerProfile);
      } else {
        res.status(404).json({ message: 'Seller profile not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to get seller profile' });
    }
  }

  async updateSellerProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const sellerProfile = await sellerService.updateSellerProfile(userId, req.body);
      res.json(sellerProfile);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update seller profile' });
    }
  }

  async createPromotion(req: Request, res: Response) {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const promotion = await sellerService.createPromotion(sellerId, req.body);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create promotion' });
    }
  }

  async getSellerPromotions(req: Request, res: Response) {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const promotions = await sellerService.getSellerPromotions(sellerId);
      res.json(promotions);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get promotions' });
    }
  }

  async updatePromotion(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const promotion = await sellerService.updatePromotion(id, req.body);
      res.json(promotion);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update promotion' });
    }
  }

  async deletePromotion(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await sellerService.deletePromotion(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete promotion' });
    }
  }

  async getSellerAnalytics(req: Request, res: Response) {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    try {
      const analytics = await sellerService.getSellerAnalytics(
        sellerId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(analytics);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get seller analytics' });
    }
  }
}

