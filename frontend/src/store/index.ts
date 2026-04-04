import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  
  initialize: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
    }
  },
}));

interface ChatState {
  chats: any[];
  currentChat: any | null;
  messages: any[];
  setChats: (chats: any[]) => void;
  setCurrentChat: (chat: any) => void;
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  messages: [],
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
}));
