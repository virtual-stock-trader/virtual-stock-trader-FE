import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts'
import { getCandles } from '../../lib/api/stocks'

type Period = '1D' | '1W' | '1M' | '3M'

type Props = {
  code: string
  period: Period
  onPeriodChange: (period: Period) => void
}

export default function CandlestickChart({ code, period, onPeriodChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  const { data: candles = [] } = useQuery({
    queryKey: ['candles', code, period],
    queryFn: () => getCandles(code, period),
  })

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return
    const container = containerRef.current

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
      },
      handleScroll: false,
      handleScale: false,
      width: container.clientWidth,
      height: 220,
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderUpColor: '#ef4444',
      borderDownColor: '#3b82f6',
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    })

    series.setData(
      candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })) as CandlestickData<Time>[],
    )
    chart.timeScale().fitContent()
    chartRef.current = chart

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: container.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      chartRef.current = null
    }
  }, [candles])

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='flex gap-1 mb-4'>
        {(['1D', '1W', '1M', '3M'] as Period[]).map((p) => (
          <button
            key={p}
            type='button'
            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              period === p ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div ref={containerRef} />
    </div>
  )
}
