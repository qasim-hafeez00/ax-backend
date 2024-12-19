import express from 'express';
import { ReviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const reviewController = new ReviewController();
export const reviewRouter = express.Router();

reviewRouter.post('/', authMiddleware, reviewController.createReview);
reviewRouter.get('/:id', reviewController.getReview);
reviewRouter.put('/:id', authMiddleware, reviewController.updateReview);
reviewRouter.delete('/:id', authMiddleware, reviewController.deleteReview);
reviewRouter.get('/product/:productId', reviewController.getProductReviews);

