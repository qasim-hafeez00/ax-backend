import express from 'express';
import { SellerController } from './seller.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { sellerMiddleware } from '../../middlewares/seller.middleware';

const sellerController = new SellerController();
export const sellerRouter = express.Router();

sellerRouter.post('/profile', authMiddleware, sellerController.createSellerProfile);
sellerRouter.get('/profile', authMiddleware, sellerMiddleware, sellerController.getSellerProfile);
sellerRouter.put('/profile', authMiddleware, sellerMiddleware, sellerController.updateSellerProfile);

sellerRouter.post('/promotions', authMiddleware, sellerMiddleware, sellerController.createPromotion);
sellerRouter.get('/promotions', authMiddleware, sellerMiddleware, sellerController.getSellerPromotions);
sellerRouter.put('/promotions/:id', authMiddleware, sellerMiddleware, sellerController.updatePromotion);
sellerRouter.delete('/promotions/:id', authMiddleware, sellerMiddleware, sellerController.deletePromotion);

sellerRouter.get('/analytics', authMiddleware, sellerMiddleware, sellerController.getSellerAnalytics);

