
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  FAILED: 'FAILED',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDateTime?: string;
  endDateTime?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categories?: Category[];
  user?: User;
}

// DTOs - obiekty do wysyłania na backend

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDateTime?: string;
  endDateTime?: string;
  userId: number;
  categoryIds?: number[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDateTime?: string;
  endDateTime?: string;
  categoryIds?: number[];
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  userId: number;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}
