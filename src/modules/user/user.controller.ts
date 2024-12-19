import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    const { email, password, role } = req.body;
    try {
      const user = await userService.createUser(email, password, role as Role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'User registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await userService.loginUser(email, password);
      if (result) {
        res.json(result);
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Login failed' });
    }
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const user = await userService.getUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to get user profile' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const users = await userService.getAllUsers(page, limit);
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get users' });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;
    try {
      const user = await userService.updateUserRole(id, role as Role);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update user role' });
    }
  }
}

