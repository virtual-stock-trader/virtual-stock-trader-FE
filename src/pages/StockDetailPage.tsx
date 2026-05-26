import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/ui/Navbar'
import PageHeader from '../components/ui/PageHeader'
import CandlestickChart from '../components/stockDetail/CandlestickChart'
import HoldingInfo from '../components/stockDetail/HoldingInfo'
import TradePanel from '../components/stockDetail/TradePanel'
import { fmtPrice, fmtRate, fmtVol, rateColor } from '../lib/utils'
import { getStockDetail } from '../lib/api/stocks'
import { getPortfolio } from '../lib/api/portfolio'
import { postOrder } from '../lib/api/orders'

type Period = '1D' | '1W' | '1M' | '3M'

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>()
  const queryClient = useQueryClient()

  const [period, setPeriod] = useState<Period>('1M')
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(1)
  const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { data: stock, isLoading: stockLoading } = useQuery({
    queryKey: ['stock', code],
    queryFn: () => getStockDetail(code!),
    enabled: !!code,
  })

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  })

  const orderMutation = useMutation({
    mutationFn: () => postOrder(code!, tradeTab, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      const tx = data.transaction
      setOrderMessage({
        type: 'success',
        text: `${tx.name} ${tx.quantity}주 ${tradeTab === 'buy' ? '매수' : '매도'} 완료 (${fmtPrice(tx.price)}원)`,
      })
      setQuantity(1)
      setTimeout(() => setOrderMessage(null), 3000)
    },
    onError: (err: Error) => {
      setOrderMessage({ type: 'error', text: err.message })
      setTimeout(() => setOrderMessage(null), 3000)
    },
  })

  if (stockLoading) {
    return (
      <div className='min-h-screen bg-[#0a0e1a]'>
        <Navbar />
        <div className='flex items-center justify-center h-64 text-gray-500 text-sm'>
          로딩 중...
        </div>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className='min-h-screen bg-[#0a0e1a]'>
        <Navbar />
        <div className='flex items-center justify-center h-64 text-gray-500 text-sm'>
          종목을 찾을 수 없습니다
        </div>
      </div>
    )
  }

  const holding = portfolio?.holdings.find((h) => h.code === code)
  const cash = portfolio?.cash ?? 0
  const change = stock.currentPrice - stock.openPrice

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 pb-12'>

        <PageHeader title={stock.name} badge={stock.code} />

        <div className='flex flex-col gap-1'>
          <p className='text-white text-3xl font-bold tabular-nums'>
            {fmtPrice(stock.currentPrice)}원
          </p>
          <p className='text-sm tabular-nums'>
            <span className={rateColor(stock.changeRate)}>{fmtRate(stock.changeRate)}</span>
            <span className='text-gray-500'>
              &ensp;{change > 0 ? '+' : ''}{fmtPrice(change)}원
            </span>
          </p>
        </div>

        <div className='grid grid-cols-4 gap-2'>
          {[
            { label: '시가', value: fmtPrice(stock.openPrice) },
            { label: '고가', value: fmtPrice(stock.highPrice) },
            { label: '저가', value: fmtPrice(stock.lowPrice) },
            { label: '거래량', value: fmtVol(stock.volume) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className='bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center'
            >
              <p className='text-gray-500 text-xs'>{label}</p>
              <p className='text-white text-sm font-medium tabular-nums mt-0.5'>{value}</p>
            </div>
          ))}
        </div>

        <CandlestickChart
          code={stock.code}
          period={period}
          onPeriodChange={setPeriod}
        />

        {holding && (
          <HoldingInfo
            quantity={holding.quantity}
            averagePrice={holding.averagePrice}
            currentPrice={stock.currentPrice}
          />
        )}

        {orderMessage && (
          <div
            className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${
              orderMessage.type === 'success'
                ? 'bg-green-500/15 text-green-400'
                : 'bg-red-500/15 text-red-400'
            }`}
          >
            {orderMessage.text}
          </div>
        )}

        <TradePanel
          stockName={stock.name}
          currentPrice={stock.currentPrice}
          cash={cash}
          holdingQty={holding?.quantity ?? 0}
          tradeTab={tradeTab}
          quantity={quantity}
          isSubmitting={orderMutation.isPending}
          onTabChange={setTradeTab}
          onQuantityChange={setQuantity}
          onSubmit={() => orderMutation.mutate()}
        />

      </main>
    </div>
  )
}
