export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  owner_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}