import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts';
import Navbar from '../components/ui/Navbar';

type Period = '1D' | '1W' | '1M' | '3M';

type StockInfo = {
  code: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
};

type HoldingInfo = {
  quantity: number;
  averagePrice: number;
};

const STOCK_DB: Record<string, StockInfo> = {
  '005930': {
    code: '005930',
    name: '삼성전자',
    currentPrice: 70500,
    changeRate: 2.17,
    openPrice: 69000,
    highPrice: 71200,
    lowPrice: 68500,
    volume: 12_345_678,
  },
  '000660': {
    code: '000660',
    name: 'SK하이닉스',
    currentPrice: 130000,
    changeRate: -1.52,
    openPrice: 132000,
    highPrice: 133200,
    lowPrice: 129000,
    volume: 3_456_789,
  },
  '035420': {
    code: '035420',
    name: 'NAVER',
    currentPrice: 188500,
    changeRate: 1.89,
    openPrice: 185000,
    highPrice: 190000,
    lowPrice: 184500,
    volume: 876_543,
  },
  '051910': {
    code: '051910',
    name: 'LG화학',
    currentPrice: 307000,
    changeRate: -0.97,
    openPrice: 310000,
    highPrice: 311000,
    lowPrice: 305000,
    volume: 234_567,
  },
  '035720': {
    code: '035720',
    name: '카카오',
    currentPrice: 43200,
    changeRate: 2.86,
    openPrice: 42000,
    highPrice: 43800,
    lowPrice: 41800,
    volume: 5_678_901,
  },
  '207940': {
    code: '207940',
    name: '삼성바이오',
    currentPrice: 882000,
    changeRate: -0.9,
    openPrice: 890000,
    highPrice: 895000,
    lowPrice: 879000,
    volume: 123_456,
  },
};

const HOLDING_DB: Record<string, HoldingInfo> = {
  '005930': { quantity: 10, averagePrice: 68000 },
  '035720': { quantity: 5, averagePrice: 41000 },
};

const CASH = 10_000_000;

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

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

function fmtRate(n: number) {
  return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
}

function fmtVol(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function rateColor(n: number) {
  if (n > 0) return 'text-red-400';
  if (n < 0) return 'text-blue-400';
  return 'text-gray-400';
}

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [period, setPeriod] = useState<Period>('1M');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);

  const stock = code ? STOCK_DB[code] : null;
  const holding = code ? HOLDING_DB[code] : null;

  useEffect(() => {
    if (!chartContainerRef.current || !code) return;
    const stockInfo = STOCK_DB[code];
    if (!stockInfo) return;

    const container = chartContainerRef.current;
    const allCandles = generateOHLC(stockInfo.currentPrice, parseInt(code, 10));
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
  }, [period, code]);

  if (!stock) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
          종목을 찾을 수 없습니다
        </div>
      </div>
    );
  }

  const change = stock.currentPrice - stock.openPrice;
  const orderAmount = stock.currentPrice * quantity;
  const holdingEval = holding ? holding.quantity * stock.currentPrice : 0;
  const holdingReturn = holding
    ? ((stock.currentPrice - holding.averagePrice) / holding.averagePrice) * 100
    : 0;
  const holdingReturnAmt = holding
    ? (stock.currentPrice - holding.averagePrice) * holding.quantity
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 pb-12">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer -ml-1"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-lg">{stock.name}</h1>
            <span className="text-gray-500 text-xs bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
              {stock.code}
            </span>
          </div>
        </div>

        {/* 현재가 */}
        <div className="flex flex-col gap-1">
          <p className="text-white text-3xl font-bold tabular-nums">
            {fmtPrice(stock.currentPrice)}원
          </p>
          <p className="text-sm tabular-nums">
            <span className={rateColor(stock.changeRate)}>{fmtRate(stock.changeRate)}</span>
            <span className="text-gray-500">
              &ensp;{change > 0 ? '+' : ''}{fmtPrice(change)}원
            </span>
          </p>
        </div>

        {/* 종목 정보 그리드 */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '시가', value: fmtPrice(stock.openPrice) },
            { label: '고가', value: fmtPrice(stock.highPrice) },
            { label: '저가', value: fmtPrice(stock.lowPrice) },
            { label: '거래량', value: fmtVol(stock.volume) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center"
            >
              <p className="text-gray-500 text-xs">{label}</p>
              <p className="text-white text-sm font-medium tabular-nums mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* 캔들스틱 차트 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex gap-1 mb-4">
            {(['1D', '1W', '1M', '3M'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
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
          <div ref={chartContainerRef} />
        </div>

        {/* 내 보유 현황 */}
        {holding && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
              내 보유
            </p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-gray-500 text-xs">보유수량</p>
                <p className="text-white text-sm font-bold mt-0.5 tabular-nums">
                  {holding.quantity}주
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">평균단가</p>
                <p className="text-white text-sm font-bold mt-0.5 tabular-nums">
                  {fmtPrice(holding.averagePrice)}원
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">평가금액</p>
                <p className="text-white text-sm font-bold mt-0.5 tabular-nums">
                  {fmtPrice(holdingEval)}원
                </p>
              </div>
            </div>
            <p className={`text-sm font-semibold tabular-nums ${rateColor(holdingReturn)}`}>
              {holdingReturnAmt > 0 ? '+' : ''}{fmtPrice(holdingReturnAmt)}원
              &ensp;({fmtRate(holdingReturn)})
            </p>
          </div>
        )}

        {/* 매매 패널 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          {/* 매수 / 매도 탭 */}
          <div className="flex mb-5 bg-white/5 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => { setTradeTab('buy'); setQuantity(1); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                tradeTab === 'buy'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              매수
            </button>
            <button
              type="button"
              onClick={() => { setTradeTab('sell'); setQuantity(1); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                tradeTab === 'sell'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              매도
            </button>
          </div>

          {/* 주문 가능 금액 / 수량 */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-xs">
              {tradeTab === 'buy' ? '주문 가능 금액' : '매도 가능 수량'}
            </p>
            <p className="text-white text-sm font-semibold tabular-nums">
              {tradeTab === 'buy'
                ? `${fmtPrice(CASH)}원`
                : `${holding?.quantity ?? 0}주`}
            </p>
          </div>

          {/* 현재가 */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-xs">현재가</p>
            <p className="text-white text-sm font-semibold tabular-nums">
              {fmtPrice(stock.currentPrice)}원
            </p>
          </div>

          {/* 수량 */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-xs">수량</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold"
              >
                −
              </button>
              <span className="text-white text-sm font-bold w-10 text-center tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* 주문 금액 */}
          <div className="flex justify-between items-center pt-3 mb-5 border-t border-white/10">
            <p className="text-gray-400 text-sm">주문 금액</p>
            <p className="text-white text-base font-bold tabular-nums">
              {fmtPrice(orderAmount)}원
            </p>
          </div>

          {/* 주문 버튼 */}
          <button
            type="button"
            className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-colors cursor-pointer ${
              tradeTab === 'buy'
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }`}
          >
            {stock.name} {quantity}주 {tradeTab === 'buy' ? '매수' : '매도'}
          </button>
        </div>

      </main>
    </div>
  );
}
