import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBanner } from './components/layout/RoleSwitcherBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AthleteDashboard } from './components/athlete/AthleteDashboard';
import { CoachDashboard } from './components/coach/CoachDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { LegalModal } from './components/legal/LegalModal';

function MainAppContent() {
  const { currentRole } = useApp();
  const [currentView, setCurrentView] = useState<'landing' | 'athlete' | 'coach' | 'admin'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Demo & Role Switcher Banner */}
      <RoleSwitcherBanner />

      {/* Primary Sticky Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentView('athlete')}
            onExploreCoaches={() => setCurrentView('coach')}
          />
        )}

        {currentView === 'athlete' && <AthleteDashboard />}

        {currentView === 'coach' && <CoachDashboard />}

        {currentView === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={type => setActiveLegalModal(type)}
        onNavigate={view => setCurrentView(view)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Legal & Governance Modal */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
