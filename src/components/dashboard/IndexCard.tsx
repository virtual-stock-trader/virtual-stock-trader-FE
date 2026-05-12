import { fmtRate, rateColor } from '../../lib/utils';

type MarketIndex = {
  name: string;
  value: number;
  change: number;
  changeRate: number;
};

type Props = { index: MarketIndex };

export default function IndexCard({ index }: Props) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
      <p className='text-gray-400 text-xs font-medium'>{index.name}</p>
      <p className='text-white text-lg font-bold mt-1 tabular-nums'>
        {index.value.toLocaleString('ko-KR', { minimumFractionDigits: 2 })}
      </p>
      <p className='text-sm tabular-nums'>
        <span className={rateColor(index.changeRate)}>
          {index.change > 0 ? '+' : ''}
          {index.change.toFixed(2)}
        </span>
        <span className='text-gray-400'>&ensp;({fmtRate(index.changeRate)})</span>
      </p>
    </div>
  );
}
