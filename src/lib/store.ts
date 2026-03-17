// localStorage-based state management for Aikya

export type UserRole = 'teacher' | 'learner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  subjects: string[];
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  topic: string;
  teacherId: string;
  teacherName: string;
  time: string;
  date: string;
  meetLink: string;
  members: string[];
  maxMembers: number;
}

export interface Review {
  id: string;
  teacherId: string;
  learnerId: string;
  learnerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'session' | 'group' | 'review' | 'info';
  read: boolean;
  date: string;
}

const KEYS = {
  user: 'aikya_user',
  sessions: 'aikya_sessions',
  reviews: 'aikya_reviews',
  chat: 'aikya_chat',
  notes: 'aikya_notes',
  notifications: 'aikya_notifications',
  darkMode: 'aikya_dark',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// User
export const getUser = (): User | null => get<User | null>(KEYS.user, null);
export const setUser = (u: User) => set(KEYS.user, u);
export const logout = () => localStorage.removeItem(KEYS.user);

// Sessions
const defaultSessions: Session[] = [
  {
    id: '1', title: 'Advanced React Patterns', subject: 'Programming', topic: 'React Hooks',
    teacherId: 't1', teacherName: 'Sarah Chen', time: '14:00', date: '2026-03-18',
    meetLink: 'https://meet.google.com/abc-defg-hij', members: ['t1', 'l1', 'l2'], maxMembers: 4,
  },
  {
    id: '2', title: 'Quantum Physics Basics', subject: 'Science', topic: 'Wave Functions',
    teacherId: 't2', teacherName: 'Prof. Miller', time: '10:00', date: '2026-03-19',
    meetLink: 'https://meet.google.com/xyz-uvwx-yz', members: ['t2', 'l3'], maxMembers: 4,
  },
  {
    id: '3', title: 'UI Design Principles', subject: 'Design', topic: 'Color Theory',
    teacherId: 't3', teacherName: 'Jane Doe', time: '13:30', date: '2026-03-20',
    meetLink: 'https://meet.google.com/mno-pqrs-tuv', members: ['t3', 'l4', 'l5', 'l6'], maxMembers: 4,
  },
];

export const getSessions = (): Session[] => get(KEYS.sessions, defaultSessions);
export const setSessions = (s: Session[]) => set(KEYS.sessions, s);

export const addSession = (s: Session) => {
  const all = getSessions();
  all.unshift(s);
  setSessions(all);
};

export const joinSession = (sessionId: string, userId: string) => {
  const all = getSessions();
  const session = all.find(s => s.id === sessionId);
  if (session && session.members.length < session.maxMembers && !session.members.includes(userId)) {
    session.members.push(userId);
    setSessions(all);
  }
};

// Reviews
const defaultReviews: Review[] = [
  { id: 'r1', teacherId: 't1', learnerId: 'l1', learnerName: 'Alex', rating: 5, comment: 'Amazing explanation!', date: '2026-03-15' },
  { id: 'r2', teacherId: 't1', learnerId: 'l2', learnerName: 'Maya', rating: 4, comment: 'Very helpful session.', date: '2026-03-14' },
];

export const getReviews = (): Review[] => get(KEYS.reviews, defaultReviews);
export const addReview = (r: Review) => {
  const all = getReviews();
  all.unshift(r);
  set(KEYS.reviews, all);
};

// Chat
const defaultChat: ChatMessage[] = [
  { id: 'c1', groupId: '1', senderId: 't1', senderName: 'Sarah', text: 'Welcome to the group! 🎉', timestamp: '2026-03-17T12:00:00' },
  { id: 'c2', groupId: '1', senderId: 'l1', senderName: 'Alex', text: 'Excited to learn React patterns!', timestamp: '2026-03-17T12:05:00' },
];

export const getChat = (groupId: string): ChatMessage[] => get<ChatMessage[]>(KEYS.chat, defaultChat).filter(m => m.groupId === groupId);
export const addChatMessage = (m: ChatMessage) => {
  const all = get<ChatMessage[]>(KEYS.chat, defaultChat);
  all.push(m);
  set(KEYS.chat, all);
};

// Notes
const defaultNotes: Note[] = [
  { id: 'n1', userId: 'demo', title: 'React Hooks Summary', content: 'useState, useEffect, useCallback...', subject: 'Programming', date: '2026-03-16' },
];

export const getNotes = (userId: string): Note[] => get<Note[]>(KEYS.notes, defaultNotes).filter(n => n.userId === userId || n.userId === 'demo');
export const addNote = (n: Note) => {
  const all = get<Note[]>(KEYS.notes, defaultNotes);
  all.push(n);
  set(KEYS.notes, all);
};

// Notifications
const defaultNotifications: Notification[] = [
  { id: 'nt1', userId: 'demo', text: 'New session "Advanced React Patterns" starts tomorrow at 2:00 PM', type: 'session', read: false, date: '2026-03-17' },
  { id: 'nt2', userId: 'demo', text: 'You\'ve been grouped with Sarah Chen\'s React session', type: 'group', read: false, date: '2026-03-17' },
  { id: 'nt3', userId: 'demo', text: 'You received a 5-star review from Alex!', type: 'review', read: true, date: '2026-03-16' },
];

export const getNotifications = (): Notification[] => get(KEYS.notifications, defaultNotifications);
export const markNotificationRead = (id: string) => {
  const all = getNotifications();
  const n = all.find(x => x.id === id);
  if (n) n.read = true;
  set(KEYS.notifications, all);
};

// Dark mode
export const isDarkMode = (): boolean => get(KEYS.darkMode, false);
export const setDarkMode = (v: boolean) => {
  set(KEYS.darkMode, v);
  document.documentElement.classList.toggle('dark', v);
};
