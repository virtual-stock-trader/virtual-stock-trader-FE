import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile } from '../types/api'

export type AuthContextValue = {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
