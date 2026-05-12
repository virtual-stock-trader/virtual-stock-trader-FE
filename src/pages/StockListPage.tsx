import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
import Navbar from '../components/ui/Navbar';
import BottomNav from '../components/ui/BottomNav';

type Stock = {
  code: string;
  name: string;
  currentPrice: number;
  changeRate: number;
};

type Tab = '전체' | '즐겨찾기';

const ALL_STOCKS: Stock[] = [
  { code: '005930', name: '삼성전자', currentPrice: 70500, changeRate: 2.17 },
  { code: '000660', name: 'SK하이닉스', currentPrice: 130000, changeRate: -1.52 },
  { code: '035420', name: 'NAVER', currentPrice: 188500, changeRate: 1.89 },
  { code: '051910', name: 'LG화학', currentPrice: 307000, changeRate: -0.97 },
  { code: '035720', name: '카카오', currentPrice: 43200, changeRate: 2.86 },
  { code: '207940', name: '삼성바이오', currentPrice: 882000, changeRate: -0.9 },
  { code: '005380', name: '현대차', currentPrice: 215000, changeRate: 0.94 },
  { code: '000270', name: '기아', currentPrice: 98500, changeRate: 1.23 },
  { code: '068270', name: '셀트리온', currentPrice: 175000, changeRate: -0.57 },
  { code: '105560', name: 'KB금융', currentPrice: 87200, changeRate: 0.35 },
  { code: '055550', name: '신한지주', currentPrice: 56800, changeRate: -0.18 },
  { code: '003550', name: 'LG', currentPrice: 92000, changeRate: 1.10 },
];

const INITIAL_FAVORITES = new Set(['005930', '035720']);

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

function fmtRate(n: number) {
  return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
}

function rateBadgeColor(n: number) {
  if (n > 0) return 'bg-red-500/15 text-red-400';
  if (n < 0) return 'bg-blue-500/15 text-blue-400';
  return 'bg-white/10 text-gray-400';
}


type StockRowProps = {
  stock: Stock;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
  onSelect: (code: string) => void;
};

function StockRow({ stock, isFavorite, onToggleFavorite, onSelect }: StockRowProps) {
  return (
    <div
      className="flex items-center px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-b-0"
      onClick={() => onSelect(stock.code)}
    >
      {/* 즐겨찾기 버튼 */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(stock.code); }}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        className={`mr-3 text-base leading-none transition-opacity cursor-pointer shrink-0 ${
          isFavorite ? 'text-yellow-400 opacity-100' : 'text-gray-500 opacity-40 hover:opacity-70'
        }`}
      >
        ★
      </button>

      {/* 종목명 / 코드 */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{stock.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{stock.code}</p>
      </div>

      {/* 현재가 / 등락률 */}
      <div className="text-right shrink-0">
        <p className="text-white text-sm font-bold tabular-nums">
          {fmtPrice(stock.currentPrice)}원
        </p>
        <span
          className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 tabular-nums ${rateBadgeColor(stock.changeRate)}`}
        >
          {fmtRate(stock.changeRate)}
        </span>
      </div>
    </div>
  );
}

export default function StockListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('전체');
  const [favorites, setFavorites] = useState<Set<string>>(INITIAL_FAVORITES);

  const toggleFavorite = (code: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_STOCKS.filter((s) => {
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.code.includes(q);
      const matchesTab = tab === '전체' || favorites.has(s.code);
      return matchesQuery && matchesTab;
    });
  }, [query, tab, favorites]);

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
          <h1 className="text-white font-bold text-lg">종목 전체</h1>
        </div>

        {/* 검색창 */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <FiSearch size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="종목명 또는 코드 검색"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>

        {/* 탭 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(['전체', '즐겨찾기'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
              {t === '즐겨찾기' && favorites.size > 0 && (
                <span className="ml-1.5 text-xs text-yellow-400">{favorites.size}</span>
              )}
            </button>
          ))}
        </div>

        {/* 종목 목록 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((stock) => (
              <StockRow
                key={stock.code}
                stock={stock}
                isFavorite={favorites.has(stock.code)}
                onToggleFavorite={toggleFavorite}
                onSelect={(code) => navigate(`/stock/${code}`)}
              />
            ))
          ) : (
            /* 빈 상태 */
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-gray-500 text-sm">
                {tab === '즐겨찾기'
                  ? '즐겨찾기한 종목이 없습니다'
                  : '검색 결과가 없습니다'}
              </p>
              {tab === '즐겨찾기' && (
                <p className="text-gray-600 text-xs">★ 버튼으로 즐겨찾기를 추가하세요</p>
              )}
            </div>
          )}
        </div>

        {/* 검색 결과 카운트 */}
        {filtered.length > 0 && (
          <p className="text-gray-600 text-xs text-center">
            {filtered.length}개 종목
          </p>
        )}

      </main>
      <BottomNav />
    </div>
  );
}
