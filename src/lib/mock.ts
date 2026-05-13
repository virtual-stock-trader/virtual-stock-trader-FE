export type Transaction = {
  id: number;
  date: string;
  code: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
};

export const ALL_TRANSACTIONS: Transaction[] = [
  { id: 1,  date: '2026-05-07', code: '035720', name: '카카오',    type: 'buy',  quantity: 5,  price: 41_000 },
  { id: 2,  date: '2026-05-05', code: '005930', name: '삼성전자',  type: 'buy',  quantity: 10, price: 68_000 },
  { id: 3,  date: '2026-04-28', code: '207940', name: '삼성바이오',type: 'sell', quantity: 2,  price: 890_000 },
  { id: 4,  date: '2026-04-20', code: '207940', name: '삼성바이오',type: 'buy',  quantity: 2,  price: 850_000 },
  { id: 5,  date: '2026-04-15', code: '035420', name: 'NAVER',     type: 'sell', quantity: 3,  price: 182_000 },
  { id: 6,  date: '2026-04-10', code: '035420', name: 'NAVER',     type: 'buy',  quantity: 3,  price: 175_000 },
  { id: 7,  date: '2026-04-05', code: '000660', name: 'SK하이닉스',type: 'sell', quantity: 5,  price: 138_000 },
  { id: 8,  date: '2026-03-28', code: '000660', name: 'SK하이닉스',type: 'buy',  quantity: 5,  price: 125_000 },
  { id: 9,  date: '2026-03-20', code: '005930', name: '삼성전자',  type: 'buy',  quantity: 5,  price: 64_000 },
  { id: 10, date: '2026-03-15', code: '051910', name: 'LG화학',    type: 'sell', quantity: 2,  price: 320_000 },
  { id: 11, date: '2026-03-10', code: '005380', name: '현대차',    type: 'buy',  quantity: 3,  price: 205_000 },
  { id: 12, date: '2026-03-05', code: '005380', name: '현대차',    type: 'sell', quantity: 3,  price: 218_000 },
  { id: 13, date: '2026-02-25', code: '051910', name: 'LG화학',    type: 'buy',  quantity: 2,  price: 295_000 },
  { id: 14, date: '2026-02-18', code: '035720', name: '카카오',    type: 'sell', quantity: 3,  price: 46_000 },
  { id: 15, date: '2026-02-10', code: '035720', name: '카카오',    type: 'buy',  quantity: 8,  price: 38_000 },
];
