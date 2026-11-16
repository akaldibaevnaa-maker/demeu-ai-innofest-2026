export type Language = 'kk' | 'ru' | 'en';
export type ThemeMode = 'light' | 'dark';

export type ActiveModule = 
  | 'home'
  | 'psychologist' 
  | 'volunteer' 
  | 'tutor' 
  | 'career' 
  | 'productivity';

export interface UserProfile {
  id: string;
  pseudonym: string; // 100% Анонимді бүркеншік ат (Аты-жөні ЖОҚ)
  avatarSeed: string; // Эмодзи аватар: 🦅, 🌱, 🚀, 🦊, 🐬, 🦁
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  badges: Badge[];
  language: Language;
  theme: ThemeMode;
  geminiApiKey: string;
  isAnonymousMode: boolean;
}

export interface Badge {
  id: string;
  titleKk: string;
  titleRu: string;
  titleEn: string;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  icon: string;
  unlockedAt?: string;
  category: 'psych' | 'volunteer' | 'study' | 'career' | 'general';
}

// 🧠 Психолог & Көңіл-күй
export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  timestamp: string;
  rating: MoodRating;
  emotions: string[];
  note: string;
  aiInsight?: string;
}

export interface CbtThoughtRecord {
  id: string;
  timestamp: string;
  situation: string;
  negativeThought: string;
  cognitiveDistortion: string;
  rationalThought: string;
  outcomeMood: MoodRating;
}

export interface ScreeningResult {
  id: string;
  date: string;
  testType: 'PHQ-9' | 'GAD-7';
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  recommendation: string;
}

export interface BullyingAnalysisResult {
  toxicityScore: number;
  threatLevel: 'low' | 'medium' | 'high';
  emotionalImpact: string;
  suggestedResponses: string[];
  formalReportTemplate: string;
}

// 🤝 Волонтерлік (Тек Мектеп/Колледж ішіндегі шаралар)
export interface VolunteerOpportunity {
  id: string;
  titleKk: string;
  titleRu: string;
  category: 'library' | 'green' | 'peer_help' | 'events' | 'cleanliness' | 'tech';
  descriptionKk: string;
  location: string; // Мектеп/Колледж ішіндегі орын (Кітапхана, Акт залы, Спорт алаңы, Асхана)
  hours: number;
  teamSizeNeeded: number;
  currentTeamCount: number;
  isStudentInitiative?: boolean;
  organizerPseudonym?: string;
  applied: boolean;
  status: 'open' | 'applied' | 'completed';
}

export interface VolunteerPassportRecord {
  id: string;
  opportunityTitle: string;
  scope: string; // "Мектеп/Колледж ішілік шара"
  date: string;
  hours: number;
  category: string;
  status: 'verified' | 'pending';
  verifierRole: string; // "Іс-шара үйлестірушісі"
  certificateHash: string;
}

export interface KindnessAct {
  id: string;
  titleKk: string;
  descriptionKk: string;
  xp: number;
  completed: boolean;
  completedDate?: string;
}

export interface PeerHelpRequest {
  id: string;
  studentPseudonym: string;
  needsHelpWith: string;
  canHelpWith: string;
  contact: string;
  date: string;
  status: 'open' | 'matched';
}

// 🎓 Білім Демеуі & ҰБТ
export type UbtSubjectCategory = 
  | 'reading'        // Оқу сауаттылығы
  | 'math_literacy'  // Математикалық сауаттылық
  | 'kz_history'     // Қазақстан тарихы
  | 'math_profile'   // Математика (Бейінді)
  | 'informatics'    // Информатика (Бейінді)
  | 'physics'        // Физика (Бейінді)
  | 'chemistry'      // Химия (Бейінді)
  | 'biology'        // Биология (Бейінді)
  | 'english';       // Ағылшын тілі (Бейінді)

export interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  mastered: boolean;
}

export interface QuizQuestion {
  id: string;
  category: UbtSubjectCategory;
  categoryTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// 🧭 Карьера & Бағдар
export interface RIASECScore {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface UniversityGrant {
  id: string;
  universityName: string;
  city: string;
  major: string;
  passingScore2025: number;
  subjects: string;
  grantCount: number;
  description: string;
}

export interface StudentCV {
  pseudonym: string;
  email: string;
  phone: string;
  aboutMe: string;
  skills: string[];
  languages: string[];
  volunteerExperiences: string[];
  academicAchievements: string[];
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  streak: number;
  lastCompletedDate?: string;
  xpReward: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  module: ActiveModule;
  isCrisis?: boolean;
}

export interface DailyQuizItem {
  id: string;
  subject: string;
  subjectLabelKk: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

export interface ExamSimulatorResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  subject: string;
  date: string;
}
