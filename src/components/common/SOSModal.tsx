import React from 'react';
import { X, Phone, ShieldAlert, Heart, Wind } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/locales';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onStartBreathing: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartBreathing
}) => {
  if (!isOpen) return null;
  const t = translations[language] || translations.kk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900">
              {t.sos.title}
            </h2>
            <p className="text-xs text-rose-600 font-semibold">
              24/7 Сенім телефоны • Анонимді • Тегін
            </p>
          </div>
        </div>

        {/* Calming message */}
        <div className="p-4 mb-5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
          <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">
            {t.sos.desc}
          </p>
        </div>

        {/* Hotlines Grid */}
        <div className="space-y-3 mb-6">
          
          {/* 111 Hotline */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-heading font-extrabold text-rose-700">111</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                  Мемлекеттік желі
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {t.sos.helpline111Desc}
              </p>
            </div>
            <a
              href="tel:111"
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{t.sos.callNow}</span>
            </a>
          </div>

          {/* 150 Hotline */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-heading font-extrabold text-indigo-700">150</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  Ұлттық сенім телефоны
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {t.sos.helpline150Desc}
              </p>
            </div>
            <a
              href="tel:150"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{t.sos.callNow}</span>
            </a>
          </div>

          {/* Police / Ambulance info */}
          <div className="flex gap-2">
            <a
              href="tel:102"
              className="flex-1 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center text-xs text-slate-700 font-semibold transition"
            >
              👮 102 Полиция
            </a>
            <a
              href="tel:103"
              className="flex-1 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center text-xs text-slate-700 font-semibold transition"
            >
              🚑 103 Жедел жәрдем
            </a>
          </div>

        </div>

        {/* Guided Breathing Quick Action */}
        <button
          onClick={() => {
            onClose();
            onStartBreathing();
          }}
          className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Wind className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span>{t.sos.startBreathing} (4-7-8 Тынышталу)</span>
        </button>

      </div>
    </div>
  );
};
