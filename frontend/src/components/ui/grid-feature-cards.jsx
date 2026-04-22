import React from 'react';
import { cn } from '@/lib/utils';

function genRandomPattern(length = 5) {
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}

function GridPattern({ width, height, x, y, squares, ...props }) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${patternId})`} />
      {squares ? (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([squareX, squareY], index) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={squareX * width}
              y={squareY * height}
            />
          ))}
        </svg>
      ) : null}
    </svg>
  );
}

export function FeatureCard({ feature, className, ...props }) {
  const pattern = React.useMemo(() => genRandomPattern(), []);
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden p-6 transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[0_18px_60px_rgba(56,189,248,0.08)]',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={pattern}
            className="absolute inset-0 h-full w-full fill-foreground/5 stroke-foreground/25 mix-blend-overlay"
          />
        </div>
      </div>

      <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
        <Icon className="size-6 text-foreground/80" strokeWidth={1.2} aria-hidden />
      </div>

      <h3 className="relative z-10 mt-10 text-sm font-semibold tracking-wide text-white md:text-base">
        {feature.title}
      </h3>
      <p className="text-muted-foreground relative z-10 mt-2 max-w-xs text-xs font-light leading-6">
        {feature.description}
      </p>
    </div>
  );
}
