import React from 'react';
import { Zap, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavigate: (view: 'landing' | 'athlete' | 'coach' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060A12] text-xs text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              </div>
              <span className="text-base font-extrabold text-white font-mono tracking-tight">
                ELITEZ<span className="text-cyan-400">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Standardized sports talent assessment, deterministic scoring, video movement tracking, and collegiate scout discovery.
            </p>
            <div className="text-[11px] font-mono text-cyan-400">
              Scoring Engine v2.4-deterministic
            </div>
          </div>

          {/* Platform Nav */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('athlete')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Athlete Performance Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('coach')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Scout & Coach Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Standard Testing Protocols
                </button>
              </li>
            </ul>
          </div>

          {/* Test Protocols */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Testing Protocols
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>40-Meter Linear Acceleration (40M)</li>
              <li>Countermovement Vertical Jump (VJ)</li>
              <li>Push-ups Cadence Stamina (PU-60)</li>
              <li>Pro Agility 5-10-5 Lateral Shuttle</li>
              <li>20m Multi-Stage Beep Test (Endurance)</li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Governance & Privacy
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Privacy Policy & Minor Safeguards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Terms of Service & Fair Assessment Charter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('disclaimer')}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Benchmark Data Citations & Disclaimers
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-xl text-center sm:text-left">
            * Fair Evaluation Notice: Elitez provides objective, deterministic measurement tools. Assessment scores and benchmark percentiles are informative reference indicators and do not, by themselves, prove an athlete's potential or guarantee team selection.
          </p>

          <div className="font-mono text-slate-400 shrink-0">
            © {new Date().getFullYear()} Elitez Sports Technology. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
