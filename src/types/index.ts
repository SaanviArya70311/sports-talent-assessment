export type UserRole = 'athlete' | 'coach' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export type AssessmentCategory = 'speed' | 'power' | 'strength' | 'endurance' | 'agility';

export interface AssessmentDefinition {
  id: string;
  name: string;
  shortCode: string;
  category: AssessmentCategory;
  description: string;
  instructions: string[];
  safetyGuidelines: string[];
  requiredEquipment: string[];
  metricName: string;
  unit: string;
  direction: 'lower_is_better' | 'higher_is_better';
  inputType: 'decimal' | 'integer' | 'duration';
  minAllowedValue: number;
  maxAllowedValue: number;
  standardWeight: number; // e.g. 20 (percent)
  cvSupported: boolean;
  active: boolean;
}

export type VerificationStatus = 
  | 'athlete_reported' 
  | 'cv_analyzed' 
  | 'coach_verified' 
  | 'flagged_for_review';

export interface AssessmentAttempt {
  id: string;
  athleteId: string;
  assessmentId: string;
  date: string;
  rawValue: number;
  unit: string;
  normalizedScore: number; // 0-100
  scoringRuleVersion: string;
  verificationStatus: VerificationStatus;
  source: 'self_entry' | 'video_cv' | 'combine_event';
  videoUrl?: string;
  videoMetadata?: {
    filename: string;
    durationSec: number;
    repCountEstimated?: number;
    cadenceBpm?: number;
    poseReliabilityPct?: number;
  };
  athleteNotes?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  flagReason?: string;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  dateOfBirth: string; // ISO format
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  primarySport: string;
  position: string;
  secondarySport?: string;
  city: string;
  state: string;
  country: string;
  heightCm: number;
  weightKg: number;
  wingspanCm?: number;
  dominantSide: 'right' | 'left' | 'ambidextrous';
  currentTeam: string;
  yearsExperience: number;
  bio: string;
  isMinor: boolean;
  parentalConsentVerified: boolean;
  profileVisibility: 'public' | 'coaches_only' | 'private';
  showContactInfo: boolean;
  showLocation: boolean;
  showAge: boolean;
  completionPercentage: number;
}

export interface CoachProfile {
  id: string;
  userId: string;
  fullName: string;
  organization: string;
  roleTitle: string;
  sportsSpecialization: string[];
  verifiedBadge: boolean;
  bio: string;
  contactEmail: string;
}

export interface BenchmarkData {
  id: string;
  assessmentId: string;
  sport: string;
  ageGroup: 'U16' | 'U18' | 'U20' | 'Adult' | 'All';
  gender: 'male' | 'female' | 'all';
  sourceName: string;
  sourceCitation: string;
  sampleSize: number;
  lastUpdated: string;
  // Percentile values in raw units
  p10: number;
  p25: number;
  p50: number; // Median
  p75: number;
  p90: number;
  p99: number;
  limitationsNote: string;
}

export interface CoachShortlist {
  id: string;
  coachId: string;
  athleteId: string;
  tags: string[];
  privateNotes: string[];
  rating: number; // 1-5
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'assessment' | 'scoring_rule' | 'verification' | 'user_role' | 'benchmark';
  targetId: string;
  details: string;
}

export interface CompositeScoreResult {
  isCalculable: boolean;
  overallScore: number;
  completedCategories: AssessmentCategory[];
  missingCategories: AssessmentCategory[];
  reason?: string;
  categoryScores: Record<AssessmentCategory, number>;
  scoringVersion: string;
}
