export interface SessionUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
}
