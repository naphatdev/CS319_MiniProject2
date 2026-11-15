import type { UiComponent } from '../types/component'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export interface FavoriteRecord {
  id: number
  userId: string
  componentId: string
  createdAt: string
  component: UiComponent
}

async function ensureOk(response: Response): Promise<Response> {
  if (!response.ok) throw new Error(`ไม่สามารถบันทึกคอลเลกชันได้ (${response.status})`)
  return response
}

export async function getFavorites(userId: string): Promise<FavoriteRecord[]> {
  const response = await ensureOk(await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/favorites`))
  return response.json() as Promise<FavoriteRecord[]>
}

export async function addFavorite(userId: string, componentId: string): Promise<void> {
  await ensureOk(await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ componentId }),
  }))
}

export async function removeFavorite(userId: string, componentId: string): Promise<void> {
  await ensureOk(await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/favorites/${encodeURIComponent(componentId)}`, {
    method: 'DELETE',
  }))
}
