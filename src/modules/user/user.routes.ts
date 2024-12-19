import express from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware'; // Import adminMiddleware

const userController = new UserController();
export const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/profile', authMiddleware, userController.getProfile);

userRouter.get('/admin/users', authMiddleware, adminMiddleware, userController.getAllUsers);
userRouter.put('/admin/users/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);

