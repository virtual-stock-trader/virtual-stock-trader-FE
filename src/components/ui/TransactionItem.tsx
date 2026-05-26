import type { Transaction } from '../../types/api'
import { fmtPrice } from '../../lib/utils'

type Props = {
  tx: Transaction
  onClick: (code: string) => void
}

export default function TransactionItem({ tx, onClick }: Props) {
  const total = tx.total ?? tx.price * tx.quantity
  const isBuy = tx.type === 'buy'

  return (
    <div
      className='flex items-center px-4 py-3.5 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors'
      onClick={() => onClick(tx.code)}
    >
      <span
        className={`text-xs font-bold px-2 py-1 rounded-lg mr-3 shrink-0 ${
          isBuy ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'
        }`}
      >
        {isBuy ? '매수' : '매도'}
      </span>

      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-medium truncate'>{tx.name}</p>
        <p className='text-gray-500 text-xs mt-0.5'>{tx.date}</p>
      </div>

      <div className='text-right shrink-0'>
        <p className='text-white text-sm font-semibold tabular-nums'>
          {fmtPrice(total)}원
        </p>
        <p className='text-gray-500 text-xs tabular-nums mt-0.5'>
          {tx.quantity}주 × {fmtPrice(tx.price)}
        </p>
      </div>
    </div>
  )
}
