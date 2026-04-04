import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Token, User, Chat, Message, SignUpData, LoginData, CreateChatData, CreateMessageData } from '../types';

// Use direct backend URL to avoid proxy issues
const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,  // Allow sending credentials with CORS requests
    });

    // Add token to requests
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      console.log('Request interceptor - token from localStorage:', token ? 'exists' : 'missing');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set');
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(data: SignUpData): Promise<User> {
    const response = await this.client.post('/auth/signup', data);
    return response.data;
  }

  async login(data: LoginData): Promise<Token> {
    const response = await this.client.post('/auth/login', data);
    console.log('Raw login response:', response);
    console.log('Response data:', response.data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // Chat endpoints
  async createChat(data: CreateChatData): Promise<Chat> {
    const response = await this.client.post('/chats', data);
    return response.data;
  }

  async getChats(archived: boolean = false): Promise<Chat[]> {
    const response = await this.client.get('/chats', {
      params: { archived },
    });
    return response.data;
  }

  async getChat(chatId: number): Promise<Chat> {
    const response = await this.client.get(`/chats/${chatId}`);
    return response.data;
  }

  async updateChat(chatId: number, data: Partial<CreateChatData>): Promise<Chat> {
    const response = await this.client.put(`/chats/${chatId}`, data);
    return response.data;
  }

  async deleteChat(chatId: number): Promise<void> {
    await this.client.delete(`/chats/${chatId}`);
  }

  // Message endpoints
  async sendMessage(chatId: number, data: CreateMessageData): Promise<Message> {
    const response = await this.client.post(`/chats/${chatId}/messages`, data);
    return response.data;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    const response = await this.client.get(`/chats/${chatId}/messages`);
    return response.data;
  }

  // Settings endpoints
  async getUserSettings(userId: number): Promise<any> {
    const response = await this.client.get(`/users/${userId}/settings`);
    return response.data;
  }

  async updateUserSettings(userId: number, data: any): Promise<any> {
    const response = await this.client.put(`/users/${userId}/settings`, data);
    return response.data;
  }
}

export default new ApiClient();
