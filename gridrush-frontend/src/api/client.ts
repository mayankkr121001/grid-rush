import { Player, Cell, BoardStats, LeaderboardEntry } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'gridrush_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Bearer token fallback for cross-domain / cross-port environments
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Sends and receives HttpOnly cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: any = new Error(data.error || `HTTP error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

export const playersApi = {
  create: async (username: string) => {
    const res = await request<{ player: Player; recoveryCode: string; token?: string }>('/players', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  recover: async (recoveryCode: string) => {
    const res = await request<{ player: Player; token?: string }>('/players/recover', {
      method: 'POST',
      body: JSON.stringify({ recoveryCode }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  getMe: () =>
    request<{ player: Player }>('/players/me', {
      method: 'GET',
    }),

  rotateRecoveryCode: () =>
    request<{ recoveryCode: string }>('/players/recovery-code/rotate', {
      method: 'POST',
    }),

  logout: async () => {
    try {
      return await request<{ message: string }>('/players/logout', {
        method: 'POST',
      });
    } finally {
      clearAuthToken();
    }
  },
};

export const boardApi = {
  getBoard: () =>
    request<{ cells: Cell[]; stats: BoardStats }>('/board', {
      method: 'GET',
    }),

  claim: (cellId: number) =>
    request<Cell>(`/cells/${cellId}/claim`, {
      method: 'POST',
    }),
};

export const leaderboardApi = {
  getLeaderboard: (limit = 10) =>
    request<{ leaderboard: LeaderboardEntry[] }>(`/leaderboard?limit=${limit}`, {
      method: 'GET',
    }),
};

