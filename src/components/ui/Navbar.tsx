import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LogoIcon() {
  return (
    <svg
      width='18'
      height='18'
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

function UserIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='8' r='4' />
      <path d='M4 20c0-4 3.6-7 8-7s8 3 8 7' />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
      <polyline points='16 17 21 12 16 7' />
      <line x1='21' y1='12' x2='9' y2='12' />
    </svg>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* 외부 클릭 시 닫기 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    navigate('/login');
  };

  return (
    <div ref={ref} className='relative'>
      {/* 사용자 아이콘 버튼 */}
      <button
        type='button'
        aria-label='사용자 메뉴'
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
          open
            ? 'bg-white/20 text-white'
            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
        }`}
      >
        <UserIcon />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className='absolute right-0 top-full mt-2 w-44 bg-[#151b2d] border border-white/10 rounded-xl py-1 shadow-xl z-50'>
          <Link
            to='/settings/investment'
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-gray-300 text-sm hover:bg-white/5 hover:text-white transition-colors no-underline'
          >
            <SettingsIcon />
            투자금 설정
          </Link>
          <div className='mx-3 my-1 border-t border-white/10' />
          <button
            type='button'
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 text-sm hover:bg-white/5 hover:text-red-400 transition-colors cursor-pointer'
          >
            <LogoutIcon />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10'>
      <div className='w-full max-w-5xl mx-auto px-4 h-14 flex items-center justify-between'>
        <Link to='/dashboard' className='flex items-center gap-2 no-underline'>
          <div className='w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center'>
            <LogoIcon />
          </div>
          <span className='text-white font-semibold text-sm tracking-tight'>
            가상 주식 트레이더
          </span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
