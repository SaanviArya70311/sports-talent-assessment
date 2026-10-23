import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#0B111E] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              {type === 'privacy' && <Lock className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'disclaimer' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">
                {type === 'privacy' && 'Elitez Privacy Policy & Minor Safeguards'}
                {type === 'terms' && 'Elitez Terms of Service & Fair Assessment Charter'}
                {type === 'disclaimer' && 'Performance & Benchmark Disclaimers'}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Effective Date: October 2026 · Standard Version 2.4
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Data Minimization & Storage</h4>
              <p>
                Elitez collects only physical and athletic assessment information strictly required for standardized talent evaluation. We do not sell athlete personal data. Physical measurements (height, weight, wingspan) are submitted voluntarily by athletes.
              </p>

              <h4 className="font-bold text-white text-sm">2. Minor Protection (Under 18)</h4>
              <p>
                For athletes identified as minors, verified parental or guardian consent is mandatory prior to scout discovery indexing. Exact residential street addresses, personal telephone numbers, and private contact credentials are never published in open directories.
              </p>

              <h4 className="font-bold text-white text-sm">3. Video Footage Privacy</h4>
              <p>
                Assessment videos uploaded to the platform are private by default. They are accessible solely by the athlete and verified collegiate or club scouts granted explicit permission. Video analysis (pose tracking) executes client-side where possible.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Non-Guarantee of Selection</h4>
              <p>
                Elitez provides standardized athletic measurement tools and benchmark comparison references. Neither an assessment score, nor a normalized composite index, guarantees sporting team selection, collegiate scholarship, or professional recruitment.
              </p>

              <h4 className="font-bold text-white text-sm">2. Transparent Scoring Standards</h4>
              <p>
                All performance ratings are derived from deterministic mathematical formulas. We strictly prohibit generative AI hallucination of scores or rankings. Athletes are expected to submit truthful, unedited video footage.
              </p>

              <h4 className="font-bold text-white text-sm">3. Safety Protocols</h4>
              <p>
                Athletes are solely responsible for ensuring proper physical conditioning, certified equipment, adequate warm-up, and a safe physical environment before executing any physical exertion test.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Benchmark Context & Limitations</h4>
              <p>
                Cohort percentiles (e.g., 75th percentile for U18 Track) are referenced against published peer-reviewed studies and national combine datasets as cited on each test card. Measurement protocols, surface materials, timing equipment (hand-held vs. laser timing gates), and environmental altitude may cause variations.
              </p>

              <h4 className="font-bold text-white text-sm">2. Computer Vision Cadence Notice</h4>
              <p>
                Browser-based computer vision analysis provides automated movement cadence and rep-counting estimates. Official verification badges require manual audit by an accredited coach or combine official.
              </p>
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-[#090D16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
