import { useNavigate } from 'react-router-dom';
import { useInvestmentStore } from '../store/investmentStore';
import ChartIcon from '../components/ui/ChartIcon';

function KakaoIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path d='M10 2C5.582 2 2 4.925 2 8.5c0 2.274 1.453 4.27 3.64 5.412L4.8 17.5l3.89-2.565C9.188 15.012 9.59 15.03 10 15.03c4.418 0 8-2.925 8-6.53C18 4.925 14.418 2 10 2z' />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { isOnboarded } = useInvestmentStore();

  const handleKakaoLogin = () => {
    /* 백엔드 OAuth 연동 전: 클라이언트 사이드 분기 처리
       OAuth 연동 후에는 콜백 URL에서 동일한 분기 적용 필요 */
    if (isOnboarded) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className='min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4'>
      <div className='w-full max-w-sm flex flex-col items-center gap-8'>

        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30'>
            <ChartIcon />
          </div>
          <div className='flex flex-col items-center gap-1'>
            <h1 className='text-white text-2xl font-bold tracking-tight'>가상 주식 트레이더</h1>
            <p className='text-gray-400 text-sm'>실전 같은 모의 투자를 경험하세요</p>
          </div>
        </div>

        <div className='w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5'>
          <p className='text-white/70 text-sm text-center leading-relaxed'>
            가입 없이 카카오 계정으로
            <br />
            바로 시작할 수 있어요
          </p>
          <button
            type='button'
            onClick={handleKakaoLogin}
            aria-label='카카오 계정으로 로그인'
            className='w-full flex items-center justify-center gap-2.5 bg-[#FEE500] hover:bg-[#F5DC00] active:bg-[#EDD000] text-[#191919] font-semibold py-3.5 rounded-xl transition-colors cursor-pointer'
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>
        </div>

        <p className='text-gray-600 text-xs text-center leading-relaxed'>
          로그인 시 서비스 이용약관 및
          <br />개인정보처리방침에 동의하게 됩니다
        </p>

      </div>
    </div>
  );
}
