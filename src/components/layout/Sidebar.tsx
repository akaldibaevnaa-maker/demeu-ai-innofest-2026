import React from 'react';
import { 
  Home,
  HeartHandshake, 
  Brain, 
  GraduationCap, 
  Compass, 
  Timer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ActiveModule, Language } from '../../types';
import { translations } from '../../data/locales';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  language
}) => {
  const t = translations[language] || translations.kk;

  const modules = [
    {
      id: 'home' as ActiveModule,
      name: t.nav.home,
      desc: t.navDesc.home,
      icon: Home,
      color: 'from-blue-600 to-indigo-600',
      activeBorder: 'border-blue-600 bg-blue-50/80 text-blue-900',
      iconBg: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'psychologist' as ActiveModule,
      name: t.nav.psychologist,
      desc: t.navDesc.psychologist,
      icon: Brain,
      color: 'from-violet-500 to-indigo-600',
      activeBorder: 'border-violet-500 bg-violet-50/80 text-violet-900',
      iconBg: 'bg-violet-100 text-violet-700'
    },
    {
      id: 'volunteer' as ActiveModule,
      name: t.nav.volunteer,
      desc: t.navDesc.volunteer,
      icon: HeartHandshake,
      color: 'from-emerald-500 to-teal-600',
      activeBorder: 'border-emerald-500 bg-emerald-50/80 text-emerald-900',
      iconBg: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'tutor' as ActiveModule,
      name: t.nav.tutor,
      desc: t.navDesc.tutor,
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      activeBorder: 'border-blue-500 bg-blue-50/80 text-blue-900',
      iconBg: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'career' as ActiveModule,
      name: t.nav.career,
      desc: t.navDesc.career,
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      activeBorder: 'border-amber-500 bg-amber-50/80 text-amber-900',
      iconBg: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'productivity' as ActiveModule,
      name: t.nav.productivity,
      desc: t.navDesc.productivity,
      icon: Timer,
      color: 'from-rose-500 to-pink-600',
      activeBorder: 'border-rose-500 bg-rose-50/80 text-rose-900',
      iconBg: 'bg-rose-100 text-rose-700'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-3">
      <div className="p-2 glass-panel rounded-2xl border border-slate-200/90 shadow-sm bg-white/90">
        <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Интеллектуалды Бөлімдер
        </p>

        <nav className="space-y-1.5">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;

            return (
              <button
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? m.activeBorder + ' shadow-sm font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition ${
                      isActive
                        ? `bg-gradient-to-tr ${m.color} text-white shadow-sm`
                        : `${m.iconBg} group-hover:scale-105`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-sm truncate">
                      {m.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'opacity-100 text-current' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Innofest Badge with Anonymity Guarantee */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/80 border border-indigo-100 shadow-sm text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-indigo-900">100% Анонимді және Қауіпсіз</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Сіздің аты-жөніңіз сұралмайды. Барлық психологиялық сұхбаттар мен күнделіктер тек сіздің браузеріңізде құпия сақталады.
        </p>
      </div>
    </aside>
  );
};
