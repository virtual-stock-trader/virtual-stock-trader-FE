export function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

export function fmtRate(n: number) {
  return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
}

export function rateColor(n: number) {
  if (n > 0) return 'text-red-400';
  if (n < 0) return 'text-blue-400';
  return 'text-gray-400';
}

export function rateBadgeColor(n: number) {
  if (n > 0) return 'bg-red-500/15 text-red-400';
  if (n < 0) return 'bg-blue-500/15 text-blue-400';
  return 'bg-white/10 text-gray-400';
}

export function fmtShort(n: number) {
  if (n >= 100_000_000) return '1억원';
  if (n >= 10_000_000) return `${n / 10_000_000}천만원`;
  if (n >= 1_000_000) return `${n / 1_000_000}백만원`;
  return `${fmtPrice(n)}원`;
}

export function fmtVol(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}
