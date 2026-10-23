import { AssessmentCategory, AssessmentDefinition, AssessmentAttempt, CompositeScoreResult } from '../types';

export const CURRENT_SCORING_VERSION = 'v2.4-deterministic';

/**
 * Normalization baseline bounds for standard fitness tests.
 * Min represents a realistic entry-level baseline (maps to score ~15-20).
 * Max represents an elite competitive standard (maps to score ~95-100).
 */
export interface ScoringParameters {
  minRaw: number;
  maxRaw: number;
  direction: 'lower_is_better' | 'higher_is_better';
  curve?: 'linear' | 'sigmoid';
}

export const DEFAULT_SCORING_PARAMETERS: Record<string, ScoringParameters> = {
  'sprint-40m': {
    minRaw: 6.8, // 6.8s = slower/recreational
    maxRaw: 4.4, // 4.4s = world-class combine sprint
    direction: 'lower_is_better',
    curve: 'linear'
  },
  'vertical-jump': {
    minRaw: 25, // 25 cm
    maxRaw: 95, // 95 cm = elite basketball / athletics
    direction: 'higher_is_better',
    curve: 'linear'
  },
  'push-ups': {
    minRaw: 8,  // 8 reps
    maxRaw: 70, // 70 reps in 60s
    direction: 'higher_is_better',
    curve: 'linear'
  },
  'sit-ups': {
    minRaw: 12,
    maxRaw: 65,
    direction: 'higher_is_better',
    curve: 'linear'
  },
  'plank-hold': {
    minRaw: 30,  // 30 seconds
    maxRaw: 240, // 240 seconds (4 minutes)
    direction: 'higher_is_better',
    curve: 'linear'
  },
  'pro-agility-shuttle': {
    minRaw: 6.2, // 6.2s = baseline
    maxRaw: 4.0, // 4.0s = elite NFL/combine shuttle
    direction: 'lower_is_better',
    curve: 'linear'
  },
  'beep-test-endurance': {
    minRaw: 4.0, // Level 4.0
    maxRaw: 14.5, // Level 14.5+ = professional endurance
    direction: 'higher_is_better',
    curve: 'linear'
  }
};

/**
 * Deterministically normalize a raw test measurement to a standard 0-100 scale.
 * Validates bounds and prevents negative or >100 out-of-scale anomalies.
 */
export function calculateNormalizedScore(
  assessmentId: string,
  rawVal: number,
  customParams?: ScoringParameters
): {
  normalizedScore: number;
  percentileTier: string;
  formulaDescription: string;
} {
  const params = customParams || DEFAULT_SCORING_PARAMETERS[assessmentId];
  if (!params) {
    // Fallback clamp
    const score = Math.max(0, Math.min(100, Math.round(rawVal)));
    return {
      normalizedScore: score,
      percentileTier: getTierLabel(score),
      formulaDescription: `Standard direct mapping with [0, 100] clamp.`
    };
  }

  let ratio = 0;
  if (params.direction === 'higher_is_better') {
    if (params.maxRaw === params.minRaw) {
      ratio = 0.5;
    } else {
      ratio = (rawVal - params.minRaw) / (params.maxRaw - params.minRaw);
    }
  } else {
    // lower_is_better (e.g. Sprint time: 4.4s is higher score than 6.8s)
    if (params.minRaw === params.maxRaw) {
      ratio = 0.5;
    } else {
      ratio = (params.minRaw - rawVal) / (params.minRaw - params.maxRaw);
    }
  }

  // Map ratio: ratio 0 corresponds to 20 pts (baseline attempt), ratio 1.0 corresponds to 98 pts
  // Above maxRaw can reach 100 pts cap. Below minRaw can reach minimum 5 pts for a valid effort.
  let normalized = 20 + ratio * 78;
  normalized = Math.max(5, Math.min(100, normalized));
  const rounded = Math.round(normalized * 10) / 10;

  const formulaDescription = params.direction === 'higher_is_better'
    ? `Normalized scale: [${params.minRaw} to ${params.maxRaw}] mapped to 20–98 pts. Direction: Higher is better.`
    : `Normalized scale: [${params.minRaw} to ${params.maxRaw}] mapped to 20–98 pts. Direction: Lower time is better.`;

  return {
    normalizedScore: rounded,
    percentileTier: getTierLabel(rounded),
    formulaDescription
  };
}

export function getTierLabel(score: number): string {
  if (score >= 90) return 'Elite Tier (Top 5%)';
  if (score >= 80) return 'Advanced Competitor (Top 15%)';
  if (score >= 65) return 'Proficient Athlete';
  if (score >= 50) return 'Intermediate';
  return 'Developing Baseline';
}

/**
 * Calculates the Composite Elitez Athletic Score.
 * Rule: Requires at least 3 distinct category tests with valid completed attempts.
 * If requirements are not satisfied, returns isCalculable: false with clear reason.
 */
export function calculateCompositeScore(
  definitions: AssessmentDefinition[],
  attempts: AssessmentAttempt[],
  categoryWeights?: Partial<Record<AssessmentCategory, number>>
): CompositeScoreResult {
  const defaultCategoryWeights: Record<AssessmentCategory, number> = {
    speed: 25,
    power: 20,
    strength: 20,
    endurance: 20,
    agility: 15,
    ...categoryWeights
  };

  // Group latest attempts by assessmentId
  const latestAttemptsByAssessment = new Map<string, AssessmentAttempt>();
  for (const attempt of attempts) {
    if (attempt.verificationStatus === 'flagged_for_review') {
      continue; // Exclude flagged submissions from official score until audited
    }
    const existing = latestAttemptsByAssessment.get(attempt.assessmentId);
    if (!existing || new Date(attempt.date).getTime() > new Date(existing.date).getTime()) {
      latestAttemptsByAssessment.set(attempt.assessmentId, attempt);
    }
  }

  // Map to categories
  const categoryScoresAcc: Record<AssessmentCategory, number[]> = {
    speed: [],
    power: [],
    strength: [],
    endurance: [],
    agility: []
  };

  for (const [assessmentId, attempt] of latestAttemptsByAssessment.entries()) {
    const def = definitions.find(d => d.id === assessmentId);
    if (def && categoryScoresAcc[def.category]) {
      categoryScoresAcc[def.category].push(attempt.normalizedScore);
    }
  }

  const completedCategories: AssessmentCategory[] = [];
  const missingCategories: AssessmentCategory[] = [];
  const categoryAverages: Record<AssessmentCategory, number> = {
    speed: 0,
    power: 0,
    strength: 0,
    endurance: 0,
    agility: 0
  };

  const allCategories: AssessmentCategory[] = ['speed', 'power', 'strength', 'endurance', 'agility'];

  for (const cat of allCategories) {
    const scores = categoryScoresAcc[cat];
    if (scores.length > 0) {
      completedCategories.push(cat);
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      categoryAverages[cat] = Math.round(avg * 10) / 10;
    } else {
      missingCategories.push(cat);
    }
  }

  // Minimum 3 categories required for a valid holistic composite index
  if (completedCategories.length < 3) {
    return {
      isCalculable: false,
      overallScore: 0,
      completedCategories,
      missingCategories,
      reason: `Composite index requires at least 3 distinct fitness categories. Current completed: ${completedCategories.length} / 5 (${completedCategories.join(', ') || 'None'}).`,
      categoryScores: categoryAverages,
      scoringVersion: CURRENT_SCORING_VERSION
    };
  }

  // Compute weighted average over the completed categories, re-normalizing weights
  let weightedSum = 0;
  let totalActiveWeight = 0;

  for (const cat of completedCategories) {
    const weight = defaultCategoryWeights[cat] || 20;
    weightedSum += categoryAverages[cat] * weight;
    totalActiveWeight += weight;
  }

  const overallScore = totalActiveWeight > 0
    ? Math.round((weightedSum / totalActiveWeight) * 10) / 10
    : 0;

  return {
    isCalculable: true,
    overallScore,
    completedCategories,
    missingCategories,
    categoryScores: categoryAverages,
    scoringVersion: CURRENT_SCORING_VERSION
  };
}

/**
 * Validates if a raw input is within physiologically plausible limits.
 * Protects against typo bugs (e.g. 40m sprint in 0.4 seconds).
 */
export function validateAssessmentInput(
  assessment: AssessmentDefinition,
  value: number
): { isValid: boolean; warning?: string; error?: string } {
  if (isNaN(value) || value === null || value === undefined) {
    return { isValid: false, error: 'Please enter a valid numeric value.' };
  }

  if (value < assessment.minAllowedValue) {
    return {
      isValid: false,
      error: `Value (${value} ${assessment.unit}) is below the acceptable physiological minimum (${assessment.minAllowedValue} ${assessment.unit}).`
    };
  }

  if (value > assessment.maxAllowedValue) {
    return {
      isValid: false,
      error: `Value (${value} ${assessment.unit}) exceeds the acceptable physiological maximum (${assessment.maxAllowedValue} ${assessment.unit}).`
    };
  }

  // Check for suspicious world-record anomaly that should prompt human verification
  if (assessment.direction === 'lower_is_better') {
    if (value <= assessment.minAllowedValue * 1.1) {
      return {
        isValid: true,
        warning: `Exceptional performance detected! Video proof is recommended for scout verification.`
      };
    }
  } else {
    if (value >= assessment.maxAllowedValue * 0.92) {
      return {
        isValid: true,
        warning: `Near world-class result detected! Submission will be flagged for video review.`
      };
    }
  }

  return { isValid: true };
}
