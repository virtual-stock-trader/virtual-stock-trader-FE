import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';
import PortfolioTable from '../components/ui/PortfolioTable';
import IndexCard from '../components/dashboard/IndexCard';
import StockCard from '../components/dashboard/StockCard';
import AssetChart from '../components/dashboard/AssetChart';
import { fmtPrice, fmtRate, rateColor } from '../lib/utils';

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
  { code: '005930', name: '삼성전자', openPrice: 69_000, currentPrice: 70_500, changeRate: 2.17, isFavorite: true },
  { code: '000660', name: 'SK하이닉스', openPrice: 132_000, currentPrice: 130_000, changeRate: -1.52, isFavorite: false },
  { code: '035420', name: 'NAVER', openPrice: 185_000, currentPrice: 188_500, changeRate: 1.89, isFavorite: false },
  { code: '051910', name: 'LG화학', openPrice: 310_000, currentPrice: 307_000, changeRate: -0.97, isFavorite: false },
  { code: '035720', name: '카카오', openPrice: 42_000, currentPrice: 43_200, changeRate: 2.86, isFavorite: true },
  { code: '207940', name: '삼성바이오', openPrice: 890_000, currentPrice: 882_000, changeRate: -0.9, isFavorite: false },
];

const PORTFOLIO: PortfolioItem[] = [
  { code: '005930', name: '삼성전자', quantity: 10, averagePrice: 68_000, currentPrice: 70_500 },
  { code: '035720', name: '카카오', quantity: 5, averagePrice: 41_000, currentPrice: 43_200 },
];

const TOTAL_ASSETS = 10_921_000;
const CASH = 10_000_000;
const STOCK_VALUE = 921_000;
const DAILY_RETURN_RATE = 5.23;
const DAILY_RETURN_AMT = 542_000;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState(INITIAL_STOCKS);

  const toggleFavorite = (code: string) => {
    setStocks((prev) =>
      prev.map((s) => (s.code === code ? { ...s, isFavorite: !s.isFavorite } : s)),
    );
  };

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24'>

        {/* 내 자산 현황 */}
        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            내 자산 현황
          </h2>

          <div>
            <p className='text-gray-400 text-xs font-medium'>총 자산</p>
            <p className='text-white text-3xl font-bold mt-1 tabular-nums'>
              {fmtPrice(TOTAL_ASSETS)}원
            </p>
            <p className='text-sm mt-1.5 tabular-nums'>
              <span className={rateColor(DAILY_RETURN_RATE)}>{fmtRate(DAILY_RETURN_RATE)}</span>
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
              <p className='text-white text-lg font-bold mt-1 tabular-nums'>{fmtPrice(CASH)}원</p>
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

          <AssetChart data={ASSET_HISTORY} />
        </section>

        {/* 실시간 시세 */}
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
          <PortfolioTable items={PORTFOLIO} quantityLabel='보유수량' />
        </section>

      </main>
      <BottomNav />
    </div>
  );
}
