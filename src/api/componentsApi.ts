import componentDatabase from '../../server/db.json'
import type { ComponentFilters, UiComponent } from '../types/component'

const components = componentDatabase.components as UiComponent[]
const API_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL ?? '/api')
  : import.meta.env.VITE_API_URL

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`ไม่สามารถโหลดข้อมูลได้ (${response.status})`)
  }
  return response.json() as Promise<T>
}

export function getComponents(filters: ComponentFilters = {}): Promise<UiComponent[]> {
  if (API_URL) {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.framework) params.set('framework', filters.framework)
    const query = params.size ? `?${params.toString()}` : ''
    return request<UiComponent[]>(`/components${query}`)
  }

  const filteredComponents = components.filter((component) => {
    const matchesCategory = !filters.category || component.category === filters.category
    const matchesFramework = !filters.framework || component.framework === filters.framework
    return matchesCategory && matchesFramework
  })

  return Promise.resolve(filteredComponents)
}

export function getComponent(id: string): Promise<UiComponent> {
  if (API_URL) {
    return request<UiComponent>(`/components/${encodeURIComponent(id)}`)
  }

  const component = components.find((item) => item.id === id)

  if (!component) {
    return Promise.reject(new Error(`ไม่พบคอมโพเนนต์ ${id}`))
  }

  return Promise.resolve(component)
}
