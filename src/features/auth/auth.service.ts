// src/features/auth/auth.service.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../core/database/client'
import { env } from '../../core/config/env'
import { AppError } from '../../core/middleware/error.middleware'
import type { CreateUserInput, LoginInput, AuthResponse } from './types'

export class AuthService {
  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      throw new AppError('User already exists', 400)
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        profileImage: input.profileImage,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return {
      user,
      token,
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      throw new AppError('Invalid credentials', 400)
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 400)
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        role: user.role,
      },
      token,
    }
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  }
}
