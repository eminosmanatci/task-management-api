import { apiClient } from './client';
import type { AuthResponse } from '../types';

export const authAPI = {
  login: async (email: string, password: string) => {
    // Alternatif ve daha sağlam yöntem:
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await apiClient.post<AuthResponse>('/auth/login', params, {
      headers: { 
        // Axios bazen bu header'ı otomatik ayarlar ama manuel girmek daha güvenli
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    });
    return response.data;
  },
  // ... register kısmın doğru
};