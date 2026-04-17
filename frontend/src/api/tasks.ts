import { apiClient } from './client';
import type { Task } from '../types';

export const tasksAPI = {
  // Tüm görevleri getir
  getTasks: async () => {
    const response = await apiClient.get<Task[]>('/tasks/');
    return response.data;
  },

  // Yeni görev ekle
  createTask: async (data: Partial<Task>) => {
    const response = await apiClient.post<Task>('/tasks/', data);
    return response.data;
  },

  // Görev güncelle (Örn: todo -> done yapmak için)
  updateTask: async (id: number, data: Partial<Task>) => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // Görev sil
  deleteTask: async (id: number) => {
    await apiClient.delete(`/tasks/${id}`);
  }
};