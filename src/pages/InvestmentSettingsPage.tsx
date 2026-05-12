import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import Navbar from '../components/ui/Navbar';
import PageHeader from '../components/ui/PageHeader';
import InvestmentSlider from '../components/ui/InvestmentSlider';
import { useInvestmentStore } from '../store/investmentStore';
import { fmtPrice } from '../lib/utils';

export default function InvestmentSettingsPage() {
  const navigate = useNavigate();
  const { initialAmount, setInitialAmount } = useInvestmentStore();

  const [draft, setDraft] = useState(initialAmount);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setInitialAmount(draft);
    setSaved(true);
    /* 저장 후 잠시 대기 뒤 이전 페이지로 이동 */
    setTimeout(() => navigate(-1), 800);
  };

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6'>

        <PageHeader title='투자금 설정' />

        {/* 현재 적용 중인 투자금 */}
        <div className='bg-white/5 border border-white/10 rounded-2xl px-5 py-4'>
          <p className='text-gray-500 text-xs font-medium'>현재 적용 중인 초기 투자금</p>
          <p className='text-white text-xl font-bold mt-1.5 tabular-nums'>
            {fmtPrice(initialAmount)}원
          </p>
        </div>

        {/* 설정 패널 */}
        <div className='bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-6'>
          <div className='text-center'>
            <p className='text-gray-500 text-xs mb-1'>설정할 금액</p>
            <p className='text-white text-4xl font-bold tabular-nums tracking-tight'>
              {fmtPrice(draft)}
              <span className='text-xl text-gray-400 font-medium ml-1'>원</span>
            </p>
          </div>

          <InvestmentSlider
            value={draft}
            onChange={(v) => { setDraft(v); setSaved(false); }}
            showPresetLabel
          />
        </div>

        {/* 주의 문구 */}
        <p className='text-gray-600 text-xs text-center leading-relaxed'>
          투자금을 변경하면 현재 포트폴리오가 초기화됩니다.
          <br />최대 투자금은 1억원입니다.
        </p>

        {/* 저장 버튼 */}
        <button
          type='button'
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
              <FiCheck size={18} strokeWidth={2.5} />
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
