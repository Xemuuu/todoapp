import api from '../config/api';
import type { LoginDto, RegisterDto, LoginResponse } from '../types';

export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },
};
