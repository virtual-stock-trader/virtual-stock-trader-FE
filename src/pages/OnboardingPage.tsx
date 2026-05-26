import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { postOnboarding } from '../lib/api/users'
import ChartIcon from '../components/ui/ChartIcon'
import InvestmentSlider from '../components/ui/InvestmentSlider'
import { fmtPrice, fmtShort } from '../lib/utils'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [amount, setAmount] = useState(10_000_000)

  const mutation = useMutation({
    mutationFn: () => postOnboarding(amount),
    onSuccess: async () => {
      await refreshProfile()
      navigate('/dashboard', { replace: true })
    },
  })

  return (
    <div className='min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm flex flex-col gap-8'>

        <div className='flex flex-col items-center gap-3'>
          <div className='w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30'>
            <ChartIcon />
          </div>
          <div className='text-center'>
            <h1 className='text-white text-xl font-bold'>시작 투자금을 설정해주세요</h1>
            <p className='text-gray-400 text-sm mt-1'>가상 투자를 시작할 금액을 선택하세요</p>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-white text-4xl font-bold tabular-nums tracking-tight'>
            {fmtPrice(amount)}
            <span className='text-xl text-gray-400 font-medium ml-1'>원</span>
          </p>
          <p className='text-gray-500 text-sm mt-1'>{fmtShort(amount)}</p>
        </div>

        <InvestmentSlider value={amount} onChange={setAmount} />

        {mutation.isError && (
          <p className='text-red-400 text-sm text-center'>{(mutation.error as Error).message}</p>
        )}

        <button
          type='button'
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className='w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-bold text-white text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {mutation.isPending ? '처리 중...' : `${fmtShort(amount)}으로 시작하기`}
        </button>

        <p className='text-gray-600 text-xs text-center'>
          최대 1억원까지 설정할 수 있습니다
          <br />
          설정한 금액은 가상의 투자금이며, 실제 돈이 아닙니다
        </p>
      </div>
    </div>
  )
}
