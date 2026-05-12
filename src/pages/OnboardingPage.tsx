import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestmentStore } from '../store/investmentStore';

const MIN = 1_000_000;
const MAX = 100_000_000;
const STEP = 1_000_000;

const PRESETS = [
  { label: '1천만', value: 10_000_000 },
  { label: '3천만', value: 30_000_000 },
  { label: '5천만', value: 50_000_000 },
  { label: '1억', value: 100_000_000 },
];

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

function fmtShort(n: number) {
  if (n >= 100_000_000) return '1억원';
  if (n % 10_000_000 === 0) return `${n / 10_000_000}천만원`;
  if (n % 1_000_000 === 0) return `${n / 1_000_000}백만원`;
  return `${fmtPrice(n)}원`;
}

function ChartIcon() {
  return (
    <svg
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
      aria-hidden='true'
    >
      <polyline
        points='2,22 8,13 13,17 19,7 26,11'
        stroke='white'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useInvestmentStore();
  const [amount, setAmount] = useState(10_000_000);

  const pct = ((amount - MIN) / (MAX - MIN)) * 100;

  const handleStart = () => {
    completeOnboarding(amount);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className='min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm flex flex-col gap-8'>
        {/* 브랜드 */}
        <div className='flex flex-col items-center gap-3'>
          <div className='w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30'>
            <ChartIcon />
          </div>
          <div className='text-center'>
            <h1 className='text-white text-xl font-bold'>
              시작 투자금을 설정해주세요
            </h1>
            <p className='text-gray-400 text-sm mt-1'>
              가상 투자를 시작할 금액을 선택하세요
            </p>
          </div>
        </div>

        {/* 금액 표시 */}
        <div className='text-center'>
          <p className='text-white text-4xl font-bold tabular-nums tracking-tight'>
            {fmtPrice(amount)}
            <span className='text-xl text-gray-400 font-medium ml-1'>원</span>
          </p>
          <p className='text-gray-500 text-sm mt-1'>{fmtShort(amount)}</p>
        </div>

        {/* 슬라이더 */}
        <div className='flex flex-col gap-2'>
          <div className='relative'>
            <div className='absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-white/10 overflow-hidden pointer-events-none'>
              <div
                className='h-full bg-blue-500 rounded-full transition-all'
                style={{ width: `${pct}%` }}
              />
            </div>
            <input
              type='range'
              min={MIN}
              max={MAX}
              step={STEP}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className='relative w-full appearance-none bg-transparent cursor-pointer py-2
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-blue-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-blue-500
                [&::-moz-range-thumb]:cursor-pointer
                [&::-webkit-slider-runnable-track]:h-1.5
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-runnable-track]:bg-transparent
                [&::-moz-range-track]:h-1.5
                [&::-moz-range-track]:rounded-full
                [&::-moz-range-track]:bg-transparent'
            />
          </div>
          <div className='flex justify-between text-gray-600 text-xs tabular-nums'>
            <span>100만원</span>
            <span>1억원</span>
          </div>
        </div>

        {/* 빠른 선택 */}
        <div className='grid grid-cols-4 gap-2'>
          {PRESETS.map(({ label, value }) => (
            <button
              key={label}
              type='button'
              onClick={() => setAmount(value)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                amount === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 시작 버튼 */}
        <button
          type='button'
          onClick={handleStart}
          className='w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-bold text-white text-sm transition-colors cursor-pointer'
        >
          {fmtShort(amount)}으로 시작하기
        </button>

        <p className='text-gray-600 text-xs text-center'>
          최대 1억원까지 설정할 수 있습니다
          <br />
          설정한 금액은 가상의 투자금이며, 실제 돈이 아닙니다
        </p>
      </div>
    </div>
  );
}
