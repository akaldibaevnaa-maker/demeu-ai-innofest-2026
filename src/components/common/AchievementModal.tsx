import React from 'react';
import { X, Award, CheckCircle, Lock } from 'lucide-react';
import { UserProfile, Badge } from '../../types';
import { translations } from '../../data/locales';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen) return null;
  const t = translations[profile.language] || translations.kk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Жетістіктер мен Төсбелгілер
            </h2>
            <p className="text-xs text-slate-500">
              {profile.pseudonym} • {t.common.level} {profile.level} ({profile.xp} XP)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {profile.badges.map((badge: Badge) => {
            const isUnlocked = !!badge.unlockedAt;
            const title = profile.language === 'ru' ? badge.titleRu : profile.language === 'en' ? badge.titleEn : badge.titleKk;
            const desc = profile.language === 'ru' ? badge.descriptionRu : profile.language === 'en' ? badge.descriptionEn : badge.descriptionKk;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex items-center gap-4 transition ${
                  isUnlocked 
                    ? 'bg-indigo-50/60 border-indigo-200' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-indigo-100 border border-indigo-200' : 'bg-slate-200 text-slate-400'
                }`}>
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                      {title}
                    </h3>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Ашылды
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Жабық
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    {desc}
                  </p>
                  {badge.unlockedAt && (
                    <span className="text-[10px] text-indigo-600 font-mono mt-1 block">
                      Қол жеткізілді: {badge.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
