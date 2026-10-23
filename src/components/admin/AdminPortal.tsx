import React, { useState } from 'react';
import {
  Settings,
  Scale,
  ShieldAlert,
  Database,
  History,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Server,
  UserCheck,
  ChevronRight,
  Save,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssessmentDefinition, AuditLog } from '../../types';

export const AdminPortal: React.FC = () => {
  const {
    assessmentDefinitions,
    updateAssessmentDefinition,
    auditLogs,
    attempts,
    verifyAttempt,
    benchmarks,
    isDemoMode,
    setDemoMode,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scoring' | 'review_queue' | 'benchmarks' | 'audit_trail' | 'backend_setup'>('scoring');
  const [selectedDefId, setSelectedDefId] = useState<string>(assessmentDefinitions[0]?.id || '');
  const [editMin, setEditMin] = useState<string>('');
  const [editMax, setEditMax] = useState<string>('');
  const [editWeight, setEditWeight] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Review queue: flagged submissions
  const flaggedAttempts = attempts.filter(a => a.verificationStatus === 'flagged_for_review');

  const selectedDef = assessmentDefinitions.find(d => d.id === selectedDefId);

  const handleSelectDef = (def: AssessmentDefinition) => {
    setSelectedDefId(def.id);
    setEditMin(def.minAllowedValue.toString());
    setEditMax(def.maxAllowedValue.toString());
    setEditWeight(def.standardWeight.toString());
    setSaveFeedback(null);
  };

  const handleSaveDefChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDef) return;

    const min = parseFloat(editMin) || selectedDef.minAllowedValue;
    const max = parseFloat(editMax) || selectedDef.maxAllowedValue;
    const weight = parseFloat(editWeight) || selectedDef.standardWeight;

    updateAssessmentDefinition({
      ...selectedDef,
      minAllowedValue: min,
      maxAllowedValue: max,
      standardWeight: weight
    });

    setSaveFeedback(`Parameters for ${selectedDef.name} saved! Logged in audit trail.`);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                System Administration
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                Admin Console
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Assessment Standards, Scoring Engine & Audit Console
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage physiological boundaries, deterministic scoring weights, submission review queue, and benchmark datasets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Environment:</span>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded">
              Demo/Local State Active
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { id: 'scoring', label: 'Scoring Rules & Bounds', icon: Scale },
            { id: 'review_queue', label: `Flagged Queue (${flaggedAttempts.length})`, icon: ShieldAlert },
            { id: 'benchmarks', label: 'Benchmark Datasets', icon: Database },
            { id: 'audit_trail', label: 'Audit Trail', icon: History },
            { id: 'backend_setup', label: 'Production Backend Config', icon: Server }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Scoring Rules & Parameters Editor */}
      {activeTab === 'scoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">
              Active Assessment Protocols
            </span>
            <div className="space-y-1.5">
              {assessmentDefinitions.map(def => (
                <button
                  key={def.id}
                  onClick={() => handleSelectDef(def)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                    selectedDefId === def.id
                      ? 'bg-slate-900 border-cyan-500 text-white font-bold'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-white block font-medium">{def.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{def.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            {selectedDef ? (
              <form onSubmit={handleSaveDefChanges} className="space-y-5">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    Protocol Parameter Tuning
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedDef.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedDef.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Min Plausible ({selectedDef.unit})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editMin || selectedDef.minAllowedValue}
                      onChange={e => setEditMin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Values below will be rejected as errors.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Max Plausible ({selectedDef.unit})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editMax || selectedDef.maxAllowedValue}
                      onChange={e => setEditMax(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Values above will be rejected.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Composite Weight (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={editWeight || selectedDef.standardWeight}
                      onChange={e => setEditWeight(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Standard weight in overall index.
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                    Current Normalization Formula
                  </span>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Direction: {selectedDef.direction === 'higher_is_better' ? 'Higher raw value = Higher score' : 'Lower raw value = Higher score'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Scoring Version: v2.4-deterministic · Reproducibility audited.
                  </div>
                </div>

                {saveFeedback && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {saveFeedback}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Rule Changes to Audit Trail
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: Flagged Review Queue */}
      {activeTab === 'review_queue' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Submission Verification & Anomaly Review Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submissions flagged automatically due to physiological anomalies, world-record proximity, or sensor noise.
            </p>
          </div>

          {flaggedAttempts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              All submissions currently audited. No flagged anomalies in queue!
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedAttempts.map(attempt => {
                const def = assessmentDefinitions.find(d => d.id === attempt.assessmentId);
                return (
                  <div
                    key={attempt.id}
                    className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{def?.name}</span>
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                            Flagged for Review
                          </span>
                        </div>
                        <p className="text-xs text-rose-300/90 font-mono mt-1">
                          Flag Reason: {attempt.flagReason || 'Extreme statistical deviation detected.'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-white">
                          {attempt.rawValue} {attempt.unit}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Date: {attempt.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() =>
                          verifyAttempt(
                            attempt.id,
                            'coach_verified',
                            'Reviewed by Admin: Video confirmed legitimate combine timing'
                          )
                        }
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors"
                      >
                        Approve & Verify
                      </button>
                      <button
                        onClick={() =>
                          verifyAttempt(
                            attempt.id,
                            'flagged_for_review',
                            'Rejected by Admin: Timing gate error or wind-assisted invalid attempt'
                          )
                        }
                        className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-xs transition-colors"
                      >
                        Confirm Invalid & Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Benchmark Datasets */}
      {activeTab === 'benchmarks' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Benchmark Reference Datasets & Cohort Citations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All benchmarks displayed across Elitez are backed by documented scientific literature or national combine studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarks.map(bm => {
              const def = assessmentDefinitions.find(d => d.id === bm.assessmentId);
              return (
                <div key={bm.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                      {def?.name} · {bm.ageGroup}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Sample: {bm.sampleSize.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{bm.sourceName}</h4>
                  <p className="text-xs text-slate-400 italic">Citation: {bm.sourceCitation}</p>

                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px] pt-2 border-t border-slate-800">
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">p10</span>
                      <span className="text-slate-300 font-bold">{bm.p10}</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">p25</span>
                      <span className="text-slate-300 font-bold">{bm.p25}</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-[9px] text-cyan-400 block">p50</span>
                      <span className="text-cyan-300 font-bold">{bm.p50}</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">p75</span>
                      <span className="text-slate-300 font-bold">{bm.p75}</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-[9px] text-emerald-400 block">p90</span>
                      <span className="text-emerald-300 font-bold">{bm.p90}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                    Protocol note: {bm.limitationsNote}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Trail */}
      {activeTab === 'audit_trail' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">System Audit Trail</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable log of scoring weight changes, coach verifications, and anomalous submission events.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-semibold">{log.actorName}</td>
                    <td className="py-2.5 px-3 text-purple-400 font-semibold">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.targetId}</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px] font-sans max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Production Backend Setup Guide */}
      {activeTab === 'backend_setup' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Production Backend Connection Guide
              </h3>
              <p className="text-xs text-slate-400">
                Currently running in <span className="text-amber-400 font-bold">Local-First Reactive Mode</span>. All attempts, scores, and coach notes persist reliably in local storage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono text-cyan-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Option A: Supabase PostgreSQL & Auth
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                To connect a production Supabase instance:
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside font-mono">
                <li>Create project at supabase.com</li>
                <li>Copy <span className="text-slate-200">SUPABASE_URL</span> and <span className="text-slate-200">SUPABASE_ANON_KEY</span></li>
                <li>Add to Secrets Panel in Google AI Studio or .env</li>
                <li>Apply Row Level Security (RLS) schema from <span className="text-slate-200">schema.sql</span></li>
              </ol>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono text-cyan-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                Option B: Google Cloud Run & Firebase
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                To deploy to Google Cloud Run:
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside font-mono">
                <li>Run containerized build via Cloud Build</li>
                <li>Set <span className="text-slate-200">PORT=3000</span></li>
                <li>Attach Cloud SQL PostgreSQL or Firebase Firestore database</li>
                <li>Run health check via /api/health</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
