import { apiFetch } from './client'
import type { Portfolio, AssetPoint } from '../../types/api'

export function getPortfolio() {
  return apiFetch<Portfolio>('/portfolio')
}

export function getPortfolioHistory(days: 7 | 30 | 90 = 30) {
  return apiFetch<AssetPoint[]>(`/portfolio/history?days=${days}`)
}
