import { fmtPrice } from '../../lib/utils';

type Props = {
  stockName: string;
  currentPrice: number;
  cash: number;
  holdingQty: number;
  tradeTab: 'buy' | 'sell';
  quantity: number;
  onTabChange: (tab: 'buy' | 'sell') => void;
  onQuantityChange: (qty: number) => void;
};

export default function TradePanel({
  stockName,
  currentPrice,
  cash,
  holdingQty,
  tradeTab,
  quantity,
  onTabChange,
  onQuantityChange,
}: Props) {
  const orderAmount = currentPrice * quantity;

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      {/* 매수 / 매도 탭 */}
      <div className='flex mb-5 bg-white/5 rounded-xl p-1 gap-1'>
        <button
          type='button'
          onClick={() => {
            onTabChange('buy');
            onQuantityChange(1);
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tradeTab === 'buy' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          매수
        </button>
        <button
          type='button'
          onClick={() => {
            onTabChange('sell');
            onQuantityChange(1);
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tradeTab === 'sell' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          매도
        </button>
      </div>

      {/* 주문 가능 금액 / 수량 */}
      <div className='flex justify-between items-center mb-4'>
        <p className='text-gray-500 text-xs'>
          {tradeTab === 'buy' ? '주문 가능 금액' : '매도 가능 수량'}
        </p>
        <p className='text-white text-sm font-semibold tabular-nums'>
          {tradeTab === 'buy' ? `${fmtPrice(cash)}원` : `${holdingQty}주`}
        </p>
      </div>

      {/* 현재가 */}
      <div className='flex justify-between items-center mb-4'>
        <p className='text-gray-500 text-xs'>현재가</p>
        <p className='text-white text-sm font-semibold tabular-nums'>
          {fmtPrice(currentPrice)}원
        </p>
      </div>

      {/* 수량 */}
      <div className='flex justify-between items-center mb-4'>
        <p className='text-gray-500 text-xs'>수량</p>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className='w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold'
          >
            −
          </button>
          <span className='text-white text-sm font-bold w-10 text-center tabular-nums'>
            {quantity}
          </span>
          <button
            type='button'
            onClick={() => onQuantityChange(quantity + 1)}
            className='w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold'
          >
            +
          </button>
        </div>
      </div>

      {/* 주문 금액 */}
      <div className='flex justify-between items-center pt-3 mb-5 border-t border-white/10'>
        <p className='text-gray-400 text-sm'>주문 금액</p>
        <p className='text-white text-base font-bold tabular-nums'>{fmtPrice(orderAmount)}원</p>
      </div>

      {/* 주문 버튼 */}
      <button
        type='button'
        className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-colors cursor-pointer ${
          tradeTab === 'buy'
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        {stockName} {quantity}주 {tradeTab === 'buy' ? '매수' : '매도'}
      </button>
    </div>
  );
}
