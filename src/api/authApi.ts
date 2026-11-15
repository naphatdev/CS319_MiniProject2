import type { LoginInput, RegisterInput, SessionUser } from '../types/user'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

async function authRequest(path: string, input: LoginInput | RegisterInput): Promise<SessionUser> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(error?.message ?? 'ไม่สามารถดำเนินการได้')
  }
  return response.json() as Promise<SessionUser>
}

export function login(input: LoginInput): Promise<SessionUser> {
  return authRequest('/auth/login', input)
}

export function register(input: RegisterInput): Promise<SessionUser> {
  return authRequest('/auth/register', input)
}
