import { Link } from 'react-router-dom';

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
        <button
          type='button'
          aria-label='사용자 메뉴'
          className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors cursor-pointer'
        >
          <UserIcon />
        </button>
      </div>
    </header>
  );
}
