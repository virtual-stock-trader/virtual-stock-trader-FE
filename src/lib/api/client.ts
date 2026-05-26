import { supabase } from '../supabase'

const BASE_URL = import.meta.env.VITE_API_URL as string

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('UNAUTHORIZED')
  return token
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body as { error?: { message?: string } })?.error?.message ?? `HTTP ${res.status}`
    throw new Error(message)
  }

  return res.json() as Promise<T>
}
