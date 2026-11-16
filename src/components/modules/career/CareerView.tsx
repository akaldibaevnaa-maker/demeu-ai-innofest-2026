import React, { useState } from 'react';
import { 
  Compass, 
  Building, 
  FileText, 
  Search, 
  MapPin, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Briefcase,
  Percent,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, UniversityGrant, StudentCV } from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';
import { initialUniversityGrants } from '../../../data/initialData';

interface CareerViewProps {
  profile: UserProfile;
}

export const CareerView: React.FC<CareerViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.kk;

  const [subTab, setSubTab] = useState<'riasec' | 'predictor' | 'grants' | 'cv'>('riasec');

  // Expanded RIASEC Test State (24 Questions: 4 per dimension)
  const [currentRiasecStep, setCurrentRiasecStep] = useState(0);
  const [riasecScores, setRiasecScores] = useState({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });
  const [riasecFinished, setRiasecFinished] = useState(false);

  // Grants State
  const [grants] = useState<UniversityGrant[]>(initialUniversityGrants);
  const [searchQuery, setSearchQuery] = useState('');

  // ҰБТ Grant Predictor State with FULL Combinations
  const [userScoreInput, setUserScoreInput] = useState<number>(112);
  const [userSubjectCombination, setUserSubjectCombination] = useState('Математика + Информатика');

  // Student CV Builder (Zero names, zero grades, zero school numbers)
  const verifiedVolunteerHours = storageService.getVolunteerRecords().reduce((acc, r) => acc + r.hours, 0);
  const [cvData, setCvData] = useState<StudentCV>({
    pseudonym: profile.pseudonym,
    email: 'student.demeu@gmail.com',
    phone: '+7 (707) 123-4567',
    aboutMe: 'Технология мен ғылымға қызығатын, өзін-өзі дамытуға ұмтылатын белсенді оқушы. Мектепшілік волонтерлік және STEM жобаларына белсенді қатысу тәжірибесі бар.',
    skills: ['Командада жұмыс істеу', 'Python бағдарламалау', 'Ағылшын тілі (B2)', 'Логикалық ойлау', 'Жобаларды үйлестіру'],
    languages: ['Қазақ тілі (Ана тілі)', 'Орыс тілі (Еркін)', 'Ағылшын тілі (Upper-Intermediate)'],
    volunteerExperiences: [
      `Мектеп кітапханасы мен көгалдандыру акциясының қатысушысы (Барлығы ${verifiedVolunteerHours} расталған сағат)`,
      'Мектепшілік зияткерлік турнирлерін ұйымдастыру тобының мүшесі'
    ],
    academicAchievements: [
      'Мектепшілік пәндік олимпиада жеңімпазы',
      'Innofest 2026 Республикалық байқауының қатысушысы'
    ]
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  // 24 Deep RIASEC Questions (4 per category: Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
  const riasecQuestions = [
    // Realistic (R) - 4 questions
    { text: 'Электроника құрылғыларын, роботтарды немесе физикалық тетіктерді өз қолыңмен құрастырып, жөндеген ұнай ма?', dimension: 'R' as const },
    { text: 'Автомеханика, құрылыс, дәнекерлеу немесе ағаш шеберлігі сияқты нақты материалдық жұмыстар қызықты ма?', dimension: 'R' as const },
    { text: 'Ашық ауада техникамен немесе табиғи ресурстармен (орман, ауылшаруашылығы, геодезия) жұмыс істеген тартымды ма?', dimension: 'R' as const },
    { text: 'Сызбалар мен техникалық нұсқаулықтарды қарап, бұзылған құрал-жабдықтың ақауын табу ұнай ма?', dimension: 'R' as const },

    // Investigative (I) - 4 questions
    { text: 'Ғылыми жаңалықтарды, математикалық есептер мен бағдарламалау алгоритмдерін сағаттап талдау ұнай ма?', dimension: 'I' as const },
    { text: 'Табиғаттағы немесе қоғамдағы күрделі құбылыстардың себеп-салдарын ғылыми тұрғыдан зерттеген қызық па?', dimension: 'I' as const },
    { text: 'Биологиялық, химиялық зертханалық тәжірибелер жасап, деректерді статистикалық өңдеген ұнай ма?', dimension: 'I' as const },
    { text: 'Жасанды Интеллект, астрономия немесе киберқауіпсіздік саласындағы күрделі мәселелерді шешуге құмарсың ба?', dimension: 'I' as const },

    // Artistic (A) - 4 questions
    { text: 'Графикалық дизайн, UI/UX интерфейстерін жасау, сурет салу немесе видеомонтаж жасау ұнай ма?', dimension: 'A' as const },
    { text: 'Өз идеяларыңды жазушылық, поэзия немесе сценарий жазу арқылы стандарттан тыс білдіру тартымды ма?', dimension: 'A' as const },
    { text: 'Музыкалық аспапта ойнау, ән шығару немесе дыбыс режиссурасы саласы жаныңа жақын ба?', dimension: 'A' as const },
    { text: 'Интерьер дизайны, киім үлгілері немесе сәулет өнерінің эстетикалық концепцияларын құрастырған ұнай ма?', dimension: 'A' as const },

    // Social (S) - 4 questions
    { text: 'Құрдастарыңа немесе кіші оқушыларға күрделі сабақтарды түсіндіріп, тәлімгер болудан ләззат аласың ба?', dimension: 'S' as const },
    { text: 'Адамдардың жан сырын тыңдап, психологиялық кеңес беріп, қиын жағдайда қолдау көрсеткің келе ме?', dimension: 'S' as const },
    { text: 'Медицина, емдеу, алғашқы көмек көрсету және адамдардың денсаулығын қорғау саласы қызық па?', dimension: 'S' as const },
    { text: 'Әлеуметтік волонтерлік топтарды ұйымдастырып, қоғамдағы мұқтаж жандарға пайда тигізу маңызды ма?', dimension: 'S' as const },

    // Enterprising (E) - 4 questions
    { text: 'Өз стартапыңды, жобаңды немесе бизнесіңді ашып, нарықта көшбасшы болуды армандайсың ба?', dimension: 'E' as const },
    { text: 'Адамдардың назарын аударып, өз пікіріңді батыл қорғап, келіссөздер жүргізу қолыңнан келе ме?', dimension: 'E' as const },
    { text: 'Маркетинг, брендті танымал ету және аудиторияны тарту стратегияларын құру қызықты ма?', dimension: 'E' as const },
    { text: 'Команданы басқарып, тапсырмаларды бөліп, жобаның орындалуына жеке жауапкершілік алу ұнай ма?', dimension: 'E' as const },

    // Conventional (C) - 4 questions
    { text: 'Қаржылық есептерді, кестелерді (Excel) және бюджетті тиянақты реттеу ұнай ма?', dimension: 'C' as const },
    { text: 'Кез келген істе қатаң тәртіпті, ережелер мен нақты алгоритмдерді ұстанғанды жөн көресің бе?', dimension: 'C' as const },
    { text: 'Деректер базасын жүйелеу, құжаттарды архивтеу және статистикалық есеп жасау тартымды ма?', dimension: 'C' as const },
    { text: 'Заңнамалық актілерді, келісімшарттарды ұқыпты тексеріп, қателерді анықтау қолыңнан келе ме?', dimension: 'C' as const }
  ];

  const handleRiasecAnswer = (points: number) => {
    const dim = riasecQuestions[currentRiasecStep].dimension;
    const updated = {
      ...riasecScores,
      [dim]: riasecScores[dim] + points
    };
    setRiasecScores(updated);

    if (currentRiasecStep < riasecQuestions.length - 1) {
      setCurrentRiasecStep(prev => prev + 1);
    } else {
      setRiasecFinished(true);
      storageService.addXp(60);
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch {}
    }
  };

  const entries = Object.entries(riasecScores) as [keyof typeof riasecScores, number][];
  const sortedDimensions = entries.sort((a, b) => b[1] - a[1]);
  const topDimension = sortedDimensions[0][0];

  const dimensionMeta: Record<string, { title: string; majors: string[]; desc: string; icon: string; traits: string[] }> = {
    R: {
      title: 'Практикалық / Реалистік (R)',
      majors: ['Робототехника және мехатроника', 'Компьютерлік инженерия', 'Архитектура және құрылыс', 'Авиация және ғарыштық техника'],
      desc: 'Сіз нақты материалдық нәтижелермен, құрылғылармен және өндірістік технологиялармен жұмыс істегенде барынша өнімдісіз.',
      icon: '🛠️',
      traits: ['Қолмен істеу шеберлігі', 'Техникалық түйсік', 'Шыдамдылық пен нақтылық']
    },
    I: {
      title: 'Зерттеушілік / Ғылыми (I)',
      majors: ['Жасанды Интеллект & Data Science', 'Киберқауіпсіздік', 'Биотехнология және генетика', 'Қолданбалы математика'],
      desc: 'Сіз аналитикалық ойлау қабілеті жоғары, деректерді терең зерттеуге құштар, заманауи ғылым мен жоғары IT бағытының адамысыз.',
      icon: '🔬',
      traits: ['Логикалық анализ', 'Ғылыми ізденіс', 'Күрделі есептерді шешу']
    },
    A: {
      title: 'Шығармашылық / Көркемдік (A)',
      majors: ['UI/UX Дизайн & Game Art', 'Медиа және цифрлық журналистика', 'Кино және анимация режиссурасы', 'Графикалық дизайн'],
      desc: 'Сізде стандарттан тыс креативті ойлау, эстетикалық сезім және жаңа бейнелер жасау таланты мықты дамыған.',
      icon: '🎨',
      traits: ['Креативтілік', 'Эстетикалық талғам', 'Еркін ойлау']
    },
    S: {
      title: 'Әлеуметтік / Қоғамдық (S)',
      majors: ['Психология және коучинг', 'Жалпы медицина және педиатрия', 'Заманауи педагогика (STEM)', 'Әлеуметтік менеджмент'],
      desc: 'Сіз адамдарға қолдау көрсету, оқыту, емдеу және қоғамның дамуына игілік жасау саласында ең үлкен биіктерді бағындырасыз.',
      icon: '🤝',
      traits: ['Эмпатия', 'Түсіністік пен көмек', 'Коммуникация']
    },
    E: {
      title: 'Кәсіпкерлік / Көшбасшылық (E)',
      majors: ['IT-Стартаптар менеджменті', 'Халықаралық бизнес және сауда', 'Цифрлық маркетинг', 'Құқықтану және сот ісі'],
      desc: 'Сіз туа біткен көшбасшысыз, адамдарды бастап жүріп, мақсатқа жетуде батыл әрі жігерлісіз.',
      icon: '🚀',
      traits: ['Көшбасшылық', 'Шешім қабылдау', 'Келіссөз жүргізу']
    },
    C: {
      title: 'Жүйелі / Аналитикалық (C)',
      majors: ['Финтех және банк ісі', 'Аудит және бухгалтерлік есеп', 'Деректер қоры әкімшісі', 'Заңгерлік сараптама'],
      desc: 'Сіз ұқыптылықты, тәртіпті, нақты цифрларды және мінсіз жүйелі процестерді жоғары бағалайсыз.',
      icon: '📊',
      traits: ['Ұқыптылық', 'Тәртіп пен ереже', 'Цифрлармен жұмыс']
    }
  };

  const currentMeta = dimensionMeta[topDimension] || dimensionMeta.I;

  const filteredGrants = grants.filter(g => 
    g.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subjects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Sub Nav Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-panel rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        <button
          onClick={() => setSubTab('riasec')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'riasec'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Голланд Матрицасы (24 сұрақ)</span>
        </button>

        <button
          onClick={() => setSubTab('predictor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'predictor'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>ҰБТ Грант Калькуляторы</span>
        </button>

        <button
          onClick={() => setSubTab('grants')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'grants'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>ҚР Гранттары мен ЖОО Картасы</span>
        </button>

        <button
          onClick={() => setSubTab('cv')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'cv'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Студенттік Резюме</span>
        </button>
      </div>

      {/* ================= TAB 1: RIASEC EXPANDED TEST (24 QUESTIONS) ================= */}
      {subTab === 'riasec' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-2xl mx-auto space-y-6">
          {!riasecFinished ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Сұрақ {currentRiasecStep + 1} / {riasecQuestions.length}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {Math.round(((currentRiasecStep + 1) / riasecQuestions.length) * 100)}% орындалды
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((currentRiasecStep + 1) / riasecQuestions.length) * 100}%` }}
                />
              </div>

              <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 leading-relaxed">
                {riasecQuestions[currentRiasecStep].text}
              </h3>

              <div className="space-y-2.5">
                {[
                  { label: 'Иә, бұл дәл мен туралы! (Өте қатты ұнайды)', points: 3 },
                  { label: 'Кейде қызығамын (Орташа қызығушылық)', points: 2 },
                  { label: 'Жоқ, бұл маған мүлдем қызық емес', points: 0 }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRiasecAnswer(opt.points)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 mx-auto flex items-center justify-center text-3xl shadow-sm">
                {currentMeta.icon}
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
                  Сіздің басым психологиялық типіңіз:
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
                  {currentMeta.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                  {currentMeta.desc}
                </p>
              </div>

              {/* 6 Dimension Breakdown Bars */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  6 Бағыт бойынша нәтижелер пайызы:
                </span>

                <div className="space-y-2 text-xs">
                  {entries.map(([dim, score]) => {
                    const percent = Math.min(100, Math.round((score / 12) * 100));
                    const labelMap: Record<string, string> = {
                      R: 'Реалистік (Практикалық)',
                      I: 'Зерттеушілік (Ғылыми/IT)',
                      A: 'Шығармашылық (Өнер/Дизайн)',
                      S: 'Әлеуметтік (Педагогика/Медицина)',
                      E: 'Кәсіпкерлік (Бизнес/Лидерлік)',
                      C: 'Жүйелі (Қаржы/Аналитика)'
                    };

                    return (
                      <div key={dim} className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>{labelMap[dim]}</span>
                          <span className="font-mono text-amber-700">{percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Majors */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Қазақстандағы ең қолайлы мамандықтар:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentMeta.majors.map((major, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-semibold flex items-center gap-2 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{major}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setRiasecFinished(false);
                  setCurrentRiasecStep(0);
                  setRiasecScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
              >
                Тестті қайта тапсыру
              </button>

            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: GRANT CHANCE PREDICTOR WITH FULL COMBINATIONS ================= */}
      {subTab === 'predictor' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              🎯 ҰБТ Аналитикасы
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-slate-900">
              Грантқа Түсу Ықтималдығын Есептеу
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Қазақстанның ресми ҰБТ бейіндік комбинациялары мен күтілетін балыңызды таңдап, ЖОО гранттарына түсу мүмкіндігіңізді көріңіз.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Күтілетін немесе жинаған ҰБТ баллыңыз (50 - 140):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={userScoreInput}
                  onChange={e => setUserScoreInput(Number(e.target.value))}
                  className="flex-1 accent-amber-600 cursor-pointer"
                />
                <span className="text-xl font-heading font-black text-amber-700 w-16 text-right font-mono">
                  {userScoreInput} балл
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Бейіндік пәндер комбинациясы (Толық ресми тізім):
              </label>
              <select
                value={userSubjectCombination}
                onChange={e => setUserSubjectCombination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold"
              >
                <option value="Математика + Информатика">1. Математика + Информатика (IT, Бағдарламалау, Data Science, AI)</option>
                <option value="Математика + Физика">2. Математика + Физика (Инженерия, Робототехника, Механика, Құрылыс)</option>
                <option value="Биология + Химия">3. Биология + Химия (Жалпы медицина, Стоматология, Педиатрия, Фармация)</option>
                <option value="География + Математика">4. География + Математика (Экономика, Қаржы, Менеджмент, Логистика)</option>
                <option value="Ағылшын тілі + Дүниежүзі тарихы">5. Ағылшын тілі + Дүниежүзі тарихы (Халықаралық қатынастар, Аударма)</option>
                <option value="Дүниежүзі тарихы + Құқық негіздері">6. Дүниежүзі тарихы + Құқық негіздері (Юриспруденция, Сот ісі, Құқық)</option>
                <option value="Қазақ тілі/Әдебиеті + Қазақстан тарихы">7. Қазақ тілі/Әдебиеті + Қазақстан тарихы (Педагогика, Филология)</option>
                <option value="Биология + География">8. Биология + География (Агрономия, Экология, Биотехнология, Ветеринария)</option>
                <option value="Химия + Физика">9. Химия + Физика (Химиялық инженерия, Нанотехнология, Металлургия)</option>
                <option value="География + Дүниежүзі тарихы">10. География + Дүниежүзі тарихы (Туризм, Мейрамхана және қонақ үй ісі)</option>
                <option value="Шығармашылық емтихандар">11. Шығармашылық емтихандар (Сәулет, Дизайн, Журналистика, Театр)</option>
              </select>
            </div>
          </div>

          {/* Predictions Cards */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold text-slate-800 block">
              «{userSubjectCombination}» комбинациясы бойынша ЖОО грант мүмкіндігі:
            </span>

            {grants.map(grant => {
              const diff = userScoreInput - grant.passingScore2025;
              let statusText = 'Төмен мүмкіндік';
              let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

              if (diff >= 5) {
                statusText = 'Өте жоғары мүмкіндік (95%+)';
                badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              } else if (diff >= 0) {
                statusText = 'Жақсы мүмкіндік (75-85%)';
                badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
              } else if (diff >= -5) {
                statusText = 'Шекаралық (Қосымша 4-6 балл қажет)';
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
              }

              return (
                <div
                  key={grant.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{grant.universityName}</h4>
                    <p className="text-[11px] text-slate-600">{grant.major}</p>
                    <p className="text-[10px] text-slate-400">Пәндер: {grant.subjects} • 2025 шекті балы: {grant.passingScore2025}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeColor} whitespace-nowrap`}>
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= TAB 3: UNIVERSITY GRANTS MAP ================= */}
      {subTab === 'grants' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Университетті, мамандықты немесе пәндерді іздеу..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGrants.map(grant => (
              <div
                key={grant.id}
                className="p-5 glass-panel rounded-2xl border border-slate-200 bg-white space-y-4 hover:border-amber-500 transition flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {grant.city}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {grant.grantCount} грант
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {grant.universityName}
                  </h3>

                  <p className="text-xs font-semibold text-indigo-700">
                    {grant.major}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {grant.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Бейіндік пәндер:</span>
                    <span className="font-medium text-slate-800">{grant.subjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">2025 жылғы өту балы:</span>
                    <span className="font-bold text-amber-700 font-mono text-sm">{grant.passingScore2025} балл</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: STUDENT CV BUILDER (ANONYMOUS) ================= */}
      {subTab === 'cv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4 text-xs">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Түйіндеме Баптаулары</span>
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Бүркеншік ат:</label>
              <input
                type="text"
                value={cvData.pseudonym}
                onChange={e => setCvData({ ...cvData, pseudonym: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email:</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={e => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Байланыс:</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={e => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Өзім туралы қысқаша:</label>
              <textarea
                rows={3}
                value={cvData.aboutMe}
                onChange={e => setCvData({ ...cvData, aboutMe: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Жаңа дағды қосу:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Мысалы: C++, Figma..."
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      setCvData({ ...cvData, skills: [...cvData.skills, newSkillInput.trim()] });
                      setNewSkillInput('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Қосу
                </button>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Резюмені Басып Шығару / PDF</span>
            </button>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 text-xs text-slate-700 shadow-sm">
            <div className="border-b border-slate-200 pb-5">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                {cvData.pseudonym}
              </h2>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                Оқушылық Портфолио
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-[11px] text-slate-500 font-mono">
                <span>✉️ {cvData.email}</span>
                <span>📞 {cvData.phone}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                Қысқаша мәлімет:
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {cvData.aboutMe}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                Негізгі дағдылар:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                Мектепшілік волонтерлік тәжірибе:
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {cvData.volunteerExperiences.map((exp, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {exp}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                Жетістіктер:
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {cvData.academicAchievements.map((ach, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {ach}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
