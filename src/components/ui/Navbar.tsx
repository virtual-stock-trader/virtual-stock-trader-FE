import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import ChartIcon from './ChartIcon';

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
        <FiUser size={16} />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className='absolute right-0 top-full mt-2 w-44 bg-[#151b2d] border border-white/10 rounded-xl py-1 shadow-xl z-50'>
          <Link
            to='/settings/investment'
            onClick={() => setOpen(false)}
            className='flex items-center gap-3 px-4 py-2.5 text-gray-300 text-sm hover:bg-white/5 hover:text-white transition-colors no-underline'
          >
            <FiSettings size={15} />
            투자금 설정
          </Link>
          <div className='mx-3 my-1 border-t border-white/10' />
          <button
            type='button'
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 text-sm hover:bg-white/5 hover:text-red-400 transition-colors cursor-pointer'
          >
            <FiLogOut size={15} />
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
            <ChartIcon size={18} />
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
