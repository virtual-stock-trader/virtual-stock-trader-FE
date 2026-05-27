import { useState, useEffect } from 'react'

function checkMarketOpen(): boolean {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)

  const day = kst.getUTCDay() // 0=일, 6=토
  if (day === 0 || day === 6) return false

  const totalMinutes = kst.getUTCHours() * 60 + kst.getUTCMinutes()
  return totalMinutes >= 9 * 60 && totalMinutes < 15 * 60 + 30
}

export function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(checkMarketOpen)

  useEffect(() => {
    const id = setInterval(() => setIsOpen(checkMarketOpen()), 60_000)
    return () => clearInterval(id)
  }, [])

  return { isOpen }
}
