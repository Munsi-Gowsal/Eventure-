import { api, setAccessToken } from './client';
import { handleApiError } from './errors';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
      const data = response.data.data;
      setAccessToken(data.accessToken);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', credentials);
      const data = response.data.data;
      setAccessToken(data.accessToken);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setAccessToken(null);
    }
  },
};
