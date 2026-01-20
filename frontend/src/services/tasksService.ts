import api from '../config/api';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types';

export const tasksService = {
  getAll: async (
    params?: {
      page?: number;
      limit?: number;
      status?: TaskStatus;
      categoryId?: number;
    }
  ): Promise<Task[]> => {
    const response = await api.get<{ data: Task[] }>('/tasks', { params });
    return response.data.data;
  },

  create: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  update: async (id: number, taskData: UpdateTaskDto): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
