import { useAuthStore } from './authStore';
import { apiRequest as baseApiRequest } from './queryClient';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`;
  
  try {
    const response = await baseApiRequest(method, url, data);
    const json = await response.json();
    return { data: json };
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return { error: 'Unauthorized' };
    }
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function login(email: string, password: string) {
  return apiRequest<{ user: any; token: string }>('POST', '/auth/login', { email, password });
}

export async function getMe() {
  return apiRequest<{ user: any }>('GET', '/auth/me');
}
