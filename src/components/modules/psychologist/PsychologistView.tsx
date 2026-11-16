import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Smile, 
  Wind, 
  RefreshCw, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  AlertTriangle,
  Lock,
  Trash2,
  ShieldAlert,
  Flame,
  Copy
} from 'lucide-react';
import { UserProfile, MoodEntry, MoodRating, ChatMessage, CbtThoughtRecord, BullyingAnalysisResult } from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';
import { geminiService } from '../../../services/geminiService';
import { audioService } from '../../../services/audioService';

interface PsychologistViewProps {
  profile: UserProfile;
  initialSubTab?: string;
}

export const PsychologistView: React.FC<PsychologistViewProps> = ({ profile, initialSubTab }) => {
  const t = translations[profile.language] || translations.kk;
  
  const [subTab, setSubTab] = useState<'chat' | 'mood' | 'breathing' | 'cbt' | 'bullying' | 'screening'>(
    (initialSubTab as any) || 'chat'
  );

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storageService.getChatHistory('psychologist');
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        content: `Сәлем, қымбатты досым! 🌿 Мен сенің AI Психологың «Жан Демеуімін».\n\n🔒 **100% Анонимділік кепілдігі:** Біздің әңгімемізде сенің аты-жөнің сұралмайды. Мұнда сені ешкім сынамайды және бағаламайды. Мектептегі, үйдегі, достарыңмен қарым-қатынастағы немесе өзіңді мазалаған кез келген уайымды ашық айта аласың. Бүгін өзіңді қалай сезініп тұрсың?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: 'psychologist'
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Mood Tracker State
  const [moods, setMoods] = useState<MoodEntry[]>(() => storageService.getMoods());
  const [selectedRating, setSelectedRating] = useState<MoodRating>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [moodNote, setMoodNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Breathing Techniques: '478' | 'box' | '711'
  const [breathingMode, setBreathingMode] = useState<'478' | 'box' | '711'>('478');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // CBT State
  const [cbtRecords, setCbtRecords] = useState<CbtThoughtRecord[]>(() => storageService.getCbtRecords());
  const [cbtSituation, setCbtSituation] = useState('');
  const [cbtNegativeThought, setCbtNegativeThought] = useState('');
  const [cbtDistortion, setCbtDistortion] = useState('Катастрофизация (Ең жаман нәрсені күту)');
  const [cbtRational, setCbtRational] = useState('');
  const [cbtMoodScore, setCbtMoodScore] = useState<MoodRating>(4);
  const [cbtSaved, setCbtSaved] = useState(false);

  // Bullying / Toxic Message Analyzer State
  const [toxicMessageInput, setToxicMessageInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<BullyingAnalysisResult | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null);

  // Screening State
  const [screeningStep, setScreeningStep] = useState(0);
  const [screeningAnswers, setScreeningAnswers] = useState<number[]>([]);
  const [screeningFinished, setScreeningFinished] = useState(false);

  const emotionTags = [
    'Қуаныш ✨', 'Шабыт 🚀', 'Сабырлылық 🌿', 'Сенімділік 🦁',
    'Шаршау 🥱', 'Мазасыздық 🌪️', 'Жалғыздық 🌧️', 'Уайым 💭', 'Ыза ⚡'
  ];

  // Save chat to storage
  useEffect(() => {
    storageService.saveChatHistory('psychologist', messages);
  }, [messages]);

  // Breathing Engine
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          if (breathingMode === '478') {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 8;
            } else {
              setBreathingPhase('inhale');
              return 4;
            }
          } else if (breathingMode === 'box') {
            // Box 4-4-4-4
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 4;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 4;
            } else if (breathingPhase === 'exhale') {
              setBreathingPhase('hold2');
              return 4;
            } else {
              setBreathingPhase('inhale');
              return 4;
            }
          } else {
            // 7-11 Anti Panic
            if (breathingPhase === 'inhale') {
              setBreathingPhase('exhale');
              return 11;
            } else {
              setBreathingPhase('inhale');
              return 7;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase, breathingMode]);

  // Handle Send Chat
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      module: 'psychologist'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await geminiService.generateResponse({
        module: 'psychologist',
        prompt: text,
        language: profile.language,
        apiKey: profile.geminiApiKey
      });

      const botMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: 'psychologist',
        isCrisis: response.isCrisis
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.isCrisis) {
        audioService.playChime();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle Voice
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
        setInputMessage((prev) => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  // Toggle TTS
  const toggleSpeech = (id: string, text: string) => {
    if (isSpeakingId === id) {
      audioService.stopSpeech();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(id);
      audioService.speak(text, profile.language, () => {
        setIsSpeakingId(null);
      });
    }
  };

  // Save Mood
  const handleSaveMood = () => {
    let insight = '';
    if (selectedRating <= 2) {
      insight = 'Қиын күндер бәрінде болады. Өзіңе мейірімді бол және 4-7-8 тыныс жаттығуын жасап көр.';
    } else if (selectedRating === 3) {
      insight = 'Қалыпты күн — тұрақтылықтың белгісі. Сүйікті ісіңе немесе серуенге уақыт бөл!';
    } else {
      insight = 'Керемет көңіл-күй! Жағымды қуатыңды пайдалы мақсаттарға бағыттай бер!';
    }

    const newMood = storageService.addMood({
      timestamp: new Date().toISOString(),
      rating: selectedRating,
      emotions: selectedEmotions,
      note: moodNote,
      aiInsight: insight
    });

    setMoods((prev) => [newMood, ...prev]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    setMoodNote('');
    setSelectedEmotions([]);
  };

  // Save CBT
  const handleSaveCbt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbtSituation || !cbtNegativeThought || !cbtRational) return;

    const saved = storageService.addCbtRecord({
      situation: cbtSituation,
      negativeThought: cbtNegativeThought,
      cognitiveDistortion: cbtDistortion,
      rationalThought: cbtRational,
      outcomeMood: cbtMoodScore
    });

    setCbtRecords((prev) => [saved, ...prev]);
    setCbtSaved(true);
    setTimeout(() => setCbtSaved(false), 2500);
    setCbtSituation('');
    setCbtNegativeThought('');
    setCbtRational('');
  };

  // Bullying analysis
  const handleAnalyzeBullying = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toxicMessageInput.trim()) return;

    const res = geminiService.analyzeBullyingMessage(toxicMessageInput);
    setAnalysisResult(res);
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(text);
    setTimeout(() => setCopiedResponse(null), 2000);
  };

  // Clear chat
  const handleClearChatHistory = () => {
    if (window.confirm('Психологпен сұхбат тарихын толықтай өшіріп, жаңа анонимді сессия бастағыңыз келе ме?')) {
      storageService.clearAnonymousSession();
      setMessages([
        {
          id: 'msg-fresh',
          sender: 'assistant',
          content: 'Сұхбат тарихы толық тазартылды. Сен мүлдем жаңа, құпия сессиядасың. Қалай көмектесе аламын?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          module: 'psychologist'
        }
      ]);
    }
  };

  // Screening Questions
  const screeningQuestions = [
    'Соңғы 2 аптада сабаққа немесе сүйікті істеріңе қызығушылығың азайды ма?',
    'Өзіңді шаршаңқы, энергиясыз немесе көңілсіз сезінген кездер жиі болды ма?',
    'Ұйқыңның бұзылуы (ұйықтай алмау немесе тым көп ұйықтау) байқалды ма?',
    'Өзіңе көңілің толмай, «қолымнан ештеңе келмейді» деген ойлар болды ма?',
    'Сабаққа зейін қою немесе кітап оқу кезінде үнемі алаңдаушылық сезіндің бе?'
  ];

  const handleScreeningAnswer = (score: number) => {
    const updated = [...screeningAnswers, score];
    setScreeningAnswers(updated);
    if (screeningStep < screeningQuestions.length - 1) {
      setScreeningStep(screeningStep + 1);
    } else {
      setScreeningFinished(true);
      const totalScore = updated.reduce((a, b) => a + b, 0);
      let severity: 'minimal' | 'mild' | 'moderate' | 'severe' = 'minimal';
      let rec = '';

      if (totalScore <= 4) {
        severity = 'minimal';
        rec = 'Сенің эмоционалды жағдайың жақсы! Өзіңе сенімді болып, сүйікті істеріңді жалғастыра бер.';
      } else if (totalScore <= 8) {
        severity = 'mild';
        rec = 'Жеңіл шаршау белгілері бар. Күн режимін дұрыстап, гаджетсіз тынығуға уақыт бөл.';
      } else if (totalScore <= 11) {
        severity = 'moderate';
        rec = 'Орташа деңгейдегі мазасыздық. Сенімді адаммен сырласу, тыныс алу жаттығуларын жасау пайдалы.';
      } else {
        severity = 'severe';
        rec = 'Жоғары эмоционалды күйзеліс. Жалғыз қалма, 111 немесе 150 сенім желісінен кәсіби кеңес алуға болады.';
      }

      storageService.addScreeningResult({
        testType: 'PHQ-9',
        score: totalScore,
        severity,
        recommendation: rec
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-panel rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        <button
          onClick={() => setSubTab('chat')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Анонимді AI Сұхбат</span>
        </button>

        <button
          onClick={() => setSubTab('bullying')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'bullying'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Кибербуллингке Қарсы</span>
        </button>

        <button
          onClick={() => setSubTab('breathing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'breathing'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Тыныс Алу Практикасы</span>
        </button>

        <button
          onClick={() => setSubTab('mood')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'mood'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Көңіл-күй Күнделігі</span>
        </button>

        <button
          onClick={() => setSubTab('cbt')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'cbt'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>CBT Ойды Қайта Құру</span>
        </button>

        <button
          onClick={() => setSubTab('screening')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'screening'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Скрининг Тесті</span>
        </button>
      </div>

      {/* ================= TAB 1: ANONYMOUS CHAT ================= */}
      {subTab === 'chat' && (
        <div className="glass-panel rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 text-lg shadow-sm">
                🧠
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Жан Демеуі — Анонимді AI Психолог</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>100% Анонимді режим • Аты-жөніңіз сұралмайды</span>
                </p>
              </div>
            </div>

            {/* Clear session button */}
            <button
              onClick={handleClearChatHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition"
              title="Сұхбат тарихын тазарту"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Тарихты өшіру</span>
            </button>
          </div>

          {/* Quick topic pills */}
          <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 shrink-0 font-medium">Көмекші тақырыптар:</span>
            <button
              onClick={() => handleSendMessage('ҰБТ және емтихандар жақындаған сайын қатты қобалжып жүрмін, не істей аламын?')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition shadow-2xs"
            >
              📝 ҰБТ емтиханынан қорқамын
            </button>
            <button
              onClick={() => handleSendMessage('Сыныпта өзімді жалғыз сезінемін, ешкім мені түсінбейтін сияқты.')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition shadow-2xs"
            >
              🌧️ Өзімді жалғыз сезінемін
            </button>
            <button
              onClick={() => handleSendMessage('Сабаққа зауқым жоқ, шаршап кеттім. Күйіп кетуді (burnout) қалай жеңемін?')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition shadow-2xs"
            >
              🔋 Сабақтан қатты шаршадым
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSpeaking = isSpeakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : msg.isCrisis
                        ? 'bg-rose-600 text-white'
                        : 'bg-violet-100 text-violet-800 border border-violet-200'
                    }`}
                  >
                    {isUser ? profile.avatarSeed : '🧠'}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs relative ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : msg.isCrisis
                        ? 'bg-rose-50 border-2 border-rose-400 text-rose-950 rounded-tl-none'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => toggleSpeech(msg.id, msg.content)}
                          className="opacity-75 hover:opacity-100 p-1 rounded hover:bg-slate-100 transition flex items-center gap-1 text-slate-600"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                              <span className="text-rose-500">Тоқтату</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Тыңдау</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-800 border border-violet-200 flex items-center justify-center text-sm">
                  🧠
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 ml-1">Жан Демеуі жауап жазып жатыр...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Дауыспен айту"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ішкі сырыңды немесе сұрағыңды жаз (анонимді)..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ================= TAB 2: BULLYING & TOXICITY ANALYZER ================= */}
      {subTab === 'bullying' && (
        <div className="space-y-6">
          
          <div className="p-6 glass-panel rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50/60 to-white shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="font-heading font-extrabold text-lg text-slate-900">
                Кибербуллинг және Токсикалық Хабарлама Анализаторы
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Егер әлеуметтік желіде немесе мектеп чатында біреу саған жағымсыз, қорлайтын немесе қоқан-лоқы сөздер жазса — оны осында көшіріп сал. AI қауіп деңгейін талдап, абыройыңды қорғайтын сабырлы жауап нұсқалары мен мектеп әкімшілігіне арналған ресми арыз үлгісін дайындайды.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Input Form */}
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              <form onSubmit={handleAnalyzeBullying} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Саған келген жағымсыз хабарламаны енгіз:
                </label>
                <textarea
                  rows={4}
                  value={toxicMessageInput}
                  onChange={(e) => setToxicMessageInput(e.target.value)}
                  placeholder="Мысалы: «Сен ештеңе білмейсің, ертең көресің...» немесе сынып чатындағы жағымсыз пікір..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
                  required
                />

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Қауіпсіздікті талдау</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setToxicMessageInput('Сен неге сонша қорқақсың? Бізбен сөйлеспе, бәрібір ешкімге керек емессің');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                  >
                    Мысал
                  </button>
                </div>
              </form>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">💡 Психолог кеңесі:</p>
                <p>Агрессорлардың басты мақсаты — сені ашуландыру немесе қорқыту. Оларға эмоциямен жауап бермеу — жеңістің 90%-ы.</p>
              </div>
            </div>

            {/* Right Result */}
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              {analysisResult ? (
                <div className="space-y-4 text-xs animate-fade-in">
                  
                  {/* Score */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700">Токсикалық деңгейі:</span>
                    <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                      analysisResult.threatLevel === 'high'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : analysisResult.threatLevel === 'medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>
                      {analysisResult.toxicityScore}% ({analysisResult.threatLevel === 'high' ? 'Жоғары қауіп' : analysisResult.threatLevel === 'medium' ? 'Орташа' : 'Төмен'})
                    </span>
                  </div>

                  {/* Impact */}
                  <p className="text-slate-600 leading-relaxed italic">
                    "{analysisResult.emotionalImpact}"
                  </p>

                  {/* 3 Safe Responses */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block">
                      Ұсынылатын 3 қауіпсіз жауап нұсқасы:
                    </span>
                    {analysisResult.suggestedResponses.map((resp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-900 flex items-center justify-between gap-2"
                      >
                        <span>{resp}</span>
                        <button
                          onClick={() => handleCopy(resp)}
                          className="p-1 text-indigo-600 hover:text-indigo-800 shrink-0"
                          title="Көшіріп алу"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Formal complaint template */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Ресми хабарлау үлгісі (Мектепке/Психологқа):</span>
                      <button
                        onClick={() => handleCopy(analysisResult.formalReportTemplate)}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Көшіру</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-700 whitespace-pre-wrap font-sans">
                      {analysisResult.formalReportTemplate}
                    </pre>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm">Талдау нәтижесі осында шығады.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 3: 3 BREATHING TECHNIQUES ================= */}
      {subTab === 'breathing' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          
          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
              Ғылыми Тыныс Алу Практикасы
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Парасимпатикалық жүйені реттеп, стресс пен үрейді лезде төмендетіңіз.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center justify-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold max-w-md mx-auto">
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingMode('478');
                setBreathingPhase('inhale');
                setBreathingTimer(4);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                breathingMode === '478' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌿 4-7-8 Тынышталу
            </button>
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingMode('box');
                setBreathingPhase('inhale');
                setBreathingTimer(4);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                breathingMode === 'box' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏹️ 4-4-4-4 Box
            </button>
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingMode('711');
                setBreathingPhase('inhale');
                setBreathingTimer(7);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                breathingMode === '711' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ 7-11 Анти-паника
            </button>
          </div>

          {/* Interactive Breathing Visual Circle */}
          <div className="relative py-8 flex items-center justify-center">
            <div
              className={`w-60 h-60 rounded-full flex items-center justify-center transition-all duration-1000 shadow-sm ${
                isBreathingActive && breathingPhase === 'inhale'
                  ? 'scale-125 bg-emerald-100 border-4 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : isBreathingActive && (breathingPhase === 'hold' || breathingPhase === 'hold2')
                  ? 'scale-125 bg-indigo-100 border-4 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : isBreathingActive && breathingPhase === 'exhale'
                  ? 'scale-100 bg-sky-100 border-4 border-sky-400'
                  : 'scale-100 bg-slate-100 border-2 border-slate-300'
              }`}
            >
              <div className="text-center space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-700">
                  {breathingPhase === 'inhale' && 'Тыныс ал'}
                  {(breathingPhase === 'hold' || breathingPhase === 'hold2') && 'Тынысты ұста'}
                  {breathingPhase === 'exhale' && 'Тыныс шығар'}
                </p>
                <div className="text-5xl font-heading font-black text-slate-900">
                  {breathingTimer}s
                </div>
                <p className="text-[11px] text-slate-500">
                  {breathingPhase === 'inhale' && 'Мұрынмен баяу...'}
                  {(breathingPhase === 'hold' || breathingPhase === 'hold2') && 'Сабыр сақта...'}
                  {breathingPhase === 'exhale' && 'Ауызбен босаңсы...'}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                if (isBreathingActive) {
                  setIsBreathingActive(false);
                } else {
                  setIsBreathingActive(true);
                  setBreathingPhase('inhale');
                  setBreathingTimer(breathingMode === '711' ? 7 : 4);
                  audioService.playChime();
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>{isBreathingActive ? 'Тоқтату' : 'Жаттығуды Бастау'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            💡 Тыныс алу кезінде иығыңызды бос ұстап, диафрагмамен (ішпен) тыныстаңыз.
          </p>
        </div>
      )}

      {/* ================= TAB 4: MOOD TRACKER ================= */}
      {subTab === 'mood' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Бүгінгі көңіл-күйіңді бағала
                </h3>
                <p className="text-xs text-slate-500">
                  Өз сезіміңді тану — эмоционалды тұрақтылықтың негізі (+20 XP)
                </p>
              </div>
            </div>

            {/* 5-step Rating scale */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { rating: 1 as MoodRating, emoji: '😫', label: 'Өте ауыр' },
                { rating: 2 as MoodRating, emoji: '😟', label: 'Мазасыз' },
                { rating: 3 as MoodRating, emoji: '😐', label: 'Қалыпты' },
                { rating: 4 as MoodRating, emoji: '🙂', label: 'Жақсы' },
                { rating: 5 as MoodRating, emoji: '🤩', label: 'Керемет' }
              ].map((item) => (
                <button
                  key={item.rating}
                  type="button"
                  onClick={() => setSelectedRating(item.rating)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    selectedRating === item.rating
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 scale-105 shadow-xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Emotion Tag Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Қандай эмоциялар басым болды?
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag) => {
                  const isSelected = selectedEmotions.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedEmotions(selectedEmotions.filter((t) => t !== tag));
                        } else {
                          setSelectedEmotions([...selectedEmotions, tag]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Күнделік жазбасы (анонимді):
              </label>
              <textarea
                rows={3}
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Бүгін не болды? Ойыңмен бөліс..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveMood}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Көңіл-күй сақталды! (+20 XP)</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Көңіл-күйді сақтау</span>
                </>
              )}
            </button>
          </div>

          {/* Right History */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Көңіл-күй Динамикасы</span>
              </h3>
              <span className="text-xs text-slate-500">Соңғы жазбалар</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {moods.map((entry) => {
                const emojis = ['', '😫', '😟', '😐', '🙂', '🤩'];
                return (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emojis[entry.rating]}</span>
                        <span className="text-xs font-bold text-slate-800">
                          Деңгей: {entry.rating} / 5
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(entry.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.emotions.map((em, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            {em}
                          </span>
                        ))}
                      </div>
                    )}

                    {entry.note && (
                      <p className="text-xs text-slate-700 italic">
                        "{entry.note}"
                      </p>
                    )}

                    {entry.aiInsight && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-800">
                          {entry.aiInsight}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 5: CBT THOUGHT REFRAMING ================= */}
      {subTab === 'cbt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Ойларды Қайта Құру (CBT)
              </h3>
              <p className="text-xs text-slate-500">
                Мазасыз теріс ойларды анықтап, оларды шынайы әрі қолдаушы ойларға айналдыру (+35 XP)
              </p>
            </div>

            <form onSubmit={handleSaveCbt} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Жағдай (Не болды?):
                </label>
                <input
                  type="text"
                  value={cbtSituation}
                  onChange={(e) => setCbtSituation(e.target.value)}
                  placeholder="Мысалы: Мұғалім сабақта қатал ескерту жасады..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Автоматты жағымсыз ой:
                </label>
                <input
                  type="text"
                  value={cbtNegativeThought}
                  onChange={(e) => setCbtNegativeThought(e.target.value)}
                  placeholder="«Мен ештеңе білмеймін, мені бәрі мазақтайды...»"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Когнитивті қателікті анықта:
                </label>
                <select
                  value={cbtDistortion}
                  onChange={(e) => setCbtDistortion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Катастрофизация (Ең жаманын күту)">Катастрофизация (Ең жаманын күту)</option>
                  <option value="Ақ-қара ойлау («Бәрі немесе ештеңе»)">Ақ-қара ойлау («Бәрі немесе ештеңе»)</option>
                  <option value="Асыра сілтеу («Менде әрдайым осылай...»)">Асыра сілтеу («Менде әрдайым осылай...»)</option>
                  <option value="Ойды оқу («Олар мені жек көреді»)">Ойды оқу («Олар мені жек көреді»)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. Рационалды жаңа ой (шындық қалай?):
                </label>
                <textarea
                  rows={3}
                  value={cbtRational}
                  onChange={(e) => setCbtRational(e.target.value)}
                  placeholder="«Бұл тек бір сабақтағы ескерту. Мен одан сабақ алып, келесіде жақсырақ дайындала аламын»"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
              >
                {cbtSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Ой қайта құрылды! (+35 XP)</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Қайта құрылған ойды бекіту</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Менің CBT Жазбаларым
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {cbtRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Әзірге CBT жазбалары жоқ. Сол жақтағы форма арқылы бірінші ойыңды өңдеп көр!
                </div>
              ) : (
                cbtRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-rose-600 line-through">
                        "{rec.negativeThought}"
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                        {rec.cognitiveDistortion.split(' ')[0]}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold text-emerald-700 block mb-0.5">
                        ✨ Рационалды ой:
                      </span>
                      {rec.rationalThought}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 6: SCREENING TEST ================= */}
      {subTab === 'screening' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-2xl mx-auto space-y-6">
          {!screeningFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Сұрақ {screeningStep + 1} / {screeningQuestions.length}
                </span>
                <span className="text-xs text-slate-500">
                  Анонимді сауалнама
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((screeningStep + 1) / screeningQuestions.length) * 100}%` }}
                />
              </div>

              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-relaxed">
                {screeningQuestions[screeningStep]}
              </h3>

              <div className="space-y-2.5">
                {[
                  { label: 'Ешқашан / Мүлдем болған жоқ', score: 0 },
                  { label: 'Бірнеше күн ғана байқалды', score: 1 },
                  { label: 'Күндердің жартысынан көбінде', score: 2 },
                  { label: 'Күн сайын дерлік', score: 3 }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScreeningAnswer(opt.score)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5 py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center text-3xl">
                📋
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Сауалнама нәтижесі дайын!
              </h3>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Тестке адал жауап бергеніңе рақмет. Бұл нәтиже сенің қазіргі эмоционалды жағдайыңды түсінуге көмектеседі.
              </p>

              <button
                onClick={() => {
                  setScreeningFinished(false);
                  setScreeningStep(0);
                  setScreeningAnswers([]);
                  setSubTab('chat');
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
              >
                Психологпен талқылау
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
