import { useNavigate } from 'react-router-dom'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/ui/Navbar'
import BottomNav from '../components/ui/BottomNav'
import PortfolioTable from '../components/ui/PortfolioTable'
import IndexCard from '../components/dashboard/IndexCard'
import StockCard from '../components/dashboard/StockCard'
import AssetChart from '../components/dashboard/AssetChart'
import { fmtPrice, fmtRate, rateColor } from '../lib/utils'
import { getStockDetail } from '../lib/api/stocks'
import { getPortfolio, getPortfolioHistory } from '../lib/api/portfolio'
import { getMarketIndices } from '../lib/api/market'
import { getFavorites, addFavorite, removeFavorite } from '../lib/api/favorites'
import { useMarketStatus } from '../hooks/useMarketStatus'

const FEATURED_CODES = ['005930', '000660', '035420', '005380', '000270', '035720']

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOpen: isMarketOpen } = useMarketStatus()

  const { data: indices = [] } = useQuery({
    queryKey: ['market-indices'],
    queryFn: getMarketIndices,
  })

  const featuredQueries = useQueries({
    queries: FEATURED_CODES.map((code) => ({
      queryKey: ['stock', code],
      queryFn: () => getStockDetail(code),
    })),
  })

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  })

  const { data: assetHistory = [] } = useQuery({
    queryKey: ['portfolio-history'],
    queryFn: () => getPortfolioHistory(30),
  })

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  })

  const favoriteCodes = new Set(favorites.map((f) => f.code))

  const toggleFavMutation = useMutation({
    mutationFn: (code: string) =>
      favoriteCodes.has(code) ? removeFavorite(code) : addFavorite(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  const featuredStocks = featuredQueries
    .map((q) => q.data)
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({ ...s, isFavorite: favoriteCodes.has(s.code) }))

  const totalAssets = portfolio?.totalAssets ?? 0
  const cash = portfolio?.cash ?? 0
  const stockValue = portfolio?.stockValue ?? 0
  const dailyReturnRate = portfolio?.dailyReturnRate ?? 0
  const dailyReturnAmt = portfolio?.dailyReturnAmt ?? 0

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24'>

        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            내 자산 현황
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
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>{fmtPrice(cash)}원</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
              <p className='text-gray-500 text-xs font-medium'>주식 평가금</p>
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>
                {fmtPrice(stockValue)}원
              </p>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              시장 지수
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isMarketOpen
                ? 'bg-green-500/15 text-green-400'
                : 'bg-gray-500/15 text-gray-400'
            }`}>
              {isMarketOpen ? '장중' : '장외'}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            {indices.map((index) => (
              <IndexCard key={index.name} index={index} />
            ))}
          </div>

          <AssetChart data={assetHistory} />
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              실시간 시세
            </h2>
            <button
              type='button'
              onClick={() => navigate('/stocks')}
              className='text-gray-500 text-xs hover:text-gray-300 transition-colors cursor-pointer'
            >
              전체보기
            </button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {featuredStocks.map((stock) => (
              <StockCard
                key={stock.code}
                stock={stock}
                onToggleFavorite={(code) => toggleFavMutation.mutate(code)}
                onSelect={(code) => navigate(`/stock/${code}`)}
              />
            ))}
          </div>
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              내 보유 종목
            </h2>
            <button
              type='button'
              onClick={() => navigate('/portfolio')}
              className='text-gray-500 text-xs hover:text-gray-300 transition-colors cursor-pointer'
            >
              전체보기
            </button>
          </div>
          <PortfolioTable items={portfolio?.holdings ?? []} quantityLabel='보유수량' />
        </section>

      </main>
      <BottomNav />
    </div>
  )
}
