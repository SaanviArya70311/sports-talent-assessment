import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  FileVideo,
  Eye,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  ChevronRight,
  ArrowUpDown,
  Lock,
  Layers,
  Sparkles,
  Award,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AthleteProfile, AssessmentAttempt, AssessmentDefinition } from '../../types';
import { calculateCompositeScore } from '../../utils/scoringEngine';
import { compareWithBenchmark } from '../../utils/benchmarks';
import { AthleticRadarChart } from '../charts/AthleticRadarChart';
import { ProgressTrendChart } from '../charts/ProgressTrendChart';
import { VideoAnalysisModal } from '../video/VideoAnalysisModal';

export const CoachDashboard: React.FC = () => {
  const {
    athletes,
    attempts,
    assessmentDefinitions,
    shortlist,
    toggleShortlist,
    updateShortlistNotes,
    verifyAttempt,
    currentCoachProfile
  } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'overall' | 'speed' | 'power' | 'relevance'>('overall');

  // Selected athlete for deep inspection drawer/modal
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(athletes[0] || null);

  // Compare mode: select up to 2 athletes
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareAthleteIds, setCompareAthleteIds] = useState<string[]>([
    athletes[0]?.id || '',
    athletes[1]?.id || ''
  ]);

  // Review & verification modal state
  const [inspectAttemptVideo, setInspectAttemptVideo] = useState<AssessmentAttempt | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState<string>('');
  const [activeReviewAttemptId, setActiveReviewAttemptId] = useState<string | null>(null);

  // Filter athletes authorized for coach view:
  // Must be 'public' or 'coaches_only'. 'private' profiles are not discoverable.
  const authorizedAthletes = athletes.filter(a => a.profileVisibility !== 'private');

  // Filter athletes by search & criteria
  const filteredAthletes = authorizedAthletes.filter(athlete => {
    // Name, sport, position search
    const matchesSearch =
      athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.primarySport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.city.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (sportFilter !== 'all' && athlete.primarySport !== sportFilter) {
      return false;
    }

    if (ageGroupFilter === 'U17' && athlete.age > 16) return false;
    if (ageGroupFilter === 'U19' && (athlete.age < 17 || athlete.age > 18)) return false;
    if (ageGroupFilter === 'Adult' && athlete.age < 19) return false;

    if (verificationFilter === 'verified_only') {
      const hasVerified = attempts.some(
        att => att.athleteId === athlete.id && att.verificationStatus === 'coach_verified'
      );
      if (!hasVerified) return false;
    }

    return true;
  });

  // Unique sports for filter dropdown
  const uniqueSports = Array.from(new Set(authorizedAthletes.map(a => a.primarySport)));

  // Selected athlete's attempts
  const selectedAttempts = selectedAthlete
    ? attempts.filter(a => a.athleteId === selectedAthlete.id)
    : [];

  const selectedComposite = selectedAthlete
    ? calculateCompositeScore(assessmentDefinitions, selectedAttempts)
    : null;

  // Check shortlist status for selected athlete
  const selectedShortlistEntry = selectedAthlete
    ? shortlist.find(s => s.athleteId === selectedAthlete.id)
    : null;

  const isShortlisted = !!selectedShortlistEntry;

  const handleVerifySubmission = (attemptId: string, status: 'coach_verified' | 'flagged_for_review') => {
    verifyAttempt(attemptId, status, reviewNoteInput || 'Verified by Scout via Combine & Video records');
    setActiveReviewAttemptId(null);
    setReviewNoteInput('');
  };

  // Compare mode athletes
  const compareAthleteA = athletes.find(a => a.id === compareAthleteIds[0]);
  const compareAthleteB = athletes.find(a => a.id === compareAthleteIds[1]);

  const attemptsA = compareAthleteA ? attempts.filter(a => a.athleteId === compareAthleteA.id) : [];
  const attemptsB = compareAthleteB ? attempts.filter(a => a.athleteId === compareAthleteB.id) : [];

  const compositeA = compareAthleteA ? calculateCompositeScore(assessmentDefinitions, attemptsA) : null;
  const compositeB = compareAthleteB ? calculateCompositeScore(assessmentDefinitions, attemptsB) : null;

  return (
    <div className="space-y-6">
      {/* Scout Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Coach & Scout Portal
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Verified Organization Access
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Athlete Discovery & Verification Network
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <span className="text-slate-200 font-semibold">{currentCoachProfile?.fullName}</span> ({currentCoachProfile?.organization}). Search verified athletes, review video evidence, and manage shortlists.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                compareMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {compareMode ? 'Exit Compare View' : 'Compare Athletes (Side-by-Side)'}
            </button>
          </div>
        </div>
      </div>

      {/* COMPARISON VIEW IF ACTIVE */}
      {compareMode && compareAthleteA && compareAthleteB && (
        <div className="bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Direct Side-by-Side Comparison
              </span>
              <h3 className="text-base font-bold text-white">
                {compareAthleteA.fullName} vs {compareAthleteB.fullName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={compareAthleteIds[0]}
                onChange={e => setCompareAthleteIds([e.target.value, compareAthleteIds[1]])}
                className="bg-slate-800 border border-slate-700 rounded-lg text-xs p-1.5 text-white"
              >
                {authorizedAthletes.map(a => (
                  <option key={a.id} value={a.id}>{a.fullName} ({a.primarySport})</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-mono">VS</span>
              <select
                value={compareAthleteIds[1]}
                onChange={e => setCompareAthleteIds([compareAthleteIds[0], e.target.value])}
                className="bg-slate-800 border border-slate-700 rounded-lg text-xs p-1.5 text-white"
              >
                {authorizedAthletes.map(a => (
                  <option key={a.id} value={a.id}>{a.fullName} ({a.primarySport})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Athlete A card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={compareAthleteA.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-white text-sm">{compareAthleteA.fullName}</h4>
                  <span className="text-xs text-cyan-400 font-mono">{compareAthleteA.primarySport}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Height / Weight:</span>
                  <span className="font-mono text-white">{compareAthleteA.heightCm}cm / {compareAthleteA.weightKg}kg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Elitez Index:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {compositeA?.isCalculable ? `${compositeA.overallScore} pts` : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>

            {/* Overlaid Radar Chart */}
            <div className="flex flex-col items-center justify-center">
              {compositeA && compositeB && (
                <AthleticRadarChart
                  categoryScores={compositeA.categoryScores}
                  compareScores={compositeB.categoryScores}
                  athleteName={compareAthleteA.fullName}
                  compareLabel={compareAthleteB.fullName}
                />
              )}
            </div>

            {/* Athlete B card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={compareAthleteB.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-white text-sm">{compareAthleteB.fullName}</h4>
                  <span className="text-xs text-amber-400 font-mono">{compareAthleteB.primarySport}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Height / Weight:</span>
                  <span className="font-mono text-white">{compareAthleteB.heightCm}cm / {compareAthleteB.weightKg}kg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Elitez Index:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {compositeB?.isCalculable ? `${compositeB.overallScore} pts` : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter & Discovery Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search athlete, sport, position, city..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <select
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Sports</option>
              {uniqueSports.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Age Group Filter */}
          <div>
            <select
              value={ageGroupFilter}
              onChange={e => setAgeGroupFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Age Brackets</option>
              <option value="U17">U17 (16 & under)</option>
              <option value="U19">U19 (17-18)</option>
              <option value="Adult">Collegiate / Adult (19+)</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={e => setVerificationFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified_only">Coach Verified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Athlete List & Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search Results List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>DISCOVERED ATHLETES ({filteredAthletes.length})</span>
            <span>Sorted by Composite Score</span>
          </div>

          <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredAthletes.map(athlete => {
              const athleteAtts = attempts.filter(a => a.athleteId === athlete.id);
              const comp = calculateCompositeScore(assessmentDefinitions, athleteAtts);
              const isSelected = selectedAthlete?.id === athlete.id;
              const hasVerified = athleteAtts.some(a => a.verificationStatus === 'coach_verified');
              const isWatchlisted = shortlist.some(s => s.athleteId === athlete.id);

              return (
                <div
                  key={athlete.id}
                  onClick={() => setSelectedAthlete(athlete)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={athlete.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm">{athlete.fullName}</h4>
                          {hasVerified && (
                            <span title="Coach Verified Attempts">
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            </span>
                          )}
                          {isWatchlisted && (
                            <span title="On Scout Shortlist">
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 mt-0.5">
                          <span>{athlete.primarySport}</span> · <span>{athlete.position}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {athlete.showLocation ? `${athlete.city}, ${athlete.state}` : 'Location Private'}
                          {athlete.showAge && ` · Age ${athlete.age}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Elitez Index</span>
                      <span className="text-lg font-extrabold font-mono text-cyan-400">
                        {comp.isCalculable ? comp.overallScore : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Athlete Dossier (7 cols) */}
        {selectedAthlete ? (
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedAthlete.avatarUrl}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedAthlete.fullName}</h3>
                    {selectedAthlete.isMinor && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                        Minor (Safeguards Active)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedAthlete.primarySport} · {selectedAthlete.position} · {selectedAthlete.currentTeam}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedAthlete.heightCm}cm · {selectedAthlete.weightKg}kg · {selectedAthlete.yearsExperience} yrs exp
                  </p>
                </div>
              </div>

              {/* Shortlist Toggle Button */}
              <button
                onClick={() => toggleShortlist(selectedAthlete.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isShortlisted
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isShortlisted ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                {isShortlisted ? 'On Shortlist' : 'Add to Shortlist'}
              </button>
            </div>

            {/* Scout Private Notes & Tagging if shortlisted */}
            {isShortlisted && selectedShortlistEntry && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Scout Private Evaluation Notes
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(starVal => (
                      <button
                        key={starVal}
                        onClick={() =>
                          updateShortlistNotes(
                            selectedAthlete.id,
                            selectedShortlistEntry.privateNotes,
                            selectedShortlistEntry.tags,
                            starVal
                          )
                        }
                        className={`text-xs ${
                          starVal <= selectedShortlistEntry.rating ? 'text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedShortlistEntry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-amber-900/40 text-amber-200 border border-amber-800/40 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  {selectedShortlistEntry.privateNotes.map((note, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2 rounded text-[11px] text-slate-300">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Overview: 5-Pillars & Radar Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Performance Pillars
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {selectedComposite?.isCalculable ? `${selectedComposite.overallScore} / 100` : 'Pillars Incomplete'}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  {selectedComposite?.isCalculable
                    ? 'Evaluated across Speed, Power, Strength, Agility, and Endurance.'
                    : selectedComposite?.reason}
                </p>
              </div>

              {selectedComposite && (
                <AthleticRadarChart
                  categoryScores={selectedComposite.categoryScores}
                  athleteName={selectedAthlete.fullName}
                />
              )}
            </div>

            {/* Assessment Attempts & Scout Verification Action Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Verified Attempts & Evidence Queue
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedAttempts.length} submissions
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedAttempts.map(attempt => {
                  const def = assessmentDefinitions.find(d => d.id === attempt.assessmentId);
                  const isVerified = attempt.verificationStatus === 'coach_verified';
                  const isUnderReview = activeReviewAttemptId === attempt.id;

                  return (
                    <div
                      key={attempt.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {def?.name || attempt.assessmentId}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                isVerified
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
                          </div>

                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            Recorded: {attempt.date} · Source: {attempt.source.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold font-mono text-white">
                            {attempt.rawValue} {attempt.unit}
                          </span>
                          <span className="text-xs font-mono text-cyan-400 block">
                            Score: {attempt.normalizedScore} pts
                          </span>
                        </div>
                      </div>

                      {/* Video clip attachment with CV link */}
                      {attempt.videoUrl && (
                        <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2">
                            <FileVideo className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300 font-mono text-[11px]">
                              {attempt.videoMetadata?.filename || 'combine_video.mp4'} (
                              {attempt.videoMetadata?.poseReliabilityPct || 95}% CV Confidence)
                            </span>
                          </div>

                          <button
                            onClick={() => setInspectAttemptVideo(attempt)}
                            className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded font-mono text-xs transition-colors"
                          >
                            Review Video & Keypoints
                          </button>
                        </div>
                      )}

                      {/* Reviewer / Coach verification note */}
                      {attempt.reviewerNotes && (
                        <div className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/50">
                          Scout Note: "{attempt.reviewerNotes}" — {attempt.reviewedBy}
                        </div>
                      )}

                      {/* Coach Verification Action Bar */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Scout Verification:</span>

                        {isUnderReview ? (
                          <div className="flex items-center gap-2 w-full max-w-md ml-3">
                            <input
                              type="text"
                              placeholder="Add verification note (e.g. Official gate time)..."
                              value={reviewNoteInput}
                              onChange={e => setReviewNoteInput(e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-xs p-1.5 rounded flex-1 text-white"
                            />
                            <button
                              onClick={() => handleVerifySubmission(attempt.id, 'coach_verified')}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerifySubmission(attempt.id, 'flagged_for_review')}
                              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-xs"
                            >
                              Flag
                            </button>
                            <button
                              onClick={() => setActiveReviewAttemptId(null)}
                              className="text-slate-400 text-xs hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveReviewAttemptId(attempt.id)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold transition-colors"
                            >
                              Audit / Update Status
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Select an athlete from the list to review detailed assessment history and video evidence.
          </div>
        )}
      </div>

      {/* Video Keypoint Inspector Modal */}
      {inspectAttemptVideo && (
        <VideoAnalysisModal
          isOpen={!!inspectAttemptVideo}
          onClose={() => setInspectAttemptVideo(null)}
          initialVideoUrl={inspectAttemptVideo.videoUrl}
          assessment={assessmentDefinitions.find(d => d.id === inspectAttemptVideo.assessmentId)}
        />
      )}
    </div>
  );
};
