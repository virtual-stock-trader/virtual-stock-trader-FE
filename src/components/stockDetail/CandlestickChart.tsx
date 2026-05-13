import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts';

type Period = '1D' | '1W' | '1M' | '3M';

const PERIOD_DAYS: Record<Period, number> = {
  '1D': 5,
  '1W': 10,
  '1M': 22,
  '3M': 65,
};

function seededRandom(seed: number) {
  let s = seed | 0;
  return (): number => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function generateOHLC(basePrice: number, seed: number): CandlestickData<Time>[] {
  const rand = seededRandom(seed);
  const data: CandlestickData<Time>[] = [];
  let price = basePrice * 0.85;
  const endDate = new Date('2026-05-12');

  for (let i = 90; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const open = Math.round(price);
    const change = (rand() - 0.47) * price * 0.025;
    const close = Math.round(price + change);
    const high = Math.round(Math.max(open, close) * (1 + rand() * 0.008));
    const low = Math.round(Math.min(open, close) * (1 - rand() * 0.008));

    data.push({
      time: date.toISOString().slice(0, 10) as Time,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return data;
}

type Props = {
  code: string;
  basePrice: number;
  period: Period;
  onPeriodChange: (period: Period) => void;
};

export default function CandlestickChart({ code, basePrice, period, onPeriodChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const allCandles = generateOHLC(basePrice, parseInt(code, 10));
    const candles = allCandles.slice(-PERIOD_DAYS[period]);

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
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderUpColor: '#ef4444',
      borderDownColor: '#3b82f6',
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    });

    series.setData(candles);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [period, code, basePrice]);

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='flex gap-1 mb-4'>
        {(['1D', '1W', '1M', '3M'] as Period[]).map((p) => (
          <button
            key={p}
            type='button'
            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div ref={containerRef} />
    </div>
  );
}
