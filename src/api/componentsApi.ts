import type { ComponentFilters, UiComponent } from '../types/component'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`ไม่สามารถโหลดข้อมูลได้ (${response.status})`)
  }
  return response.json() as Promise<T>
}

export function getComponents(filters: ComponentFilters = {}): Promise<UiComponent[]> {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.framework) params.set('framework', filters.framework)
  const query = params.size ? `?${params.toString()}` : ''
  return request<UiComponent[]>(`/components${query}`)
}

export function getComponent(id: string): Promise<UiComponent> {
  return request<UiComponent>(`/components/${encodeURIComponent(id)}`)
}
