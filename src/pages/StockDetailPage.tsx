import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import PageHeader from '../components/ui/PageHeader';
import CandlestickChart from '../components/stockDetail/CandlestickChart';
import HoldingInfo from '../components/stockDetail/HoldingInfo';
import TradePanel from '../components/stockDetail/TradePanel';
import { fmtPrice, fmtRate, fmtVol, rateColor } from '../lib/utils';

type Period = '1D' | '1W' | '1M' | '3M';

type StockInfo = {
  code: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
};

type HoldingInfo = {
  quantity: number;
  averagePrice: number;
};

const STOCK_DB: Record<string, StockInfo> = {
  '005930': { code: '005930', name: '삼성전자', currentPrice: 70500, changeRate: 2.17, openPrice: 69000, highPrice: 71200, lowPrice: 68500, volume: 12_345_678 },
  '000660': { code: '000660', name: 'SK하이닉스', currentPrice: 130000, changeRate: -1.52, openPrice: 132000, highPrice: 133200, lowPrice: 129000, volume: 3_456_789 },
  '035420': { code: '035420', name: 'NAVER', currentPrice: 188500, changeRate: 1.89, openPrice: 185000, highPrice: 190000, lowPrice: 184500, volume: 876_543 },
  '051910': { code: '051910', name: 'LG화학', currentPrice: 307000, changeRate: -0.97, openPrice: 310000, highPrice: 311000, lowPrice: 305000, volume: 234_567 },
  '035720': { code: '035720', name: '카카오', currentPrice: 43200, changeRate: 2.86, openPrice: 42000, highPrice: 43800, lowPrice: 41800, volume: 5_678_901 },
  '207940': { code: '207940', name: '삼성바이오', currentPrice: 882000, changeRate: -0.9, openPrice: 890000, highPrice: 895000, lowPrice: 879000, volume: 123_456 },
};

const HOLDING_DB: Record<string, HoldingInfo> = {
  '005930': { quantity: 10, averagePrice: 68000 },
  '035720': { quantity: 5, averagePrice: 41000 },
};

const CASH = 10_000_000;

export default function StockDetailPage() {
  const { code } = useParams<{ code: string }>();

  const [period, setPeriod] = useState<Period>('1M');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);

  const stock = code ? STOCK_DB[code] : null;
  const holding = code ? HOLDING_DB[code] : null;

  if (!stock) {
    return (
      <div className='min-h-screen bg-[#0a0e1a]'>
        <Navbar />
        <div className='flex items-center justify-center h-64 text-gray-500 text-sm'>
          종목을 찾을 수 없습니다
        </div>
      </div>
    );
  }

  const change = stock.currentPrice - stock.openPrice;

  return (
    <div className='min-h-screen bg-[#0a0e1a]'>
      <Navbar />
      <main className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 pb-12'>

        <PageHeader title={stock.name} badge={stock.code} />

        {/* 현재가 */}
        <div className='flex flex-col gap-1'>
          <p className='text-white text-3xl font-bold tabular-nums'>
            {fmtPrice(stock.currentPrice)}원
          </p>
          <p className='text-sm tabular-nums'>
            <span className={rateColor(stock.changeRate)}>{fmtRate(stock.changeRate)}</span>
            <span className='text-gray-500'>
              &ensp;{change > 0 ? '+' : ''}{fmtPrice(change)}원
            </span>
          </p>
        </div>

        {/* 종목 정보 그리드 */}
        <div className='grid grid-cols-4 gap-2'>
          {[
            { label: '시가', value: fmtPrice(stock.openPrice) },
            { label: '고가', value: fmtPrice(stock.highPrice) },
            { label: '저가', value: fmtPrice(stock.lowPrice) },
            { label: '거래량', value: fmtVol(stock.volume) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className='bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center'
            >
              <p className='text-gray-500 text-xs'>{label}</p>
              <p className='text-white text-sm font-medium tabular-nums mt-0.5'>{value}</p>
            </div>
          ))}
        </div>

        <CandlestickChart
          code={stock.code}
          basePrice={stock.currentPrice}
          period={period}
          onPeriodChange={setPeriod}
        />

        {holding && (
          <HoldingInfo
            quantity={holding.quantity}
            averagePrice={holding.averagePrice}
            currentPrice={stock.currentPrice}
          />
        )}

        <TradePanel
          stockName={stock.name}
          currentPrice={stock.currentPrice}
          cash={CASH}
          holdingQty={holding?.quantity ?? 0}
          tradeTab={tradeTab}
          quantity={quantity}
          onTabChange={setTradeTab}
          onQuantityChange={setQuantity}
        />

      </main>
    </div>
  );
}
