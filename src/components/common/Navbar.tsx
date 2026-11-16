import React from 'react';
import { 
  Flame, 
  Award, 
  AlertTriangle, 
  Settings as SettingsIcon, 
  ShieldCheck,
  EyeOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { UserProfile, Language, ActiveModule } from '../../types';
import { translations } from '../../data/locales';

interface NavbarProps {
  profile: UserProfile;
  activeModule: ActiveModule;
  onOpenSos: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  onOpenCamouflage: () => void;
  onSelectLanguage: (lang: Language) => void;
  onRegeneratePseudonym: () => void;
  onClearSession: () => void;
  onNavigate?: (module: ActiveModule) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeModule,
  onOpenSos,
  onOpenSettings,
  onOpenAchievements,
  onOpenCamouflage,
  onSelectLanguage,
  onRegeneratePseudonym,
  onClearSession,
  onNavigate
}) => {
  const t = translations[profile.language] || translations.kk;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200/90 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[2px] shadow-sm group-hover:scale-105 transition">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                DEMEU AI
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Анонимді & Қауіпсіз
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              {t.slogan}
            </p>
          </div>
        </div>

        {/* Center: Anonymous Identity & Camouflage Button */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Anonymous Nickname Pill */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-semibold"
            title="100% Анонимді режим: Аты-жөніңіз сұралмайды"
          >
            <span className="text-base">{profile.avatarSeed}</span>
            <span>{profile.pseudonym}</span>
            <button
              onClick={onRegeneratePseudonym}
              className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
              title="Бүркеншік атты жаңарту"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Camouflage / Stealth Button */}
          <button
            onClick={onOpenCamouflage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition"
            title="Егер бөлмеге біреу кірсе, экранды лезде оқулық конспектісіне ауыстырады (Esc)"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Жасыру / Камуфляж</span>
          </button>
        </div>

        {/* Right Actions: Streak, XP, SOS, Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Streak */}
          <div 
            title={`${profile.streakDays} күн үздіксіз белсенділік!`}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{profile.streakDays} күн</span>
          </div>

          {/* Level & XP */}
          <button 
            onClick={onOpenAchievements}
            title="Жетістіктерді көру"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition text-xs font-semibold"
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>{profile.xp} XP</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => onSelectLanguage('kk')}
              className={`px-2 py-1 rounded-md transition ${profile.language === 'kk' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ҚАЗ
            </button>
            <button
              onClick={() => onSelectLanguage('ru')}
              className={`px-2 py-1 rounded-md transition ${profile.language === 'ru' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              РУС
            </button>
          </div>

          {/* Panic Clear Session */}
          <button
            onClick={onClearSession}
            className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition"
            title="Құпиялықты лезде тазарту (чаттарды өшіру)"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* High Priority SOS Button */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-lg shadow-sm transition transform active:scale-95 animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">111/150</span>
            <span>SOS</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
            title={t.common.settings}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
