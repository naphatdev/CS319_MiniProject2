import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionUser } from '../types/user'

interface AuthState {
  user: SessionUser | null
  setUser: (user: SessionUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'nataui-session' },
  ),
)
