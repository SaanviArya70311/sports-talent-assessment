import {
  AssessmentDefinition,
  AthleteProfile,
  CoachProfile,
  AssessmentAttempt,
  CoachShortlist,
  AuditLog,
  User
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-athlete-1',
    email: 'marcus.vance@elitezsports.com',
    fullName: 'Marcus Vance',
    role: 'athlete',
    createdAt: '2026-01-15'
  },
  {
    id: 'user-athlete-2',
    email: 'elena.rostova@elitezsports.com',
    fullName: 'Elena Rostova',
    role: 'athlete',
    createdAt: '2026-02-10'
  },
  {
    id: 'user-athlete-3',
    email: 'jordan.cole@elitezsports.com',
    fullName: 'Jordan Cole',
    role: 'athlete',
    createdAt: '2026-03-01'
  },
  {
    id: 'user-coach-1',
    email: 'scout.miller@vanguardcombine.org',
    fullName: 'Dave Miller',
    role: 'coach',
    createdAt: '2025-11-20'
  },
  {
    id: 'user-admin-1',
    email: 'admin.chen@elitez.internal',
    fullName: 'Sarah Chen',
    role: 'admin',
    createdAt: '2025-10-01'
  }
];

export const INITIAL_ASSESSMENT_DEFINITIONS: AssessmentDefinition[] = [
  {
    id: 'sprint-40m',
    name: '40-Meter Sprint',
    shortCode: '40M',
    category: 'speed',
    description: 'Measures maximal acceleration and linear top-end speed over a standard 40-meter distance.',
    instructions: [
      'Set two clear cones exactly 40 meters apart on a flat, non-slip surface.',
      'Begin in a stationary 2-point or 3-point athletic stance with front foot behind the start line.',
      'Explode forward at maximum acceleration through the finish line without decelerating early.',
      'Record time via automated timing gates, stopwatch, or side-angle video verification.'
    ],
    safetyGuidelines: [
      'Complete a minimum 10-minute dynamic warm-up including hamstring activation.',
      'Ensure at least 15 meters of clear deceleration space beyond the finish cone.',
      'Do not perform in wet conditions without appropriate traction footwear.'
    ],
    requiredEquipment: ['Measuring tape or pre-measured 40m track', 'Cones (2x)', 'Timing gate or verified video camera'],
    metricName: 'Time',
    unit: 's',
    direction: 'lower_is_better',
    inputType: 'decimal',
    minAllowedValue: 4.20,
    maxAllowedValue: 8.50,
    standardWeight: 25,
    cvSupported: true,
    active: true
  },
  {
    id: 'vertical-jump',
    name: 'Standing Vertical Jump',
    shortCode: 'VJ',
    category: 'power',
    description: 'Measures explosive lower-body concentric and countermovement vertical power.',
    instructions: [
      'Stand flat-footed next to the measuring wall or Vertec device to establish standing reach height.',
      'Dip into a countermovement squat with double arm swing.',
      'Explode vertically, touching the highest achievable vane or wall marker at peak jump height.',
      'Subtract standing reach height from maximum touch height to calculate net vertical jump.'
    ],
    safetyGuidelines: [
      'Ensure a firm, level landing area with non-slip athletic shoes.',
      'Land on balls of both feet with flexed knees and hips to absorb impact safely.',
      'Rest at least 90 seconds between attempts for neuromuscular recovery.'
    ],
    requiredEquipment: ['Vertec device, chalk wall, or calibrated jump mat'],
    metricName: 'Height',
    unit: 'cm',
    direction: 'higher_is_better',
    inputType: 'decimal',
    minAllowedValue: 20,
    maxAllowedValue: 120,
    standardWeight: 20,
    cvSupported: true,
    active: true
  },
  {
    id: 'push-ups',
    name: 'Max Push-Ups (1 Minute)',
    shortCode: 'PU-60',
    category: 'strength',
    description: 'Tests upper-body anterior muscular endurance, chest, triceps, and anterior shoulder stamina.',
    instructions: [
      'Assume a plank position with hands slightly wider than shoulder-width, core locked.',
      'Lower torso until elbows reach at least a 90-degree angle or chest grazes a 2-inch fist pad.',
      'Push back up into full elbow extension without locking violently or sagging lower back.',
      'Execute as many clean repetitions as possible within 60 seconds.'
    ],
    safetyGuidelines: [
      'Maintain a neutral spine; stop the test if lumbar hyperextension causes discomfort.',
      'Do not compromise form for speed; improper reps will not be counted.'
    ],
    requiredEquipment: ['Exercise mat', 'Stopwatch / Video camera'],
    metricName: 'Reps',
    unit: 'reps',
    direction: 'higher_is_better',
    inputType: 'integer',
    minAllowedValue: 0,
    maxAllowedValue: 90,
    standardWeight: 20,
    cvSupported: true,
    active: true
  },
  {
    id: 'plank-hold',
    name: 'Timed Forearm Plank',
    shortCode: 'PLANK',
    category: 'strength',
    description: 'Evaluates isometric core endurance, transverse abdominis, and spinal stabilizer capacity.',
    instructions: [
      'Place forearms on the ground with elbows aligned directly under the shoulders.',
      'Elevate body onto toes, maintaining a straight line from ears through shoulders, hips, and ankles.',
      'Keep core braced and breathing steady throughout the duration.',
      'Hold until form breaks (hips drop >5 cm or pike upward).'
    ],
    safetyGuidelines: [
      'Terminate test immediately if severe sharp pain in the lower spine is felt.',
      'Do not hold breath; maintain rhythmic diaphragmatic respiration.'
    ],
    requiredEquipment: ['Flat gym mat', 'Timer'],
    metricName: 'Duration',
    unit: 's',
    direction: 'higher_is_better',
    inputType: 'integer',
    minAllowedValue: 15,
    maxAllowedValue: 600,
    standardWeight: 15,
    cvSupported: true,
    active: true
  },
  {
    id: 'pro-agility-shuttle',
    name: 'Pro Agility 5-10-5 Shuttle',
    shortCode: '5-10-5',
    category: 'agility',
    description: 'Gold-standard test of rapid lateral change of direction, balance, and lateral deceleration.',
    instructions: [
      'Place 3 cones in a straight line 5 yards (4.57m) apart.',
      'Straddle the middle cone in a balanced 3-point stance.',
      'Sprint 5 yards to the right, touching line with right hand.',
      'Turn and sprint 10 yards to the far left, touching line with left hand.',
      'Sprint back through the starting middle line at full speed.'
    ],
    safetyGuidelines: [
      'High-friction surface required (turf, rubber track, or clean wood court).',
      'Warm up hip adductors, groins, and ankles thoroughly.'
    ],
    requiredEquipment: ['3 cones', 'Measuring tape', 'Timer / Video camera'],
    metricName: 'Time',
    unit: 's',
    direction: 'lower_is_better',
    inputType: 'decimal',
    minAllowedValue: 3.80,
    maxAllowedValue: 7.50,
    standardWeight: 20,
    cvSupported: false,
    active: true
  },
  {
    id: 'beep-test-endurance',
    name: '20m Multi-Stage Beep Test',
    shortCode: 'BEEP',
    category: 'endurance',
    description: 'Progressive maximal aerobic capacity assessment estimating VO2 max through paced shuttles.',
    instructions: [
      'Mark two parallel lines exactly 20 meters apart.',
      'Begin behind line 1. At audible beep, run to line 2 before the next beep sounds.',
      'Pace increases incrementally at each minute (stage).',
      'Test finishes when athlete fails to cross line before beep twice consecutively.'
    ],
    safetyGuidelines: [
      'Maximal cardiovascular exertion test: requires medical clearance for strenuous activity.',
      'Ensure immediate access to hydration and certified supervisor.'
    ],
    requiredEquipment: ['20m calibrated course', 'Standard audio test track', 'Audio speaker'],
    metricName: 'Level',
    unit: 'level',
    direction: 'higher_is_better',
    inputType: 'decimal',
    minAllowedValue: 3.0,
    maxAllowedValue: 17.5,
    standardWeight: 20,
    cvSupported: false,
    active: true
  }
];

export const INITIAL_ATHLETES: AthleteProfile[] = [
  {
    id: 'ath-1',
    userId: 'user-athlete-1',
    fullName: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2008-05-14',
    age: 18,
    gender: 'male',
    primarySport: 'Track & Field',
    position: 'Sprinter (100m/200m) & Football WR',
    secondarySport: 'American Football',
    city: 'Austin',
    state: 'Texas',
    country: 'United States',
    heightCm: 184,
    weightKg: 78,
    wingspanCm: 191,
    dominantSide: 'right',
    currentTeam: 'Lone Star Track Club / Westlake High',
    yearsExperience: 5,
    bio: 'Dedicated sprinter specializing in acceleration mechanics and horizontal force production. 2025 State Regional Finalist in 100m. Seeking collegiate track & football opportunities.',
    isMinor: false,
    parentalConsentVerified: true,
    profileVisibility: 'public',
    showContactInfo: false,
    showLocation: true,
    showAge: true,
    completionPercentage: 95
  },
  {
    id: 'ath-2',
    userId: 'user-athlete-2',
    fullName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2007-03-22',
    age: 19,
    gender: 'female',
    primarySport: 'CrossFit / Functional Fitness',
    position: 'Individual Competitor',
    secondarySport: 'Artistic Gymnastics',
    city: 'Boulder',
    state: 'Colorado',
    country: 'United States',
    heightCm: 165,
    weightKg: 62,
    wingspanCm: 168,
    dominantSide: 'right',
    currentTeam: 'Apex Performance Lab',
    yearsExperience: 7,
    bio: 'Former Level 9 artistic gymnast transitioned to competitive functional athletics. Exceptional relative bodyweight strength, core endurance, and high-altitude aerobic threshold.',
    isMinor: false,
    parentalConsentVerified: true,
    profileVisibility: 'public',
    showContactInfo: true,
    showLocation: true,
    showAge: true,
    completionPercentage: 100
  },
  {
    id: 'ath-3',
    userId: 'user-athlete-3',
    fullName: 'Jordan Cole',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2009-11-04',
    age: 16,
    gender: 'male',
    primarySport: 'Basketball',
    position: 'Point Guard',
    secondarySport: 'Volleyball',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    heightCm: 188,
    weightKg: 74,
    wingspanCm: 196,
    dominantSide: 'left',
    currentTeam: 'Windy City Elite AAU U17',
    yearsExperience: 6,
    bio: 'Dynamic point guard with high court vision, first-step deceleration, and a 78 cm vertical jump. All-Metro Sophomore selection.',
    isMinor: true,
    parentalConsentVerified: true,
    profileVisibility: 'coaches_only',
    showContactInfo: false,
    showLocation: true,
    showAge: true,
    completionPercentage: 88
  },
  {
    id: 'ath-4',
    userId: 'user-athlete-4',
    fullName: 'Maya Lin',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    dateOfBirth: '2008-08-19',
    age: 18,
    gender: 'female',
    primarySport: 'Soccer',
    position: 'Box-to-Box Midfielder',
    secondarySport: 'Cross Country',
    city: 'Portland',
    state: 'Oregon',
    country: 'United States',
    heightCm: 171,
    weightKg: 61,
    wingspanCm: 172,
    dominantSide: 'right',
    currentTeam: 'Cascadia Premier FC U19',
    yearsExperience: 8,
    bio: 'Relentless midfielder known for aerobic motor, rapid transition pressing, and agility shuttle marks.',
    isMinor: false,
    parentalConsentVerified: true,
    profileVisibility: 'public',
    showContactInfo: false,
    showLocation: true,
    showAge: true,
    completionPercentage: 90
  }
];

export const INITIAL_COACHES: CoachProfile[] = [
  {
    id: 'coach-1',
    userId: 'user-coach-1',
    fullName: 'Dave Miller',
    organization: 'Vanguard Combine Scouting Network',
    roleTitle: 'Senior Combine Director & Collegiate Scout',
    sportsSpecialization: ['Track & Field', 'American Football', 'Basketball'],
    verifiedBadge: true,
    bio: 'Over 14 years evaluating NCAA Division I and preparatory prospects. Focused on transparent biometrics and verified video movement mechanics.',
    contactEmail: 'scout.miller@vanguardcombine.org'
  }
];

export const INITIAL_ATTEMPTS: AssessmentAttempt[] = [
  // Marcus Vance attempts
  {
    id: 'att-101',
    athleteId: 'ath-1',
    assessmentId: 'sprint-40m',
    date: '2026-03-12',
    rawValue: 4.58,
    unit: 's',
    normalizedScore: 92.2,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller (Vanguard Scout)',
    reviewedAt: '2026-03-14',
    reviewerNotes: 'Verified at Austin Spring Combine via dual Freelap electronic timing gates. Verified non-wind assisted.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoMetadata: {
      filename: 'marcus_vance_40m_combine.mp4',
      durationSec: 8.4,
      cadenceBpm: 242,
      poseReliabilityPct: 98
    }
  },
  {
    id: 'att-102',
    athleteId: 'ath-1',
    assessmentId: 'vertical-jump',
    date: '2026-03-12',
    rawValue: 78.5,
    unit: 'cm',
    normalizedScore: 88.6,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller (Vanguard Scout)',
    reviewedAt: '2026-03-14',
    reviewerNotes: 'Vertec measurement verified. Zero step-in run-up observed.'
  },
  {
    id: 'att-103',
    athleteId: 'ath-1',
    assessmentId: 'push-ups',
    date: '2026-03-10',
    rawValue: 48,
    unit: 'reps',
    normalizedScore: 78.3,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'cv_analyzed',
    source: 'video_cv',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoMetadata: {
      filename: 'marcus_pushup_60s.mp4',
      durationSec: 62.0,
      repCountEstimated: 48,
      cadenceBpm: 52,
      poseReliabilityPct: 94
    },
    athleteNotes: 'Clean elbow lockout on all repetitions.'
  },
  {
    id: 'att-104',
    athleteId: 'ath-1',
    assessmentId: 'pro-agility-shuttle',
    date: '2026-03-05',
    rawValue: 4.38,
    unit: 's',
    normalizedScore: 84.5,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller (Vanguard Scout)',
    reviewedAt: '2026-03-08'
  },
  {
    id: 'att-105',
    athleteId: 'ath-1',
    assessmentId: 'plank-hold',
    date: '2026-02-28',
    rawValue: 145,
    unit: 's',
    normalizedScore: 71.8,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'athlete_reported',
    source: 'self_entry',
    athleteNotes: 'Self-timed in gym.'
  },

  // Elena Rostova attempts
  {
    id: 'att-201',
    athleteId: 'ath-2',
    assessmentId: 'push-ups',
    date: '2026-03-18',
    rawValue: 64,
    unit: 'reps',
    normalizedScore: 97.4,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller',
    reviewedAt: '2026-03-20',
    reviewerNotes: 'Exceptional strict form. Consistent 90+ degree elbow flexion.'
  },
  {
    id: 'att-202',
    athleteId: 'ath-2',
    assessmentId: 'plank-hold',
    date: '2026-03-15',
    rawValue: 235,
    unit: 's',
    normalizedScore: 98.1,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'cv_analyzed',
    source: 'video_cv',
    videoMetadata: {
      filename: 'elena_plank_hold.mp4',
      durationSec: 238,
      poseReliabilityPct: 99
    }
  },
  {
    id: 'att-203',
    athleteId: 'ath-2',
    assessmentId: 'beep-test-endurance',
    date: '2026-03-10',
    rawValue: 12.8,
    unit: 'level',
    normalizedScore: 85.2,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller',
    reviewedAt: '2026-03-12'
  },
  {
    id: 'att-204',
    athleteId: 'ath-2',
    assessmentId: 'vertical-jump',
    date: '2026-03-02',
    rawValue: 56.0,
    unit: 'cm',
    normalizedScore: 60.5,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'athlete_reported',
    source: 'self_entry'
  },

  // Jordan Cole attempts
  {
    id: 'att-301',
    athleteId: 'ath-3',
    assessmentId: 'vertical-jump',
    date: '2026-03-19',
    rawValue: 82.0,
    unit: 'cm',
    normalizedScore: 92.5,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller',
    reviewedAt: '2026-03-21',
    reviewerNotes: 'Elite leaping ability for U17 guard.'
  },
  {
    id: 'att-302',
    athleteId: 'ath-3',
    assessmentId: 'pro-agility-shuttle',
    date: '2026-03-15',
    rawValue: 4.28,
    unit: 's',
    normalizedScore: 88.1,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'coach_verified',
    source: 'combine_event',
    reviewedBy: 'Dave Miller',
    reviewedAt: '2026-03-17'
  },
  {
    id: 'att-303',
    athleteId: 'ath-3',
    assessmentId: 'sprint-40m',
    date: '2026-03-14',
    rawValue: 4.82,
    unit: 's',
    normalizedScore: 84.4,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'cv_analyzed',
    source: 'video_cv'
  },

  // Flagged attempt for demonstration of Review Queue
  {
    id: 'att-flagged-1',
    athleteId: 'ath-4',
    assessmentId: 'sprint-40m',
    date: '2026-03-22',
    rawValue: 4.15,
    unit: 's',
    normalizedScore: 99.5,
    scoringRuleVersion: 'v2.4-deterministic',
    verificationStatus: 'flagged_for_review',
    source: 'video_cv',
    flagReason: 'Raw sprint time of 4.15s approaches international Olympic record. Requires manual review of video angle and camera calibration.',
    athleteNotes: 'Timing gates tripped on breezy track.'
  }
];

export const INITIAL_SHORTLIST: CoachShortlist[] = [
  {
    id: 'shortlist-1',
    coachId: 'coach-1',
    athleteId: 'ath-1',
    tags: ['Priority Scout', 'Division I Speed', 'Football WR Target'],
    privateNotes: [
      'Top-tier acceleration curve in 40m. Fluid hip transition.',
      'Check transcript and fall combine schedule.'
    ],
    rating: 5,
    createdAt: '2026-03-15'
  },
  {
    id: 'shortlist-2',
    coachId: 'coach-1',
    athleteId: 'ath-3',
    tags: ['Elite Leaper', 'U17 Point Guard', 'Great Lateral Agility'],
    privateNotes: [
      'Vertical jump verified at 82cm. Quick change of direction on 5-10-5.'
    ],
    rating: 4,
    createdAt: '2026-03-20'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2026-03-22 14:10:00',
    actorId: 'admin-chen',
    actorName: 'Sarah Chen (Admin)',
    action: 'UPDATED_SCORING_WEIGHTS',
    targetType: 'scoring_rule',
    targetId: 'v2.4-deterministic',
    details: 'Adjusted speed metric standard weight from 20% to 25% for multi-sport composite evaluation.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-03-21 09:30:15',
    actorId: 'coach-miller',
    actorName: 'Dave Miller (Scout)',
    action: 'VERIFIED_ATTEMPT',
    targetType: 'verification',
    targetId: 'att-301',
    details: 'Approved Jordan Cole vertical jump (82cm) from Combine video evidence.'
  },
  {
    id: 'audit-003',
    timestamp: '2026-03-22 16:45:00',
    actorId: 'system',
    actorName: 'Elitez Validation Engine',
    action: 'FLAGGED_ANOMALOUS_SUBMISSION',
    targetType: 'verification',
    targetId: 'att-flagged-1',
    details: 'System flagged sprint submission of 4.15s: value exceeds physiological baseline threshold.'
  }
];
