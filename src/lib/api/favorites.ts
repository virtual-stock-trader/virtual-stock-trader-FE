import { apiFetch } from './client'
import type { Favorite } from '../../types/api'

export function getFavorites() {
  return apiFetch<Favorite[]>('/favorites')
}

export function addFavorite(code: string) {
  return apiFetch<{ success: boolean }>(`/favorites/${code}`, { method: 'POST' })
}

export function removeFavorite(code: string) {
  return apiFetch<{ success: boolean }>(`/favorites/${code}`, { method: 'DELETE' })
}
