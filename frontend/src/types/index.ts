// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserSettings {
  id: number;
  user_id: number;
  theme: 'light' | 'dark';
  language: string;
  notifications_enabled: boolean;
}

// Auth types
export interface SignUpData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Chat types
export interface Chat {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatDetail extends Chat {
  messages: Message[];
}

export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
}

export interface CreateChatData {
  title?: string;
  description?: string;
}

export interface CreateMessageData {
  content: string;
}
