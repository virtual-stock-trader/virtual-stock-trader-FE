import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/ui/Navbar'
import BottomNav from '../components/ui/BottomNav'
import PortfolioTable from '../components/ui/PortfolioTable'
import TransactionItem from '../components/ui/TransactionItem'
import AllocationChart from '../components/portfolio/AllocationChart'
import { getPortfolio } from '../lib/api/portfolio'
import { getTransactions } from '../lib/api/transactions'
import { fmtPrice, fmtRate, rateColor } from '../lib/utils'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']

export default function PortfolioPage() {
  const navigate = useNavigate()

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  })

  const { data: recentTransactions = [] } = useQuery({
    queryKey: ['transactions', { limit: 5 }],
    queryFn: () => getTransactions(undefined, 5),
  })

  const totalAssets = portfolio?.totalAssets ?? 0
  const cash = portfolio?.cash ?? 0
  const stockValue = portfolio?.stockValue ?? 0
  const dailyReturnRate = portfolio?.dailyReturnRate ?? 0
  const dailyReturnAmt = portfolio?.dailyReturnAmt ?? 0

  const allocationWithColors = (portfolio?.allocation ?? []).map((item, i) => ({
    ...item,
    color: COLORS[i % COLORS.length],
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24'>

        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            내 자산
          </h2>

          <div>
            <p className='text-gray-400 text-xs font-medium'>총 자산</p>
            <p className='text-white text-3xl font-bold mt-1 tabular-nums'>
              {fmtPrice(totalAssets)}원
            </p>
            <p className='text-sm mt-1.5 tabular-nums'>
              <span className={rateColor(dailyReturnRate)}>{fmtRate(dailyReturnRate)}</span>
              <span className='text-gray-400'>
                &ensp;({dailyReturnAmt >= 0 ? '+' : ''}{fmtPrice(dailyReturnAmt)}원)
              </span>
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
              <p className='text-gray-500 text-xs font-medium'>예수금</p>
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>
                {fmtPrice(cash)}원
              </p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
              <p className='text-gray-500 text-xs font-medium'>주식 평가금</p>
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>
                {fmtPrice(stockValue)}원
              </p>
            </div>
          </div>
        </section>

        {allocationWithColors.length > 0 && (
          <section className='flex flex-col gap-3'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              자산 배분
            </h2>
            <AllocationChart data={allocationWithColors} totalAssets={totalAssets} />
          </section>
        )}

        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            보유 종목
          </h2>
          <PortfolioTable
            items={portfolio?.holdings ?? []}
            onRowClick={(code) => navigate(`/stock/${code}`)}
          />
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              거래 내역
            </h2>
            <button
              type='button'
              onClick={() => navigate('/transactions')}
              className='text-gray-500 text-xs hover:text-gray-300 transition-colors cursor-pointer'
            >
              전체보기
            </button>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  tx={tx}
                  onClick={(code) => navigate(`/stock/${code}`)}
                />
              ))
            ) : (
              <div className='flex items-center justify-center py-12'>
                <p className='text-gray-500 text-sm'>거래 내역이 없습니다</p>
              </div>
            )}
          </div>
        </section>

      </main>
      <BottomNav />
    </div>
  )
}
