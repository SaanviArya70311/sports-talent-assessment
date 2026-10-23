import React, { useState } from 'react';
import { AssessmentAttempt } from '../../types';

interface ProgressTrendChartProps {
  attempts: AssessmentAttempt[];
  assessmentName: string;
  unit: string;
}

export const ProgressTrendChart: React.FC<ProgressTrendChartProps> = ({
  attempts,
  assessmentName,
  unit
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<AssessmentAttempt | null>(null);

  // Sort chronological
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
        <p className="text-slate-400 text-sm">No recorded attempts yet for {assessmentName}.</p>
      </div>
    );
  }

  const width = 540;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  // Compute min/max scores for scaling
  const scores = sorted.map(a => a.normalizedScore);
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const maxScore = Math.min(100, Math.max(...scores) + 10);
  const scoreRange = maxScore - minScore || 1;

  const getCoordinates = (index: number, score: number) => {
    const x =
      sorted.length === 1
        ? width / 2
        : paddingX + (index / (sorted.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((score - minScore) / scoreRange) * (height - 2 * paddingY);
    return { x, y };
  };

  const pointsString = sorted
    .map((attempt, i) => {
      const { x, y } = getCoordinates(i, attempt.normalizedScore);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            Performance Progression
          </span>
          <h4 className="text-sm font-semibold text-white">{assessmentName}</h4>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {sorted.length} recorded {sorted.length === 1 ? 'attempt' : 'attempts'}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Horizontal Grid lines */}
          {[20, 50, 80, 100].map(val => {
            if (val < minScore || val > maxScore) return null;
            const y = height - paddingY - ((val - minScore) / scoreRange) * (height - 2 * paddingY);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="3,3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {sorted.length > 1 && (
            <polygon
              points={`${paddingX},${height - paddingY} ${pointsString} ${
                width - paddingX
              },${height - paddingY}`}
              fill="rgba(14, 165, 233, 0.08)"
            />
          )}

          {/* Sparkline Path */}
          {sorted.length > 1 && (
            <polyline
              points={pointsString}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {sorted.map((attempt, i) => {
            const { x, y } = getCoordinates(i, attempt.normalizedScore);
            const isHovered = hoveredPoint?.id === attempt.id;
            const isVerified = attempt.verificationStatus === 'coach_verified';

            return (
              <g
                key={attempt.id}
                onMouseEnter={() => setHoveredPoint(attempt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 5}
                  fill={isVerified ? '#10B981' : '#0EA5E9'}
                  stroke="#080C14"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* Date label at bottom */}
                <text
                  x={x}
                  y={height - paddingY + 18}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  {attempt.date.substring(5)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-slate-950 border border-cyan-500/40 p-2.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none z-10">
            <div className="text-slate-400 text-[10px]">Date: {hoveredPoint.date}</div>
            <div className="text-white font-bold text-sm">
              Raw: {hoveredPoint.rawValue} {unit}
            </div>
            <div className="text-cyan-400">
              Normalized Score: {hoveredPoint.normalizedScore} pts
            </div>
            <div className="text-[10px] mt-1 text-slate-400 capitalize">
              Status: <span className={hoveredPoint.verificationStatus === 'coach_verified' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                {hoveredPoint.verificationStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
