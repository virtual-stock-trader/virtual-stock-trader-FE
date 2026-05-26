import { apiFetch } from './client'
import type { Transaction } from '../../types/api'

export function getTransactions(type?: 'buy' | 'sell', limit?: number, offset?: number) {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (limit !== undefined) params.set('limit', String(limit))
  if (offset !== undefined) params.set('offset', String(offset))
  const qs = params.toString() ? `?${params.toString()}` : ''
  return apiFetch<Transaction[]>(`/transactions${qs}`)
}
