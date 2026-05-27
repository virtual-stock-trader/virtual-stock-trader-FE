import { apiFetch } from './client'
import type { Stock, StockDetail, Candle } from '../../types/api'

export function getStocks(market?: string) {
  const qs = market ? `?market=${market}` : ''
  return apiFetch<Stock[]>(`/stocks${qs}`)
}

export function getStockDetail(code: string) {
  return apiFetch<StockDetail>(`/stocks/${code}`)
}

export function getCandles(code: string, period: string) {
  return apiFetch<Candle[]>(`/stocks/${code}/candles?period=${period}`)
}
