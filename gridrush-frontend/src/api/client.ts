import { Player, Cell, BoardStats, LeaderboardEntry } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
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
  create: (username: string) =>
    request<{ player: Player; recoveryCode: string }>('/players', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  recover: (recoveryCode: string) =>
    request<{ player: Player }>('/players/recover', {
      method: 'POST',
      body: JSON.stringify({ recoveryCode }),
    }),

  getMe: () =>
    request<{ player: Player }>('/players/me', {
      method: 'GET',
    }),

  rotateRecoveryCode: () =>
    request<{ recoveryCode: string }>('/players/recovery-code/rotate', {
      method: 'POST',
    }),

  logout: () =>
    request<{ message: string }>('/players/logout', {
      method: 'POST',
    }),
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

