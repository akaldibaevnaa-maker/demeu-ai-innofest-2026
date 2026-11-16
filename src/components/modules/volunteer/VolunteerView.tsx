import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Award, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Search, 
  Download, 
  QrCode, 
  PlusCircle, 
  Building2,
  FileCheck,
  BookOpen,
  Leaf,
  Smile,
  Music,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  VolunteerOpportunity, 
  VolunteerPassportRecord, 
  KindnessAct, 
  PeerHelpRequest 
} from '../../../types';
import { translations } from '../../../data/locales';
import { storageService } from '../../../services/storageService';

interface VolunteerViewProps {
  profile: UserProfile;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.kk;

  const [subTab, setSubTab] = useState<'opportunities' | 'create_team' | 'passport' | 'kindness' | 'peer'>('opportunities');

  // Opportunities State (Strictly in-school/college)
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(() => storageService.getVolunteerOpps());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Team / Student Initiative State
  const [newInitTitle, setNewInitTitle] = useState('');
  const [newInitCategory, setNewInitCategory] = useState<'library' | 'green' | 'peer_help' | 'events' | 'cleanliness' | 'tech'>('events');
  const [newInitLocation, setNewInitLocation] = useState('');
  const [newInitDesc, setNewInitDesc] = useState('');
  const [newInitTeamSize, setNewInitTeamSize] = useState<number>(4);
  const [newInitHours, setNewInitHours] = useState<number>(3);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Passport State
  const [records, setRecords] = useState<VolunteerPassportRecord[]>(() => storageService.getVolunteerRecords());
  const [showCertificateModal, setShowCertificateModal] = useState<VolunteerPassportRecord | null>(null);

  // Kindness Acts State
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>(() => storageService.getKindnessActs());

  // Peer-to-Peer Help State
  const [peerRequests, setPeerRequests] = useState<PeerHelpRequest[]>(() => storageService.getPeerRequests());
  const [newNeedHelp, setNewNeedHelp] = useState('');
  const [newCanHelp, setNewCanHelp] = useState('');
  const [newContact, setNewContact] = useState('@');
  const [showAddPeerModal, setShowAddPeerModal] = useState(false);

  const totalVolunteerHours = records.reduce((acc, r) => acc + r.hours, 0);

  // Apply / Join Team
  const handleJoinTeam = (opp: VolunteerOpportunity) => {
    const updated = storageService.joinVolunteerTeam(opp.id);
    setOpportunities([...updated]);

    const newRecord = storageService.addVolunteerRecord({
      opportunityTitle: opp.titleKk,
      scope: 'Мектеп/Колледж ішілік шара',
      date: new Date().toISOString().split('T')[0],
      hours: opp.hours,
      category: opp.category,
      status: 'verified',
      verifierRole: 'Іс-шара үйлестірушісі'
    });
    setRecords(prev => [newRecord, ...prev]);

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
  };

  // Create Student Initiative
  const handleCreateInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInitTitle.trim() || !newInitLocation.trim()) return;

    const added = storageService.addStudentVolunteerInitiative({
      titleKk: newInitTitle,
      titleRu: newInitTitle,
      category: newInitCategory,
      descriptionKk: newInitDesc,
      location: newInitLocation,
      hours: newInitHours,
      teamSizeNeeded: newInitTeamSize,
      organizerPseudonym: profile.pseudonym
    });

    setOpportunities(prev => [added, ...prev]);
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setSubTab('opportunities');
      setNewInitTitle('');
      setNewInitDesc('');
      setNewInitLocation('');
    }, 1500);

    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch {}
  };

  const handleToggleKindness = (id: string) => {
    const updated = storageService.toggleKindnessAct(id);
    setKindnessActs(updated);
  };

  const handleAddPeerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeedHelp.trim() || !newCanHelp.trim()) return;

    const added = storageService.addPeerRequest({
      studentPseudonym: profile.pseudonym,
      needsHelpWith: newNeedHelp,
      canHelpWith: newCanHelp,
      contact: newContact
    });

    setPeerRequests(prev => [added, ...prev]);
    setShowAddPeerModal(false);
    setNewNeedHelp('');
    setNewCanHelp('');
  };

  const filteredOpps = opportunities.filter(o => {
    const matchesCategory = selectedCategory === 'all' || o.category === selectedCategory;
    const matchesSearch = o.titleKk.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Sub Nav Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-panel rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        <button
          onClick={() => setSubTab('opportunities')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'opportunities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Мектеп/Колледж Шаралары</span>
        </button>

        <button
          onClick={() => setSubTab('create_team')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'create_team'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Шара Ұйымдастыру & Топ Құру</span>
        </button>

        <button
          onClick={() => setSubTab('passport')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'passport'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Ішкі Төлқұжат ({totalVolunteerHours} сағат)</span>
        </button>

        <button
          onClick={() => setSubTab('kindness')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'kindness'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Күнделікті «Игі Іс»</span>
        </button>

        <button
          onClick={() => setSubTab('peer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            subTab === 'peer'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Құрдасқа Көмек (P2P)</span>
        </button>
      </div>

      {/* ================= TAB 1: IN-SCHOOL VOLUNTEERING ================= */}
      {subTab === 'opportunities' && (
        <div className="space-y-6">
          
          <div className="p-6 glass-panel rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 shadow-sm space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Тек Мектеп және Колледж Ішіндегі Бастамалар
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              Мектепшілік Волонтерлік және Командалық Орталық
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Бұл жерде тек өз білім ордаңдағы (кітапхана, жасыл бұрыш, үзіліс ойындары, акт залы, асхана) пайдалы шаралар жинақталған. Өз шараңды құрып, құрдастарыңнан команда жасақта немесе ашық топтарға қосыл!
            </p>

            {/* Filter & Search */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Мектеп шарасын немесе орнын іздеу..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {[
                  { id: 'all', label: 'Барлығы' },
                  { id: 'library', label: '📖 Кітапхана' },
                  { id: 'green', label: '🌿 Жасыл бұрыш' },
                  { id: 'peer_help', label: '🤝 Кіші буынға көмек' },
                  { id: 'tech', label: '🎙️ Дыбыс/Техника' },
                  { id: 'events', label: '🏆 Шара ұйымдастыру' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpps.map(opp => {
              const isApplied = opp.applied;
              const isFull = opp.currentTeamCount >= opp.teamSizeNeeded;

              return (
                <div
                  key={opp.id}
                  className="p-5 glass-panel rounded-2xl border border-slate-200 bg-white flex flex-col justify-between hover:border-emerald-400 transition duration-200 space-y-4 shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {opp.location}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <Clock className="w-3.5 h-3.5" />
                        <span>+{opp.hours} сағат</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {opp.titleKk}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {opp.descriptionKk}
                    </p>

                    {/* Team recruitment progress bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Команда құрамы:</span>
                        </span>
                        <span>{opp.currentTeamCount} / {opp.teamSizeNeeded} қатысушы</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (opp.currentTeamCount / opp.teamSizeNeeded) * 100)}%` }}
                        />
                      </div>
                      {opp.organizerPseudonym && (
                        <p className="text-[10px] text-indigo-600 font-medium">
                          Ұйымдастырушы: {opp.organizerPseudonym}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleJoinTeam(opp)}
                      disabled={isApplied || isFull}
                      className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                        isApplied
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-default'
                          : isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Сіз бұл командадасыз (+{opp.hours * 25} XP)</span>
                        </>
                      ) : isFull ? (
                        <span>Топ толық жиналды</span>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Топқа қосылу & Шараға қатысу</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= TAB 2: CREATE INITIATIVE & RECRUIT TEAM ================= */}
      {subTab === 'create_team' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🚀 Мектепшілік Бастама
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-slate-900">
              Жаңа Шара Ұйымдастыру & Топ Құру
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Мектепте немесе колледжде игі бастама көтергіңіз келе ме? Шараны сипаттап, қажетті оқушылар командасын бірге жинаңыз!
            </p>
          </div>

          <form onSubmit={handleCreateInitiative} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Іс-шара атауы:
              </label>
              <input
                type="text"
                value={newInitTitle}
                onChange={e => setNewInitTitle(e.target.value)}
                placeholder="Мысалы: Мектеп кітаптарын қаптау немесе Шахмат турнирі..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Бағыты:
                </label>
                <select
                  value={newInitCategory}
                  onChange={e => setNewInitCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="library">Кітапхана ісі</option>
                  <option value="green">Жасыл бұрыш & Экология</option>
                  <option value="peer_help">Кіші буынға көмек</option>
                  <option value="events">Іс-шара & Сайыстар</option>
                  <option value="cleanliness">Тазалық & Тәртіп</option>
                  <option value="tech">Дыбыс & Медиа техника</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Мектептегі орны:
                </label>
                <input
                  type="text"
                  value={newInitLocation}
                  onChange={e => setNewInitLocation(e.target.value)}
                  placeholder="Мысалы: Кітапхана, Акт залы, Спорт алаңы"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Қажетті еріктілер саны (команда):
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={newInitTeamSize}
                  onChange={e => setNewInitTeamSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Бөлінетін сағат көлемі:
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={newInitHours}
                  onChange={e => setNewInitHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Қысқаша сипаттамасы мен мақсаты:
              </label>
              <textarea
                rows={3}
                value={newInitDesc}
                onChange={e => setNewInitDesc(e.target.value)}
                placeholder="Қатысушылар не істейді? Қандай нәтижеге қол жеткіземіз?"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              {createdSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Шара сәтті жарияланды! (+40 XP)</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Шараны Жариялау & Команда Жинау</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 3: IN-SCHOOL PASSPORT & CERTIFICATE ================= */}
      {subTab === 'passport' && (
        <div className="space-y-6">
          <div className="p-6 glass-panel rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl shadow-sm text-white">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">
                    Мектеп/Колледж Волонтерлік Төлқұжаты
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ІШКІ РАСТАЛҒАН
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Иесі: <strong className="text-slate-900">{profile.pseudonym}</strong> (Анонимді ID)
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: SCH-VOL-DEMEU-{profile.id.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
              <div className="text-center">
                <span className="text-3xl font-heading font-black text-emerald-600">
                  {totalVolunteerHours}
                </span>
                <span className="text-[11px] text-slate-500 block font-semibold uppercase">
                  Ішкі сағат
                </span>
              </div>
              <div className="w-[1px] h-10 bg-slate-200" />
              <div className="text-center">
                <span className="text-3xl font-heading font-black text-indigo-600">
                  {records.length}
                </span>
                <span className="text-[11px] text-slate-500 block font-semibold uppercase">
                  Атқарылған іс
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Мектеп/Колледж Ішілік Волонтерлік Еңбектер Тізімі
              </h4>
              <span className="text-xs text-emerald-700 font-mono font-bold">
                Барлығы {records.length} жазба
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Іс-шара атауы</th>
                    <th className="p-3.5">Деңгейі</th>
                    <th className="p-3.5">Мерзімі</th>
                    <th className="p-3.5 text-center">Сағат</th>
                    <th className="p-3.5">Растау мәртебесі</th>
                    <th className="p-3.5 text-right">Сертификат</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {records.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-semibold text-slate-900">
                        {rec.opportunityTitle}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {rec.scope}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">
                        {rec.date}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          {rec.hours} сағат
                        </span>
                      </td>
                      <td className="p-3.5 text-emerald-700 font-semibold">
                        ✓ {rec.verifierRole}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setShowCertificateModal(rec)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-xs transition inline-flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Сертификат</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificate Modal (Zero real names, zero school numbers) */}
          {showCertificateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <div className="relative w-full max-w-xl bg-white border border-emerald-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
                <button
                  onClick={() => setShowCertificateModal(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
                >
                  ✕
                </button>

                <div className="space-y-1">
                  <span className="text-3xl">🏅</span>
                  <h3 className="font-heading font-extrabold text-2xl text-emerald-800">
                    МЕКТЕП/КОЛЛЕДЖ ВОЛОНТЕРЛІК СЕРТИФИКАТЫ
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    INTERNAL YOUTH VOLUNTEERING VERIFIED CERTIFICATE
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3 text-sm text-slate-700">
                  <p className="text-xs text-slate-500">Осы сертификат растайды:</p>
                  <p className="text-xl font-heading font-bold text-slate-900">
                    {profile.pseudonym}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    «<strong>{showCertificateModal.opportunityTitle}</strong>» мектепшілік/колледждік іс-шарасына белсенді қатысып, жалпы көлемі <strong className="text-emerald-700">{showCertificateModal.hours} сағат</strong> қоғамдық пайдалы еңбек атқарды.
                  </p>
                  
                  <div className="pt-3 border-t border-emerald-200/60 text-xs text-center">
                    <span className="text-slate-500 block text-[10px]">Мәртебесі:</span>
                    <strong className="text-slate-800">Мектеп/Колледж өзін-өзі басқару ұйымымен расталған</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-10 h-10 text-emerald-600" />
                    <div className="text-left font-mono">
                      <p className="text-[10px] text-slate-500">Электронды тексеру кілті:</p>
                      <p className="font-bold text-emerald-700">{showCertificateModal.certificateHash}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF / Басып шығару</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 4: DAILY KINDNESS ================= */}
      {subTab === 'kindness' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              💛 Күн сайын 1 игі іс
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-slate-900">
              Мектепшілік «Игі Іс» Тапсырмалары
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Қайырымдылық өзің оқитын сынып пен мектептен басталады. Әр орындалған игі іс үшін XP беріледі!
            </p>
          </div>

          <div className="space-y-3">
            {kindnessActs.map(act => (
              <div
                key={act.id}
                onClick={() => handleToggleKindness(act.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                  act.completed
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'glass-panel border-slate-200 bg-white hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    act.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-slate-50'
                  }`}>
                    {act.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className={`font-heading font-bold text-sm ${act.completed ? 'text-emerald-800 line-through' : 'text-slate-900'}`}>
                      {act.titleKk}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.descriptionKk}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{act.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: PEER-TO-PEER ================= */}
      {subTab === 'peer' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Құрдасқа Көмек (P2P Оқу Орталығы)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                «Сен маған математика түсіндір, мен саған ағылшынша көмектесемін». Анонимді және тегін өзара оқу платформасы.
              </p>
            </div>

            <button
              onClick={() => setShowAddPeerModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Өтініш қосу</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peerRequests.map(peer => (
              <div
                key={peer.id}
                className="p-5 glass-panel rounded-2xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-slate-900">
                      {peer.studentPseudonym}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {peer.date}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block mb-0.5">
                      🔴 Көмек қажет пән:
                    </span>
                    <p className="text-slate-800 font-medium">
                      {peer.needsHelpWith}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">
                      🟢 Өзі үйрете алады:
                    </span>
                    <p className="text-slate-800 font-medium">
                      {peer.canHelpWith}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Байланыс:</span>
                  <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                    {peer.contact}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {showAddPeerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
                <button
                  onClick={() => setShowAddPeerModal(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg bg-slate-100 transition"
                >
                  ✕
                </button>

                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">
                  Өзара көмек өтінішін қалдыру
                </h3>

                <form onSubmit={handleAddPeerRequest} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Қай пәннен көмек қажет?
                    </label>
                    <input
                      type="text"
                      placeholder="Мысалы: Физика (термодинамика)"
                      value={newNeedHelp}
                      onChange={e => setNewNeedHelp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Сен қай салада көмектесе аласың?
                    </label>
                    <input
                      type="text"
                      placeholder="Мысалы: Ағылшын тілі, Қазақстан тарихы"
                      value={newCanHelp}
                      onChange={e => setNewCanHelp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Байланыс контактің (анонимді):
                    </label>
                    <input
                      type="text"
                      placeholder="@username немесе жеке ID"
                      value={newContact}
                      onChange={e => setNewContact(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPeerModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                    >
                      Бас тарту
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Жариялау (+15 XP)
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
