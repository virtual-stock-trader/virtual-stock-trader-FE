export type UserProfile = {
  id: string
  isOnboarded: boolean
  initialAmount: number
  cash: number
}

export type MarketIndex = {
  name: string
  value: number
  change: number
  changeRate: number
}

export type Stock = {
  code: string
  name: string
  market: string
}

export type StockDetail = {
  code: string
  name: string
  market: string
  currentPrice: number
  changeRate: number
  openPrice: number
  highPrice: number
  lowPrice: number
  volume: number
}

export type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export type Holding = {
  code: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
}

export type AllocationItem = {
  name: string
  value: number
}

export type Portfolio = {
  totalAssets: number
  cash: number
  stockValue: number
  dailyReturnRate: number
  dailyReturnAmt: number
  holdings: Holding[]
  allocation: AllocationItem[]
}

export type AssetPoint = {
  date: string
  value: number
}

export type Transaction = {
  id: string
  code: string
  name: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  total?: number
  date: string
}

export type Favorite = {
  code: string
  name: string
}

export type ApiError = {
  error: {
    code: string
    message: string
  }
}
