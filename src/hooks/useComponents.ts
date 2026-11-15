import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComponent, deleteComponent, getComponent, getComponents, updateComponent } from '../api/componentsApi'
import type { ComponentFilters, ComponentInput } from '../types/component'

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

export function useComponentMutations() {
  const queryClient = useQueryClient()
  const refreshComponents = () => queryClient.invalidateQueries({ queryKey: componentKeys.all })

  const createMutation = useMutation({
    mutationFn: createComponent,
    onSuccess: refreshComponents,
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ComponentInput }) => updateComponent(id, input),
    onSuccess: refreshComponents,
  })
  const deleteMutation = useMutation({
    mutationFn: deleteComponent,
    onSuccess: refreshComponents,
  })

  return { createMutation, updateMutation, deleteMutation }
}
