import { fmtPrice, fmtRate, rateColor } from '../../lib/utils';

type Props = {
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

export default function HoldingInfo({ quantity, averagePrice, currentPrice }: Props) {
  const evalAmount = currentPrice * quantity;
  const returnRate = ((currentPrice - averagePrice) / averagePrice) * 100;
  const returnAmt = (currentPrice - averagePrice) * quantity;

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <p className='text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3'>
        내 보유
      </p>
      <div className='grid grid-cols-3 gap-3 mb-3'>
        <div>
          <p className='text-gray-500 text-xs'>보유수량</p>
          <p className='text-white text-sm font-bold mt-0.5 tabular-nums'>{quantity}주</p>
        </div>
        <div>
          <p className='text-gray-500 text-xs'>평균단가</p>
          <p className='text-white text-sm font-bold mt-0.5 tabular-nums'>
            {fmtPrice(averagePrice)}원
          </p>
        </div>
        <div>
          <p className='text-gray-500 text-xs'>평가금액</p>
          <p className='text-white text-sm font-bold mt-0.5 tabular-nums'>
            {fmtPrice(evalAmount)}원
          </p>
        </div>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${rateColor(returnRate)}`}>
        {returnAmt > 0 ? '+' : ''}
        {fmtPrice(returnAmt)}원&ensp;({fmtRate(returnRate)})
      </p>
    </div>
  );
}
