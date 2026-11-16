import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Habit } from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';
import { audioService } from '../../../services/audioService';

interface ProductivityViewProps {
  profile: UserProfile;
}

export const ProductivityView: React.FC<ProductivityViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.kk;

  // Pomodoro Timer State
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Ambient sound state
  const [ambientType, setAmbientType] = useState<'off' | 'rain' | 'white' | 'binaural'>('off');

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(() => storageService.getHabits());

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      audioService.playChime();
      storageService.addXp(mode === 'work' ? 30 : 10);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const handleModeChange = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(25 * 60);
    else if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const handleToggleAmbient = (type: 'rain' | 'white' | 'binaural') => {
    if (ambientType === type) {
      audioService.stopAmbient();
      setAmbientType('off');
    } else {
      audioService.startAmbient(type);
      setAmbientType(type);
    }
  };

  const handleCheckHabit = (id: string) => {
    const updated = storageService.checkHabitToday(id);
    setHabits([...updated]);
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const leaderboardPeers = [
    { rank: 1, name: 'Жұлдызды Ізденуші #114', status: 'Зейін шебері 🌟', xp: 580, streak: 9, badge: '🥇' },
    { rank: 2, name: `${profile.pseudonym} (Сіз)`, status: 'Белсенді зерттеуші 🚀', xp: profile.xp, streak: profile.streakDays, badge: '🥈' },
    { rank: 3, name: 'Тұлпар #308', status: 'Тапқыр оқырман 💡', xp: 410, streak: 6, badge: '🥉' },
    { rank: 4, name: 'Шамшырақ #952', status: 'Үздік көшбасшы 🎯', xp: 350, streak: 4, badge: '4' },
    { rank: 5, name: 'Болашақ Ғалым #710', status: 'Ізденімпаз жас 🌱', xp: 310, streak: 3, badge: '5' }
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 glass-panel rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
            Уақыт пен Зейін • Өнімділік орталығы
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mt-1">
            {t.prod.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t.prod.subtitle}
          </p>
        </div>

        {/* Ambient Relaxation Audio Controls */}
        <div className="p-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-xs shadow-2xs">
          <Headphones className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="text-slate-500 hidden md:inline">Релакс:</span>
          
          <button
            onClick={() => handleToggleAmbient('rain')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              ambientType === 'rain' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            🌧️ Жаңбыр
          </button>
          
          <button
            onClick={() => handleToggleAmbient('white')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              ambientType === 'white' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            🌫️ Ақ шу
          </button>

          <button
            onClick={() => handleToggleAmbient('binaural')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              ambientType === 'binaural' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            🧠 10Hz Альфа
          </button>

          {ambientType !== 'off' && (
            <button
              onClick={() => {
                audioService.stopAmbient();
                setAmbientType('off');
              }}
              className="p-1 text-slate-400 hover:text-rose-600 transition"
              title="Өшіру"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pomodoro Timer */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-slate-200 bg-white flex flex-col items-center justify-center space-y-6 text-center shadow-sm relative overflow-hidden">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => handleModeChange('work')}
              className={`px-4 py-2 rounded-xl transition ${
                mode === 'work' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ 25м Фокус (Сабақ)
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`px-4 py-2 rounded-xl transition ${
                mode === 'shortBreak' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☕ 5м Тынығу
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`px-4 py-2 rounded-xl transition ${
                mode === 'longBreak' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧘 15м Демалыс
            </button>
          </div>

          {/* Circular Countdown Display */}
          <div className="relative py-4 flex items-center justify-center">
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-200 flex flex-col items-center justify-center bg-slate-50 shadow-inner">
              <span className="text-6xl sm:text-7xl font-heading font-black tracking-tight text-slate-900 font-mono">
                {formattedTime}
              </span>
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest mt-2">
                {isRunning ? 'Зейін процесі жүріп жатыр...' : 'Дайын болғанда бастаңыз'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition transform active:scale-95"
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Тоқтата тұру' : 'Фокусты Бастау'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
              title="Қайта орнату"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 max-w-sm">
            💡 Әр аяқталған сессия үшін +30 XP және зейін төсбелгісінің прогресі беріледі!
          </p>

        </div>

        {/* Right: Habits & Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <span>🔥</span>
                <span>Пайдалы Әдеттер</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Бүгінгі орындалу</span>
            </div>

            <div className="space-y-2.5">
              {habits.map(h => {
                const isDoneToday = h.lastCompletedDate === todayStr;

                return (
                  <div
                    key={h.id}
                    onClick={() => !isDoneToday && handleCheckHabit(h.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                      isDoneToday
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{h.icon}</span>
                      <div>
                        <h4 className={`text-xs font-bold ${isDoneToday ? 'text-emerald-800' : 'text-slate-900'}`}>
                          {h.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-0.5">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          <span>{h.streak} күн үздіксіз</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        +{h.xpReward} XP
                      </span>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isDoneToday ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isDoneToday && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Friendly Leaderboard */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Оқушылар Рейтингі (Top 5)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold">Анонимді жүйе</span>
            </div>

            <div className="space-y-2">
              {leaderboardPeers.map(peer => {
                const isMe = peer.name.includes('(Сіз)');

                return (
                  <div
                    key={peer.rank}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      isMe
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-bold text-sm">{peer.badge}</span>
                      <div>
                        <p className="truncate max-w-[140px] sm:max-w-[180px]">{peer.name}</p>
                        <p className="text-[10px] text-slate-400">{peer.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-amber-600">🔥 {peer.streak} күн</span>
                      <span className="text-indigo-700 font-bold">{peer.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
