import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useInvestmentStore } from '../store/investmentStore';

const MIN = 1_000_000;    // 100만
const MAX = 100_000_000;  // 1억
const STEP = 1_000_000;   // 100만 단위

const PRESETS = [
  { label: '1천만', value: 10_000_000 },
  { label: '3천만', value: 30_000_000 },
  { label: '5천만', value: 50_000_000 },
  { label: '1억',   value: 100_000_000 },
];

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

function fmtShort(n: number) {
  if (n >= 100_000_000) return '1억원';
  if (n >= 10_000_000) return `${n / 10_000_000}천만원`;
  if (n >= 1_000_000) return `${n / 1_000_000}백만원`;
  return `${fmtPrice(n)}원`;
}

function BackIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function InvestmentSettingsPage() {
  const navigate = useNavigate();
  const { initialAmount, setInitialAmount } = useInvestmentStore();

  const [draft, setDraft] = useState(initialAmount);
  const [saved, setSaved] = useState(false);

  const pct = ((draft - MIN) / (MAX - MIN)) * 100;

  const handleSave = () => {
    setInitialAmount(draft);
    setSaved(true);
    /* 저장 후 잠시 대기 뒤 이전 페이지로 이동 */
    setTimeout(() => navigate(-1), 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer -ml-1"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
          <h1 className="text-white font-bold text-lg">투자금 설정</h1>
        </div>

        {/* 현재 적용 중인 투자금 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
          <p className="text-gray-500 text-xs font-medium">현재 적용 중인 초기 투자금</p>
          <p className="text-white text-xl font-bold mt-1.5 tabular-nums">
            {fmtPrice(initialAmount)}원
          </p>
        </div>

        {/* 설정 패널 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-6">

          {/* 선택 금액 표시 */}
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-1">설정할 금액</p>
            <p className="text-white text-4xl font-bold tabular-nums tracking-tight">
              {fmtPrice(draft)}
              <span className="text-xl text-gray-400 font-medium ml-1">원</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">{fmtShort(draft)}</p>
          </div>

          {/* 슬라이더 */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              {/* 슬라이더 트랙 배경 */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-white/10 overflow-hidden pointer-events-none">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={draft}
                onChange={(e) => { setDraft(Number(e.target.value)); setSaved(false); }}
                className="relative w-full appearance-none bg-transparent cursor-pointer
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
                  [&::-moz-range-track]:bg-transparent
                  py-2"
              />
            </div>
            <div className="flex justify-between text-gray-600 text-xs tabular-nums">
              <span>100만원</span>
              <span>1억원</span>
            </div>
          </div>

          {/* 빠른 선택 */}
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-xs font-medium">빠른 선택</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setDraft(value); setSaved(false); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    draft === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 주의 문구 */}
        <p className="text-gray-600 text-xs text-center leading-relaxed">
          투자금을 변경하면 현재 포트폴리오가 초기화됩니다.
          <br />최대 투자금은 1억원입니다.
        </p>

        {/* 저장 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
        >
          {saved ? (
            <>
              <CheckIcon />
              저장되었습니다
            </>
          ) : (
            '저장하기'
          )}
        </button>

      </main>
    </div>
  );
}
