import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  FileVideo,
  ShieldCheck,
  Save,
  Info
} from 'lucide-react';
import { AssessmentDefinition } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateNormalizedScore, validateAssessmentInput } from '../../utils/scoringEngine';
import { compareWithBenchmark } from '../../utils/benchmarks';
import { VideoAnalysisModal } from '../video/VideoAnalysisModal';

interface AssessmentWizardModalProps {
  assessment: AssessmentDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentWizardModal: React.FC<AssessmentWizardModalProps> = ({
  assessment,
  isOpen,
  onClose
}) => {
  const { addAttempt, assessmentDrafts, saveDraft, clearDraft, currentAthleteProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [rawValue, setRawValue] = useState<string>('');
  const [athleteNotes, setAthleteNotes] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoMetadata, setVideoMetadata] = useState<any>(undefined);
  const [source, setSource] = useState<'self_entry' | 'video_cv' | 'combine_event'>('self_entry');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Restore draft if available for this assessment
  useEffect(() => {
    if (assessment) {
      const draft = assessmentDrafts[assessment.id];
      if (draft) {
        setRawValue(draft.rawValue);
        setAthleteNotes(draft.athleteNotes);
      } else {
        setRawValue('');
        setAthleteNotes('');
      }
      setStep(1);
      setSubmissionSuccess(false);
      setValidationError(null);
      setValidationWarning(null);
    }
  }, [assessment, assessmentDrafts]);

  if (!isOpen || !assessment) return null;

  const numVal = parseFloat(rawValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawValue(val);
    saveDraft(assessment.id, val, athleteNotes);

    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      const result = validateAssessmentInput(assessment, parsed);
      if (!result.isValid) {
        setValidationError(result.error || null);
        setValidationWarning(null);
      } else {
        setValidationError(null);
        setValidationWarning(result.warning || null);
      }
    } else {
      setValidationError(null);
      setValidationWarning(null);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAthleteNotes(val);
    saveDraft(assessment.id, rawValue, val);
  };

  const calculatedPreview = !isNaN(numVal) && numVal > 0
    ? calculateNormalizedScore(assessment.id, numVal)
    : null;

  const benchmarkPreview = !isNaN(numVal) && numVal > 0
    ? compareWithBenchmark(assessment.id, numVal, assessment.direction)
    : null;

  const handleSubmit = () => {
    const parsed = parseFloat(rawValue);
    const result = addAttempt({
      assessmentId: assessment.id,
      rawValue: parsed,
      athleteNotes,
      videoUrl,
      videoMetadata,
      source
    });

    if (result.success) {
      setSubmissionSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setValidationError(result.error || 'Failed to record attempt.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-[#0B111E] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Step {step} of 3 · Standardized Protocol
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {assessment.name}
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {assessment.category.toUpperCase()}
                </span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper indicator */}
          <div className="grid grid-cols-3 border-b border-slate-800/80 bg-slate-900/40 text-xs font-medium text-slate-400">
            <div className={`py-2 text-center border-b-2 transition-colors ${step === 1 ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-transparent'}`}>
              1. Instructions & Safety
            </div>
            <div className={`py-2 text-center border-b-2 transition-colors ${step === 2 ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-transparent'}`}>
              2. Measurement & Evidence
            </div>
            <div className={`py-2 text-center border-b-2 transition-colors ${step === 3 ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-transparent'}`}>
              3. Review & Submit
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {submissionSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Assessment Attempt Recorded!</h4>
                <p className="text-sm text-slate-400 max-w-sm">
                  Your results have been deterministically normalized and added to your performance log.
                </p>
              </div>
            ) : (
              <>
                {/* STEP 1: Instructions & Safety */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-mono text-cyan-400 uppercase font-semibold">Test Protocol</h4>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                        {assessment.description}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Required Equipment:</h5>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {assessment.requiredEquipment.map((eq, i) => (
                          <li key={i}>{eq}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Execution Steps:</h5>
                      <div className="space-y-2">
                        {assessment.instructions.map((stepText, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{stepText}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-200/90 space-y-1">
                        <span className="font-semibold block text-amber-300">Safety & Biomechanics Notice:</span>
                        <ul className="list-disc list-inside text-amber-300/80 space-y-0.5">
                          {assessment.safetyGuidelines.map((sg, i) => (
                            <li key={i}>{sg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Measurement & Video Evidence */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* Raw Value Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-200 uppercase font-mono">
                          Recorded Result ({assessment.metricName})
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Acceptable Range: {assessment.minAllowedValue} – {assessment.maxAllowedValue} {assessment.unit}
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          step={assessment.inputType === 'integer' ? '1' : '0.01'}
                          placeholder={`Enter ${assessment.metricName.toLowerCase()} in ${assessment.unit}...`}
                          value={rawValue}
                          onChange={handleValueChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-cyan-400 font-bold">
                          {assessment.unit}
                        </div>
                      </div>

                      {validationError && (
                        <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {validationError}
                        </p>
                      )}

                      {validationWarning && (
                        <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          {validationWarning}
                        </p>
                      )}
                    </div>

                    {/* Video Attachment Option */}
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileVideo className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-white">Video Verification Evidence</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          Recommended for Scouts
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        Attach a video of your attempt. Video clips can be analyzed via browser computer vision to track keypoint movement, rep cadence, and form consistency.
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsVideoModalOpen(true)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                        >
                          <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
                          {videoUrl ? 'Inspect / Change Video' : 'Add Assessment Video & Run CV'}
                        </button>

                        {videoUrl && (
                          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {videoMetadata?.filename || 'Video attached'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Environmental or Athlete Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Surface type, weather conditions, equipment used..."
                        value={athleteNotes}
                        onChange={handleNotesChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Offline draft autosave note */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Save className="w-3.5 h-3.5 text-slate-400" />
                      <span>Form automatically saved as local draft in case connection drops.</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review & Submit */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                      <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                        Deterministic Score Calculation
                      </span>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Raw Value</span>
                          <span className="text-2xl font-bold font-mono text-white">
                            {rawValue} <span className="text-sm font-normal text-slate-400">{assessment.unit}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-400 block">Normalized Elitez Score</span>
                          <span className="text-2xl font-bold font-mono text-cyan-400">
                            {calculatedPreview?.normalizedScore || '—'} <span className="text-sm font-normal text-slate-400">/ 100</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono">
                        Tier: <span className="text-emerald-400 font-semibold">{calculatedPreview?.percentileTier || '—'}</span>
                      </div>
                    </div>

                    {/* Benchmark comparison preview */}
                    {benchmarkPreview?.hasBenchmark && (
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-xs space-y-1">
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          Benchmark Standing Preview ({benchmarkPreview.benchmark?.ageGroup})
                        </span>
                        <div className="text-sm font-semibold text-white">
                          {benchmarkPreview.percentileBand}
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          {benchmarkPreview.comparisonText}
                        </p>
                      </div>
                    )}

                    {/* Verification Status Notice */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        Your submission will be tagged as{' '}
                        <span className="text-slate-200 font-semibold">
                          {videoUrl ? 'CV-Analyzed' : 'Athlete-Reported'}
                        </span>
                        . Coaches can inspect raw metrics, video proof, and issue a verified badge after combine or video review.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Controls */}
          {!submissionSuccess && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#090D16]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  disabled={step === 2 && (!rawValue || !!validationError)}
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Submit Assessment
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Video Modal */}
      <VideoAnalysisModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        assessment={assessment}
        initialVideoUrl={videoUrl}
        onConfirmAnalysis={res => {
          setVideoUrl(res.videoUrl);
          setVideoMetadata(res.videoMetadata);
          setSource('video_cv');
          if (!rawValue) {
            setRawValue(res.measuredValue.toString());
          }
        }}
      />
    </>
  );
};
