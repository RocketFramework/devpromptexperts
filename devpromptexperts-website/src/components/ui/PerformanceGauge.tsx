// components/ui/PerformanceGauge.tsx
export function PerformanceGauge({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }[size];

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClass} relative`}>
        {/* Simplified gauge - replace with actual SVG gauge if needed */}
        <div className="w-full h-full rounded-full border-8 border-slate-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{Math.round(value)}%</span>
        </div>
      </div>
    </div>
  );
}