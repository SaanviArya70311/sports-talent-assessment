import React, { useState } from 'react';
import { AssessmentCategory } from '../../types';

interface AthleticRadarChartProps {
  categoryScores: Record<AssessmentCategory, number>;
  compareScores?: Record<AssessmentCategory, number>;
  compareLabel?: string;
  athleteName?: string;
}

const CATEGORIES: { key: AssessmentCategory; label: string }[] = [
  { key: 'speed', label: 'Speed' },
  { key: 'power', label: 'Power' },
  { key: 'strength', label: 'Strength' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'agility', label: 'Agility' }
];

export const AthleticRadarChart: React.FC<AthleticRadarChartProps> = ({
  categoryScores,
  compareScores,
  compareLabel = 'Benchmark Average',
  athleteName = 'Athlete Score'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const totalSides = CATEGORIES.length;
  const angleStep = (Math.PI * 2) / totalSides;
  const startAngle = -Math.PI / 2; // Start from top

  // Helper to compute coordinate for a given index and score (0-100)
  const getCoordinates = (index: number, score: number) => {
    const angle = startAngle + index * angleStep;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Build grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [20, 40, 60, 80, 100];

  // Polygon points for primary athlete
  const athletePoints = CATEGORIES.map((cat, i) => {
    const val = categoryScores[cat.key] || 0;
    const { x, y } = getCoordinates(i, Math.max(10, val));
    return `${x},${y}`;
  }).join(' ');

  // Polygon points for comparison dataset if provided
  const comparePoints = compareScores
    ? CATEGORIES.map((cat, i) => {
        const val = compareScores[cat.key] || 0;
        const { x, y } = getCoordinates(i, Math.max(10, val));
        return `${x},${y}`;
      }).join(' ')
    : null;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Polygon Rings */}
          {rings.map((ringVal) => {
            const ringPoints = CATEGORIES.map((_, i) => {
              const { x, y } = getCoordinates(i, ringVal);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={ringVal}
                points={ringPoints}
                fill="none"
                stroke="#1E293B"
                strokeWidth={ringVal === 100 ? '1.5' : '1'}
                strokeDasharray={ringVal === 100 ? undefined : '2,2'}
              />
            );
          })}

          {/* Radial Axis Lines */}
          {CATEGORIES.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}

          {/* Comparison Polygon if exists */}
          {comparePoints && (
            <polygon
              points={comparePoints}
              fill="rgba(245, 158, 11, 0.12)"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="transition-all duration-300"
            />
          )}

          {/* Athlete Data Polygon */}
          <polygon
            points={athletePoints}
            fill="rgba(14, 165, 233, 0.25)"
            stroke="#0EA5E9"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Data Points on vertices */}
          {CATEGORIES.map((cat, i) => {
            const val = categoryScores[cat.key] || 0;
            const { x, y } = getCoordinates(i, Math.max(10, val));
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={cat.key}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#0EA5E9"
                  stroke="#080C14"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Category Axis Labels */}
          {CATEGORIES.map((cat, i) => {
            const angle = startAngle + i * angleStep;
            const labelRadius = radius + 24;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);
            const val = categoryScores[cat.key] || 0;
            const isHovered = hoveredIndex === i;

            return (
              <text
                key={cat.key}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[11px] font-semibold tracking-wide transition-colors ${
                  isHovered ? 'fill-cyan-300 font-bold' : 'fill-slate-300'
                }`}
              >
                {cat.label} ({val > 0 ? Math.round(val) : '—'})
              </text>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredIndex !== null && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-xl text-center backdrop-blur-sm">
            <span className="text-xs font-mono text-cyan-400 block uppercase">
              {CATEGORIES[hoveredIndex].label}
            </span>
            <span className="text-base font-bold text-white">
              {categoryScores[CATEGORIES[hoveredIndex].key] > 0
                ? `${categoryScores[CATEGORIES[hoveredIndex].key]} pts`
                : 'No tests recorded'}
            </span>
            {compareScores && (
              <span className="text-[10px] text-amber-400 block font-mono">
                {compareLabel}: {compareScores[CATEGORIES[hoveredIndex].key] || '—'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-sm" />
          <span className="text-slate-300 font-medium">{athleteName}</span>
        </div>
        {compareScores && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 bg-amber-400 border-b border-dashed border-amber-400" />
            <span className="text-amber-400 font-medium">{compareLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
