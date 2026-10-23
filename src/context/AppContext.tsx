import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AthleteProfile,
  CoachProfile,
  AssessmentDefinition,
  AssessmentAttempt,
  CoachShortlist,
  AuditLog,
  BenchmarkData
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ATHLETES,
  INITIAL_COACHES,
  INITIAL_ASSESSMENT_DEFINITIONS,
  INITIAL_ATTEMPTS,
  INITIAL_SHORTLIST,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';
import { BENCHMARK_DATASETS } from '../utils/benchmarks';
import { calculateNormalizedScore, CURRENT_SCORING_VERSION, validateAssessmentInput } from '../utils/scoringEngine';

interface AssessmentDraft {
  assessmentId: string;
  rawValue: string;
  athleteNotes: string;
  videoFilename?: string;
  lastSavedAt: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  
  athletes: AthleteProfile[];
  currentAthleteProfile: AthleteProfile | null;
  updateAthleteProfile: (updated: Partial<AthleteProfile>) => void;
  
  coaches: CoachProfile[];
  currentCoachProfile: CoachProfile | null;
  
  assessmentDefinitions: AssessmentDefinition[];
  updateAssessmentDefinition: (def: AssessmentDefinition) => void;
  
  attempts: AssessmentAttempt[];
  addAttempt: (attemptData: {
    assessmentId: string;
    rawValue: number;
    athleteNotes?: string;
    videoUrl?: string;
    videoMetadata?: AssessmentAttempt['videoMetadata'];
    source?: 'self_entry' | 'video_cv' | 'combine_event';
  }) => { success: boolean; attempt?: AssessmentAttempt; error?: string };
  
  verifyAttempt: (
    attemptId: string,
    status: 'coach_verified' | 'flagged_for_review',
    reviewerNotes: string
  ) => void;
  
  shortlist: CoachShortlist[];
  toggleShortlist: (athleteId: string) => void;
  updateShortlistNotes: (athleteId: string, notes: string[], tags: string[], rating: number) => void;
  
  auditLogs: AuditLog[];
  benchmarks: BenchmarkData[];
  
  // Offline / draft capability
  assessmentDrafts: Record<string, AssessmentDraft>;
  saveDraft: (assessmentId: string, rawValue: string, athleteNotes: string, videoFilename?: string) => void;
  clearDraft: (assessmentId: string) => void;

  // Real backend connection status info
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'elitez_app_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or fallback to seed data
  const [isDemoMode, setDemoMode] = useState<boolean>(true);

  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}curr_user_id`) || 'user-athlete-1';
  });

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;

  const [athletes, setAthletes] = useState<AthleteProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}athletes`);
    return saved ? JSON.parse(saved) : INITIAL_ATHLETES;
  });

  const [coaches] = useState<CoachProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}coaches`);
    return saved ? JSON.parse(saved) : INITIAL_COACHES;
  });

  const [assessmentDefinitions, setAssessmentDefinitions] = useState<AssessmentDefinition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}definitions`);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENT_DEFINITIONS;
  });

  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attempts`);
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });

  const [shortlist, setShortlist] = useState<CoachShortlist[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}shortlist`);
    return saved ? JSON.parse(saved) : INITIAL_SHORTLIST;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [benchmarks] = useState<BenchmarkData[]>(BENCHMARK_DATASETS);

  const [assessmentDrafts, setAssessmentDrafts] = useState<Record<string, AssessmentDraft>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}drafts`);
    return saved ? JSON.parse(saved) : {};
  });

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}athletes`, JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}attempts`, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}definitions`, JSON.stringify(assessmentDefinitions));
  }, [assessmentDefinitions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}shortlist`, JSON.stringify(shortlist));
  }, [shortlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}curr_user_id`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}drafts`, JSON.stringify(assessmentDrafts));
  }, [assessmentDrafts]);

  const currentAthleteProfile = athletes.find(a => a.userId === currentUser.id) || athletes[0];
  const currentCoachProfile = coaches.find(c => c.userId === currentUser.id) || coaches[0];

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
    }
  };

  const updateAthleteProfile = (updated: Partial<AthleteProfile>) => {
    if (!currentAthleteProfile) return;
    setAthletes(prev =>
      prev.map(a => (a.id === currentAthleteProfile.id ? { ...a, ...updated } : a))
    );
  };

  const updateAssessmentDefinition = (def: AssessmentDefinition) => {
    setAssessmentDefinitions(prev =>
      prev.map(d => (d.id === def.id ? def : d))
    );

    // Record audit log
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorId: currentUser.id,
      actorName: `${currentUser.fullName} (${currentUser.role})`,
      action: 'UPDATED_ASSESSMENT_DEFINITION',
      targetType: 'assessment',
      targetId: def.id,
      details: `Updated parameters for ${def.name}: Min=${def.minAllowedValue}, Max=${def.maxAllowedValue}, Weight=${def.standardWeight}%.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addAttempt = (attemptData: {
    assessmentId: string;
    rawValue: number;
    athleteNotes?: string;
    videoUrl?: string;
    videoMetadata?: AssessmentAttempt['videoMetadata'];
    source?: 'self_entry' | 'video_cv' | 'combine_event';
  }) => {
    if (!currentAthleteProfile) {
      return { success: false, error: 'No active athlete profile found.' };
    }

    const def = assessmentDefinitions.find(d => d.id === attemptData.assessmentId);
    if (!def) {
      return { success: false, error: 'Invalid assessment.' };
    }

    // Physiological and plausibility check
    const validation = validateAssessmentInput(def, attemptData.rawValue);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Determine normalized score using deterministic engine
    const { normalizedScore } = calculateNormalizedScore(def.id, attemptData.rawValue);

    // Determine verification status
    let verificationStatus: AssessmentAttempt['verificationStatus'] = 'athlete_reported';
    let flagReason: string | undefined;

    if (attemptData.source === 'video_cv') {
      verificationStatus = 'cv_analyzed';
    }

    // If anomaly warning triggered, flag for human scout review
    if (validation.warning) {
      verificationStatus = 'flagged_for_review';
      flagReason = validation.warning;
    }

    const newAttempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      athleteId: currentAthleteProfile.id,
      assessmentId: def.id,
      date: new Date().toISOString().substring(0, 10),
      rawValue: attemptData.rawValue,
      unit: def.unit,
      normalizedScore,
      scoringRuleVersion: CURRENT_SCORING_VERSION,
      verificationStatus,
      source: attemptData.source || (attemptData.videoUrl ? 'video_cv' : 'self_entry'),
      videoUrl: attemptData.videoUrl,
      videoMetadata: attemptData.videoMetadata,
      athleteNotes: attemptData.athleteNotes,
      flagReason
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Clear draft upon successful submission
    clearDraft(def.id);

    // Audit log if flagged
    if (verificationStatus === 'flagged_for_review') {
      const log: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorId: 'system',
        actorName: 'Elitez Plausibility Engine',
        action: 'FLAGGED_ANOMALOUS_SUBMISSION',
        targetType: 'verification',
        targetId: newAttempt.id,
        details: `Submission of ${attemptData.rawValue} ${def.unit} on ${def.name} flagged for review: ${flagReason}`
      };
      setAuditLogs(prev => [log, ...prev]);
    }

    return { success: true, attempt: newAttempt };
  };

  const verifyAttempt = (
    attemptId: string,
    status: 'coach_verified' | 'flagged_for_review',
    reviewerNotes: string
  ) => {
    setAttempts(prev =>
      prev.map(a =>
        a.id === attemptId
          ? {
              ...a,
              verificationStatus: status,
              reviewedBy: `${currentUser.fullName} (${currentUser.role})`,
              reviewedAt: new Date().toISOString().substring(0, 10),
              reviewerNotes
            }
          : a
      )
    );

    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorId: currentUser.id,
      actorName: `${currentUser.fullName} (${currentUser.role})`,
      action: status === 'coach_verified' ? 'VERIFIED_ATTEMPT' : 'FLAGGED_SUBMISSION',
      targetType: 'verification',
      targetId: attemptId,
      details: `${status === 'coach_verified' ? 'Approved' : 'Flagged'} attempt ${attemptId}. Reviewer Note: "${reviewerNotes}"`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const toggleShortlist = (athleteId: string) => {
    const existing = shortlist.find(s => s.athleteId === athleteId);
    if (existing) {
      setShortlist(prev => prev.filter(s => s.athleteId !== athleteId));
    } else {
      const newEntry: CoachShortlist = {
        id: `shortlist-${Date.now()}`,
        coachId: currentCoachProfile?.id || 'coach-1',
        athleteId,
        tags: ['New Prospect'],
        privateNotes: ['Saved to scout watchlist.'],
        rating: 4,
        createdAt: new Date().toISOString().substring(0, 10)
      };
      setShortlist(prev => [newEntry, ...prev]);
    }
  };

  const updateShortlistNotes = (athleteId: string, notes: string[], tags: string[], rating: number) => {
    setShortlist(prev =>
      prev.map(s =>
        s.athleteId === athleteId
          ? { ...s, privateNotes: notes, tags, rating }
          : s
      )
    );
  };

  const saveDraft = (assessmentId: string, rawValue: string, athleteNotes: string, videoFilename?: string) => {
    setAssessmentDrafts(prev => ({
      ...prev,
      [assessmentId]: {
        assessmentId,
        rawValue,
        athleteNotes,
        videoFilename,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    }));
  };

  const clearDraft = (assessmentId: string) => {
    setAssessmentDrafts(prev => {
      const next = { ...prev };
      delete next[assessmentId];
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentUser,
        switchRole,
        athletes,
        currentAthleteProfile,
        updateAthleteProfile,
        coaches,
        currentCoachProfile,
        assessmentDefinitions,
        updateAssessmentDefinition,
        attempts,
        addAttempt,
        verifyAttempt,
        shortlist,
        toggleShortlist,
        updateShortlistNotes,
        auditLogs,
        benchmarks,
        assessmentDrafts,
        saveDraft,
        clearDraft,
        isDemoMode,
        setDemoMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
