import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';

type PortfolioItem = {
  code: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type Transaction = {
  id: number;
  date: string;
  code: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
};

type AllocationItem = {
  name: string;
  value: number;
  color: string;
};

type TooltipProps = {
  active?: boolean;
  payload?: { name: string; value: number }[];
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
  { name: '예수금', value: 10_000_000, color: '#3b82f6' },
  { name: '삼성전자', value: 705_000, color: '#ef4444' },
  { name: '카카오', value: 216_000, color: '#f59e0b' },
];

const TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2026-05-07', code: '035720', name: '카카오', type: 'buy', quantity: 5, price: 41_000 },
  { id: 2, date: '2026-05-05', code: '005930', name: '삼성전자', type: 'buy', quantity: 10, price: 68_000 },
  { id: 3, date: '2026-04-28', code: '207940', name: '삼성바이오', type: 'sell', quantity: 2, price: 890_000 },
  { id: 4, date: '2026-04-20', code: '207940', name: '삼성바이오', type: 'buy', quantity: 2, price: 850_000 },
  { id: 5, date: '2026-04-15', code: '035420', name: 'NAVER', type: 'sell', quantity: 3, price: 182_000 },
];

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

function AllocationTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const pct = ((payload[0].value / TOTAL_ASSETS) * 100).toFixed(1);
  return (
    <div className="bg-[#151b2d] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-0.5">{payload[0].name}</p>
      <p className="text-white font-bold tabular-nums">{fmtPrice(payload[0].value)}원</p>
      <p className="text-gray-400 tabular-nums">{pct}%</p>
    </div>
  );
}

export default function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24">

        {/* 자산 요약 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            내 자산
          </h2>

          <div>
            <p className="text-gray-400 text-xs font-medium">총 자산</p>
            <p className="text-white text-3xl font-bold mt-1 tabular-nums">
              {fmtPrice(TOTAL_ASSETS)}원
            </p>
            <p className="text-sm mt-1.5 tabular-nums">
              <span className={rateColor(DAILY_RETURN_RATE)}>{fmtRate(DAILY_RETURN_RATE)}</span>
              <span className="text-gray-400">
                &ensp;(+{fmtPrice(DAILY_RETURN_AMT)}원)
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-gray-500 text-xs font-medium">예수금</p>
              <p className="text-white text-lg font-bold mt-1 tabular-nums">
                {fmtPrice(CASH)}원
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-gray-500 text-xs font-medium">주식 평가금</p>
              <p className="text-white text-lg font-bold mt-1 tabular-nums">
                {fmtPrice(TOTAL_ASSETS - CASH)}원
              </p>
            </div>
          </div>
        </section>

        {/* 자산 배분 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            자산 배분
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              {/* 도넛 차트 */}
              <div className="shrink-0" style={{ width: 140, height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALLOCATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {ALLOCATION.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<AllocationTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 범례 */}
              <div className="flex flex-col gap-2.5 flex-1">
                {ALLOCATION.map((item) => {
                  const pct = ((item.value / TOTAL_ASSETS) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-xs truncate">{item.name}</span>
                      </div>
                      <span className="text-white text-xs font-semibold tabular-nums shrink-0">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 보유 종목 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            보유 종목
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-white/5">
                    <th className="py-3 px-4 text-left font-medium">종목명</th>
                    <th className="py-3 px-4 text-right font-medium">수량</th>
                    <th className="py-3 px-4 text-right font-medium">평균단가</th>
                    <th className="py-3 px-4 text-right font-medium">현재가</th>
                    <th className="py-3 px-4 text-right font-medium">평가금액</th>
                    <th className="py-3 px-4 text-right font-medium">수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO.map((item) => {
                    const evalAmt = item.currentPrice * item.quantity;
                    const returnRate =
                      ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;
                    const returnAmt = (item.currentPrice - item.averagePrice) * item.quantity;
                    const color = rateColor(returnRate);
                    return (
                      <tr
                        key={item.code}
                        className="border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => navigate(`/stock/${item.code}`)}
                      >
                        <td className="py-3.5 px-4 text-white text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 text-sm text-right tabular-nums">
                          {item.quantity}주
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-sm text-right tabular-nums">
                          {fmtPrice(item.averagePrice)}
                        </td>
                        <td className="py-3.5 px-4 text-white text-sm text-right tabular-nums">
                          {fmtPrice(item.currentPrice)}
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <p className="text-white text-sm">{fmtPrice(evalAmt)}</p>
                          <p className={`text-xs ${color}`}>
                            {returnAmt > 0 ? '+' : ''}{fmtPrice(returnAmt)}
                          </p>
                        </td>
                        <td className={`py-3.5 px-4 text-sm font-semibold text-right tabular-nums ${color}`}>
                          {fmtRate(returnRate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {PORTFOLIO.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-10">보유 종목이 없습니다</p>
              )}
            </div>
          </div>
        </section>

        {/* 거래 내역 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            거래 내역
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {TRANSACTIONS.map((tx) => {
              const total = tx.price * tx.quantity;
              const isBuy = tx.type === 'buy';
              return (
                <div
                  key={tx.id}
                  className="flex items-center px-4 py-3.5 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
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
            })}
          </div>
        </section>

      </main>
      <BottomNav />
    </div>
  );
}
