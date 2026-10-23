import React, { useState } from 'react';
import { X, UserPlus, LogIn, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, switchRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('athlete');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isMinorConsent, setIsMinorConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (mode === 'register' && !fullName) {
      setError('Full name is required for sports identity verification.');
      return;
    }

    // Create user in local storage
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      role,
      createdAt: new Date().toISOString().substring(0, 10)
    };

    setCurrentUser(newUser);
    setSuccessMsg(`Authenticated as ${newUser.fullName} (${newUser.role})!`);

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#0B111E] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Sign In to Elitez' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick preset selector for testing convenience */}
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block">
              1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  switchRole('athlete');
                  onClose();
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono truncate"
              >
                Marcus (Athlete)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('coach');
                  onClose();
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono truncate"
              >
                Dave (Coach)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  onClose();
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono truncate"
              >
                Sarah (Admin)
              </button>
            </div>
          </div>

          {/* Mode switch */}
          <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-1.5 rounded-lg font-semibold transition-colors ${
                mode === 'login' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-1.5 rounded-lg font-semibold transition-colors ${
                mode === 'register' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Legal Name</label>
              <input
                type="text"
                placeholder="Marcus Vance"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="athlete@elitezsports.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Account Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="athlete">Athlete (Record tests, track progress)</option>
                <option value="coach">Coach / Scout (Discover & evaluate talent)</option>
                <option value="admin">Administrator (Protocol & system audit)</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 rounded-lg text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors mt-2"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
