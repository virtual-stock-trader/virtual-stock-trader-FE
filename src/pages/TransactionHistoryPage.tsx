import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';
import { ALL_TRANSACTIONS } from '../lib/mock';

type FilterTab = '전체' | '매수' | '매도';

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<FilterTab>('전체');

  const filtered = useMemo(() => {
    if (tab === '전체') return ALL_TRANSACTIONS;
    return ALL_TRANSACTIONS.filter((tx) =>
      tab === '매수' ? tx.type === 'buy' : tx.type === 'sell',
    );
  }, [tab]);

  /* 탭별 건수 */
  const buyCnt = ALL_TRANSACTIONS.filter((tx) => tx.type === 'buy').length;
  const sellCnt = ALL_TRANSACTIONS.filter((tx) => tx.type === 'sell').length;

  const tabMeta: { label: FilterTab; count: number }[] = [
    { label: '전체', count: ALL_TRANSACTIONS.length },
    { label: '매수', count: buyCnt },
    { label: '매도', count: sellCnt },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5 pb-24">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer -ml-1"
            aria-label="뒤로가기"
          >
            <FiChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-white font-bold text-lg">거래 내역</h1>
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {tabMeta.map(({ label, count }) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(label)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === label
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-gray-200'
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
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((tx) => {
              const total = tx.price * tx.quantity;
              const isBuy = tx.type === 'buy';
              return (
                <div
                  key={tx.id}
                  className="flex items-center px-4 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/stock/${tx.code}`)}
                >
                  {/* 매수/매도 뱃지 */}
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg mr-3 shrink-0 ${
                      isBuy
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}
                  >
                    {isBuy ? '매수' : '매도'}
                  </span>

                  {/* 종목명 / 날짜 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{tx.date}</p>
                  </div>

                  {/* 수량 / 금액 */}
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-semibold tabular-nums">
                      {fmtPrice(total)}원
                    </p>
                    <p className="text-gray-500 text-xs tabular-nums mt-0.5">
                      {tx.quantity}주 × {fmtPrice(tx.price)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            /* 빈 상태 */
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500 text-sm">거래 내역이 없습니다</p>
            </div>
          )}
        </div>

        {/* 결과 건수 */}
        {filtered.length > 0 && (
          <p className="text-gray-600 text-xs text-center">{filtered.length}건</p>
        )}

      </main>
      <BottomNav />
    </div>
  );
}
