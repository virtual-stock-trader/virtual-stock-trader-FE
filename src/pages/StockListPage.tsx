import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/ui/Navbar'
import BottomNav from '../components/ui/BottomNav'
import PageHeader from '../components/ui/PageHeader'
import StockRow from '../components/stockList/StockRow'
import { getStocks } from '../lib/api/stocks'
import { getFavorites, addFavorite, removeFavorite } from '../lib/api/favorites'

type Tab = '전체' | '즐겨찾기'

export default function StockListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('전체')

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getStocks(),
  })

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  })

  const favoriteCodes = useMemo(() => new Set(favorites.map((f) => f.code)), [favorites])

  const toggleFavMutation = useMutation({
    mutationFn: (code: string) =>
      favoriteCodes.has(code) ? removeFavorite(code) : addFavorite(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stocks.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.code.includes(q)
      const matchesTab = tab === '전체' || favoriteCodes.has(s.code)
      return matchesQuery && matchesTab
    })
  }, [query, tab, stocks, favoriteCodes])

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5 pb-24'>

        <PageHeader title='종목 전체' />

        <div className='relative'>
          <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>
            <FiSearch size={16} />
          </span>
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='종목명 또는 코드 검색'
            className='w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/60 transition-colors'
          />
        </div>

        <div className='flex gap-1 bg-white/5 rounded-xl p-1'>
          {(['전체', '즐겨찾기'] as Tab[]).map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
              {t === '즐겨찾기' && favoriteCodes.size > 0 && (
                <span className='ml-1.5 text-xs text-yellow-400'>{favoriteCodes.size}</span>
              )}
            </button>
          ))}
        </div>

        <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
          {filtered.length > 0 ? (
            filtered.map((stock) => (
              <StockRow
                key={stock.code}
                stock={stock}
                isFavorite={favoriteCodes.has(stock.code)}
                onToggleFavorite={(code) => toggleFavMutation.mutate(code)}
                onSelect={(code) => navigate(`/stock/${code}`)}
              />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-16 gap-2'>
              <p className='text-gray-500 text-sm'>
                {tab === '즐겨찾기' ? '즐겨찾기한 종목이 없습니다' : '검색 결과가 없습니다'}
              </p>
              {tab === '즐겨찾기' && (
                <p className='text-gray-600 text-xs'>★ 버튼으로 즐겨찾기를 추가하세요</p>
              )}
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className='text-gray-600 text-xs text-center'>{filtered.length}개 종목</p>
        )}

      </main>
      <BottomNav />
    </div>
  )
}
