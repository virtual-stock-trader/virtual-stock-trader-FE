import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtPrice } from '../../lib/utils';

type AllocationItem = {
  name: string;
  value: number;
  color: string;
  fill: string;
};

type TooltipProps = {
  active?: boolean;
  payload?: { name: string; value: number }[];
  totalAssets: number;
};

function AllocationTooltip({ active, payload, totalAssets }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const pct = ((payload[0].value / totalAssets) * 100).toFixed(1);
  return (
    <div className='bg-[#151b2d] border border-white/10 rounded-lg px-3 py-2 text-xs'>
      <p className='text-gray-400 mb-0.5'>{payload[0].name}</p>
      <p className='text-white font-bold tabular-nums'>{fmtPrice(payload[0].value)}원</p>
      <p className='text-gray-400 tabular-nums'>{pct}%</p>
    </div>
  );
}

type Props = {
  data: AllocationItem[];
  totalAssets: number;
};

export default function AllocationChart({ data, totalAssets }: Props) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='flex items-center gap-4'>
        {/* 도넛 차트 */}
        <div className='shrink-0' style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={42}
                outerRadius={62}
                dataKey='value'
                strokeWidth={0}
              />
              <Tooltip content={<AllocationTooltip totalAssets={totalAssets} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div className='flex flex-col gap-2.5 flex-1'>
          {data.map((item) => {
            const pct = ((item.value / totalAssets) * 100).toFixed(1);
            return (
              <div key={item.name} className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span
                    className='w-2.5 h-2.5 rounded-full shrink-0'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='text-gray-300 text-xs truncate'>{item.name}</span>
                </div>
                <span className='text-white text-xs font-semibold tabular-nums shrink-0'>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
