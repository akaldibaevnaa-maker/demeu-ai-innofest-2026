import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  HeartHandshake, 
  Brain, 
  Compass, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  HelpCircle,
  Eye,
  Award,
  ChevronRight,
  Zap,
  TrendingUp,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ActiveModule, DailyQuizItem } from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';
import { audioService } from '../../../services/audioService';

interface HomeViewProps {
  profile: UserProfile;
  onNavigate: (module: ActiveModule) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onToggleCamouflage: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onNavigate,
  onUpdateProfile,
  onToggleCamouflage
}) => {
  const t = translations[profile.language] || translations.kk;

  // Countdown to UBT 2026 (target: June 1, 2026)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date('2026-06-01T09:00:00+05:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Daily Quiz State
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuizItem>(() => storageService.getTodayDailyQuiz());
  const [isQuizDone, setIsQuizDone] = useState<boolean>(() => storageService.isDailyQuizCompletedToday());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSelectQuizOption = (optIndex: number) => {
    if (isAnswered || isQuizDone) return;
    setSelectedOption(optIndex);
    setIsAnswered(true);

    const correct = optIndex === dailyQuiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      audioService.playChime();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      storageService.completeDailyQuizToday(dailyQuiz.xpReward);
      setIsQuizDone(true);
      onUpdateProfile(storageService.getProfile());
    } else {
      audioService.playClick();
    }
  };

  const dailyAffirmations = [
    { text: '«Білім — ең мықты қару. Онымен сен өз өміріңді де, қоғамды да жақсарта аласың.»', author: 'DEMEU Даналық ЖИ' },
    { text: '«Күн сайын 1%-ға өссең, бір жылда өз нәтижеңді 37 есе арттырасың!»', author: 'Джеймс Клир (Атомдық әдеттер)' },
    { text: '«Қиындықтар мен қателіктер — бұл сәтсіздік емес, сенің миыңның даму сатысы.»', author: 'Кэрол Дуэк (Өсу менталитеті)' },
    { text: '«Бүгінгі жасаған кішкентай игі ісің ертең үлкен жеңіске айналады!»', author: 'Ел Демеуі Қағидасы' }
  ];

  const todayAffirmation = dailyAffirmations[new Date().getDate() % dailyAffirmations.length];

  const modules = [
    {
      id: 'tutor' as ActiveModule,
      title: 'Білім Демеуі',
      subtitle: '9 пән бойынша ҰБТ дайындығы & Сынақ Симуляторы',
      desc: 'Оқу сауаттылығы, Математикалық сауаттылық, Тарих және бейінді пәндер. 3 деңгейлі Socratic AI түсіндіргіші мен 3D карточкалар.',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      badge: '9 Пән + Симулятор',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'psychologist' as ActiveModule,
      title: 'Жан Демеуі',
      subtitle: '100% Анонимді AI Психолог & Кибербуллинг қорғау',
      desc: 'Анонимді сырласу, стресске қарсы 3 тыныс алу техникасы, ойды түзету тренажері және токсикалық сөздер анализаторы.',
      icon: Brain,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Толық Анонимді',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'volunteer' as ActiveModule,
      title: 'Ел Демеуі',
      subtitle: 'Мектепішілік Волонтерлік & Топ құру алаңы',
      desc: 'Кітапхананы қолдау, «Жасыл сынып», бүлдіршіндерге тәлімгерлік. Өз бастамаңды ұсынып, мектепішілік топ жина!',
      icon: HeartHandshake,
      color: 'from-amber-500 to-orange-600',
      badge: 'Мектепішілік',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'career' as ActiveModule,
      title: 'Болашақ Демеуі',
      subtitle: 'Дж. Голланд 24 RIASEC тесті & ҰБТ Грант Калькуляторы',
      desc: '24 сұрақты психологиялық кәсіптік матрица, 11 ресми бейінді пән комбинациясы бойынша ЖОО грант балын есептеу.',
      icon: Compass,
      color: 'from-purple-500 to-violet-600',
      badge: '11 Грант Жұбы',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'productivity' as ActiveModule,
      title: 'Уақыт пен Зейін',
      subtitle: 'Помодоро Таймер, Релакс-Дыбыстар & Әдеттер',
      desc: '25 минуттық зейін фокусы, табиғат пен Альфа ырғақты релакс-дыбыстары, күнделікті әдеттер тізбегі мен анонимді көшбасшылар.',
      icon: Clock,
      color: 'from-rose-500 to-pink-600',
      badge: 'Фокус & Рейтинг',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      
      {/* Top Welcome Hero Banner with AI Generated Illustration */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 p-6 sm:p-8 shadow-sm">
        
        {/* Decorative background glow blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-indigo-100 shadow-xs text-xs font-semibold text-indigo-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DEMEU AI • Қорғалған Анонимді Сессия</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-mono">ID: {profile.id.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
              Қайырлы күн, <span className="text-indigo-600">{profile.avatarSeed} {profile.pseudonym}</span>!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              DEMEU AI — оқушылар мен студенттерге арналған кешенді қолдау экожүйесі. 
              Мұнда сен 100% құпия түрде ҰБТ-ға дайындала аласың, мектепішілік игі істерге қатысып, AI психологтан қолдау аласың.
            </p>

            {/* Daily Affirmation Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-indigo-100/80 shadow-xs flex items-start gap-3 text-left">
              <span className="text-2xl select-none">💡</span>
              <div>
                <p className="text-xs font-medium text-slate-700 italic">
                  {todayAffirmation.text}
                </p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">
                  — {todayAffirmation.author}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => onNavigate('tutor')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 card-hover-effect"
              >
                <BookOpen className="w-4 h-4" />
                <span>ҰБТ-ға Дайындық & Симулятор</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('psychologist')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
              >
                <Brain className="w-4 h-4 text-emerald-600" />
                <span>AI Психологпен Сырласу</span>
              </button>

              <button
                onClick={onToggleCamouflage}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition flex items-center gap-1.5"
                title="Экранды лезде биология конспектісіне ауыстыру (Esc пернесі)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Камуфляж (Esc)</span>
              </button>
            </div>

          </div>

          {/* AI Generated Graphic Hero Thumbnail */}
          <div className="relative shrink-0 w-full sm:w-80 lg:w-96">
            <div className="relative rounded-2xl overflow-hidden border border-indigo-200/70 shadow-lg bg-white group card-hover-effect">
              <img 
                src="/demeu_hero_art.jpg" 
                alt="DEMEU AI Assistant" 
                className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if image not yet loaded
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/80 backdrop-blur-md uppercase tracking-wider">
                  Жасанды Интеллект Экожүйесі
                </span>
                <p className="text-xs font-semibold mt-1 drop-shadow-xs">
                  «DEMEU AI» — Әр оқушының сенімді серігі
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Live Countdown & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Countdown to UBT 2026 */}
        <div className="md:col-span-2 p-5 glass-panel rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">ҰБТ-2026 Негізгі Сынағы</h3>
                <p className="text-[11px] text-slate-500">1 маусым 2026 жылға дейін қалған уақыт</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white animate-pulse">
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-heading font-black text-blue-900 font-mono">
                {timeLeft.days}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">күн</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-heading font-black text-blue-900 font-mono">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">сағат</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-heading font-black text-blue-900 font-mono">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">минут</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-heading font-black text-indigo-600 font-mono">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">секунд</span>
            </div>
          </div>
        </div>

        {/* User XP & Level Card */}
        <div className="p-5 glass-panel rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-orange-50/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Оқу Деңгейі</span>
            </span>
            <span className="text-xs font-bold text-amber-700">{profile.xp} / 500 XP</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-slate-900">
                {profile.level}-деңгей
              </span>
              <span className="text-xs text-slate-500">Алғыр ізденуші</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.xp % 100) * 1.5)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-amber-800/80">
            Келесі деңгейге жету үшін +{Math.max(10, 100 - (profile.xp % 100))} XP қажет!
          </p>
        </div>

        {/* Continuous Streak Card */}
        <div className="p-5 glass-panel rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/70 to-pink-50/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Үздіксіз Қарқын</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">Күнделікті</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-slate-900 font-mono">
                {profile.streakDays}
              </span>
              <span className="text-sm font-bold text-rose-700">күн белсенді 🔥</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Күн сайын кіріп, өнімділік пен зейінді жоғалтпа!
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Бүгінгі күн белгіленді</span>
          </div>
        </div>

      </div>

      {/* Daily Quick Quiz Interactive Widget */}
      <div className="p-6 glass-panel rounded-3xl border border-indigo-100 bg-white shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Күннің Экспресс-Тесті</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {dailyQuiz.subjectLabelKk}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                1 сұраққа дұрыс жауап беріп, жеке қоржыныңызға <strong className="text-indigo-600">+{dailyQuiz.xpReward} XP</strong> қосыңыз!
              </p>
            </div>
          </div>

          {isQuizDone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Бүгін орындалды (+{dailyQuiz.xpReward} XP)</span>
            </span>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            {dailyQuiz.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dailyQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === dailyQuiz.correctAnswer;
              
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50/50 hover:border-indigo-300';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-100 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={isAnswered || isQuizDone}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-slide-up ${
              isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <span>{isCorrect ? '🎉 Керемет! Дұрыс жауап!' : '💡 Дұрыс жауапты қарастырайық:'}</span>
              </div>
              <p>{dailyQuiz.explanation}</p>
            </div>
          )}
        </div>

      </div>

      {/* 5 Core Modules Launchpad Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Негізгі Қызмет Модульдері</span>
          </h2>
          <span className="text-xs text-slate-500">Барлық қызметтер тегін & анонимді</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;

            return (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-indigo-300 card-hover-effect cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mod.badgeBg}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Модульге өту</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & In-School Initiatives Live Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* School Volunteering Digest */}
        <div className="p-5 glass-panel rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Мектепішілік Белсенді Топтар</span>
            </h3>
            <button
              onClick={() => onNavigate('volunteer')}
              className="text-[11px] text-indigo-600 hover:underline font-semibold"
            >
              Барлығы ➔
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Мектепішілік «Жасыл сынып» эко-аймағы</p>
                <p className="text-[10px] text-slate-500">Өсімдіктер күтімі & көгалдандыру</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                3/5 орын
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Кітапхана қорын сауықтыру</p>
                <p className="text-[10px] text-slate-500">Кітаптарды ретке келтіру & каталогтау</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                2/4 орын
              </span>
            </div>
          </div>
        </div>

        {/* Anonymity & Camouflage Advice Card */}
        <div className="p-5 glass-panel rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Жеке Қауіпсіздік & Құпиялық Нұсқаулығы</span>
          </div>

          <p className="text-xs text-emerald-800 leading-relaxed">
            Платформаны қолданғанда сіздің шынайы аты-жөніңіз, сыныбыңыз немесе мектебіңіз еш жерде жарияланбайды. 
            Егер қасыңызға күтпеген жерден мұғалім немесе ата-анаңыз келсе, пернетақтадағы <kbd className="px-1.5 py-0.5 bg-white border border-emerald-300 rounded text-[11px] font-mono shadow-2xs font-bold text-emerald-950">Esc</kbd> батырмасын басыңыз — экран лезде биология конспектісіне ауысады!
          </p>

          <div className="pt-1 flex items-center gap-3 text-[11px] font-semibold text-emerald-700">
            <span>Шұғыл байланыс: 111 (Балалар желісі)</span>
            <span>•</span>
            <span>150 (Сенім телефоны)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
