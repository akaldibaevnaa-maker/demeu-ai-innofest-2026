import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Layers, 
  CheckCircle, 
  HelpCircle, 
  RotateCw, 
  Plus, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Check, 
  X,
  BookOpen,
  Filter,
  Timer,
  Flag,
  Play,
  Award,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Flashcard, QuizQuestion, ChatMessage, UbtSubjectCategory, ExamSimulatorResult } from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';
import { geminiService } from '../../../services/geminiService';
import { audioService } from '../../../services/audioService';
import { initialQuizQuestions } from '../../../data/initialData';

interface TutorViewProps {
  profile: UserProfile;
}

export const TutorView: React.FC<TutorViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.kk;

  const [subTab, setSubTab] = useState<'quiz' | 'simulator' | 'explainer' | 'flashcards'>('quiz');

  // Explainer State
  const [explanationLevel, setExplanationLevel] = useState<'kid' | 'standard' | 'deep'>('standard');
  const [explainerTopic, setExplainerTopic] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storageService.getChatHistory('tutor');
    if (saved.length > 0) return saved;
    return [
      {
        id: 'tutor-init-1',
        sender: 'assistant',
        content: `Сәлем, қымбатты досым! Мен сенің жеке AI Репетиторың «Білім Демеуімін». 🎓\n\nМаған кез келген ҰБТ сұрағын, математика, физика, химия, биология, информатика немесе тарих есебін жібер. Мен оны саған қарапайым мысалдардан бастап, күрделі ҰБТ формулаларына дейін қадам-қадаммен түсіндіріп беремін!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: 'tutor'
      }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => storageService.getFlashcards());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newSubject, setNewSubject] = useState('Математикалық сауаттылық');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // ҰБТ Quiz Category Filter State
  const [selectedUbtCategory, setSelectedUbtCategory] = useState<UbtSubjectCategory | 'all'>('reading');
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sync questions when category changes
  useEffect(() => {
    let qList = initialQuizQuestions;
    if (selectedUbtCategory !== 'all') {
      qList = initialQuizQuestions.filter(q => q.category === selectedUbtCategory);
    }
    setFilteredQuestions(qList);
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  }, [selectedUbtCategory]);

  // ================= ҰБТ Сынақ Симуляторы (Exam Simulator) State =================
  const [simActive, setSimActive] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);
  const [simSubject, setSimSubject] = useState<string>('all');
  const [simQuestions, setSimQuestions] = useState<QuizQuestion[]>([]);
  const [simCurrentIdx, setSimCurrentIdx] = useState(0);
  const [simAnswers, setSimAnswers] = useState<Record<number, number>>({});
  const [simFlagged, setSimFlagged] = useState<Record<number, boolean>>({});
  const [simTimeLeft, setSimTimeLeft] = useState(900); // 15 mins default
  const [simResultsHistory, setSimResultsHistory] = useState<ExamSimulatorResult[]>(() => storageService.getExamResults());

  // Timer effect for exam simulator
  useEffect(() => {
    if (!simActive || simCompleted) return;
    const interval = setInterval(() => {
      setSimTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [simActive, simCompleted, simQuestions, simAnswers]);

  const handleStartSimulation = (subject: string, durationMinutes: number) => {
    let q = initialQuizQuestions;
    if (subject !== 'all') {
      q = initialQuizQuestions.filter(item => item.category === subject);
    }
    const shuffled = [...q].sort(() => Math.random() - 0.5);
    setSimQuestions(shuffled);
    setSimSubject(subject);
    setSimCurrentIdx(0);
    setSimAnswers({});
    setSimFlagged({});
    setSimTimeLeft(durationMinutes * 60);
    setSimCompleted(false);
    setSimActive(true);
    audioService.playClick();
  };

  const handleToggleFlag = (idx: number) => {
    setSimFlagged(prev => ({ ...prev, [idx]: !prev[idx] }));
    audioService.playClick();
  };

  const handleSelectSimAnswer = (optionIdx: number) => {
    setSimAnswers(prev => ({ ...prev, [simCurrentIdx]: optionIdx }));
    audioService.playClick();
  };

  const handleFinishSimulation = () => {
    setSimActive(false);
    setSimCompleted(true);
    
    let calculatedScore = 0;
    simQuestions.forEach((q, idx) => {
      if (simAnswers[idx] === q.correctIndex) {
        calculatedScore++;
      }
    });

    const percentage = Math.round((calculatedScore / (simQuestions.length || 1)) * 100);
    const result: ExamSimulatorResult = {
      score: calculatedScore,
      totalQuestions: simQuestions.length,
      percentage,
      timeSpentSeconds: 900 - simTimeLeft,
      subject: simSubject,
      date: new Date().toLocaleDateString()
    };

    const updated = storageService.saveExamResult(result);
    setSimResultsHistory(updated);

    if (percentage >= 70) {
      audioService.playChime();
      try {
        confetti({ particleCount: 70, spread: 70 });
      } catch {}
    }
  };

  useEffect(() => {
    storageService.saveChatHistory('tutor', messages);
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || explainerTopic;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'tmsg-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      module: 'tutor'
    };

    setMessages(prev => [...prev, userMsg]);
    setExplainerTopic('');
    setIsTyping(true);

    try {
      const response = await geminiService.generateResponse({
        module: 'tutor',
        prompt: `Түсіндіру деңгейі: ${explanationLevel}. Сұрақ: ${text}`,
        language: profile.language,
        apiKey: profile.geminiApiKey,
        explanationLevel
      });

      const botMsg: ChatMessage = {
        id: 'tmsg-bot-' + Date.now(),
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: 'tutor'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      audioService.stopSpeech();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    audioService.startListening(
      profile.language,
      (text) => {
        setExplainerTopic(prev => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleToggleMastered = (id: string) => {
    const updated = storageService.toggleFlashcardMastered(id);
    setFlashcards(updated);
  };

  const handleAddFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const added = storageService.addFlashcard({
      subject: newSubject,
      question: newQuestion,
      answer: newAnswer
    });

    setFlashcards(prev => [...prev, added]);
    setShowAddCardModal(false);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const currentQuiz = filteredQuestions[quizIndex] || filteredQuestions[0];

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQuiz) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQuiz.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      storageService.addXp(20);
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {}
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < filteredQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const currentCard = flashcards[currentCardIndex] || flashcards[0];

  return (
    <div className="space-y-6">
      
      {/* Sub Nav Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-panel rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        <button
          onClick={() => setSubTab('quiz')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'quiz'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>ҰБТ Пәндік Тренажеры</span>
        </button>

        <button
          onClick={() => setSubTab('simulator')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'simulator'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>ҰБТ Сынақ Симуляторы</span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-400 text-amber-950 font-bold uppercase">Жаңа</span>
        </button>

        <button
          onClick={() => setSubTab('explainer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'explainer'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>AI Қадамдық Түсіндіруші</span>
        </button>

        <button
          onClick={() => setSubTab('flashcards')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'flashcards'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ақылды Флешкарталар ({flashcards.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: ҰБТ EXAM PREP BY SUBJECTS ================= */}
      {subTab === 'quiz' && (
        <div className="space-y-6">
          
          {/* UBT Subject Category Tabs */}
          <div className="p-5 glass-panel rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                  ҰБТ Дайындық Бөлімі
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                  Пәнді таңдап, тест тапсыруды бастаңыз:
                </h3>
              </div>
              <span className="text-xs text-blue-700 font-bold bg-white px-3 py-1.5 rounded-xl border border-blue-200">
                Сұрақтар: {filteredQuestions.length}
              </span>
            </div>

            {/* Subject Selector Buttons */}
            <div className="space-y-2 pt-1">
              {/* Mandatory Subjects */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Міндетті пәндер:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'reading' as const, label: '📖 Оқу сауаттылығы' },
                    { id: 'math_literacy' as const, label: '📐 Математикалық сауаттылық' },
                    { id: 'kz_history' as const, label: '📜 Қазақстан тарихы' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedUbtCategory(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedUbtCategory === item.id
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Subjects */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Бейінді пәндер:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'math_profile' as const, label: '📐 Математика' },
                    { id: 'informatics' as const, label: '💻 Информатика' },
                    { id: 'physics' as const, label: '⚡ Физика' },
                    { id: 'chemistry' as const, label: '🧪 Химия' },
                    { id: 'biology' as const, label: '🧬 Биология' },
                    { id: 'english' as const, label: '🇬🇧 Ағылшын тілі' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedUbtCategory(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedUbtCategory === item.id
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-2xl mx-auto space-y-6">
            {!quizCompleted && currentQuiz ? (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    {currentQuiz.categoryTitle}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Сұрақ {quizIndex + 1} / {filteredQuestions.length}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 leading-relaxed">
                  {currentQuiz.question}
                </h3>

                <div className="space-y-2.5">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;

                    let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                      } else {
                        btnStyle = 'bg-slate-50/50 border-slate-100 text-slate-400';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold text-blue-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Түсіндірме:
                    </span>
                    <p className="leading-relaxed">
                      {currentQuiz.explanation}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition shadow-sm"
                    >
                      Жауапты тексеру
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
                    >
                      {quizIndex < filteredQuestions.length - 1 ? 'Келесі сұрақ →' : 'Нәтижені көру'}
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center space-y-5 py-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 mx-auto flex items-center justify-center text-3xl">
                  🏆
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Пәндік сынақ аяқталды!
                </h3>

                <div className="text-center">
                  <span className="text-4xl font-heading font-black text-emerald-600">
                    {score} / {filteredQuestions.length}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Дұрыс жауап саны</p>
                </div>

                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setScore(0);
                    setQuizCompleted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
                >
                  Қайта тапсыру
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB: ҰБТ СЫНАҚ СИМУЛЯТОРЫ (EXAM SIMULATOR) ================= */}
      {subTab === 'simulator' && (
        <div className="space-y-6">

          {/* 1. CONFIG & START SCREEN */}
          {!simActive && !simCompleted && (
            <div className="space-y-6 animate-slide-up">
              
              <div className="p-6 glass-panel rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/60 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Ресми ҰБТ Сынақ Режимі</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  ҰБТ Онлайн Емтихан Симуляторы
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Шынайы ҰБТ емтиханының форматында уақытпен жарысып, өз біліміңізді тексеріңіз. Сұрақтар арасында еркін өтіп, күмәнді сұрақтарды жалаушамен белгілеп, соңында әрбір қатеге қадамдап AI түсіндірмесін алыңыз.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block">⏱️ Уақытты бақылау:</span>
                    <span className="text-slate-500">Шынайы кері санайтын таймер</span>
                  </div>
                  <div className="p-3 bg-white/80 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block">🎯 Сұрақтар навигаторы:</span>
                    <span className="text-slate-500">1-ден N-ге дейін еркін өту</span>
                  </div>
                  <div className="p-3 bg-white/80 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block">🏆 Socratic AI сараптамасы:</span>
                    <span className="text-slate-500">Қателерді қадамдап талдау</span>
                  </div>
                </div>
              </div>

              {/* Exam Options Card */}
              <div className="p-6 glass-panel rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span>Емтихан параметрлерін таңдаңыз:</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Пәнді таңдаңыз:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs font-semibold">
                      {[
                        { id: 'all', title: 'Барлық 9 пәннен' },
                        { id: 'reading', title: 'Оқу сауаттылығы' },
                        { id: 'math_literacy', title: 'Мат. сауаттылық' },
                        { id: 'kz_history', title: 'Қазақстан тарихы' },
                        { id: 'math_profile', title: 'Математика (Бейінді)' },
                        { id: 'informatics', title: 'Информатика' },
                        { id: 'physics', title: 'Физика' },
                        { id: 'chemistry', title: 'Химия' },
                        { id: 'biology', title: 'Биология' },
                        { id: 'english', title: 'Ағылшын тілі' }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSimSubject(sub.id)}
                          className={`p-2.5 rounded-xl border text-center transition ${
                            simSubject === sub.id
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Сынақ ұзақтығы:
                    </label>
                    <div className="flex gap-2">
                      {[10, 15, 25].map(min => (
                        <button
                          key={min}
                          type="button"
                          onClick={() => setSimTimeLeft(min * 60)}
                          className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                            simTimeLeft === min * 60
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {min} минут
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Дайын болсаңыз, бастау батырмасын басыңыз:
                    </span>
                    <button
                      onClick={() => handleStartSimulation(simSubject, Math.floor(simTimeLeft / 60) || 15)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 card-hover-effect"
                    >
                      <Play className="w-4 h-4" />
                      <span>Емтиханды бастау</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Past Exam History */}
              {simResultsHistory.length > 0 && (
                <div className="p-5 glass-panel rounded-2xl border border-slate-200 bg-white space-y-3">
                  <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Алдыңғы сынақ нәтижелері ({simResultsHistory.length}):</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {simResultsHistory.slice(0, 6).map((res, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{res.percentage}% нәтиже</p>
                          <p className="text-[10px] text-slate-400">{res.date} • {res.score}/{res.totalQuestions} дұрыс</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.percentage >= 70 ? 'Грант' : 'Жаттығу'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 2. ACTIVE TESTING SCREEN */}
          {simActive && !simCompleted && (
            <div className="space-y-4 animate-slide-up">
              
              {/* Exam Header Bar */}
              <div className="p-4 glass-panel rounded-2xl border border-blue-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold ${
                    simTimeLeft < 120 
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{Math.floor(simTimeLeft / 60)}:{String(simTimeLeft % 60).padStart(2, '0')}</span>
                  </div>

                  <span className="text-xs text-slate-600 font-semibold">
                    Сұрақ: <strong className="text-slate-900">{simCurrentIdx + 1}</strong> / {simQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFlag(simCurrentIdx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                      simFlagged[simCurrentIdx]
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${simFlagged[simCurrentIdx] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{simFlagged[simCurrentIdx] ? 'Белгіленген' : 'Белгілеу'}</span>
                  </button>

                  <button
                    onClick={handleFinishSimulation}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Емтиханды аяқтау</span>
                  </button>
                </div>
              </div>

              {/* Question Navigation Palette Grid */}
              <div className="p-3.5 glass-panel rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Сұрақтар картасы:</span>
                  <span className="text-slate-700 font-bold">
                    {Object.keys(simAnswers).length} / {simQuestions.length} жауап берілді
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {simQuestions.map((_, idx) => {
                    const isCurrent = idx === simCurrentIdx;
                    const isAnswered = simAnswers[idx] !== undefined;
                    const isFlag = simFlagged[idx];

                    let style = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (isCurrent) {
                      style = 'bg-blue-600 text-white border-blue-600 font-bold scale-105 shadow-xs';
                    } else if (isFlag) {
                      style = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                    } else if (isAnswered) {
                      style = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setSimCurrentIdx(idx)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs border transition flex items-center justify-center font-mono ${style}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Box */}
              {simQuestions[simCurrentIdx] && (
                <div className="p-6 glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm space-y-5">
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {simQuestions[simCurrentIdx].categoryTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{simCurrentIdx + 1} сұрақ
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    {simQuestions[simCurrentIdx].question}
                  </p>

                  <div className="space-y-2.5">
                    {simQuestions[simCurrentIdx].options.map((opt, optIdx) => {
                      const isChosen = simAnswers[simCurrentIdx] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectSimAnswer(optIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${
                            isChosen
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${
                              isChosen ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isChosen && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSimCurrentIdx(prev => Math.max(0, prev - 1))}
                      disabled={simCurrentIdx === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Алдыңғы сұрақ
                    </button>

                    {simCurrentIdx < simQuestions.length - 1 ? (
                      <button
                        onClick={() => setSimCurrentIdx(prev => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <span>Келесі сұрақ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishSimulation}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Тестті аяқтау</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* 3. EXAM RESULTS & DEEP REVIEW SCREEN */}
          {simCompleted && (
            <div className="space-y-6 animate-slide-up">
              
              {/* Summary Score Card */}
              <div className="p-6 sm:p-8 glass-panel rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/60 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center text-3xl shadow-sm">
                  🏆
                </div>

                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Сынақ Нәтижесі
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-1">
                    {simResultsHistory[0]?.score || 0} / {simQuestions.length} дұрыс ({simResultsHistory[0]?.percentage || 0}%)
                  </h2>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${simResultsHistory[0]?.percentage || 0}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {(simResultsHistory[0]?.percentage || 0) >= 80 ? (
                    <span className="text-emerald-700">🎉 Керемет көрсеткіш! Мемлекеттік грантқа түсу мүмкіндігіңіз өте жоғары!</span>
                  ) : (simResultsHistory[0]?.percentage || 0) >= 60 ? (
                    <span className="text-blue-700">🌟 Жақсы деңгей! Әлі де аздап бекіту мен қайталау қажет.</span>
                  ) : (
                    <span className="text-amber-700">💡 Қателерді Socratic AI репетитормен талдап, білімді күшейтейік!</span>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSimActive(false);
                      setSimCompleted(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Жаңа емтихан тапсыру</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubTab('explainer');
                      const mistakes = simQuestions
                        .filter((q, i) => simAnswers[i] !== q.correctIndex)
                        .map(q => q.question)
                        .slice(0, 3)
                        .join('; ');
                      if (mistakes) {
                        setExplainerTopic(`ҰБТ-дағы мына қате жіберген сұрақтарымды қадамдап түсіндірші: ${mistakes}`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Қателерді Socratic AI-мен талдау</span>
                  </button>
                </div>
              </div>

              {/* Comprehensive Question-by-Question Review */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Әрбір сұрақтың толық талдауы:
                </h3>

                <div className="space-y-3">
                  {simQuestions.map((q, idx) => {
                    const chosen = simAnswers[idx];
                    const isCorrect = chosen === q.correctIndex;

                    return (
                      <div 
                        key={idx}
                        className={`p-5 rounded-2xl border transition space-y-3 ${
                          isCorrect 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="px-2.5 py-0.5 rounded-md bg-white border text-slate-700">
                            #{idx + 1} {q.categoryTitle}
                          </span>
                          <span className={`font-bold flex items-center gap-1 ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            <span>{isCorrect ? 'Дұрыс' : 'Қате'}</span>
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-800">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            const isActual = q.correctIndex === optIdx;

                            let optStyle = 'bg-white/80 border-slate-200 text-slate-600';
                            if (isActual) {
                              optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                            } else if (isSelected && !isActual) {
                              optStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                            }

                            return (
                              <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${optStyle}`}>
                                <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                                {isActual && <span className="text-[10px] text-emerald-800 font-bold">Дұрыс жауап</span>}
                                {isSelected && !isActual && <span className="text-[10px] text-rose-800 font-bold">Сіздің таңдауыңыз</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-800 block mb-0.5">Түсіндірме:</strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: SOCRATIC EXPLAINER ================= */}
      {subTab === 'explainer' && (
        <div className="space-y-4">
          <div className="p-4 glass-panel rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Түсіндіру тереңдігі:
              </h3>
              <p className="text-xs text-slate-500">
                AI сіз таңдаған деңгейге сай формула мен логиканы ашады.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setExplanationLevel('kid')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  explanationLevel === 'kid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎈 Қарапайым (Базалық)
              </button>
              <button
                onClick={() => setExplanationLevel('standard')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  explanationLevel === 'standard' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💡 Өмірлік мысалдармен
              </button>
              <button
                onClick={() => setExplanationLevel('deep')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  explanationLevel === 'deep' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎓 Тереңдетілген ҰБТ
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[580px] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-500 shrink-0 font-medium">Дайын сұрақтар:</span>
              <button
                onClick={() => handleSendMessage('Квадрат теңдеулерді Виет теоремасымен қалай жылдам шығаруға болады?')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition"
              >
                📐 Математика: Виет теоремасы
              </button>
              <button
                onClick={() => handleSendMessage('Ньютонның үшінші заңын өмірдегі мысалдармен қадамдап түсіндір')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition"
              >
                ⚡ Физика: Ньютон заңдары
              </button>
              <button
                onClick={() => handleSendMessage('Қазақ хандығының құрылуының 3 басты себебін ашып бер')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition"
              >
                📜 Тарих: Қазақ хандығы
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20">
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold shadow-xs ${
                        isUser ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isUser ? profile.avatarSeed : '🎓'}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => audioService.speak(msg.content, profile.language)}
                            className="hover:text-blue-600 transition flex items-center gap-1 text-slate-500"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Дауыстау</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-sm">
                    🎓
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500 ml-1">Репетитор талдап жатыр...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition ${
                    isListening ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Дауыспен сұрау"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={explainerTopic}
                  onChange={e => setExplainerTopic(e.target.value)}
                  placeholder="Тақырып немесе есепті енгізіңіз..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!explainerTopic.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SMART FLASHCARDS ================= */}
      {subTab === 'flashcards' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                Ақылды Флешкарталар (Active Recall)
              </h3>
              <p className="text-xs text-slate-500">
                Карточканы басып, жауапты ашыңыз.
              </p>
            </div>

            <button
              onClick={() => setShowAddCardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Карточка қосу</span>
            </button>
          </div>

          {currentCard && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[280px] p-8 rounded-3xl glass-panel border-2 border-slate-200 bg-white hover:border-blue-400 transition-all duration-300 flex flex-col justify-between text-center relative group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {currentCard.subject}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentCardIndex + 1} / {flashcards.length}
                </span>
              </div>

              <div className="my-auto py-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  {isFlipped ? '💡 Жауабы:' : '❓ Сұрақ:'}
                </p>
                <h4 className="text-lg sm:text-xl font-heading font-bold text-slate-900 leading-relaxed">
                  {isFlipped ? currentCard.answer : currentCard.question}
                </h4>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Аударып көру үшін басыңыз</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
            >
              ← Алдыңғы
            </button>

            {currentCard && (
              <button
                onClick={() => handleToggleMastered(currentCard.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentCard.mastered
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{currentCard.mastered ? 'Меңгерілді (+10 XP)' : 'Жатталды деп белгілеу'}</span>
              </button>
            )}

            <button
              onClick={handleNextCard}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
            >
              Келесі →
            </button>
          </div>

          {showAddCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
                >
                  ✕
                </button>

                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">
                  Жаңа флешкарта қосу
                </h3>

                <form onSubmit={handleAddFlashcard} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Пән:
                    </label>
                    <select
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    >
                      <option value="Оқу сауаттылығы">Оқу сауаттылығы</option>
                      <option value="Математикалық сауаттылық">Математикалық сауаттылық</option>
                      <option value="Қазақстан тарихы">Қазақстан тарихы</option>
                      <option value="Математика">Математика (Бейінді)</option>
                      <option value="Информатика">Информатика</option>
                      <option value="Физика">Физика</option>
                      <option value="Химия">Химия</option>
                      <option value="Биология">Биология</option>
                      <option value="Ағылшын тілі">Ағылшын тілі</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Сұрақ:
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      placeholder="Мысалы: Теорема немесе ереже..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Жауабы:
                    </label>
                    <textarea
                      rows={3}
                      value={newAnswer}
                      onChange={e => setNewAnswer(e.target.value)}
                      placeholder="Дұрыс жауапты жазыңыз..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCardModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                    >
                      Бас тарту
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Қосу (+15 XP)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
