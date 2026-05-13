import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';
import PageHeader from '../components/ui/PageHeader';
import TransactionItem from '../components/ui/TransactionItem';
import { ALL_TRANSACTIONS } from '../lib/mock';

type FilterTab = '전체' | '매수' | '매도';

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<FilterTab>('전체');

  const filtered = useMemo(() => {
    if (tab === '전체') return ALL_TRANSACTIONS;
    return ALL_TRANSACTIONS.filter((tx) =>
      tab === '매수' ? tx.type === 'buy' : tx.type === 'sell',
    );
  }, [tab]);

  const buyCnt = ALL_TRANSACTIONS.filter((tx) => tx.type === 'buy').length;
  const sellCnt = ALL_TRANSACTIONS.filter((tx) => tx.type === 'sell').length;

  const tabMeta: { label: FilterTab; count: number }[] = [
    { label: '전체', count: ALL_TRANSACTIONS.length },
    { label: '매수', count: buyCnt },
    { label: '매도', count: sellCnt },
  ];

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5 pb-24'>

        <PageHeader title='거래 내역' />

        {/* 필터 탭 */}
        <div className='flex gap-1 bg-white/5 rounded-xl p-1'>
          {tabMeta.map(({ label, count }) => (
            <button
              key={label}
              type='button'
              onClick={() => setTab(label)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === label ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {label}
              <span
                className={`text-xs tabular-nums ${
                  tab === label ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* 거래 목록 */}
        <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
          {filtered.length > 0 ? (
            filtered.map((tx) => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                onClick={(code) => navigate(`/stock/${code}`)}
              />
            ))
          ) : (
            <div className='flex items-center justify-center py-16'>
              <p className='text-gray-500 text-sm'>거래 내역이 없습니다</p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className='text-gray-600 text-xs text-center'>{filtered.length}건</p>
        )}

      </main>
      <BottomNav />
    </div>
  );
}
