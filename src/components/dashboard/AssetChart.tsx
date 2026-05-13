import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fmtPrice } from '../../lib/utils';

type AssetPoint = {
  date: string;
  value: number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-[#151b2d] border border-white/10 rounded-lg px-3 py-2'>
      <p className='text-gray-400 text-xs mb-0.5'>{label}</p>
      <p className='text-white text-sm font-bold tabular-nums'>
        {fmtPrice(payload[0].value)}원
      </p>
    </div>
  );
}

type Props = { data: AssetPoint[] };

export default function AssetChart({ data }: Props) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl px-5 pt-4 pb-2'>
      <p className='text-gray-400 text-xs font-medium mb-3'>자산 추이</p>
      <ResponsiveContainer width='100%' height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id='assetGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#60a5fa' stopOpacity={0.25} />
              <stop offset='95%' stopColor='#60a5fa' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey='date'
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
            domain={['dataMin - 100000', 'dataMax + 100000']}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Area
            type='monotone'
            dataKey='value'
            stroke='#60a5fa'
            strokeWidth={2}
            fill='url(#assetGrad)'
            dot={false}
            activeDot={{ r: 4, fill: '#60a5fa', stroke: '#0a0e1a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
