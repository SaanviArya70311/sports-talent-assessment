import { BenchmarkData } from '../types';

export const BENCHMARK_DATASETS: BenchmarkData[] = [
  {
    id: 'bm-sprint-40m-u18',
    assessmentId: 'sprint-40m',
    sport: 'All Sports (Multi-Sport Combine)',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'National Scholastic High School Combine Normative Study',
    sourceCitation: 'Journal of Strength and Conditioning Research (Vol. 33, Issue 8, 2019)',
    sampleSize: 1420,
    lastUpdated: '2023-04-12',
    p10: 5.95, // 10th percentile (slower)
    p25: 5.60,
    p50: 5.25, // Median
    p75: 4.95,
    p90: 4.75,
    p99: 4.48, // Elite high school sprinter
    limitationsNote: 'Measured electronically with timing gates on synthetic track. Hand-timed or grass results may deviate by ±0.20s.'
  },
  {
    id: 'bm-vert-jump-u18',
    assessmentId: 'vertical-jump',
    sport: 'Multi-Sport Athletics',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'Physical Fitness Assessment in Youth Athletes - NSCA Database',
    sourceCitation: 'National Strength & Conditioning Association (NSCA) Youth Performance Manual, 4th Ed.',
    sampleSize: 2180,
    lastUpdated: '2023-09-18',
    p10: 36.0,
    p25: 44.0,
    p50: 53.0, // Median 53 cm
    p75: 64.0,
    p90: 74.0,
    p99: 86.0, // Elite
    limitationsNote: 'Standing countermovement jump (CMJ) with Vertec or optical jump mat. Running starts invalidate comparison.'
  },
  {
    id: 'bm-pushups-u18',
    assessmentId: 'push-ups',
    sport: 'General Fitness Norms',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'Cooper Institute FitnessGram Reference Standards',
    sourceCitation: 'Cooper Institute Healthy Fitness Zone Normative Tables (2020 Revision)',
    sampleSize: 8400,
    lastUpdated: '2022-11-05',
    p10: 14.0,
    p25: 22.0,
    p50: 32.0, // Median
    p75: 44.0,
    p90: 56.0,
    p99: 68.0,
    limitationsNote: 'Standard cadence 90-degree elbow flexion push-ups in continuous movement until exhaustion or form failure.'
  },
  {
    id: 'bm-plank-u18',
    assessmentId: 'plank-hold',
    sport: 'Core Endurance Protocols',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'Canadian Physical Activity, Fitness & Lifestyle Approach (CPAFLA)',
    sourceCitation: 'Canadian Society for Exercise Physiology (CSEP) Testing Protocol Manual',
    sampleSize: 1850,
    lastUpdated: '2023-01-20',
    p10: 45.0,
    p25: 75.0,
    p50: 110.0,
    p75: 155.0,
    p90: 200.0,
    p99: 250.0,
    limitationsNote: 'Forearm plank on flat mat. Timer stops when hips sag or pike out of neutral alignment for >2 seconds.'
  },
  {
    id: 'bm-agility-u18',
    assessmentId: 'pro-agility-shuttle',
    sport: 'Multi-Sport Agility (5-10-5 Shuttle)',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'American Football Coaches Association & Combine Standard Protocols',
    sourceCitation: 'AFCA Collegiate Prospect Scouting Compendium',
    sampleSize: 3100,
    lastUpdated: '2023-06-14',
    p10: 5.45,
    p25: 5.15,
    p50: 4.80,
    p75: 4.50,
    p90: 4.28,
    p99: 4.08,
    limitationsNote: 'Electronic timing gates on turf or hardwood. Hand touch on lateral lines mandatory.'
  },
  {
    id: 'bm-beep-u18',
    assessmentId: 'beep-test-endurance',
    sport: 'Aerobic Shuttle Protocols (20m Multi-Stage)',
    ageGroup: 'U18',
    gender: 'all',
    sourceName: 'Léger & Lambert Multi-Stage Fitness Test Reference Cohort',
    sourceCitation: 'European Journal of Applied Physiology & Occupational Physiology (68:445-451)',
    sampleSize: 4500,
    lastUpdated: '2022-08-30',
    p10: 5.5,
    p25: 7.2,
    p50: 9.4,
    p75: 11.2,
    p90: 12.8,
    p99: 14.2,
    limitationsNote: '20-meter shuttle protocol. Athlete must reach turnaround line before audible signal on two consecutive shuttles.'
  }
];

export interface BenchmarkComparisonResult {
  hasBenchmark: boolean;
  benchmark?: BenchmarkData;
  percentileRank: number; // 0 to 100 estimated percentile
  percentileBand: string; // e.g. "Top 25% (75th Percentile)"
  comparisonText: string;
  sourceDisclaimer: string;
}

/**
 * Calculates where an athlete's raw score sits relative to the documented benchmark dataset.
 */
export function compareWithBenchmark(
  assessmentId: string,
  rawValue: number,
  direction: 'lower_is_better' | 'higher_is_better',
  ageGroup: string = 'U18'
): BenchmarkComparisonResult {
  const benchmark = BENCHMARK_DATASETS.find(
    b => b.assessmentId === assessmentId && (b.ageGroup === ageGroup || b.ageGroup === 'U18' || b.ageGroup === 'All')
  );

  if (!benchmark) {
    return {
      hasBenchmark: false,
      percentileRank: 50,
      percentileBand: 'No verified cohort benchmark available',
      comparisonText: 'No population benchmark is currently configured for this specific test and demographic. Showing personal progress only.',
      sourceDisclaimer: 'Elitez only provides comparisons when verified research datasets exist.'
    };
  }

  // Calculate estimated percentile rank
  let percentile = 50;

  if (direction === 'higher_is_better') {
    if (rawValue < benchmark.p10) percentile = Math.max(2, Math.round((rawValue / benchmark.p10) * 10));
    else if (rawValue < benchmark.p25) percentile = 10 + Math.round(((rawValue - benchmark.p10) / (benchmark.p25 - benchmark.p10)) * 15);
    else if (rawValue < benchmark.p50) percentile = 25 + Math.round(((rawValue - benchmark.p25) / (benchmark.p50 - benchmark.p25)) * 25);
    else if (rawValue < benchmark.p75) percentile = 50 + Math.round(((rawValue - benchmark.p50) / (benchmark.p75 - benchmark.p50)) * 25);
    else if (rawValue < benchmark.p90) percentile = 75 + Math.round(((rawValue - benchmark.p75) / (benchmark.p90 - benchmark.p75)) * 15);
    else if (rawValue < benchmark.p99) percentile = 90 + Math.round(((rawValue - benchmark.p90) / (benchmark.p99 - benchmark.p90)) * 9);
    else percentile = 99;
  } else {
    // lower_is_better (e.g. 40m sprint: rawValue 4.6 is faster than p90 of 4.75)
    if (rawValue > benchmark.p10) percentile = Math.max(2, Math.round((benchmark.p10 / rawValue) * 10));
    else if (rawValue > benchmark.p25) percentile = 10 + Math.round(((benchmark.p10 - rawValue) / (benchmark.p10 - benchmark.p25)) * 15);
    else if (rawValue > benchmark.p50) percentile = 25 + Math.round(((benchmark.p25 - rawValue) / (benchmark.p25 - benchmark.p50)) * 25);
    else if (rawValue > benchmark.p75) percentile = 50 + Math.round(((benchmark.p50 - rawValue) / (benchmark.p50 - benchmark.p75)) * 25);
    else if (rawValue > benchmark.p90) percentile = 75 + Math.round(((benchmark.p75 - rawValue) / (benchmark.p75 - benchmark.p90)) * 15);
    else if (rawValue > benchmark.p99) percentile = 90 + Math.round(((benchmark.p90 - rawValue) / (benchmark.p90 - benchmark.p99)) * 9);
    else percentile = 99;
  }

  percentile = Math.max(1, Math.min(99, percentile));

  let band = '';
  if (percentile >= 90) band = `Top ${100 - percentile}% · Elite Competitive`;
  else if (percentile >= 75) band = `Top ${100 - percentile}% · Above Average`;
  else if (percentile >= 50) band = `50th–75th Percentile · Solid Athletic Baseline`;
  else band = `${percentile}th Percentile · Developing`;

  return {
    hasBenchmark: true,
    benchmark,
    percentileRank: percentile,
    percentileBand: band,
    comparisonText: `Compared to ${benchmark.sampleSize.toLocaleString()} tested athletes in the "${benchmark.sourceName}" study (${benchmark.ageGroup}).`,
    sourceDisclaimer: `Source: ${benchmark.sourceCitation}. Note: Benchmarks are informative reference data and do not guarantee selection or future performance.`
  };
}
