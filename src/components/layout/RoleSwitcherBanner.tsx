import React from 'react';
import { UserCheck, ShieldAlert, Trophy, Users, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentRole, switchRole, currentUser, isDemoMode } = useApp();

  return (
    <aside aria-label="Demo environment and persona switcher" className="bg-[#060A12] border-b border-cyan-950/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Active Persona: <span className="text-white font-bold">{currentUser.fullName}</span> (
            <span className="text-cyan-400 capitalize">{currentRole}</span>)
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            Local-First Reactive State (Audit trail enabled)
          </span>
        </div>

        {/* Quick Role Switch Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[10px] uppercase font-mono text-slate-400 mr-1">Switch:</span>
          {(['athlete', 'coach', 'admin'] as UserRole[]).map(role => {
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
