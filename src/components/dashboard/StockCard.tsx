import { fmtPrice, fmtRate, rateBadgeColor } from '../../lib/utils';

type Stock = {
  code: string;
  name: string;
  openPrice: number;
  currentPrice: number;
  changeRate: number;
  isFavorite: boolean;
};

type Props = {
  stock: Stock;
  onToggleFavorite: (code: string) => void;
  onSelect: (code: string) => void;
};

export default function StockCard({ stock, onToggleFavorite, onSelect }: Props) {
  return (
    <div
      className='bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-white/8 transition-colors'
      onClick={() => onSelect(stock.code)}
    >
      <div className='flex items-center justify-between'>
        <p className='text-white font-medium text-sm'>{stock.name}</p>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(stock.code);
          }}
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
          className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded mt-1 tabular-nums ${rateBadgeColor(stock.changeRate)}`}
        >
          {fmtRate(stock.changeRate)}
        </span>
      </div>
    </div>
  );
}
