import apiClient from '@/lib/axios';
import { User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: 'JOB_SEEKER' | 'RECRUITER';
  phone?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register/', payload);
    return response.data;
  },

  logout: async (refreshToken?: string): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/', refreshToken ? { refresh: refreshToken } : {});
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me/');
    return response.data;
  },

  updateProfile: async (data: FormData | Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>('/auth/me/', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ uid?: string; token?: string; reset_link?: string }>> => {
    const response = await apiClient.post('/auth/forgot-password/', { email });
    return response.data;
  },

  resetPassword: async (payload: { uid: string; token: string; new_password: string }): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/reset-password/', payload);
    return response.data;
  },
};

