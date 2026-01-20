import api from '../config/api';
import type { Category, CreateCategoryDto } from '../types';

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  create: async (categoryData: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', categoryData);
    return response.data;
  },
};
