import { apiFetch } from './client'
import type { Transaction } from '../../types/api'

export function postOrder(code: string, type: 'buy' | 'sell', quantity: number) {
  return apiFetch<{ success: boolean; transaction: Transaction }>('/orders', {
    method: 'POST',
    body: JSON.stringify({ code, type, quantity }),
  })
}
