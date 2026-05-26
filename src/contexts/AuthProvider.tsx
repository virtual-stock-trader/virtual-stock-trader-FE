import { useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types/api'
import { getMe } from '../lib/api/users'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchProfile() {
    try {
      const p = await getMe()
      setProfile(p)
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session) {
        fetchProfile().finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s) {
        fetchProfile()
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithKakao() {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { scope: 'profile_nickname profile_image' },
      },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshProfile() {
    await fetchProfile()
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signInWithKakao, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
