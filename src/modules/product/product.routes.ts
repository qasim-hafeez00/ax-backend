import express from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { sellerMiddleware } from '../../middlewares/seller.middleware';

const productController = new ProductController();
export const productRouter = express.Router();

productRouter.post('/', authMiddleware, sellerMiddleware, productController.createProduct);
productRouter.get('/:id', productController.getProduct);
productRouter.put('/:id', authMiddleware, sellerMiddleware, productController.updateProduct);
productRouter.delete('/:id', authMiddleware, sellerMiddleware, productController.deleteProduct);
productRouter.get('/', productController.getAllProducts);
productRouter.get('/search', productController.searchProducts);

// Seller-specific routes
productRouter.get('/seller/products', authMiddleware, sellerMiddleware, productController.getSellerProducts);
productRouter.put('/:id/stock', authMiddleware, sellerMiddleware, productController.updateProductStock);
productRouter.post('/:productId/variants', authMiddleware, sellerMiddleware, productController.createProductVariant);
productRouter.put('/variants/:variantId', authMiddleware, sellerMiddleware, productController.updateProductVariant);
productRouter.delete('/variants/:variantId', authMiddleware, sellerMiddleware, productController.deleteProductVariant);

