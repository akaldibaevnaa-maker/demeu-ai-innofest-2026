import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SOSModal } from './components/common/SOSModal';
import { SettingsModal } from './components/common/SettingsModal';
import { AchievementModal } from './components/common/AchievementModal';
import { CamouflageScreen } from './components/common/CamouflageScreen';
import { HomeView } from './components/modules/home/HomeView';
import { PsychologistView } from './components/modules/psychologist/PsychologistView';
import { VolunteerView } from './components/modules/volunteer/VolunteerView';
import { TutorView } from './components/modules/tutor/TutorView';
import { CareerView } from './components/modules/career/CareerView';
import { ProductivityView } from './components/modules/productivity/ProductivityView';
import { ActiveModule, UserProfile, Language } from './types';
import { storageService } from './services/storageService';
import { translations } from './data/locales';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [psychSubTabOverride, setPsychSubTabOverride] = useState<string | undefined>(undefined);

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCamouflageOpen, setIsCamouflageOpen] = useState(false);

  // Keyboard shortcut: Press Escape to toggle Camouflage / Stealth
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCamouflageOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveProfile = (updated: UserProfile) => {
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleSelectLanguage = (lang: Language) => {
    const updated: UserProfile = { ...profile, language: lang };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleRegeneratePseudonym = () => {
    const rolled = storageService.generateRandomPseudonym();
    const updated: UserProfile = {
      ...profile,
      pseudonym: rolled.pseudonym,
      avatarSeed: rolled.avatar
    };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleClearSession = () => {
    if (window.confirm('Барлық чат пен сессия деректерін тазартып, жаңа құпия сессия бастағыңыз келе ме?')) {
      storageService.clearAnonymousSession();
      window.location.reload();
    }
  };

  const handleStartBreathingFromSos = () => {
    setActiveModule('psychologist');
    setPsychSubTabOverride('breathing');
  };

  const t = translations[profile.language] || translations.kk;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        profile={profile}
        activeModule={activeModule}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenCamouflage={() => setIsCamouflageOpen(true)}
        onSelectLanguage={handleSelectLanguage}
        onRegeneratePseudonym={handleRegeneratePseudonym}
        onClearSession={handleClearSession}
        onNavigate={(mod) => {
          setActiveModule(mod);
          if (mod !== 'psychologist') {
            setPsychSubTabOverride(undefined);
          }
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            if (mod !== 'psychologist') {
              setPsychSubTabOverride(undefined);
            }
          }}
          language={profile.language}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeModule === 'home' && (
            <HomeView
              profile={profile}
              onNavigate={(mod) => {
                setActiveModule(mod);
                if (mod !== 'psychologist') {
                  setPsychSubTabOverride(undefined);
                }
              }}
              onUpdateProfile={handleSaveProfile}
              onToggleCamouflage={() => setIsCamouflageOpen(prev => !prev)}
            />
          )}

          {activeModule === 'psychologist' && (
            <PsychologistView
              profile={profile}
              initialSubTab={psychSubTabOverride}
            />
          )}

          {activeModule === 'volunteer' && (
            <VolunteerView profile={profile} />
          )}

          {activeModule === 'tutor' && (
            <TutorView profile={profile} />
          )}

          {activeModule === 'career' && (
            <CareerView profile={profile} />
          )}

          {activeModule === 'productivity' && (
            <ProductivityView profile={profile} />
          )}
        </main>

      </div>

      {/* Soft Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <span>🔒 100% Анонимді & Қауіпсіз кеңістік (Жеке аты-жөніңіз сақталмайды)</span>
            <span>•</span>
            <span>📞 Сенім желілері: <strong>111</strong>, <strong>150</strong> (Тәулік бойы тегін)</span>
            <span>•</span>
            <span className="font-semibold text-indigo-700">INNOFEST 2026 Республикалық байқауы</span>
          </div>
          <p className="text-[11px] text-slate-400">
            ⚠️ Ескерту: DEMEU AI — білім беру және көмекші қолдаушы экожүйе. Шұғыл медициналық көмек қажет болғанда кәсіби мамандарға жүгіну ұсынылады.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        language={profile.language}
        onStartBreathing={handleStartBreathingFromSos}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <AchievementModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        profile={profile}
      />

      {/* Stealth Camouflage Screen */}
      <CamouflageScreen
        isOpen={isCamouflageOpen}
        onClose={() => setIsCamouflageOpen(false)}
      />

    </div>
  );
};
