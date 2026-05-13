import { NavLink } from 'react-router-dom';
import { FiHome, FiBarChart2, FiBriefcase } from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/dashboard',  label: '홈',       Icon: FiHome },
  { to: '/stocks',     label: '종목',      Icon: FiBarChart2 },
  { to: '/portfolio',  label: '포트폴리오', Icon: FiBriefcase },
] as const;

export default function BottomNav() {
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-md border-t border-white/10'>
      <div className='w-full max-w-5xl mx-auto h-16 flex items-center'>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <Icon size={22} />
            <span className='text-xs font-medium'>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
