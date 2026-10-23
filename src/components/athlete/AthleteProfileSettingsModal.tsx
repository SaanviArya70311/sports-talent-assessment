import React, { useState } from 'react';
import { X, Save, Lock, ShieldCheck, UserCheck, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AthleteProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AthleteProfileSettingsModal: React.FC<AthleteProfileSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentAthleteProfile, updateAthleteProfile } = useApp();

  if (!isOpen || !currentAthleteProfile) return null;

  const [fullName, setFullName] = useState(currentAthleteProfile.fullName);
  const [primarySport, setPrimarySport] = useState(currentAthleteProfile.primarySport);
  const [position, setPosition] = useState(currentAthleteProfile.position);
  const [city, setCity] = useState(currentAthleteProfile.city);
  const [state, setState] = useState(currentAthleteProfile.state);
  const [heightCm, setHeightCm] = useState(currentAthleteProfile.heightCm.toString());
  const [weightKg, setWeightKg] = useState(currentAthleteProfile.weightKg.toString());
  const [wingspanCm, setWingspanCm] = useState(currentAthleteProfile.wingspanCm?.toString() || '');
  const [bio, setBio] = useState(currentAthleteProfile.bio);
  const [currentTeam, setCurrentTeam] = useState(currentAthleteProfile.currentTeam);
  const [yearsExperience, setYearsExperience] = useState(currentAthleteProfile.yearsExperience.toString());

  // Privacy toggles
  const [profileVisibility, setProfileVisibility] = useState(currentAthleteProfile.profileVisibility);
  const [showContactInfo, setShowContactInfo] = useState(currentAthleteProfile.showContactInfo);
  const [showLocation, setShowLocation] = useState(currentAthleteProfile.showLocation);
  const [showAge, setShowAge] = useState(currentAthleteProfile.showAge);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAthleteProfile({
      fullName,
      primarySport,
      position,
      city,
      state,
      heightCm: parseFloat(heightCm) || currentAthleteProfile.heightCm,
      weightKg: parseFloat(weightKg) || currentAthleteProfile.weightKg,
      wingspanCm: wingspanCm ? parseFloat(wingspanCm) : undefined,
      bio,
      currentTeam,
      yearsExperience: parseInt(yearsExperience) || currentAthleteProfile.yearsExperience,
      profileVisibility,
      showContactInfo,
      showLocation,
      showAge
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#0B111E] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Account & Privacy Controls
            </span>
            <h3 className="text-lg font-bold text-white">
              Athlete Profile & Data Sharing Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Minor Status & Consent Safeguard */}
          {currentAthleteProfile.isMinor && (
            <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-0.5">
                <span className="font-semibold text-cyan-300 block">
                  Minor Safeguarding Active (Under 18)
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Verified parental consent is recorded on file. Direct contact details and precise location coordinates are strictly hidden from public directories and visible only to verified collegiate coaches.
                </p>
              </div>
            </div>
          )}

          {/* Privacy & Visibility Controls */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Discovery & Sharing Permissions
              </h4>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Profile Visibility
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'public', label: 'Public Directory', desc: 'Visible to verified scouts & public talent board' },
                  { id: 'coaches_only', label: 'Coaches Only', desc: 'Hidden from public, searchable by verified scouts' },
                  { id: 'private', label: 'Private Mode', desc: 'Only visible to you. Not discoverable in search' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfileVisibility(opt.id as any)}
                    className={`p-3 text-left rounded-lg border text-xs transition-colors ${
                      profileVisibility === opt.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Display city & region to scouts</span>
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={e => setShowLocation(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Display exact age on scout profile</span>
                <input
                  type="checkbox"
                  checked={showAge}
                  onChange={e => setShowAge(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Allow verified scouts to view direct contact email</span>
                <input
                  type="checkbox"
                  checked={showContactInfo}
                  onChange={e => setShowContactInfo(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Sporting Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
              Sporting Background
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Primary Sport</label>
                <input
                  type="text"
                  value={primarySport}
                  onChange={e => setPrimarySport(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Position / Event</label>
                <input
                  type="text"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Current Club / Team</label>
                <input
                  type="text"
                  value={currentTeam}
                  onChange={e => setCurrentTeam(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Biometrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
              Voluntary Physical Measurements
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Wingspan (cm)</label>
                <input
                  type="number"
                  value={wingspanCm}
                  placeholder="Optional"
                  onChange={e => setWingspanCm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs text-slate-300 block mb-1">Athletic Statement & Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Modal Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              {savedSuccess ? 'Changes Saved!' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
