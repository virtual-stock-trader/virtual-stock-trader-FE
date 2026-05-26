import { apiFetch } from './client'
import type { UserProfile } from '../../types/api'

export function getMe() {
  return apiFetch<UserProfile>('/users/me')
}

export function postOnboarding(amount: number) {
  return apiFetch<{ success: boolean }>('/users/onboarding', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
}

export function patchInvestment(amount: number) {
  return apiFetch<{ success: boolean }>('/users/investment', {
    method: 'PATCH',
    body: JSON.stringify({ amount }),
  })
}
