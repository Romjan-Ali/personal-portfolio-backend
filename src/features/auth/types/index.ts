// src/features/auth/types/index.ts
export interface CreateUserInput {
  email: string
  name: string
  password: string
  profileImage?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    profileImage: string | null
    role: string
  }
  token: string
}