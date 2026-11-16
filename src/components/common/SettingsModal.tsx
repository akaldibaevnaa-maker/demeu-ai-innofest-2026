import React, { useState } from 'react';
import { X, Key, User, Check, Sparkles, RefreshCw, Trash2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types';
import { translations } from '../../data/locales';
import { storageService } from '../../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen) return null;
  const t = translations[profile.language] || translations.kk;

  const [pseudonym, setPseudonym] = useState(profile.pseudonym);
  const [avatarSeed, setAvatarSeed] = useState(profile.avatarSeed);
  const [apiKey, setApiKey] = useState(profile.geminiApiKey);
  const [isSaved, setIsSaved] = useState(false);

  const avatars = ['🦅', '🌱', '🚀', '🦊', '🐬', '🦁', '🌟', '🎯', '⚡'];

  const handleReroll = () => {
    const rolled = storageService.generateRandomPseudonym();
    setPseudonym(rolled.pseudonym);
    setAvatarSeed(rolled.avatar);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      pseudonym,
      avatarSeed,
      geminiApiKey: apiKey
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>⚙️</span>
          <span>Баптаулар & Құпиялық</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Анонимді Аватар:
            </label>
            <div className="flex gap-1.5">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatarSeed(av)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition ${
                    avatarSeed === av
                      ? 'bg-indigo-50 border-indigo-600 scale-105 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Pseudonym */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Анонимді Бүркеншік ат:</span>
              </label>
              <button
                type="button"
                onClick={handleReroll}
                className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Кездейсоқ таңдау</span>
              </button>
            </div>
            <input
              type="text"
              value={pseudonym}
              onChange={e => setPseudonym(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Шынайы аты-жөніңізді жазбауыңызға толық құқығыңыз бар.
            </p>
          </div>

          {/* 100% Anonymity Card */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Құпиялық және Анонимділік Кепілі</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Жүйеде оқушының аты-жөні, сыныбы, мектеп нөмірі немесе мекенжайы талап етілмейді. Барлық белсенділік пен сұрақтар тек құпия бүркеншік атпен жүреді.
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                Google Gemini API Key (міндетті емес):
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Офлайн ЖИ бар</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Бас тарту
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm flex items-center gap-1.5 transition"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'Сақталды!' : 'Сақтау'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
