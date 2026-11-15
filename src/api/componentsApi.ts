import type { ComponentFilters, ComponentInput, UiComponent } from '../types/component'

const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message ?? `ไม่สามารถดำเนินการได้ (${response.status})`)
  }

  if (response.status === 204) return undefined as T
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

export function createComponent(input: ComponentInput): Promise<UiComponent> {
  return request<UiComponent>('/components', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateComponent(id: string, input: ComponentInput): Promise<UiComponent> {
  return request<UiComponent>(`/components/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteComponent(id: string): Promise<void> {
  return request<void>(`/components/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
