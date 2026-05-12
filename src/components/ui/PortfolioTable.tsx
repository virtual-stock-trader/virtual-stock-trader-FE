import { fmtPrice, fmtRate, rateColor } from '../../lib/utils';

type PortfolioItem = {
  code: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type Props = {
  items: PortfolioItem[];
  /** 행 클릭 시 종목 코드 전달 — 없으면 클릭 불가 */
  onRowClick?: (code: string) => void;
  /** 수량 컬럼 헤더 레이블 */
  quantityLabel?: string;
};

export default function PortfolioTable({
  items,
  onRowClick,
  quantityLabel = '수량',
}: Props) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='text-gray-500 text-xs border-b border-white/5'>
              <th className='py-3 px-4 text-left font-medium'>종목명</th>
              <th className='py-3 px-4 text-right font-medium'>{quantityLabel}</th>
              <th className='py-3 px-4 text-right font-medium'>평균단가</th>
              <th className='py-3 px-4 text-right font-medium'>현재가</th>
              <th className='py-3 px-4 text-right font-medium'>평가금액</th>
              <th className='py-3 px-4 text-right font-medium'>수익률</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const evalAmt = item.currentPrice * item.quantity;
              const returnRate =
                ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;
              const returnAmt = (item.currentPrice - item.averagePrice) * item.quantity;
              const color = rateColor(returnRate);
              return (
                <tr
                  key={item.code}
                  className={`border-t border-white/5 transition-colors ${
                    onRowClick
                      ? 'hover:bg-white/5 cursor-pointer'
                      : 'hover:bg-white/2'
                  }`}
                  onClick={() => onRowClick?.(item.code)}
                >
                  <td className='py-3.5 px-4 text-white text-sm font-medium'>
                    {item.name}
                  </td>
                  <td className='py-3.5 px-4 text-gray-300 text-sm text-right tabular-nums'>
                    {item.quantity}주
                  </td>
                  <td className='py-3.5 px-4 text-gray-400 text-sm text-right tabular-nums'>
                    {fmtPrice(item.averagePrice)}
                  </td>
                  <td className='py-3.5 px-4 text-white text-sm text-right tabular-nums'>
                    {fmtPrice(item.currentPrice)}
                  </td>
                  <td className='py-3.5 px-4 text-right tabular-nums'>
                    <p className='text-white text-sm'>{fmtPrice(evalAmt)}</p>
                    <p className={`text-xs ${color}`}>
                      {returnAmt > 0 ? '+' : ''}
                      {fmtPrice(returnAmt)}
                    </p>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-sm font-semibold text-right tabular-nums ${color}`}
                  >
                    {fmtRate(returnRate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className='text-gray-600 text-sm text-center py-10'>
            보유 종목이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
