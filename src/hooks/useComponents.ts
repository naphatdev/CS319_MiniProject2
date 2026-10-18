import { useQuery } from '@tanstack/react-query'
import { getComponent, getComponents } from '../api/componentsApi'
import type { ComponentFilters } from '../types/component'

export const componentKeys = {
  all: ['components'] as const,
  list: (filters: ComponentFilters) => [...componentKeys.all, 'list', filters] as const,
  detail: (id: string) => [...componentKeys.all, 'detail', id] as const,
}

export function useComponents(filters: ComponentFilters = {}) {
  return useQuery({
    queryKey: componentKeys.list(filters),
    queryFn: () => getComponents(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function useComponent(id: string) {
  return useQuery({
    queryKey: componentKeys.detail(id),
    queryFn: () => getComponent(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
