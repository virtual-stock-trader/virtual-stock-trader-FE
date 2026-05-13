type Props = {
  size?: number;
};

export default function ChartIcon({ size = 28 }: Props) {
  return (
    <svg width={size} height={size} viewBox='0 0 28 28' fill='none' aria-hidden='true'>
      <polyline
        points='2,22 8,13 13,17 19,7 26,11'
        stroke='white'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
