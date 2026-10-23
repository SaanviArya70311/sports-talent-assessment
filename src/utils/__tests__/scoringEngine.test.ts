import {
  calculateNormalizedScore,
  calculateCompositeScore,
  validateAssessmentInput,
  DEFAULT_SCORING_PARAMETERS
} from '../scoringEngine';
import { INITIAL_ASSESSMENT_DEFINITIONS } from '../../data/seedData';
import { AssessmentAttempt } from '../../types';

function runTests() {
  console.log('--- RUNNING ELITEZ SCORING ENGINE DETERMINISTIC AUDIT ---');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Lower is better (Sprint 40m)
  const eliteSprint = calculateNormalizedScore('sprint-40m', 4.40);
  const baselineSprint = calculateNormalizedScore('sprint-40m', 6.00);
  assert(
    eliteSprint.normalizedScore > baselineSprint.normalizedScore,
    'Sprint 40m: 4.40s yields higher normalized score than 6.00s'
  );
  assert(
    eliteSprint.normalizedScore >= 95,
    'Sprint 40m: 4.40s achieves elite score >= 95 pts'
  );

  // 2. Higher is better (Vertical Jump)
  const eliteJump = calculateNormalizedScore('vertical-jump', 85);
  const baselineJump = calculateNormalizedScore('vertical-jump', 35);
  assert(
    eliteJump.normalizedScore > baselineJump.normalizedScore,
    'Vertical Jump: 85cm yields higher score than 35cm'
  );

  // 3. Score bounds: scores must always be between [5, 100]
  const extremeLow = calculateNormalizedScore('vertical-jump', -10);
  const extremeHigh = calculateNormalizedScore('vertical-jump', 500);
  assert(extremeLow.normalizedScore >= 5, 'Extreme low is clamped to >= 5 pts');
  assert(extremeHigh.normalizedScore <= 100, 'Extreme high is clamped to <= 100 pts');

  // 4. Input Plausibility Validation
  const sprintDef = INITIAL_ASSESSMENT_DEFINITIONS.find(d => d.id === 'sprint-40m')!;
  const invalidNegative = validateAssessmentInput(sprintDef, -2);
  assert(!invalidNegative.isValid, 'Rejects negative sprint time');

  const impossibleFast = validateAssessmentInput(sprintDef, 1.2);
  assert(!impossibleFast.isValid, 'Rejects physiologically impossible sprint time (1.2s)');

  const validSprint = validateAssessmentInput(sprintDef, 4.65);
  assert(validSprint.isValid, 'Accepts realistic sprint time (4.65s)');

  // 5. Composite Score Calculation requirements
  const testAttempts: AssessmentAttempt[] = [
    {
      id: 'test-1',
      athleteId: 'ath-test',
      assessmentId: 'sprint-40m',
      date: '2026-03-01',
      rawValue: 4.60,
      unit: 's',
      normalizedScore: 91,
      scoringRuleVersion: 'v2.4-deterministic',
      verificationStatus: 'coach_verified',
      source: 'combine_event'
    },
    {
      id: 'test-2',
      athleteId: 'ath-test',
      assessmentId: 'vertical-jump',
      date: '2026-03-01',
      rawValue: 75,
      unit: 'cm',
      normalizedScore: 85,
      scoringRuleVersion: 'v2.4-deterministic',
      verificationStatus: 'coach_verified',
      source: 'combine_event'
    }
  ];

  // Only 2 categories (speed, power) -> should not compute overall score
  const incompleteComposite = calculateCompositeScore(INITIAL_ASSESSMENT_DEFINITIONS, testAttempts);
  assert(
    !incompleteComposite.isCalculable,
    'Composite score requires at least 3 categories and reports isCalculable=false when only 2 are present'
  );

  // Add 3rd category (push-ups = strength)
  testAttempts.push({
    id: 'test-3',
    athleteId: 'ath-test',
    assessmentId: 'push-ups',
    date: '2026-03-01',
    rawValue: 50,
    unit: 'reps',
    normalizedScore: 80,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event'
  });

  const validComposite = calculateCompositeScore(INITIAL_ASSESSMENT_DEFINITIONS, testAttempts);
  assert(
    validComposite.isCalculable,
    'Composite score successfully calculates once 3 distinct categories are completed'
  );
  assert(
    validComposite.overallScore > 0,
    `Calculated composite score is positive: ${validComposite.overallScore}`
  );

  console.log(`\nTEST AUDIT SUMMARY: ${passed} Passed, ${failed} Failed`);
  return failed === 0;
}

runTests();
