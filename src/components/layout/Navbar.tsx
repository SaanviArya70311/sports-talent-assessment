import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  Users,
  Settings,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  LogOut,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  currentView: 'landing' | 'athlete' | 'coach' | 'admin';
  setCurrentView: (view: 'landing' | 'athlete' | 'coach' | 'admin') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth
}) => {
  const { currentUser, currentRole, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'athlete', label: 'Athlete Hub' },
    { id: 'coach', label: 'Scout Discovery' },
    { id: 'admin', label: 'Standards & Admin' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080C14] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tighter text-white font-mono flex items-center">
              ELITEZ<span className="text-cyan-400">.</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 -mt-1">
              TALENT COMBINE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center font-mono">
                {currentUser.fullName[0]}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 capitalize block leading-none">
                  {currentRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0B111E] border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Signed in as:</span>
                  <span className="text-white font-mono font-medium truncate block">
                    {currentUser.email}
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      switchRole('athlete');
                      setCurrentView('athlete');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Switch to Athlete View</span>
                    <span className="text-[10px] font-mono text-cyan-400">Marcus</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('coach');
                      setCurrentView('coach');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Switch to Coach View</span>
                    <span className="text-[10px] font-mono text-cyan-400">Dave</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setCurrentView('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span>Switch to Admin View</span>
                    <span className="text-[10px] font-mono text-cyan-400">Sarah</span>
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-800 px-1">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Account Login / Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090D16] border-b border-slate-800 px-4 py-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
                currentView === item.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase">Switch Persona:</span>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['athlete', 'coach', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setCurrentView(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded text-center text-xs capitalize font-mono ${
                    currentRole === r ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
