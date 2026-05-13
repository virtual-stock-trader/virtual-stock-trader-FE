import { fmtPrice, fmtRate, rateBadgeColor } from '../../lib/utils';

type Stock = {
  code: string;
  name: string;
  currentPrice: number;
  changeRate: number;
};

type Props = {
  stock: Stock;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
  onSelect: (code: string) => void;
};

export default function StockRow({ stock, isFavorite, onToggleFavorite, onSelect }: Props) {
  return (
    <div
      className='flex items-center px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-b-0'
      onClick={() => onSelect(stock.code)}
    >
      {/* 즐겨찾기 버튼 */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(stock.code);
        }}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        className={`mr-3 text-base leading-none transition-opacity cursor-pointer shrink-0 ${
          isFavorite
            ? 'text-yellow-400 opacity-100'
            : 'text-gray-500 opacity-40 hover:opacity-70'
        }`}
      >
        ★
      </button>

      {/* 종목명 / 코드 */}
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-medium truncate'>{stock.name}</p>
        <p className='text-gray-500 text-xs mt-0.5'>{stock.code}</p>
      </div>

      {/* 현재가 / 등락률 */}
      <div className='text-right shrink-0'>
        <p className='text-white text-sm font-bold tabular-nums'>
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
