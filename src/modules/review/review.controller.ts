import { Request, Response } from 'express';
import { ReviewService } from './review.service';

const reviewService = new ReviewService();

export class ReviewController {
  async createReview(req: Request, res: Response) {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const review = await reviewService.createReview({
        productId,
        userId,
        rating,
        comment,
      });
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create review' });
    }
  }

  async getReview(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const review = await reviewService.getReviewById(id);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to get review' });
    }
  }

  async updateReview(req: Request, res: Response) {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const review = await reviewService.updateReview(id, { rating, comment });
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update review' });
    }
  }

  async deleteReview(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await reviewService.deleteReview(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete review' });
    }
  }

  async getProductReviews(req: Request, res: Response) {
    const { productId } = req.params;
    try {
      const reviews = await reviewService.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get product reviews' });
    }
  }
}

