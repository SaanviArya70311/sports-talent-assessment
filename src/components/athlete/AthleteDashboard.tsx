import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Eye,
  FileVideo,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssessmentDefinition, AssessmentAttempt } from '../../types';
import { calculateCompositeScore } from '../../utils/scoringEngine';
import { compareWithBenchmark } from '../../utils/benchmarks';
import { AthleticRadarChart } from '../charts/AthleticRadarChart';
import { ProgressTrendChart } from '../charts/ProgressTrendChart';
import { BenchmarkBarChart } from '../charts/BenchmarkBarChart';
import { AssessmentWizardModal } from '../assessment/AssessmentWizardModal';
import { AthleteProfileSettingsModal } from './AthleteProfileSettingsModal';
import { VideoAnalysisModal } from '../video/VideoAnalysisModal';

export const AthleteDashboard: React.FC = () => {
  const {
    currentAthleteProfile,
    assessmentDefinitions,
    attempts,
    assessmentDrafts
  } = useApp();

  const [selectedAssessmentForModal, setSelectedAssessmentForModal] = useState<AssessmentDefinition | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeTrendAssessmentId, setActiveTrendAssessmentId] = useState<string>('sprint-40m');
  const [videoModalAttempt, setVideoModalAttempt] = useState<AssessmentAttempt | null>(null);

  if (!currentAthleteProfile) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active athlete profile selected.
      </div>
    );
  }

  // Filter attempts for this athlete
  const athleteAttempts = attempts.filter(a => a.athleteId === currentAthleteProfile.id);

  // Calculate composite score using deterministic engine
  const composite = calculateCompositeScore(assessmentDefinitions, athleteAttempts);

  // Find personal bests for each assessment
  const personalBests = assessmentDefinitions.map(def => {
    const testAttempts = athleteAttempts.filter(
      a => a.assessmentId === def.id && a.verificationStatus !== 'flagged_for_review'
    );
    if (testAttempts.length === 0) return { def, bestAttempt: null };

    const best = testAttempts.reduce((prev, curr) => {
      if (def.direction === 'lower_is_better') {
        return curr.rawValue < prev.rawValue ? curr : prev;
      }
      return curr.rawValue > prev.rawValue ? curr : prev;
    });

    return { def, bestAttempt: best };
  });

  // Recommended next assessments (those with 0 attempts or oldest date)
  const pendingAssessments = assessmentDefinitions.filter(
    def => !athleteAttempts.some(a => a.assessmentId === def.id)
  );

  const handleStartAssessment = (def: AssessmentDefinition) => {
    setSelectedAssessmentForModal(def);
    setIsWizardOpen(true);
  };

  const activeTrendAssessment = assessmentDefinitions.find(d => d.id === activeTrendAssessmentId);
  const activeTrendAttempts = athleteAttempts.filter(a => a.assessmentId === activeTrendAssessmentId);

  // Latest attempt for benchmark display
  const latestSelectedAttempt = activeTrendAttempts[0] || athleteAttempts[0];
  const benchmarkResult = latestSelectedAttempt && activeTrendAssessment
    ? compareWithBenchmark(activeTrendAssessment.id, latestSelectedAttempt.rawValue, activeTrendAssessment.direction)
    : null;

  return (
    <div className="space-y-6">
      {/* Athlete Header Profile Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentAthleteProfile.avatarUrl}
                alt={currentAthleteProfile.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
              />
              {currentAthleteProfile.parentalConsentVerified && (
                <div
                  title="Verified Profile"
                  className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1 rounded-full shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentAthleteProfile.fullName}
                </h2>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                  {currentAthleteProfile.primarySport}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                <span>{currentAthleteProfile.position}</span>
                <span>·</span>
                <span>{currentAthleteProfile.currentTeam}</span>
                {currentAthleteProfile.showLocation && (
                  <>
                    <span>·</span>
                    <span>{currentAthleteProfile.city}, {currentAthleteProfile.state}</span>
                  </>
                )}
                {currentAthleteProfile.showAge && (
                  <>
                    <span>·</span>
                    <span>Age {currentAthleteProfile.age}</span>
                  </>
                )}
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-400 mt-2 max-w-xl line-clamp-2">
                {currentAthleteProfile.bio}
              </p>
            </div>
          </div>

          {/* Quick Actions & Privacy controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              Privacy & Settings
            </button>

            <button
              onClick={() => handleStartAssessment(assessmentDefinitions[0])}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Record Assessment
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Profile Completeness:</span>
            <span className="font-mono font-bold text-white">{currentAthleteProfile.completionPercentage}%</span>
            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${currentAthleteProfile.completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span>Visibility:</span>
            <span className="text-emerald-400 capitalize font-semibold">
              {currentAthleteProfile.profileVisibility.replace('_', ' ')}
            </span>
            <span>·</span>
            <span className="text-slate-400">{athleteAttempts.length} Total Verified Attempts</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards & Overall Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Composite Score Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Composite Elitez Index
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {composite.scoringVersion}
              </span>
            </div>

            {composite.isCalculable ? (
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {composite.overallScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Weighted deterministic aggregation across {composite.completedCategories.length} pillars ({composite.completedCategories.join(', ')}).
                </p>
              </div>
            ) : (
              <div className="mt-3 bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Index Unavailable
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  {composite.reason}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Required Pillars: 3 of 5</span>
            <span className="font-mono text-slate-300">
              Completed: {composite.completedCategories.length}/5
            </span>
          </div>
        </div>

        {/* 5-Pillar Athletic Radar Chart Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 max-w-xs">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Athletic Fingerprint
            </span>
            <h3 className="text-base font-bold text-white">5-Pillar Performance Balance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized scoring mapped across Speed, Power, Strength, Endurance, and Agility. Hover on vertices to inspect pillar values.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 font-mono">
              Formula: Deterministic range normalization (0–100 scale).
            </div>
          </div>

          <div className="shrink-0">
            <AthleticRadarChart
              categoryScores={composite.categoryScores}
              athleteName={currentAthleteProfile.fullName}
            />
          </div>
        </div>
      </div>

      {/* Recommended Next Tests / Pending Tests Banner if any */}
      {pendingAssessments.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border border-cyan-800/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
              <Sparkles className="w-4 h-4" />
              RECOMMENDED NEXT ASSESSMENTS
            </div>
            <p className="text-xs text-slate-300">
              You haven't recorded scores for: <span className="text-white font-semibold">{pendingAssessments.map(p => p.name).join(', ')}</span>.
              Completing tests unlocks a complete 5-pillar scout composite index.
            </p>
          </div>

          <button
            onClick={() => handleStartAssessment(pendingAssessments[0])}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20"
          >
            Start {pendingAssessments[0].shortCode} Test
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Personal Bests Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            Standardized Assessment Catalog & Records
          </h3>
          <span className="text-xs text-slate-400">Click to record or inspect trends</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {personalBests.map(({ def, bestAttempt }) => {
            const hasDraft = !!assessmentDrafts[def.id];
            const isSelectedForTrend = activeTrendAssessmentId === def.id;

            return (
              <div
                key={def.id}
                onClick={() => setActiveTrendAssessmentId(def.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelectedForTrend
                    ? 'bg-slate-900/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {def.category}
                  </span>
                  {hasDraft && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Draft Saved
                    </span>
                  )}
                  {bestAttempt && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      bestAttempt.verificationStatus === 'coach_verified'
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                        : bestAttempt.verificationStatus === 'cv_analyzed'
                        ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40'
                        : 'text-slate-300 bg-slate-800 border-slate-700'
                    }`}>
                      {bestAttempt.verificationStatus.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white">{def.name}</div>

                <div className="mt-3 flex items-baseline justify-between">
                  {bestAttempt ? (
                    <div>
                      <span className="text-xl font-bold font-mono text-white">
                        {bestAttempt.rawValue}
                      </span>{' '}
                      <span className="text-xs font-mono text-slate-400">{def.unit}</span>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                        Score: {bestAttempt.normalizedScore} pts
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No attempts logged</span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartAssessment(def);
                    }}
                    className="p-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    title={`Record ${def.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Test Detail: Trend Chart & Benchmark Distribution */}
      {activeTrendAssessment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ProgressTrendChart
            attempts={activeTrendAttempts}
            assessmentName={activeTrendAssessment.name}
            unit={activeTrendAssessment.unit}
          />

          {benchmarkResult?.benchmark && latestSelectedAttempt ? (
            <BenchmarkBarChart
              benchmark={benchmarkResult.benchmark}
              rawValue={latestSelectedAttempt.rawValue}
              unit={activeTrendAssessment.unit}
              direction={activeTrendAssessment.direction}
              athleteName={currentAthleteProfile.fullName}
            />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400">Benchmark Data</span>
              <p className="text-sm text-slate-300 max-w-sm">
                Record an attempt on {activeTrendAssessment.name} to view cohort distribution and percentile rankings.
              </p>
              <button
                onClick={() => handleStartAssessment(activeTrendAssessment)}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold"
              >
                Log Test Attempt
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assessment History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Assessment Attempt History
            </h4>
            <p className="text-xs text-slate-400">
              Chronological log of self-entries, CV-analyzed clips, and coach verifications.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {athleteAttempts.length} Records
          </span>
        </div>

        {athleteAttempts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No assessment attempts on record yet. Complete your first test above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Raw Result</th>
                  <th className="py-3 px-4">Normalized Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Evidence</th>
                  <th className="py-3 px-4">Reviewer Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                {athleteAttempts.map(attempt => {
                  const def = assessmentDefinitions.find(d => d.id === attempt.assessmentId);
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {def?.name || attempt.assessmentId}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{attempt.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {attempt.rawValue} {attempt.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">
                        {attempt.normalizedScore} pts
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border ${
                            attempt.verificationStatus === 'coach_verified'
                              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                              : attempt.verificationStatus === 'cv_analyzed'
                              ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40'
                              : attempt.verificationStatus === 'flagged_for_review'
                              ? 'text-rose-400 bg-rose-950/60 border-rose-800/40'
                              : 'text-slate-300 bg-slate-800 border-slate-700'
                          }`}
                        >
                          {attempt.verificationStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {attempt.videoUrl ? (
                          <button
                            onClick={() => setVideoModalAttempt(attempt)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-xs underline"
                          >
                            <FileVideo className="w-3.5 h-3.5" />
                            Inspect CV
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {attempt.reviewerNotes || attempt.athleteNotes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assessment Wizard Modal */}
      <AssessmentWizardModal
        assessment={selectedAssessmentForModal}
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setSelectedAssessmentForModal(null);
        }}
      />

      {/* Athlete Profile Settings Modal */}
      <AthleteProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Video Inspector Modal */}
      {videoModalAttempt && (
        <VideoAnalysisModal
          isOpen={!!videoModalAttempt}
          onClose={() => setVideoModalAttempt(null)}
          initialVideoUrl={videoModalAttempt.videoUrl}
          assessment={assessmentDefinitions.find(d => d.id === videoModalAttempt.assessmentId)}
        />
      )}
    </div>
  );
};
