import { apiFetch } from './client'
import type { MarketIndex } from '../../types/api'

export function getMarketIndices() {
  return apiFetch<MarketIndex[]>('/market/indices')
}
