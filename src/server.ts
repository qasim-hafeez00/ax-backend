import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './modules/user/user.routes';
import { productRouter } from './modules/product/product.routes';
import { orderRouter } from './modules/order/order.routes';
import { reviewRouter } from './modules/review/review.routes';
import { cartRouter } from './modules/cart/cart.routes';
import { sellerRouter } from './modules/seller/seller.routes';
import { supportRouter } from './modules/support/support.routes';
import { contentRouter } from './modules/content/content.routes';
import { paymentRouter } from './modules/payment/payment.routes';
import { wishlistRouter } from './modules/wishlist/wishlist.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/cart', cartRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/support', supportRouter);
app.use('/api/content', contentRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/wishlist', wishlistRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

