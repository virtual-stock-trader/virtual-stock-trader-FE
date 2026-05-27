import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getMe } from '../lib/api/users'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate('/login', { replace: true })
        return
      }
      try {
        const profile = await getMe()
        navigate(profile.isOnboarded ? '/dashboard' : '/onboarding', { replace: true })
      } catch {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className='min-h-screen bg-[#0a0e1a] flex items-center justify-center'>
      <p className='text-gray-400 text-sm'>로그인 중...</p>
    </div>
  )
}
