export interface User {
  id: string;
  fullName: string;
  email: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  occupation?: string;
  mentalWellnessContext?: string[];
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  note?: string;
  date: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  level: 'Normal' | 'Moderate' | 'Critical';
  date: Date;
}

export interface SleepEntry {
  id: string;
  userId: string;
  bedtime: Date;
  wakeTime: Date;
  duration: number; // in hours
  quality: number; // 1-5 scale
  date: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  reminderTime: string;
  sleepReminder: boolean;
  sleepReminderTime: string;
}