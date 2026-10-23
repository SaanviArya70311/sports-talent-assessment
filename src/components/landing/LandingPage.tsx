import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  ShieldCheck,
  ChevronRight,
  Play,
  CheckCircle2,
  Users,
  Compass,
  ArrowUpRight,
  Layers,
  Sparkles,
  Sliders,
  HelpCircle,
  Eye,
  FileVideo,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateNormalizedScore } from '../../utils/scoringEngine';
import { AthleticRadarChart } from '../charts/AthleticRadarChart';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreCoaches: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreCoaches
}) => {
  const { switchRole } = useApp();

  // Interactive Live Scoring Simulator for visitors
  const [simSprint, setSimSprint] = useState<number>(4.65);
  const [simJump, setSimJump] = useState<number>(72);
  const [simPushups, setSimPushups] = useState<number>(46);

  const sprintScore = calculateNormalizedScore('sprint-40m', simSprint).normalizedScore;
  const jumpScore = calculateNormalizedScore('vertical-jump', simJump).normalizedScore;
  const pushupScore = calculateNormalizedScore('push-ups', simPushups).normalizedScore;

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Elitez guarantee fair and transparent scoring?',
      a: 'Elitez uses pure deterministic mathematical normalization formulas based on validated physiological benchmarks. We never use generative AI to guess scores or rankings. Every raw measurement (e.g. 4.62 seconds) is shown side-by-side with its normalized score, and all scoring rule versions are auditable.'
    },
    {
      q: 'How does video verification work?',
      a: 'Athletes can upload video evidence of their attempts. Our client-side motion analyzer assists by tracking anatomical landmarks (shoulders, hips, knees) and estimating cadence. Crucially, computer vision is treated as an estimation tool; certified combine badges require audit by an authorized human coach.'
    },
    {
      q: 'Are minor athletes protected on the platform?',
      a: 'Yes. Athletes under 18 have automatic safeguarding controls: direct contact details and geographic coordinates are withheld from public view and only accessible to accredited collegiate scouts with verified credentials.'
    },
    {
      q: 'Can coaches recruit directly through Elitez?',
      a: 'Accredited coaches and scouts have access to multi-parameter filters (sport, position, age, verified combine scores). Coaches can review video evidence, add private scouting notes, build shortlists, and initiate contact in compliance with sporting body regulations.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-5xl mx-auto px-4">
        {/* Subtle background ambient radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 font-mono mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Standardized Sports Talent Assessment & Scout Discovery</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
          Talent Recognized by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Data</span>, Not Chance.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Standardized athletic testing, video movement verification, and transparent peer benchmarks. Empowering athletes to showcase verified physical potential to collegiate coaches and scouts worldwide.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => {
              switchRole('athlete');
              onGetStarted();
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            Create Athlete Profile
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={() => {
              switchRole('coach');
              onExploreCoaches();
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            Access Scout Network
          </button>
        </div>

        {/* Core Metric Highlights */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Standardized Tests', val: '6+ Protocols', sub: 'Speed, Power, Core & Agility' },
            { label: 'Scoring Engine', val: '100% Deterministic', sub: 'Auditable mathematical scale' },
            { label: 'Video Analysis', val: 'CV Assisted', sub: 'Joint landmark cadence tracking' },
            { label: 'Safeguarding', val: 'Minor Protected', sub: 'Consent-verified data sharing' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-left">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">{stat.label}</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">{stat.val}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / ASSESSMENT PROCESS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Clear, Repeatable Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            The 5-Step Assessment Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Eliminating subjective bias through structured test protocols and verifiable proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'Build Athletic Profile',
              desc: 'Log sport, physical measurements, position, and voluntary biometrics with parental consent.'
            },
            {
              num: '02',
              title: 'Standardized Tests',
              desc: 'Execute guided drills: 40m sprint, vertical jump, push-ups, shuttle run, and beep test.'
            },
            {
              num: '03',
              title: 'Submit Video Evidence',
              desc: 'Upload smartphone video for automated landmark verification and rep cadence tracking.'
            },
            {
              num: '04',
              title: 'Transparent Scoring',
              desc: 'Review deterministic scores and cohort benchmarks cited from published athletic research.'
            },
            {
              num: '05',
              title: 'Scout Discovery',
              desc: 'Share verified athletic fingerprint with collegiate coaches and accredited recruiters.'
            }
          ].map(step => (
            <div
              key={step.num}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <span className="text-2xl font-mono font-extrabold text-cyan-500/40 block mb-2">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-cyan-400 font-mono">
                Verified Protocol
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE TALENT ASSESSMENT SIMULATOR */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                Live Interactive Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Deterministic Scoring Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Adjust test values below to observe real-time calculation and multi-pillar normalization.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl self-start md:self-auto">
              Scoring Engine: v2.4-deterministic
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Sprint Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-semibold">40-Meter Sprint (Speed)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {simSprint}s → <span className="text-white">{sprintScore} pts</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="4.30"
                  max="6.50"
                  step="0.05"
                  value={simSprint}
                  onChange={e => setSimSprint(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Elite (4.30s)</span>
                  <span>Average (5.25s)</span>
                  <span>Entry (6.50s)</span>
                </div>
              </div>

              {/* Jump Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-semibold">Vertical Jump (Power)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {simJump}cm → <span className="text-white">{jumpScore} pts</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="1"
                  value={simJump}
                  onChange={e => setSimJump(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Entry (30cm)</span>
                  <span>Median (53cm)</span>
                  <span>Elite (90cm)</span>
                </div>
              </div>

              {/* Push-ups Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-semibold">Push-ups in 60s (Strength)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {simPushups} reps → <span className="text-white">{pushupScore} pts</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="65"
                  step="1"
                  value={simPushups}
                  onChange={e => setSimPushups(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Entry (10 reps)</span>
                  <span>Median (32 reps)</span>
                  <span>Elite (65 reps)</span>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                * Real Elitez tests incorporate bounds checks to reject physiologically impossible numbers (e.g. 40m in 1.2s).
              </div>
            </div>

            {/* Simulated Live Radar Chart Output */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold mb-2">
                Simulated Athletic Fingerprint
              </span>
              <AthleticRadarChart
                categoryScores={{
                  speed: sprintScore,
                  power: jumpScore,
                  strength: pushupScore,
                  endurance: 75,
                  agility: 80
                }}
                athleteName="Simulator"
              />
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                Composite Score: {Math.round((sprintScore + jumpScore + pushupScore + 75 + 80) / 5)} / 100
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM FEATURES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Built for Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Engineered for Fair Sports Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            No generative AI black-box scoring. Full transparency at every tier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Deterministic Scoring Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every score maps raw metrics onto documented, auditable formulas. Both raw times and normalized points are permanently preserved in attempt records.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <FileVideo className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Browser Video & Pose Inspection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload smartphone combine videos. Inspect joint angles, movement cadence, and slow-motion frames without sending private video files to public CDNs.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Safeguarded Minor Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explicit parental consent management for minor athletes. Location and contact coordinates are encrypted and hidden from non-verified observers.
            </p>
          </div>
        </div>
      </section>

      {/* FOR COACHES & SCOUTS SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1426] to-slate-900 border border-cyan-800/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              For Collegiate & Professional Scouts
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Identify High-Ceiling Prospects with Verifiable Biometrics
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cut through self-reported highlight reels. Filter athletes by verified combine gates, 5-pillar radar balances, and side-by-side video movement scrubbers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  switchRole('coach');
                  onExploreCoaches();
                }}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
              >
                Launch Scout Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Questions & Answers
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-cyan-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
