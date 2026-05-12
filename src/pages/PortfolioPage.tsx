import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';
import PortfolioTable from '../components/ui/PortfolioTable';
import TransactionItem from '../components/ui/TransactionItem';
import AllocationChart from '../components/portfolio/AllocationChart';
import { ALL_TRANSACTIONS } from '../lib/mock';
import { fmtPrice, fmtRate, rateColor } from '../lib/utils';

type PortfolioItem = {
  code: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type AllocationItem = {
  name: string;
  value: number;
  color: string;
  fill: string;
};

const TOTAL_ASSETS = 10_921_000;
const CASH = 10_000_000;
const DAILY_RETURN_RATE = 5.23;
const DAILY_RETURN_AMT = 542_000;

const PORTFOLIO: PortfolioItem[] = [
  { code: '005930', name: '삼성전자', quantity: 10, averagePrice: 68_000, currentPrice: 70_500 },
  { code: '035720', name: '카카오', quantity: 5, averagePrice: 41_000, currentPrice: 43_200 },
];

const ALLOCATION: AllocationItem[] = [
  { name: '예수금', value: 10_000_000, color: '#3b82f6', fill: '#3b82f6' },
  { name: '삼성전자', value: 705_000, color: '#ef4444', fill: '#ef4444' },
  { name: '카카오', value: 216_000, color: '#f59e0b', fill: '#f59e0b' },
];

/* 포트폴리오 페이지에서는 최근 5건만 미리보기로 표시 */
const RECENT_TRANSACTIONS = ALL_TRANSACTIONS.slice(0, 5);

export default function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24'>

        {/* 자산 요약 */}
        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            내 자산
          </h2>

          <div>
            <p className='text-gray-400 text-xs font-medium'>총 자산</p>
            <p className='text-white text-3xl font-bold mt-1 tabular-nums'>
              {fmtPrice(TOTAL_ASSETS)}원
            </p>
            <p className='text-sm mt-1.5 tabular-nums'>
              <span className={rateColor(DAILY_RETURN_RATE)}>{fmtRate(DAILY_RETURN_RATE)}</span>
              <span className='text-gray-400'>
                &ensp;(+{fmtPrice(DAILY_RETURN_AMT)}원)
              </span>
            </p>
          </div>

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
                {fmtPrice(TOTAL_ASSETS - CASH)}원
              </p>
            </div>
          </div>
        </section>

        {/* 자산 배분 */}
        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            자산 배분
          </h2>
          <AllocationChart data={ALLOCATION} totalAssets={TOTAL_ASSETS} />
        </section>

        {/* 보유 종목 */}
        <section className='flex flex-col gap-3'>
          <h2 className='text-gray-500 text-xs font-semibold uppercase tracking-widest'>
            보유 종목
          </h2>
          <PortfolioTable
            items={PORTFOLIO}
            onRowClick={(code) => navigate(`/stock/${code}`)}
          />
        </section>

        {/* 거래 내역 */}
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
            {RECENT_TRANSACTIONS.map((tx) => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                onClick={(code) => navigate(`/stock/${code}`)}
              />
            ))}
          </div>
        </section>

      </main>
      <BottomNav />
    </div>
  );
}
