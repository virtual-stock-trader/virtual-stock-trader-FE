import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

type Props = {
  children: React.ReactNode
  requireOnboarded?: boolean
}

export default function ProtectedRoute({ children, requireOnboarded = true }: Props) {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0a0e1a] flex items-center justify-center'>
        <p className='text-gray-400 text-sm'>로딩 중...</p>
      </div>
    )
  }

  if (!user) return <Navigate to='/login' replace />
  if (requireOnboarded && profile && !profile.isOnboarded) return <Navigate to='/onboarding' replace />

  return <>{children}</>
}
