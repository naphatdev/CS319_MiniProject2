import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFavorite, getFavorites, removeFavorite } from '../api/favoritesApi'
import { useAuthStore } from '../stores/useAuthStore'

export const favoriteKeys = {
  byUser: (userId: string) => ['favorites', userId] as const,
}

export function useFavorites() {
  const user = useAuthStore((state) => state.user)
  return useQuery({
    queryKey: favoriteKeys.byUser(user?.id ?? 'guest'),
    queryFn: () => getFavorites(user!.id),
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  })
}

export function useFavoriteMutation() {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ componentId, favorite }: { componentId: string; favorite: boolean }) => {
      if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึกคอลเลกชัน')
      if (favorite) await removeFavorite(user.id, componentId)
      else await addFavorite(user.id, componentId)
    },
    onSuccess: async () => {
      if (user) await queryClient.invalidateQueries({ queryKey: favoriteKeys.byUser(user.id) })
    },
  })

  return { user, ...mutation }
}
