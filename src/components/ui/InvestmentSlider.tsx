const MIN = 1_000_000;
const MAX = 100_000_000;
const STEP = 1_000_000;

const PRESETS = [
  { label: '1천만', value: 10_000_000 },
  { label: '3천만', value: 30_000_000 },
  { label: '5천만', value: 50_000_000 },
  { label: '1억', value: 100_000_000 },
];

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** 빠른 선택 섹션 위에 라벨 표시 여부 */
  showPresetLabel?: boolean;
};

export default function InvestmentSlider({ value, onChange, showPresetLabel }: Props) {
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <>
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
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
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
      <div className='flex flex-col gap-2'>
        {showPresetLabel && (
          <p className='text-gray-500 text-xs font-medium'>빠른 선택</p>
        )}
        <div className='grid grid-cols-4 gap-2'>
          {PRESETS.map(({ label, value: presetValue }) => (
            <button
              key={label}
              type='button'
              onClick={() => onChange(presetValue)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                value === presetValue
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
