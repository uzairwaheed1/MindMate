import { create } from 'zustand';
import { User, MoodEntry, ChatMessage, QuizResult, SleepEntry, Goal, NotificationSettings } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Signup flow state
  signupStep: number;
  signupData: Partial<User>;
  
  // App data
  moodEntries: MoodEntry[];
  chatMessages: ChatMessage[];
  quizResults: QuizResult[];
  sleepEntries: SleepEntry[];
  goals: Goal[];
  notificationSettings: NotificationSettings;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setSignupStep: (step: number) => void;
  updateSignupData: (data: Partial<User>) => void;
  resetSignupData: () => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addChatMessage: (message: ChatMessage) => void;
  addQuizResult: (result: QuizResult) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  addGoal: (goal: Goal) => void;
  toggleGoal: (goalId: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  signupStep: 1,
  signupData: {},
  moodEntries: [],
  chatMessages: [],
  quizResults: [],
  sleepEntries: [],
  goals: [],
  notificationSettings: {
    dailyReminder: true,
    reminderTime: '20:00',
    sleepReminder: true,
    sleepReminderTime: '22:00',
  },
  
  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setSignupStep: (step) => set({ signupStep: step }),
  updateSignupData: (data) => set((state) => ({ 
    signupData: { ...state.signupData, ...data } 
  })),
  resetSignupData: () => set({ signupData: {}, signupStep: 1 }),
  addMoodEntry: (entry) => set((state) => ({ 
    moodEntries: [...state.moodEntries, entry] 
  })),
  addChatMessage: (message) => set((state) => ({ 
    chatMessages: [...state.chatMessages, message] 
  })),
  addQuizResult: (result) => set((state) => ({ 
    quizResults: [...state.quizResults, result] 
  })),
  addSleepEntry: (entry) => set((state) => ({ 
    sleepEntries: [...state.sleepEntries, entry] 
  })),
  addGoal: (goal) => set((state) => ({ 
    goals: [...state.goals, goal] 
  })),
  toggleGoal: (goalId) => set((state) => ({
    goals: state.goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    )
  })),
  updateNotificationSettings: (settings) => set((state) => ({
    notificationSettings: { ...state.notificationSettings, ...settings }
  })),
}));