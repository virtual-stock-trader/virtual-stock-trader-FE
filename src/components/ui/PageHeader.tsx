import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

type Props = {
  title: string;
  /** 종목 코드 등 제목 옆 뱃지 */
  badge?: string;
};

export default function PageHeader({ title, badge }: Props) {
  const navigate = useNavigate();
  return (
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={() => navigate(-1)}
        className='text-gray-400 hover:text-white transition-colors cursor-pointer -ml-1'
        aria-label='뒤로가기'
      >
        <FiChevronLeft size={20} strokeWidth={2.5} />
      </button>
      <div className='flex items-center gap-2'>
        <h1 className='text-white font-bold text-lg'>{title}</h1>
        {badge && (
          <span className='text-gray-500 text-xs bg-white/5 border border-white/10 rounded px-1.5 py-0.5'>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
