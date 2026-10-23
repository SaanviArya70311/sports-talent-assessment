import React from 'react';
import { BenchmarkData } from '../../types';

interface BenchmarkBarChartProps {
  benchmark: BenchmarkData;
  rawValue: number;
  unit: string;
  direction: 'lower_is_better' | 'higher_is_better';
  athleteName?: string;
}

export const BenchmarkBarChart: React.FC<BenchmarkBarChartProps> = ({
  benchmark,
  rawValue,
  unit,
  direction,
  athleteName = 'You'
}) => {
  // Percentile landmarks: 10th, 25th, 50th (median), 75th, 90th, 99th
  const percentiles = [
    { label: '10th', val: benchmark.p10 },
    { label: '25th', val: benchmark.p25 },
    { label: '50th (Median)', val: benchmark.p50 },
    { label: '75th', val: benchmark.p75 },
    { label: '90th', val: benchmark.p90 },
    { label: '99th (Elite)', val: benchmark.p99 }
  ];

  // Compute position percentage on bar [0% to 100%]
  // If higher_is_better: min is benchmark.p10 * 0.8, max is benchmark.p99 * 1.15
  // If lower_is_better: min is benchmark.p10 * 1.15, max is benchmark.p99 * 0.85
  const getPositionPercent = (val: number): number => {
    if (direction === 'higher_is_better') {
      const min = benchmark.p10 * 0.75;
      const max = benchmark.p99 * 1.1;
      const pct = ((val - min) / (max - min)) * 100;
      return Math.max(2, Math.min(98, pct));
    } else {
      // Lower is better (e.g. 4.4s is to the far right, 6.0s is to the left)
      const worst = benchmark.p10 * 1.15;
      const best = benchmark.p99 * 0.9;
      const pct = ((worst - val) / (worst - best)) * 100;
      return Math.max(2, Math.min(98, pct));
    }
  };

  const athletePos = getPositionPercent(rawValue);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Cohort Benchmark Distribution
          </span>
          <h4 className="text-sm font-semibold text-white">
            {benchmark.sport} · {benchmark.ageGroup} Population Norms
          </h4>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Sample Size: <span className="text-slate-200 font-semibold">{benchmark.sampleSize.toLocaleString()}</span> athletes
        </div>
      </div>

      {/* Distribution visualizer container */}
      <div className="relative pt-8 pb-10 px-2">
        {/* Graded Track Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="w-[25%] bg-slate-700/80" title="10th - 25th percentile" />
          <div className="w-[25%] bg-cyan-900/60" title="25th - 50th percentile" />
          <div className="w-[25%] bg-cyan-700/70" title="50th - 75th percentile" />
          <div className="w-[15%] bg-emerald-600/70" title="75th - 90th percentile" />
          <div className="w-[10%] bg-emerald-400" title="90th - 99th elite percentile" />
        </div>

        {/* Milestone Tick Marks */}
        {percentiles.map((p, idx) => {
          const pos = getPositionPercent(p.val);
          return (
            <div
              key={idx}
              className="absolute top-11 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${pos}%` }}
            >
              <div className="w-0.5 h-2 bg-slate-600" />
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                {p.val} {unit}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {p.label}
              </span>
            </div>
          );
        })}

        {/* Athlete Marker Pin */}
        <div
          className="absolute top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-10"
          style={{ left: `${athletePos}%` }}
        >
          <div className="bg-cyan-500 text-slate-950 font-bold text-[11px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1 font-mono">
            <span>{athleteName}:</span>
            <span>{rawValue} {unit}</span>
          </div>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-cyan-500" />
        </div>
      </div>

      {/* Benchmark Transparency Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <span className="font-semibold text-slate-300">Study Source:</span> {benchmark.sourceCitation}
        </div>
        <div className="italic text-slate-400">
          * Protocol: {benchmark.limitationsNote}
        </div>
      </div>
    </div>
  );
};
