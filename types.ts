export enum ViewState {
  LOGIN = 'LOGIN',
  PROFILE_SETUP = 'PROFILE_SETUP',
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  CHAT = 'CHAT',
  PROGRESS = 'PROGRESS',
  FOCUS_TOOLS = 'FOCUS_TOOLS'
}

export type StudentType = 'Slow Bloomer' | 'Average' | 'Strong';

export interface StudentProfile {
  name: string;
  gradeLevel: string;
  studentType: StudentType;
  subjects: string[];
  strengths: string[];
  weaknesses: string[];
  dailyStudyHours: number;
  upcomingExams: string;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface DailyPlan {
  date: string;
  sessions: {
    time: string;
    subject: string;
    activity: string;
    duration: string;
    tip: string;
  }[];
  motivationalQuote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 image string
  timestamp: number;
}

export interface ProgressData {
  day: string;
  hours: number;
  focusScore: number; // 0-100
}