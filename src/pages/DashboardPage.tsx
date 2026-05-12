import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/ui/Navbar';

type MarketIndex = {
  name: string;
  value: number;
  change: number;
  changeRate: number;
};

type Stock = {
  code: string;
  name: string;
  openPrice: number;
  currentPrice: number;
  changeRate: number;
  isFavorite: boolean;
};

type PortfolioItem = {
  code: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type AssetPoint = {
  date: string;
  value: number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

const INDICES: MarketIndex[] = [
  { name: 'KOSPI', value: 2563.51, change: 31.42, changeRate: 1.24 },
  { name: 'KOSDAQ', value: 723.45, change: -3.24, changeRate: -0.45 },
];

const ASSET_HISTORY: AssetPoint[] = [
  { date: '4/28', value: 10_000_000 },
  { date: '4/29', value: 10_150_000 },
  { date: '4/30', value: 10_080_000 },
  { date: '5/1', value: 10_280_000 },
  { date: '5/2', value: 10_200_000 },
  { date: '5/5', value: 10_440_000 },
  { date: '5/6', value: 10_680_000 },
  { date: '5/7', value: 10_921_000 },
];

const INITIAL_STOCKS: Stock[] = [
  {
    code: '005930',
    name: '삼성전자',
    openPrice: 69_000,
    currentPrice: 70_500,
    changeRate: 2.17,
    isFavorite: true,
  },
  {
    code: '000660',
    name: 'SK하이닉스',
    openPrice: 132_000,
    currentPrice: 130_000,
    changeRate: -1.52,
    isFavorite: false,
  },
  {
    code: '035420',
    name: 'NAVER',
    openPrice: 185_000,
    currentPrice: 188_500,
    changeRate: 1.89,
    isFavorite: false,
  },
  {
    code: '051910',
    name: 'LG화학',
    openPrice: 310_000,
    currentPrice: 307_000,
    changeRate: -0.97,
    isFavorite: false,
  },
  {
    code: '035720',
    name: '카카오',
    openPrice: 42_000,
    currentPrice: 43_200,
    changeRate: 2.86,
    isFavorite: true,
  },
  {
    code: '207940',
    name: '삼성바이오',
    openPrice: 890_000,
    currentPrice: 882_000,
    changeRate: -0.9,
    isFavorite: false,
  },
];

const PORTFOLIO: PortfolioItem[] = [
  {
    code: '005930',
    name: '삼성전자',
    quantity: 10,
    averagePrice: 68_000,
    currentPrice: 70_500,
  },
  {
    code: '035720',
    name: '카카오',
    quantity: 5,
    averagePrice: 41_000,
    currentPrice: 43_200,
  },
];

const TOTAL_ASSETS = 10_921_000;
const CASH = 10_000_000;
const STOCK_VALUE = 921_000;
const DAILY_RETURN_RATE = 5.23;
const DAILY_RETURN_AMT = 542_000;

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

function fmtRate(n: number) {
  return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
}

function rateColor(n: number) {
  if (n > 0) return 'text-red-400';
  if (n < 0) return 'text-blue-400';
  return 'text-gray-400';
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-[#151b2d] border border-white/10 rounded-lg px-3 py-2'>
      <p className='text-gray-400 text-xs mb-0.5'>{label}</p>
      <p className='text-white text-sm font-bold tabular-nums'>
        {fmtPrice(payload[0].value)}원
      </p>
    </div>
  );
}

type IndexCardProps = { index: MarketIndex };

function IndexCard({ index }: IndexCardProps) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
      <p className='text-gray-400 text-xs font-medium'>{index.name}</p>
      <p className='text-white text-lg font-bold mt-1 tabular-nums'>
        {index.value.toLocaleString('ko-KR', { minimumFractionDigits: 2 })}
      </p>
      <p className='text-sm tabular-nums'>
        <span className={rateColor(index.changeRate)}>
          {index.change > 0 ? '+' : ''}
          {index.change.toFixed(2)}
        </span>
        <span className='text-gray-400'>
          &ensp;({fmtRate(index.changeRate)})
        </span>
      </p>
    </div>
  );
}

type StockCardProps = {
  stock: Stock;
  onToggleFavorite: (code: string) => void;
  onSelect: (code: string) => void;
};

function StockCard({ stock, onToggleFavorite, onSelect }: StockCardProps) {
  return (
    <div
      className='bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-white/8 transition-colors'
      onClick={() => onSelect(stock.code)}
    >
      <div className='flex items-center justify-between'>
        <p className='text-white font-medium text-sm'>{stock.name}</p>
        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(stock.code); }}
          aria-label={stock.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          className={`text-base leading-none cursor-pointer transition-opacity ${
            stock.isFavorite
              ? 'text-yellow-400 opacity-100'
              : 'text-gray-500 opacity-30 hover:opacity-70'
          }`}
        >
          ★
        </button>
      </div>
      <div>
        <p className='text-gray-500 text-xs tabular-nums'>
          시가 {fmtPrice(stock.openPrice)}
        </p>
        <p className='text-white text-lg font-bold tabular-nums'>
          {fmtPrice(stock.currentPrice)}
        </p>
        <span
          className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-1 tabular-nums ${
            stock.changeRate > 0
              ? 'bg-red-500/15 text-red-400'
              : stock.changeRate < 0
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-white/10 text-gray-400'
          }`}
        >
          {fmtRate(stock.changeRate)}
        </span>
      </div>
    </div>
  );
}

type PortfolioRowProps = { item: PortfolioItem };

function PortfolioRow({ item }: PortfolioRowProps) {
  const evalAmount = item.currentPrice * item.quantity;
  const returnRate =
    ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;
  const returnAmt = (item.currentPrice - item.averagePrice) * item.quantity;
  const color = rateColor(returnRate);
  return (
    <tr className='border-t border-white/5 hover:bg-white/2 transition-colors'>
      <td className='py-3.5 px-4 text-white text-sm'>{item.name}</td>
      <td className='py-3.5 px-4 text-gray-300 text-sm text-right tabular-nums'>
        {item.quantity}주
      </td>
      <td className='py-3.5 px-4 text-gray-400 text-sm text-right tabular-nums'>
        {fmtPrice(item.averagePrice)}
      </td>
      <td className='py-3.5 px-4 text-white text-sm text-right tabular-nums'>
        {fmtPrice(item.currentPrice)}
      </td>
      <td className='py-3.5 px-4 text-right tabular-nums'>
        <p className='text-white text-sm'>{fmtPrice(evalAmount)}</p>
        <p className={`text-xs ${color}`}>
          {returnAmt > 0 ? '+' : ''}
          {fmtPrice(returnAmt)}
        </p>
      </td>
      <td
        className={`py-3.5 px-4 text-sm font-semibold text-right tabular-nums ${color}`}
      >
        {fmtRate(returnRate)}
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState(INITIAL_STOCKS);

  const toggleFavorite = (code: string) => {
    setStocks((prev) =>
      prev.map((s) =>
        s.code === code ? { ...s, isFavorite: !s.isFavorite } : s,
      ),
    );
  };

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8'>
        {/* 내 자산 현황 */}
        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            내 자산 현황
          </h2>

          {/* 총 자산 */}
          <div>
            <p className='text-gray-400 text-xs font-medium'>총 자산</p>
            <p className='text-white text-3xl font-bold mt-1 tabular-nums'>
              {fmtPrice(TOTAL_ASSETS)}원
            </p>
            <p className='text-sm mt-1.5 tabular-nums'>
              <span className={rateColor(DAILY_RETURN_RATE)}>
                {fmtRate(DAILY_RETURN_RATE)}
              </span>
              <span className='text-gray-400'>
                &ensp;({DAILY_RETURN_AMT > 0 ? '+' : ''}
                {fmtPrice(DAILY_RETURN_AMT)}원)
              </span>
            </p>
          </div>

          {/* 예수금 · 주식 평가금 */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
              <p className='text-gray-500 text-xs font-medium'>예수금</p>
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>
                {fmtPrice(CASH)}원
              </p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
              <p className='text-gray-500 text-xs font-medium'>주식 평가금</p>
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>
                {fmtPrice(STOCK_VALUE)}원
              </p>
            </div>
          </div>

          {/* 시장 지수 */}
          <div className='grid grid-cols-2 gap-3'>
            {INDICES.map((index) => (
              <IndexCard key={index.name} index={index} />
            ))}
          </div>

          {/* 자산 추이 */}
          <div className='bg-white/5 border border-white/10 rounded-2xl px-5 pt-4 pb-2'>
            <p className='text-gray-400 text-xs font-medium mb-3'>자산 추이</p>
            <ResponsiveContainer width='100%' height={160}>
              <AreaChart
                data={ASSET_HISTORY}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id='assetGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#60a5fa' stopOpacity={0.25} />
                    <stop offset='95%' stopColor='#60a5fa' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey='date'
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  domain={['dataMin - 100000', 'dataMax + 100000']}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#60a5fa'
                  strokeWidth={2}
                  fill='url(#assetGrad)'
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#60a5fa',
                    stroke: '#0a0e1a',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 실시간 시세 */}
        <section className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              실시간 시세
            </h2>
            <button
              type='button'
              className='text-gray-500 text-xs hover:text-gray-300 transition-colors cursor-pointer'
            >
              전체보기
            </button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {stocks.map((stock) => (
              <StockCard
                key={stock.code}
                stock={stock}
                onToggleFavorite={toggleFavorite}
                onSelect={(code) => navigate(`/stock/${code}`)}
              />
            ))}
          </div>
        </section>

        {/* 내 보유 종목 */}
        <section className='flex flex-col gap-3 pb-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
              내 보유 종목
            </h2>
            <button
              type='button'
              className='text-gray-500 text-xs hover:text-gray-300 transition-colors cursor-pointer'
            >
              전체보기
            </button>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='text-gray-500 text-xs'>
                    <th className='py-3 px-4 text-left font-medium'>종목명</th>
                    <th className='py-3 px-4 text-right font-medium'>
                      보유수량
                    </th>
                    <th className='py-3 px-4 text-right font-medium'>
                      평균단가
                    </th>
                    <th className='py-3 px-4 text-right font-medium'>현재가</th>
                    <th className='py-3 px-4 text-right font-medium'>
                      평가금액
                    </th>
                    <th className='py-3 px-4 text-right font-medium'>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO.map((item) => (
                    <PortfolioRow key={item.code} item={item} />
                  ))}
                </tbody>
              </table>
              {PORTFOLIO.length === 0 && (
                <p className='text-gray-600 text-sm text-center py-10'>
                  보유 종목이 없습니다
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
