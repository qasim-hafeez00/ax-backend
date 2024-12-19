import { Request, Response, NextFunction } from 'express';

export const sellerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'SELLER') {
    return res.status(403).json({ message: 'Access denied. Seller only.' });
  }
  next();
};

