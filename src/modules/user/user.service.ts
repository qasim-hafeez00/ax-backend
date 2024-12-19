import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model';
import prisma from '@/lib/prisma'

//const prisma = new PrismaClient();

export class UserService {
  async createUser(email: string, password: string, role: Role): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    return this.excludePassword(user);
  }

  async loginUser(email: string, password: string): Promise<{ user: UserModel; token: string } | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { user: this.excludePassword(user), token };
  }

  async getUserById(id: string): Promise<UserModel | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.excludePassword(user) : null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<UserModel> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return this.excludePassword(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<UserModel[]> {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return users.map(this.excludePassword);
  }

  async updateUserRole(id: string, role: Role): Promise<UserModel> {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return this.excludePassword(user);
  }

  async verifyEmail(userId: string): Promise<UserModel> {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  async getUserDashboard(userId: string): Promise<UserModel> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        wishlist: {
          include: { products: true },
        },
      },
    });
  }

  private excludePassword(user: User): UserModel {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

