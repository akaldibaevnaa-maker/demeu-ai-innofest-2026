import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  MoodEntry, 
  VolunteerOpportunity, 
  VolunteerPassportRecord, 
  KindnessAct, 
  PeerHelpRequest, 
  Flashcard, 
  Habit, 
  CbtThoughtRecord, 
  ScreeningResult,
  ChatMessage,
  DailyQuizItem,
  ExamSimulatorResult
} from '../types';
import { 
  initialProfile, 
  initialMoodHistory, 
  initialVolunteerOpportunities, 
  initialVolunteerRecords, 
  initialKindnessActs, 
  initialPeerRequests, 
  initialFlashcards, 
  initialHabits,
  initialDailyQuizQuestions 
} from '../data/initialData';

const KEYS = {
  PROFILE: 'demeu_profile_v3',
  MOODS: 'demeu_moods_v3',
  VOL_OPPS: 'demeu_vol_opps_v3',
  VOL_RECORDS: 'demeu_vol_records_v3',
  KINDNESS: 'demeu_kindness_v3',
  PEER: 'demeu_peer_v3',
  FLASHCARDS: 'demeu_flashcards_v3',
  HABITS: 'demeu_habits_v3',
  CBT: 'demeu_cbt_v3',
  SCREENING: 'demeu_screening_v3',
  CHAT: 'demeu_chat_v3',
  DAILY_QUIZ: 'demeu_daily_quiz_v3',
  EXAMS: 'demeu_exams_v3'
};

const PSEUDONYMS = [
  'Жас Қыран',
  'Жұлдызды Ізденуші',
  'Шамшырақ',
  'Тұлпар',
  'Болашақ Ғалым',
  'Талапкер',
  'Алғыр Жас',
  'Құпия Дос',
  'Бейбіт Серік',
  'Парасатты Ұлан'
];

const AVATARS = ['🦅', '🌱', '🚀', '🦊', '🐬', '🦁', '🌟', '🎯', '⚡'];

export const storageService = {
  getProfile(): UserProfile {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) return initialProfile;
    try {
      const p = JSON.parse(data);
      if (!p.pseudonym) {
        p.pseudonym = initialProfile.pseudonym;
        p.isAnonymousMode = true;
      }
      return p;
    } catch {
      return initialProfile;
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  generateRandomPseudonym(): { pseudonym: string; avatar: string } {
    const name = PSEUDONYMS[Math.floor(Math.random() * PSEUDONYMS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    return {
      pseudonym: `${name} #${num}`,
      avatar
    };
  },

  addXp(amount: number): { newXp: number; newLevel: number; leveledUp: boolean } {
    const profile = this.getProfile();
    const oldLevel = profile.level;
    const newXp = profile.xp + amount;
    const newLevel = Math.floor(newXp / 150) + 1;
    const leveledUp = newLevel > oldLevel;

    profile.xp = newXp;
    profile.level = newLevel;
    this.saveProfile(profile);

    if (leveledUp) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }

    return { newXp, newLevel, leveledUp };
  },

  clearAnonymousSession(): void {
    localStorage.removeItem(KEYS.CHAT + '_psychologist');
    localStorage.removeItem(KEYS.CHAT + '_tutor');
    localStorage.removeItem(KEYS.CBT);
    localStorage.removeItem(KEYS.SCREENING);
  },

  getMoods(): MoodEntry[] {
    const data = localStorage.getItem(KEYS.MOODS);
    if (!data) return initialMoodHistory;
    try {
      return JSON.parse(data);
    } catch {
      return initialMoodHistory;
    }
  },

  addMood(mood: Omit<MoodEntry, 'id'>): MoodEntry {
    const moods = this.getMoods();
    const newEntry: MoodEntry = {
      ...mood,
      id: 'mood-' + Date.now()
    };
    const updated = [newEntry, ...moods];
    localStorage.setItem(KEYS.MOODS, JSON.stringify(updated));
    this.addXp(20);
    return newEntry;
  },

  getCbtRecords(): CbtThoughtRecord[] {
    const data = localStorage.getItem(KEYS.CBT);
    return data ? JSON.parse(data) : [];
  },

  addCbtRecord(record: Omit<CbtThoughtRecord, 'id' | 'timestamp'>): CbtThoughtRecord {
    const records = this.getCbtRecords();
    const newRecord: CbtThoughtRecord = {
      ...record,
      id: 'cbt-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(KEYS.CBT, JSON.stringify([newRecord, ...records]));
    this.addXp(35);
    return newRecord;
  },

  getScreeningResults(): ScreeningResult[] {
    const data = localStorage.getItem(KEYS.SCREENING);
    return data ? JSON.parse(data) : [];
  },

  addScreeningResult(res: Omit<ScreeningResult, 'id' | 'date'>): ScreeningResult {
    const list = this.getScreeningResults();
    const newRes: ScreeningResult = {
      ...res,
      id: 'scr-' + Date.now(),
      date: new Date().toISOString()
    };
    localStorage.setItem(KEYS.SCREENING, JSON.stringify([newRes, ...list]));
    this.addXp(30);
    return newRes;
  },

  // Мектеп/Колледж волонтерлік шаралары
  getVolunteerOpps(): VolunteerOpportunity[] {
    const data = localStorage.getItem(KEYS.VOL_OPPS);
    if (!data) return initialVolunteerOpportunities;
    try {
      return JSON.parse(data);
    } catch {
      return initialVolunteerOpportunities;
    }
  },

  saveVolunteerOpps(list: VolunteerOpportunity[]): void {
    localStorage.setItem(KEYS.VOL_OPPS, JSON.stringify(list));
  },

  addStudentVolunteerInitiative(initiative: Omit<VolunteerOpportunity, 'id' | 'applied' | 'status' | 'currentTeamCount'>): VolunteerOpportunity {
    const list = this.getVolunteerOpps();
    const newInit: VolunteerOpportunity = {
      ...initiative,
      id: 'vol-student-' + Date.now(),
      applied: true,
      currentTeamCount: 1, // Organizer is member #1
      status: 'open',
      isStudentInitiative: true
    };
    const updated = [newInit, ...list];
    this.saveVolunteerOpps(updated);
    this.addXp(40);
    return newInit;
  },

  joinVolunteerTeam(id: string): VolunteerOpportunity[] {
    const list = this.getVolunteerOpps();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          applied: true,
          currentTeamCount: Math.min(item.teamSizeNeeded, item.currentTeamCount + 1),
          status: (item.currentTeamCount + 1 >= item.teamSizeNeeded ? 'completed' : 'applied') as any
        };
      }
      return item;
    });
    this.saveVolunteerOpps(updated);
    return updated;
  },

  getVolunteerRecords(): VolunteerPassportRecord[] {
    const data = localStorage.getItem(KEYS.VOL_RECORDS);
    if (!data) return initialVolunteerRecords;
    try {
      return JSON.parse(data);
    } catch {
      return initialVolunteerRecords;
    }
  },

  addVolunteerRecord(record: Omit<VolunteerPassportRecord, 'id' | 'certificateHash'>): VolunteerPassportRecord {
    const records = this.getVolunteerRecords();
    const hash = 'DMU-SCH-VOL-' + Math.floor(1000 + Math.random() * 9000) + 'X';
    const newRecord: VolunteerPassportRecord = {
      ...record,
      id: 'vrec-' + Date.now(),
      certificateHash: hash
    };
    localStorage.setItem(KEYS.VOL_RECORDS, JSON.stringify([newRecord, ...records]));
    this.addXp(record.hours * 25);
    return newRecord;
  },

  getKindnessActs(): KindnessAct[] {
    const data = localStorage.getItem(KEYS.KINDNESS);
    if (!data) return initialKindnessActs;
    try {
      return JSON.parse(data);
    } catch {
      return initialKindnessActs;
    }
  },

  toggleKindnessAct(id: string): KindnessAct[] {
    const acts = this.getKindnessActs();
    const updated = acts.map(a => {
      if (a.id === id) {
        const nextState = !a.completed;
        if (nextState) {
          this.addXp(a.xp);
        }
        return {
          ...a,
          completed: nextState,
          completedDate: nextState ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return a;
    });
    localStorage.setItem(KEYS.KINDNESS, JSON.stringify(updated));
    return updated;
  },

  getPeerRequests(): PeerHelpRequest[] {
    const data = localStorage.getItem(KEYS.PEER);
    if (!data) return initialPeerRequests;
    try {
      return JSON.parse(data);
    } catch {
      return initialPeerRequests;
    }
  },

  addPeerRequest(req: Omit<PeerHelpRequest, 'id' | 'date' | 'status'>): PeerHelpRequest {
    const list = this.getPeerRequests();
    const newReq: PeerHelpRequest = {
      ...req,
      id: 'peer-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    localStorage.setItem(KEYS.PEER, JSON.stringify([newReq, ...list]));
    this.addXp(15);
    return newReq;
  },

  getFlashcards(): Flashcard[] {
    const data = localStorage.getItem(KEYS.FLASHCARDS);
    if (!data) return initialFlashcards;
    try {
      return JSON.parse(data);
    } catch {
      return initialFlashcards;
    }
  },

  toggleFlashcardMastered(id: string): Flashcard[] {
    const list = this.getFlashcards();
    const updated = list.map(fc => {
      if (fc.id === id) {
        const nextVal = !fc.mastered;
        if (nextVal) this.addXp(10);
        return { ...fc, mastered: nextVal };
      }
      return fc;
    });
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(updated));
    return updated;
  },

  addFlashcard(card: Omit<Flashcard, 'id' | 'mastered'>): Flashcard {
    const list = this.getFlashcards();
    const newCard: Flashcard = {
      ...card,
      id: 'fc-' + Date.now(),
      mastered: false
    };
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify([newCard, ...list]));
    this.addXp(15);
    return newCard;
  },

  getHabits(): Habit[] {
    const data = localStorage.getItem(KEYS.HABITS);
    if (!data) return initialHabits;
    try {
      return JSON.parse(data);
    } catch {
      return initialHabits;
    }
  },

  checkHabitToday(id: string): Habit[] {
    const today = new Date().toISOString().split('T')[0];
    const habits = this.getHabits();
    const updated = habits.map(h => {
      if (h.id === id) {
        const alreadyDone = h.lastCompletedDate === today;
        if (!alreadyDone) {
          this.addXp(h.xpReward);
          return {
            ...h,
            streak: h.streak + 1,
            lastCompletedDate: today
          };
        }
      }
      return h;
    });
    localStorage.setItem(KEYS.HABITS, JSON.stringify(updated));
    return updated;
  },

  getChatHistory(module: string): ChatMessage[] {
    const data = localStorage.getItem(KEYS.CHAT + '_' + module);
    return data ? JSON.parse(data) : [];
  },

  saveChatHistory(module: string, messages: ChatMessage[]): void {
    localStorage.setItem(KEYS.CHAT + '_' + module, JSON.stringify(messages));
  },

  getTodayDailyQuiz(): DailyQuizItem {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % initialDailyQuizQuestions.length;
    return initialDailyQuizQuestions[index];
  },

  isDailyQuizCompletedToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(KEYS.DAILY_QUIZ);
    return savedDate === today;
  },

  completeDailyQuizToday(xpReward: number): void {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(KEYS.DAILY_QUIZ, today);
    this.addXp(xpReward);
  },

  getExamResults(): ExamSimulatorResult[] {
    const data = localStorage.getItem(KEYS.EXAMS);
    return data ? JSON.parse(data) : [];
  },

  saveExamResult(result: ExamSimulatorResult): ExamSimulatorResult[] {
    const current = this.getExamResults();
    const updated = [result, ...current].slice(0, 20);
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(updated));
    this.addXp(Math.max(20, Math.floor(result.score * 5)));
    return updated;
  }
};
