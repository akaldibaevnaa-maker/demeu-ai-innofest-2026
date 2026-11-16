import { 
  UserProfile, 
  VolunteerOpportunity, 
  VolunteerPassportRecord, 
  KindnessAct, 
  PeerHelpRequest, 
  Flashcard, 
  QuizQuestion, 
  UniversityGrant, 
  Habit,
  MoodEntry,
  DailyQuizItem
} from '../types';

export const initialProfile: UserProfile = {
  id: 'anon-' + Math.floor(1000 + Math.random() * 9000),
  pseudonym: 'Жас Қыран #482',
  avatarSeed: '🦅',
  xp: 450,
  level: 4,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  language: 'kk',
  theme: 'light',
  geminiApiKey: '',
  isAnonymousMode: true,
  badges: [
    {
      id: 'badge-1',
      titleKk: 'Құпия серік',
      titleRu: 'Анонимный спутник',
      titleEn: 'Anonymous Companion',
      descriptionKk: 'DEMEU AI қауіпсіз және анонимді экожүйесіне қосылғаны үшін',
      descriptionRu: 'За безопасный вход в экосистему DEMEU AI',
      descriptionEn: 'For joining the secure DEMEU AI ecosystem',
      icon: '🛡️',
      unlockedAt: '2026-03-01',
      category: 'general'
    },
    {
      id: 'badge-2',
      titleKk: 'Қайырымды жүрек',
      titleRu: 'Доброе сердце',
      titleEn: 'Kind Heart',
      descriptionKk: 'Мектеп/колледж ішілік волонтерлік шараларға қатысқаны үшін',
      descriptionRu: 'За участие во внутришкольных проектах',
      descriptionEn: 'For in-school volunteering impact',
      icon: '🤝',
      unlockedAt: '2026-03-05',
      category: 'volunteer'
    },
    {
      id: 'badge-3',
      titleKk: 'Зейін шебері',
      titleRu: 'Мастер фокуса',
      titleEn: 'Focus Master',
      descriptionKk: 'Pomodoro арқылы 25 минуттық фокус сессияларын орындағаны үшін',
      descriptionRu: 'За успешные Pomodoro сессии',
      descriptionEn: 'For Pomodoro focus sessions',
      icon: '⏱️',
      unlockedAt: '2026-03-08',
      category: 'study'
    },
    {
      id: 'badge-4',
      titleKk: 'Эмоция ұстазы',
      titleRu: 'Мастер эмоций',
      titleEn: 'Emotion Master',
      descriptionKk: 'Көңіл-күй күнделігін жүргізіп, тыныс алу жаттығуларын меңгергені үшін',
      descriptionRu: 'За трекинг настроения и дыхательные практики',
      descriptionEn: 'For mood tracking and breathing practices',
      icon: '🧠',
      category: 'psych'
    },
    {
      id: 'badge-5',
      titleKk: 'Болашақ көшбасшы',
      titleRu: 'Будущий лидер',
      titleEn: 'Future Leader',
      descriptionKk: 'Голланд кәсіптік матрицасынан өтіп, резюме жасағаны үшін',
      descriptionRu: 'За составление профориентационной карты',
      descriptionEn: 'For career roadmap generation',
      icon: '🧭',
      category: 'career'
    }
  ]
};

export const initialMoodHistory: MoodEntry[] = [
  {
    id: 'm1',
    timestamp: '2026-03-10T18:30:00Z',
    rating: 3,
    emotions: ['Шаршау 🥱', 'Ойлы 💭'],
    note: 'Сабақтан соң біраз шаршадым, бірақ тапсырмаларды орындап үлгердім.',
    aiInsight: 'Сен керемет жұмыс атқардың! Енді денең мен миыңа тыныс алу жаттығуымен демалыс бер.'
  },
  {
    id: 'm2',
    timestamp: '2026-03-11T20:15:00Z',
    rating: 4,
    emotions: ['Қуанышты ✨', 'Шабытты 🚀'],
    note: 'Білім сайысында жақсы нәтиже көрсеттім, көңіл-күйім көтеріңкі.',
    aiInsight: 'Жарайсың! Бұл сенің табандылығыңның жемісі.'
  },
  {
    id: 'm3',
    timestamp: '2026-03-12T17:20:00Z',
    rating: 5,
    emotions: ['Қуанышты ✨', 'Сабырлылық 🌿'],
    note: 'Кітапханадағы кітаптарды реттеп, мектебімізге пайдамызды тигіздік. Керемет сезім!',
    aiInsight: 'Мектеп ішіндегі игі істер достықты арттырып, нағыз шабыт сыйлайды!'
  }
];

// ТЕК ҚАНА МЕКТЕП ЖӘНЕ КОЛЛЕДЖ ІШІНДЕГІ ВОЛОНТЕРЛІК ШАРАЛАР
export const initialVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: 'vol-in-1',
    titleKk: 'Мектеп кітапханасы қорын реставрациялау және каталогтау',
    titleRu: 'Реставрация и каталогизация книг школьной библиотеки',
    category: 'library',
    descriptionKk: 'Тозған оқулықтар мен көркем әдебиеттерді жөндеу, түптеу және кітапхананың электронды базасына енгізуге көмектесу.',
    location: 'Мектеп кітапханасы',
    hours: 4,
    teamSizeNeeded: 5,
    currentTeamCount: 3,
    isStudentInitiative: false,
    applied: true,
    status: 'completed'
  },
  {
    id: 'vol-in-2',
    titleKk: '«Жасыл кабинет» — мектеп дәліздеріндегі өсімдіктер мен жылыжайды күту',
    titleRu: '«Зеленый кабинет» — уход за комнатными растениями и оранжереей',
    category: 'green',
    descriptionKk: 'Мектеп дәліздері мен биология кабинетіндегі гүлдерді суару, топырағын ауыстыру және мектеп ауласын көгалдандыру тобы.',
    location: 'Биология кабинеті & Мектеп дәлізі',
    hours: 3,
    teamSizeNeeded: 4,
    currentTeamCount: 2,
    isStudentInitiative: false,
    applied: true,
    status: 'completed'
  },
  {
    id: 'vol-in-3',
    titleKk: 'Бастауыш сыныптарға үзіліс кезінде қозғалмалы ойындар ұйымдастыру',
    titleRu: 'Организация подвижных развивающих игр на переменах для младших классов',
    category: 'peer_help',
    descriptionKk: 'Кіші оқушыларға гаджетсіз, қауіпсіз әрі қызықты үзіліс өткізуге көмектесу (тоғызқұмалақ, шахмат, көңілді эстафеталар).',
    location: 'Бастауыш қанаты & Ойын залы',
    hours: 3,
    teamSizeNeeded: 6,
    currentTeamCount: 4,
    isStudentInitiative: true,
    organizerPseudonym: 'Тұлпар #308',
    applied: false,
    status: 'open'
  },
  {
    id: 'vol-in-4',
    titleKk: 'Акт залындағы мерекелік шаралардың дыбыс және жарық аппаратурасын реттеу',
    titleRu: 'Техническая помощь: настройка звука и света в актовом зале',
    category: 'tech',
    descriptionKk: 'Мектептегі жиындар мен концерттерде дыбыс зорайтқыштарды, микрофондар мен проекторларды баптауға ерікті көмек.',
    location: 'Мектептің Акт залы',
    hours: 4,
    teamSizeNeeded: 3,
    currentTeamCount: 1,
    isStudentInitiative: false,
    applied: false,
    status: 'open'
  },
  {
    id: 'vol-in-5',
    titleKk: 'Мектепшілік дебат және зияткерлік турнирлерін ұйымдастыру тобы',
    titleRu: 'Организационная помощь во внутришкольном дебатном турнире',
    category: 'events',
    descriptionKk: 'Турнир спикерлерін тіркеу, уақытты бақылау (таймкипинг) және аудиторияларды сайысқа дайындау.',
    location: 'Мәжіліс залы',
    hours: 5,
    teamSizeNeeded: 6,
    currentTeamCount: 5,
    isStudentInitiative: true,
    organizerPseudonym: 'Шамшырақ #952',
    applied: false,
    status: 'open'
  },
  {
    id: 'vol-in-6',
    titleKk: 'Мектеп асханасындағы «Таза табақ» және тағам қалдығын азайту акциясы',
    titleRu: 'Эко-акция «Чистая тарелка» в школьной столовой',
    category: 'cleanliness',
    descriptionKk: 'Оқушыларды асты құрметтеуге, ыдысты ұқыпты тапсыруға баулитын түсіндіру және кезекшілік тобы.',
    location: 'Мектеп асханасы',
    hours: 2,
    teamSizeNeeded: 4,
    currentTeamCount: 2,
    isStudentInitiative: false,
    applied: false,
    status: 'open'
  }
];

export const initialVolunteerRecords: VolunteerPassportRecord[] = [
  {
    id: 'rec-1',
    opportunityTitle: 'Мектеп кітапханасы қорын реставрациялау',
    scope: 'Мектеп ішілік іс-шара',
    date: '2026-03-02',
    hours: 4,
    category: 'Кітапхана ісі',
    status: 'verified',
    verifierRole: 'Мектеп үйлестірушісі',
    certificateHash: 'DMU-SCH-VOL-7841A'
  },
  {
    id: 'rec-2',
    opportunityTitle: '«Жасыл кабинет» — мектеп дәліздерін көгалдандыру',
    scope: 'Мектеп ішілік іс-шара',
    date: '2026-03-07',
    hours: 3,
    category: 'Мектеп экологиясы',
    status: 'verified',
    verifierRole: 'Шара тәлімгері',
    certificateHash: 'DMU-SCH-VOL-9214B'
  }
];

export const initialKindnessActs: KindnessAct[] = [
  {
    id: 'act-1',
    titleKk: 'Құрдасыңа мектепте жылы сөз айт',
    descriptionKk: 'Бүгін қиындық көріп немесе тұйықталып отырған оқушыға шынайы қолдау білдір.',
    xp: 25,
    completed: true,
    completedDate: '2026-03-10'
  },
  {
    id: 'act-2',
    titleKk: 'Кабинет тақтасы мен парталарды тазалап қой',
    descriptionKk: 'Сабақтан кейін кабинет тақтасын сүртіп, мұғалімге көмектес.',
    xp: 20,
    completed: false
  },
  {
    id: 'act-3',
    titleKk: 'Мектеп дәлізінде түсіп қалған затты иесіне тапсыр',
    descriptionKk: 'Жоғалған қаламды, кітапты немесе киімді иесіне немесе кезекшіге жеткіз.',
    xp: 20,
    completed: false
  },
  {
    id: 'act-4',
    titleKk: 'Кітапхана сөрелерін жинауға көмектес',
    descriptionKk: 'Кітапханадағы кітаптарды реттеп, сөреге ұқыпты қойып шық.',
    xp: 30,
    completed: false
  }
];

export const initialPeerRequests: PeerHelpRequest[] = [
  {
    id: 'peer-1',
    studentPseudonym: 'Жұлдызды Оқушы #114',
    needsHelpWith: 'Математика: Логарифмдер мен функциялар',
    canHelpWith: 'Ағылшын тілі (Грамматика және Эссе)',
    contact: '@study_partner',
    date: '2026-03-11',
    status: 'open'
  },
  {
    id: 'peer-2',
    studentPseudonym: 'Тұлпар #308',
    needsHelpWith: 'Физика: Кинематика және динамика',
    canHelpWith: 'Информатика (Python бағдарламалау)',
    contact: '@python_help',
    date: '2026-03-10',
    status: 'open'
  },
  {
    id: 'peer-3',
    studentPseudonym: 'Ақылды Дос #642',
    needsHelpWith: 'Химия: Органикалық реакциялар',
    canHelpWith: 'Қазақстан тарихы (Негізгі даталар мен оқиғалар)',
    contact: '@history_prep',
    date: '2026-03-09',
    status: 'matched'
  }
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'Математикалық сауаттылық',
    question: 'Пропорцияның негізгі қасиеті қандай?',
    answer: 'Шеткі мүшелерінің көбейтіндісі ортаңғы мүшелерінің көбейтіндісіне тең: a/b = c/d болса, a · d = b · c.',
    mastered: true
  },
  {
    id: 'fc-2',
    subject: 'Қазақстан тарихы',
    question: 'Қасым ханның тұсындағы заңдар жинағы қалай аталады?',
    answer: '«Қасым ханның қасқа жолы» — қазақ қоғамындағы алғашқы жүйеленген заңдар жинағы.',
    mastered: true
  },
  {
    id: 'fc-3',
    subject: 'Оқу сауаттылығы',
    question: 'Мәтіндегі «авторлық идея» дегеніміз не?',
    answer: 'Автордың мәтін арқылы оқырманға жеткізгісі келген басты түйінді ойы мен моральдық ұстанымы.',
    mastered: false
  },
  {
    id: 'fc-4',
    subject: 'Физика',
    question: 'Бүкіләлемдік тартылыс заңы қалай өрнектеледі?',
    answer: 'F = G · (m₁ · m₂) / R², мұндағы G — гравитациялық тұрақты.',
    mastered: false
  },
  {
    id: 'fc-5',
    subject: 'Информатика',
    question: 'Python тіліндегі `list` пен `tuple` негізгі айырмашылығы неде?',
    answer: '`list` (тізім) өзгермелі (mutable), ал `tuple` (кортеж) өзгермейтін (immutable) деректер типі.',
    mastered: false
  }
];

// ҰБТ СҰРАҚТАРЫ (9 ПӘН БОЙЫНША ҰТО ФОРМАТЫНДАҒЫ ШЫНАЙЫ СҰРАҚТАР БАЗАСЫ)
export const initialQuizQuestions: QuizQuestion[] = [
  // 1. Оқу сауаттылығы
  {
    id: 'ubt-read-1',
    category: 'reading',
    categoryTitle: 'Оқу сауаттылығы',
    question: 'Мәтін: «Табиғаттағы әрбір тірі ағза белгілі бір экологиялық тепе-теңдіктің бөлшегі. Бір түрдің жойылуы басқа жүздеген түрлердің өміріне тікелей әсер етеді». Мәтіннің негізгі түйіні қандай?',
    options: [
      'Адам табиғаттан тәуелсіз өмір сүре алады',
      'Барлық биологиялық түрлер өзара тығыз байланысты және қорғауды қажет етеді',
      'Түрлердің жойылуы табиғи процесс және оған кедергі жасамау керек',
      'Жануарлар тек адамның пайдасы үшін өмір сүреді'
    ],
    correctIndex: 1,
    explanation: 'Мәтін экологиялық тепе-теңдіктің өзара байланысын және әрбір түрдің маңыздылығын нақты көрсетеді.'
  },
  {
    id: 'ubt-read-2',
    category: 'reading',
    categoryTitle: 'Оқу сауаттылығы',
    question: 'Мәтін: «Адамзат тарихындағы ұлы жаңалықтар көбінесе қажеттіліктен туындаған. Жазу мен кітап басу өнері білімді ұрпақтан ұрпаққа жалғау қажеттілігінен пайда болды». Автор кітап басу өнерінің туындауының негізгі қозғаушы күші ретінде нені көрсетеді?',
    options: [
      'Сауда байланыстарын кеңейту талабын',
      'Білім мен тәжірибені келесі ұрпаққа сақтау және жеткізу қажеттілігін',
      'Мемлекеттік билеушілердің арнайы жарлықтарын',
      'Адамдардың бос уақытын қызықты өткізу талпынысын'
    ],
    correctIndex: 1,
    explanation: 'Мәтінде тікелей: «білімді ұрпақтан ұрпаққа жалғау қажеттілігінен пайда болды» деп нақты көрсетілген.'
  },
  {
    id: 'ubt-read-3',
    category: 'reading',
    categoryTitle: 'Оқу сауаттылығы',
    question: 'Мәтін: «Экологиялық мәселелер тек бір ғана мемлекеттің емес, бүкіл адамзаттың ортақ қаупіне айналып отыр. Әсіресе, дүниежүзілік мұхиттардың ластануы мен ормандардың азаюы жаһандық климатты күрт өзгертуде». Мәтіннің негізгі идеясы қандай?',
    options: [
      'Мемлекеттердің жекелей өнеркәсіптік пайда табуы',
      'Жаһандық экологиялық қатерлер және оларды бүкіл әлеммен бірлесе шешу қажеттілігі',
      'Ағаш өндірісін барынша ұлғайту жолдары',
      'Мұхиттағы сауда флотын көбейту саясаты'
    ],
    correctIndex: 1,
    explanation: 'Мәтін экологияның бүкіл адамзатқа ортақ екендігін және оны бірлесе шешу керектігін дәлелдейді.'
  },
  {
    id: 'ubt-read-4',
    category: 'reading',
    categoryTitle: 'Оқу сауаттылығы',
    question: 'Мәтін: «Абайдың "Қара сөздері" — тек қазақ халқына ғана емес, бүкіл адамзатқа арналған философиялық трактат. Онда ғылым мен білімнің, еңбек пен ар-ұяттың маңызы терең талданады. Абай адамның ең басты қасиеті ретінде "толық адам" концепциясын ұсынады». Мәтінге сәйкес, Абай іліміндегі басты тұлғалық идеал қандай?',
    options: [
      'Байлық пен салтанатқа жету',
      '«Толық адам» деңгейіне ұмтылу',
      'Мемлекеттік жоғары шен алу',
      'Ел аралап саяхаттау'
    ],
    correctIndex: 1,
    explanation: 'Мәтінде тікелей: «Абай адамның ең басты қасиеті ретінде "толық адам" концепциясын ұсынады» деп жазылған.'
  },
  {
    id: 'ubt-read-5',
    category: 'reading',
    categoryTitle: 'Оқу сауаттылығы',
    question: 'Мәтін: «Цифрлық технологиялар заманында ақпараттың көлемі экспоненциалды түрде өсуде. Алайда ақпараттың көптігі білімнің тереңдігін білдірмейді. Заманауи адамға ақпаратты тұтыну ғана емес, оны сыни тұрғыдан саралап, жалған ақпараттан (фейк) ақиқатты ажырата білу өнері қажет». Автор заманауи адамның басты дағдысы ретінде нені бағалайды?',
    options: [
      'Кез келген жаңалықты талғаусыз оқуды',
      'Сыни ойлау мен ақпаратты тексеру қабілетін',
      'Интернетте мүмкіндігінше көп уақыт өткізуді',
      'Әлеуметтік желідегі жазылушылар санын'
    ],
    correctIndex: 1,
    explanation: 'Автор ақпараттың молдығынан гөрі оны сыни тұрғыдан саралап, фейкті ажырата білу өнерін ең маңызды деп есептейді.'
  },

  // 2. Математикалық сауаттылық
  {
    id: 'ubt-math-lit-1',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: 'Кітап беттерін нөмірлеу үшін 31 таңба қолданылды (1-ден бастап). Кітапта барлығы неше бет бар?',
    options: ['18 бет', '20 бет', '22 бет', '25 бет'],
    correctIndex: 1,
    explanation: '1-ден 9-ға дейін 9 таңба қолданылады. Қалған таңбалар: 31 - 9 = 22 таңба. Екі таңбалы сандар болғандықтан: 22 / 2 = 11 бет. Барлығы: 9 + 11 = 20 бет.'
  },
  {
    id: 'ubt-math-lit-2',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: 'Дүкенде 20% жеңілдік жасалғаннан кейінгі тауар бағасы 8000 тг болды. Осы тауардың жеңілдікке дейінгі бастапқы бағасын табыңыз:',
    options: ['9 000 тг', '10 000 тг', '11 000 тг', '12 000 тг'],
    correctIndex: 1,
    explanation: 'Жеңілдіктен кейін баға бастапқы құнның 80%-ын (0.8) құрайды. 8000 / 0.8 = 10 000 тг.'
  },
  {
    id: 'ubt-math-lit-3',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: '12 жұмысшы белгілі бір тапсырманы 8 күнде аяқтаса, дәл осындай қарқынмен жұмыс істейтін 6 жұмысшы сол тапсырманы неше күнде бітіреді?',
    options: ['12 күн', '14 күн', '16 күн', '18 күн'],
    correctIndex: 2,
    explanation: 'Кері пропорционалдық: жұмыс көлемі тұрақты: 12 · 8 = 96 адам-күн. Енді 96 / 6 = 16 күн.'
  },
  {
    id: 'ubt-math-lit-4',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: 'Екі санның қосындысы 72-ге тең, ал біреуі екіншісінен 16-ға үлкен. Осы сандардың кішісін табыңыз:',
    options: ['26', '28', '30', '32'],
    correctIndex: 1,
    explanation: 'x + (x + 16) = 72 => 2x = 56 => x = 28. Екінші сан: 28 + 16 = 44. Кіші сан — 28.'
  },
  {
    id: 'ubt-math-lit-5',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: 'Сөмкеде 4 ақ, 6 қызыл және 10 көк шар бар. Қарамай алынған бір шардың қызыл түсті болу ықтималдығы қандай?',
    options: ['0,2', '0,3', '0,4', '0,5'],
    correctIndex: 1,
    explanation: 'Барлық шарлар саны: 4 + 6 + 10 = 20. Қызыл шарлар саны: 6. Ықтималдық: P = 6 / 20 = 0,3.'
  },
  {
    id: 'ubt-math-lit-6',
    category: 'math_literacy',
    categoryTitle: 'Математикалық сауаттылық',
    question: 'Сыныптағы 25 оқушының әрқайсысы бір-бірімен қол алысып амандасты. Барлығы неше қол алысу орын алды?',
    options: ['300', '600', '250', '500'],
    correctIndex: 0,
    explanation: 'Қол алысулар саны: C(25, 2) = (25 · 24) / 2 = 600 / 2 = 300.'
  },

  // 3. Қазақстан тарихы
  {
    id: 'ubt-hist-1',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: '1991 жылы 21 желтоқсанда Алматы қаласында қандай тарихи оқиға орын алды?',
    options: [
      'ҚР Конституциясы қабылданды',
      'Тәуелсіз Мемлекеттер Достастығын (ТМД) құру туралы Алматы Декларациясына қол қойылды',
      'Қазақстан БҰҰ-ға мүше болып қабылданды',
      'Ұлттық валюта — Теңге айналымға енгізілді'
    ],
    correctIndex: 1,
    explanation: '1991 жылы 21 желтоқсанда Алматыда 11 егеменді мемлекет басшылары ТМД-ны құру туралы Алматы Декларациясына қол қойды.'
  },
  {
    id: 'ubt-hist-2',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: 'Ертіс бойында Омбы бекінісі қай жылы салынды?',
    options: ['1716 жыл', '1718 жыл', '1720 жыл', '1752 жыл'],
    correctIndex: 0,
    explanation: 'Омбы бекінісі 1716 жылы И.Д. Бухгольц бастаған экспедицияның нәтижесінде салынған.'
  },
  {
    id: 'ubt-hist-3',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: 'Абылай сұлтан ресми түрде бүкіл үш жүздің ханы болып сайланып, хандық құрған жылдары:',
    options: ['1711–1781 жж.', '1771–1781 жж.', '1740–1771 жж.', '1729–1760 жж.'],
    correctIndex: 1,
    explanation: 'Әбілмәмбет хан қайтыс болған соң, 1771 жылы Түркістанда Абылай бүкіл қазақ жерінің ұлы ханы болып сайланды (1771–1781 жж.).'
  },
  {
    id: 'ubt-hist-4',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: 'Түркістандағы Қожа Ахмет Яссауи кесенесін салдырған мемлекет билеушісі:',
    options: ['Әмір Темір', 'Жошы хан', 'Есім хан', 'Тәуке хан'],
    correctIndex: 0,
    explanation: 'XIV ғасырдың соңында (1397 ж. бастап) ұлы қолбасшы Әмір Темір Қожа Ахмет Яссауи қабірінің басына сәулетті алып кесене тұрғызды.'
  },
  {
    id: 'ubt-hist-5',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: '1723 жылы қазақ халқының басына түскен аса ауыр қасіретті тарихи кезең қалай аталады?',
    options: [
      '«Зұлмат жылдары»',
      '«Ақтабан шұбырынды, Алқакөл сұлама»',
      '«Ордабасы жиыны»',
      '«Ұлы жұт кезеңі»'
    ],
    correctIndex: 1,
    explanation: '1723 жылғы Жоңғар шапқыншылығы салдарынан орын алған тарихи қасірет халық жадында «Ақтабан шұбырынды, Алқакөл сұлама» деп қалды.'
  },
  {
    id: 'ubt-hist-6',
    category: 'kz_history',
    categoryTitle: 'Қазақстан тарихы',
    question: 'Қазақстан Республикасының тәуелсіздік алғаннан кейінгі тұңғыш Конституциясы қай жылы қабылданды?',
    options: [
      '1991 жыл 16 желтоқсан',
      '1993 жыл 28 қаңтар',
      '1995 жыл 30 тамыз',
      '1997 жыл 10 желтоқсан'
    ],
    correctIndex: 1,
    explanation: 'Тәуелсіз Қазақстанның тұңғыш Конституциясы 1993 жылы 28 қаңтарда Жоғарғы Кеңестің IX сессиясында қабылданды.'
  },

  // 4. Математика (Бейінді)
  {
    id: 'ubt-math-prof-1',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'Теңдеуді шешіңіз: log₂(x - 3) = 4',
    options: ['x = 11', 'x = 19', 'x = 16', 'x = 13'],
    correctIndex: 1,
    explanation: 'Логарифм анықтамасы бойынша: x - 3 = 2⁴ => x - 3 = 16 => x = 19.'
  },
  {
    id: 'ubt-math-prof-2',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'cos(120°) тригонометриялық мәнін табыңыз:',
    options: ['-√3/2', '-1/2', '1/2', '√3/2'],
    correctIndex: 1,
    explanation: 'Келтіру формуласы бойынша: cos(120°) = cos(180° - 60°) = -cos(60°) = -1/2.'
  },
  {
    id: 'ubt-math-prof-3',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'Функцияның туындысын табыңыз: f(x) = 3x³ - 5x² + 7',
    options: ['9x² - 10x', '3x² - 5x', '9x² - 10x + 7', '9x³ - 10x²'],
    correctIndex: 0,
    explanation: '(3x³)\' = 9x², (-5x²)\' = -10x, (7)\' = 0. Нәтиже: 9x² - 10x.'
  },
  {
    id: 'ubt-math-prof-4',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'Радиустары 3 см және 5 см болатын екі шеңбер центрлерінің арақашықтығы 8 см. Шеңберлердің өзара орналасуы:',
    options: ['Іштей жанасады', 'Сырттай жанасады', 'Екі нүктеде қиылысады', 'Ортақ нүктесі жоқ'],
    correctIndex: 1,
    explanation: 'Центрлер арақашықтығы d = R₁ + R₂ (8 = 3 + 5) болғандықтан, шеңберлер сырттай жанасады.'
  },
  {
    id: 'ubt-math-prof-5',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'Арифметикалық прогрессияның бірінші мүшесі a₁ = 3, айырымы d = 4 болса, оның алғашқы 10 мүшесінің қосындысын (S₁₀) табыңыз:',
    options: ['190', '210', '230', '250'],
    correctIndex: 1,
    explanation: 'S₁₀ = (2·3 + 9·4) · 10 / 2 = (6 + 36) · 5 = 42 · 5 = 210.'
  },
  {
    id: 'ubt-math-prof-6',
    category: 'math_profile',
    categoryTitle: 'Математика (Бейінді)',
    question: 'Анықталмаған интегралды есептеңіз: ∫ (3x² + 2x) dx',
    options: ['x³ + x² + C', '6x + 2 + C', '3x³ + 2x² + C', 'x³/3 + x²/2 + C'],
    correctIndex: 0,
    explanation: '∫ 3x² dx = x³, ал ∫ 2x dx = x². Сондықтан: x³ + x² + C.'
  },

  // 5. Информатика (Бейінді)
  {
    id: 'ubt-info-1',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: 'Python кодының нәтижесі қандай болады: `print([x**2 for x in range(4)])`?',
    options: [
      '[1, 4, 9, 16]',
      '[0, 1, 4, 9]',
      '[0, 1, 2, 3]',
      '[1, 2, 4, 8]'
    ],
    correctIndex: 1,
    explanation: '`range(4)` мәндері: 0, 1, 2, 3. Олардың квадраттары: 0²=0, 1²=1, 2²=4, 3²=9. Нәтиже: `[0, 1, 4, 9]`.'
  },
  {
    id: 'ubt-info-2',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: '2-лік санау жүйесіндегі 1101₂ санын 10-дық санау жүйесіне аударыңыз:',
    options: ['11', '12', '13', '15'],
    correctIndex: 2,
    explanation: '1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 8 + 4 + 0 + 1 = 13.'
  },
  {
    id: 'ubt-info-3',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: 'Компьютердің аппараттық бөлшектері мен қолданбалы бағдарламалардың арасындағы негізгі жүйелік көпір:',
    options: ['Желілік адаптер', 'Операциялық жүйе', 'Қатты диск', 'Транслятор'],
    correctIndex: 1,
    explanation: 'Операциялық жүйе (ОЖ) — компьютердің барлық аппараттық ресурстарын басқарып, қолданушымен интерфейс құратын негізгі жүйелік бағдарлама.'
  },
  {
    id: 'ubt-info-4',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: 'Python тілінде экранға мәтін немесе мәнді шығаруға арналған кірістірілген негізгі функция:',
    options: ['input()', 'print()', 'output()', 'display()'],
    correctIndex: 1,
    explanation: 'Python тілінде стандарты шығару ағынына мәлімет шығару үшін `print()` функциясы қолданылады.'
  },
  {
    id: 'ubt-info-5',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: 'Реляциялық деректер қорында (SQL) кестеден шартқа сай мәліметтерді таңдап, сүзіп алу үшін қолданылатын негізгі пәрмен:',
    options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
    correctIndex: 2,
    explanation: '`SELECT` пәрмені деректер қорынан шартқа сай жазбаларды сүзіп, сұраныс нәтижесін алу үшін қолданылады.'
  },
  {
    id: 'ubt-info-6',
    category: 'informatics',
    categoryTitle: 'Информатика (Бейінді)',
    question: 'Ғаламтор желісінде деректерді пакеттерге бөліп тасымалдауды және желілерді өзара байланыстыруды реттейтін негізгі желілік хаттамалар стекі:',
    options: ['HTTP/HTML', 'TCP/IP', 'FTP/SMTP', 'DNS/DHCP'],
    correctIndex: 1,
    explanation: 'TCP/IP (Transmission Control Protocol / Internet Protocol) — жаһандық интернеттің іргетасы болып табылатын базалық желілік стек.'
  },

  // 6. Физика (Бейінді)
  {
    id: 'ubt-phys-1',
    category: 'physics',
    categoryTitle: 'Физика (Бейінді)',
    question: 'Массасы 2 кг дененің жылдамдығы 3 м/с-тан 5 м/с-қа дейін артты. Дене импульсінің өзгерісі қандай?',
    options: ['2 кг·м/с', '4 кг·м/с', '6 кг·м/с', '8 кг·м/с'],
    correctIndex: 1,
    explanation: 'Импульс өзгерісі Δp = m·(v₂ - v₁) = 2 · (5 - 3) = 4 кг·м/с.'
  },
  {
    id: 'ubt-phys-2',
    category: 'physics',
    categoryTitle: 'Физика (Бейінді)',
    question: 'Массасы 2 кг дене 3 м/с жылдамдықпен түзусызықты қозғалуда. Осы дененің кинетикалық энергиясы:',
    options: ['6 Дж', '9 Дж', '12 Дж', '18 Дж'],
    correctIndex: 1,
    explanation: 'Кинетикалық энергия формуласы: Ek = (m · v²) / 2 = (2 · 3²) / 2 = 9 Дж.'
  },
  {
    id: 'ubt-phys-3',
    category: 'physics',
    categoryTitle: 'Физика (Бейінді)',
    question: 'Электромагниттік толқындар шкаласында жиілігі ең жоғары және квант энергиясы ең үлкен сәулелену:',
    options: ['Инфрақызыл сәулелер', 'Рентген сәулелері', 'Гамма-сәулелер', 'Радиотолқындар'],
    correctIndex: 2,
    explanation: 'Гамма-сәулеленудің (γ) толқын ұзындығы ең қысқа, ал жиілігі мен фотон энергиясы ең жоғары болып табылады.'
  },
  {
    id: 'ubt-phys-4',
    category: 'physics',
    categoryTitle: 'Физика (Бейінді)',
    question: 'Идеал газ күйінің Менделеев-Клапейрон теңдеуінің математикалық өрнегі қандай?',
    options: [
      'P · V = (m / M) · R · T',
      'F = m · a',
      'E = m · c²',
      'P = ρ · g · h'
    ],
    correctIndex: 0,
    explanation: 'Менделеев-Клапейрон заңы бойынша: P·V = (m/M)·R·T немесе P·V = ν·R·T.'
  },
  {
    id: 'ubt-phys-5',
    category: 'physics',
    categoryTitle: 'Физика (Бейінді)',
    question: 'Тізбек бөлігіне арналған Ом заңының формуласы қандай?',
    options: ['I = U / R', 'U = I / R', 'R = I · U', 'P = I · U'],
    correctIndex: 0,
    explanation: 'Ом заңы: ток күші кернеуге тура пропорционал, ал өткізгіштің кедергісіне кері пропорционал (I = U / R).'
  },

  // 7. Химия (Бейінді)
  {
    id: 'ubt-chem-1',
    category: 'chemistry',
    categoryTitle: 'Химия (Бейінді)',
    question: 'Қай қатарда тек сілтілік металдар көрсетілген?',
    options: [
      'Cu, Ag, Au',
      'Li, Na, K',
      'Fe, Co, Ni',
      'Mg, Ca, Ba'
    ],
    correctIndex: 1,
    explanation: 'Литий (Li), Натрий (Na), Калий (K) — периодтық жүйенің IA тобындағы нағыз сілтілік металдар.'
  },
  {
    id: 'ubt-chem-2',
    category: 'chemistry',
    categoryTitle: 'Химия (Бейінді)',
    question: 'Қалыпты жағдайда 4,48 литр көмірқышқыл газының (CO₂) зат мөлшері (моль) қанша болады?',
    options: ['0,1 моль', '0,2 моль', '0,5 моль', '1,0 моль'],
    correctIndex: 1,
    explanation: 'Зат мөлшері: n = V / Vm = 4,48 л / 22,4 л/моль = 0,2 моль.'
  },
  {
    id: 'ubt-chem-3',
    category: 'chemistry',
    categoryTitle: 'Химия (Бейінді)',
    question: 'Ортофосфор қышқылының (H₃PO₄) молярлық массасын есептеңіз (Ar: H=1, P=31, O=16):',
    options: ['49 г/моль', '82 г/моль', '98 г/моль', '104 г/моль'],
    correctIndex: 2,
    explanation: 'M(H₃PO₄) = 3·1 + 31 + 4·16 = 3 + 31 + 64 = 98 г/моль.'
  },
  {
    id: 'ubt-chem-4',
    category: 'chemistry',
    categoryTitle: 'Химия (Бейінді)',
    question: 'Тұз қышқылымен де (HCl), натрий гидроксидімен де (NaOH) әрекеттесе алатын амфотерлі оксид:',
    options: ['CaO', 'ZnO', 'Na₂O', 'SO₃'],
    correctIndex: 1,
    explanation: 'Мырыш оксиді (ZnO) қышқылдармен де, сілтілермен де әрекеттесетін айқын амфотерлі қасиет көрсетеді.'
  },
  {
    id: 'ubt-chem-5',
    category: 'chemistry',
    categoryTitle: 'Химия (Бейінді)',
    question: 'Бензолдың молекулалық формуласы қандай және ол қандай көмірсутектер тобына жатады?',
    options: [
      'C₆H₁₄, алкандар',
      'C₆H₁₂, алкендер',
      'C₆H₆, ароматты көмірсутектер (арендер)',
      'C₂H₂, алкиндер'
    ],
    correctIndex: 2,
    explanation: 'Бензол формуласы C₆H₆ болып табылады және ароматты көмірсутектердің (арендер) ең қарапайым өкілі.'
  },

  // 8. Биология (Бейінді)
  {
    id: 'ubt-bio-1',
    category: 'biology',
    categoryTitle: 'Биология (Бейінді)',
    question: 'Генетиканың негізін қалаған, белгілердің тұқым қуалау заңдылықтарын ашқан ғалым кім?',
    options: ['Ч. Дарвин', 'Г. Мендель', 'Т. Морган', 'И. Павлов'],
    correctIndex: 1,
    explanation: 'Грегор Мендель — 1865 жылы бұршақ өсімдігіне жүргізген тәжірибелері арқылы тұқым қуалау заңдылықтарын ашқан генетика ғылымының атасы.'
  },
  {
    id: 'ubt-bio-2',
    category: 'biology',
    categoryTitle: 'Биология (Бейінді)',
    question: 'Жасушаның АТФ түрінде энергия өндіретін «күштік станциясы» болып табылатын қос мембраналы органоид:',
    options: ['Рибосома', 'Лизосома', 'Митохондрия', 'Гольджи жиынтығы'],
    correctIndex: 2,
    explanation: 'Митохондриялар оттектік тыныс алу процесінде ағзаны энергиямен (АТФ) қамтамасыз етеді.'
  },
  {
    id: 'ubt-bio-3',
    category: 'biology',
    categoryTitle: 'Биология (Бейінді)',
    question: 'Тұқым қуалайтын генетикалық ақпаратты сақтайтын және ұрпаққа тасымалдайтын негізгі биополимер:',
    options: ['АТФ', 'Гликоген', 'ДНҚ', 'Инсулин'],
    correctIndex: 2,
    explanation: 'ДНҚ (дезоксирибонуклеин қышқылы) жасуша ядросында орналасып, генетикалық кодты сақтайды.'
  },
  {
    id: 'ubt-bio-4',
    category: 'biology',
    categoryTitle: 'Биология (Бейінді)',
    question: 'Өсімдік жасушаларында күн сәулесінің қатысуымен органикалық заттар (глюкоза) мен оттек түзілу процесі:',
    options: ['Транспирация', 'Тыныс алу', 'Фотосинтез', 'Гликолиз'],
    correctIndex: 2,
    explanation: 'Фотосинтез барысында хлорофилл күн сәулесін сіңіріп, көмірқышқыл газы мен судан глюкоза түзеді.'
  },
  {
    id: 'ubt-bio-5',
    category: 'biology',
    categoryTitle: 'Биология (Бейінді)',
    question: 'Адамның қанайналым жүйесінде оттекке бай артериялық қан үлкен қанайналым шеңберіне жүректің қай бөлігінен айдалады?',
    options: [
      'Оң жақ жүрекше',
      'Оң жақ қарынша',
      'Сол жақ жүрекше',
      'Сол жақ қарынша'
    ],
    correctIndex: 3,
    explanation: 'Сол жақ қарыншадан аорта тамыры басталып, оттекпен қаныққан қан бүкіл денеге таралады.'
  },

  // 9. Ағылшын тілі (Бейінді)
  {
    id: 'ubt-eng-1',
    category: 'english',
    categoryTitle: 'Ағылшын тілі (Бейінді)',
    question: 'Choose the correct form: "If I _____ harder, I would have passed the exam with flying colours."',
    options: ['study', 'had studied', 'studied', 'would study'],
    correctIndex: 1,
    explanation: 'Third Conditional (өткен шақтағы орындалмаған шарт): `If + Past Perfect (had studied), would have + V3`.'
  },
  {
    id: 'ubt-eng-2',
    category: 'english',
    categoryTitle: 'Ағылшын тілі (Бейінді)',
    question: 'Choose the correct verb: "When I come home after school, I always _____ my parents."',
    options: ['call', 'called', 'calling', 'was calling'],
    correctIndex: 0,
    explanation: 'Present Simple: тұрақты, әдетке айналған әрекетті білдіреді (I always call).'
  },
  {
    id: 'ubt-eng-3',
    category: 'english',
    categoryTitle: 'Ағылшын тілі (Бейінді)',
    question: 'Find the synonym of the word "Essential":',
    options: ['Optional', 'Crucial', 'Minor', 'Casual'],
    correctIndex: 1,
    explanation: '"Essential" (өте маңызды, қажетті) сөзінің синонимі — "Crucial" немесе "Vital".'
  },
  {
    id: 'ubt-eng-4',
    category: 'english',
    categoryTitle: 'Ағылшын тілі (Бейінді)',
    question: 'Choose the correct preposition: "She has been interested _____ artificial intelligence and coding since grade 8."',
    options: ['at', 'in', 'on', 'with'],
    correctIndex: 1,
    explanation: 'Ағылшын тілінде тұрақты тіркес: "to be interested in something" (бір нәрсеге қызығушылық таныту).'
  },
  {
    id: 'ubt-eng-5',
    category: 'english',
    categoryTitle: 'Ағылшын тілі (Бейінді)',
    question: 'Choose the correct modal verb of logical deduction: "Look at the thick snow outside. It _____ be freezing cold."',
    options: ['must', 'can\'t', 'shouldn\'t', 'may not'],
    correctIndex: 0,
    explanation: 'Айқын көзбен көріп тұрған фактіге негізделген логикалық сенімділік үшін "must" модальды етістігі қолданылады.'
  }
];

// БАСТЫ БЕТТЕГІ КҮННІҢ ЭКСПРЕСС-ТЕСТ СҰРАҚТАРЫ
export const initialDailyQuizQuestions: DailyQuizItem[] = [
  {
    id: 'dq-1',
    subject: 'math_literacy',
    subjectLabelKk: 'Математикалық сауаттылық',
    question: 'Дүкенде 20% жеңілдік жасалғаннан кейінгі баға 8000 тг болса, бастапқы баға қанша?',
    options: ['9 000 тг', '10 000 тг', '11 000 тг', '12 000 тг'],
    correctAnswer: 1,
    explanation: '8000 / 0.8 = 10 000 тг. Жауап: 10 000 тг!',
    xpReward: 25
  },
  {
    id: 'dq-2',
    subject: 'kz_history',
    subjectLabelKk: 'Қазақстан тарихы',
    question: 'Түркістандағы Қожа Ахмет Яссауи кесенесін салдырған әмірші кім?',
    options: ['Әмір Темір', 'Жошы хан', 'Есім хан', 'Тәуке хан'],
    correctAnswer: 0,
    explanation: 'XIV ғасырдың соңында Әмір Темір сәулетті алып кесене тұрғызды.',
    xpReward: 25
  },
  {
    id: 'dq-3',
    subject: 'informatics',
    subjectLabelKk: 'Информатика',
    question: '2-лік жүйедегі 1101₂ санын 10-дық жүйеге аударғанда қандай сан шығады?',
    options: ['11', '12', '13', '15'],
    correctAnswer: 2,
    explanation: '1·8 + 1·4 + 0·2 + 1·1 = 13.',
    xpReward: 25
  },
  {
    id: 'dq-4',
    subject: 'biology',
    subjectLabelKk: 'Биология',
    question: 'Жасушаның негізгі энергетикалық станциясы болып табылатын органоид:',
    options: ['Рибосома', 'Лизосома', 'Митохондрия', 'Пластид'],
    correctAnswer: 2,
    explanation: 'Митохондрия ағзаны АТФ түріндегі энергиямен қамтамасыз етеді.',
    xpReward: 25
  }
];

// ТОЛЫҚ БЕЙІНДІК ПӘНДЕР КОМБИНАЦИЯЛАРЫ ЖӘНЕ ГРАНТТАР
export const initialUniversityGrants: UniversityGrant[] = [
  {
    id: 'ug-1',
    universityName: 'Назарбаев Университеті (NU)',
    city: 'Астана қ.',
    major: 'Computer Science & AI',
    passingScore2025: 125,
    subjects: 'Математика + Информатика',
    grantCount: 350,
    description: 'Халықаралық деңгейдегі зерттеу университеті, ғылыми зертханалар мен стартап хабы.'
  },
  {
    id: 'ug-2',
    universityName: 'Satbayev University',
    city: 'Алматы қ.',
    major: 'Мехатроника, Робототехника және Машина жасау',
    passingScore2025: 110,
    subjects: 'Математика + Физика',
    grantCount: 850,
    description: 'Қазақстанның жетекші инженерлік-техникалық университеті, ірі өндіріс орындарымен серіктестік.'
  },
  {
    id: 'ug-3',
    universityName: 'С. Асфендияров атындағы ҚазҰМУ',
    city: 'Алматы қ.',
    major: 'Жалпы медицина және Педиатрия',
    passingScore2025: 122,
    subjects: 'Биология + Химия',
    grantCount: 1200,
    description: 'Еліміздің бас медициналық жоғары оқу орны, заманауи клиникалық база.'
  },
  {
    id: 'ug-4',
    universityName: 'Astana IT University (AITU)',
    city: 'Астана қ.',
    major: 'Киберқауіпсіздік және Бағдарламалық қамтамасыз ету',
    passingScore2025: 118,
    subjects: 'Математика + Информатика',
    grantCount: 600,
    description: 'EXPO аймағындағы IT хабпен тығыз байланысқан мамандандырылған цифрлық университет.'
  },
  {
    id: 'ug-5',
    universityName: 'Әл-Фараби атындағы ҚазҰУ',
    city: 'Алматы қ.',
    major: 'Экономика, Қаржы және Менеджмент',
    passingScore2025: 114,
    subjects: 'География + Математика',
    grantCount: 450,
    description: 'QS рейтингі бойынша жетекші орындағы классикалық ұлттық университет.'
  },
  {
    id: 'ug-6',
    universityName: 'Абылай хан атындағы ҚазХҚжӘТУ',
    city: 'Алматы қ.',
    major: 'Халықаралық қатынастар және Аударма ісі',
    passingScore2025: 117,
    subjects: 'Ағылшын тілі + Дүниежүзі тарихы',
    grantCount: 380,
    description: 'Шет тілдері мен дипломатиялық білім беретін танымал бейіндік ЖОО.'
  },
  {
    id: 'ug-7',
    universityName: 'КАЗГЮУ (M. Narikbayev University)',
    city: 'Астана қ.',
    major: 'Юриспруденция және Құқық қорғау қызметі',
    passingScore2025: 115,
    subjects: 'Дүниежүзі тарихы + Құқық негіздері',
    grantCount: 290,
    description: 'Заң ғылымдары мен сот жүйесі саласындағы мамандарды даярлайтын көшбасшы ЖОО.'
  },
  {
    id: 'ug-8',
    universityName: 'Л. Гумилев атындағы ЕҰУ',
    city: 'Астана қ.',
    major: 'Қазақ тілі мен әдебиеті мұғалімі',
    passingScore2025: 106,
    subjects: 'Қазақ тілі/Әдебиеті + Қазақстан тарихы',
    grantCount: 500,
    description: 'Педагогикалық және гуманитарлық бағыттар бойынша мемлекеттік гранттардың үлкен саны.'
  },
  {
    id: 'ug-9',
    universityName: 'С. Демирел атындағы Университет (SDU)',
    city: 'Алматы обл.',
    major: 'Information Systems & Big Data',
    passingScore2025: 112,
    subjects: 'Математика + Информатика',
    grantCount: 400,
    description: 'Ағылшын тілінде білім беру, белсенді студенттік өмір мен стартап ортасы.'
  },
  {
    id: 'ug-10',
    universityName: 'ҚазҰАЗУ (Аграрлық университет)',
    city: 'Алматы қ.',
    major: 'Агрономия, Биотехнология және Ветеринария',
    passingScore2025: 85,
    subjects: 'Биология + География',
    grantCount: 950,
    description: 'Ауылшаруашылық саласының мамандарын даярлайтын, грант саны мол мемлекеттік бағдарлама.'
  }
];

export const initialHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Күнделікті 20 бет пайдалы кітап оқу',
    icon: '📚',
    streak: 6,
    xpReward: 20
  },
  {
    id: 'h-2',
    title: '4-7-8 тыныс алуымен кешкі тынығу',
    icon: '🧘',
    streak: 5,
    xpReward: 15
  },
  {
    id: 'h-3',
    title: '25 минут үзіліссіз терең зейін (Pomodoro)',
    icon: '⚡',
    streak: 5,
    xpReward: 25
  },
  {
    id: 'h-4',
    title: 'Су режимін сақтау (1.5-2 литр су)',
    icon: '💧',
    streak: 4,
    xpReward: 10
  }
];
