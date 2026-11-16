export interface Player {
  id: string;
  username: string;
  color: string;
  claimedCount: number;
}

export interface CellOwner {
  id: string;
  username: string;
  color: string;
}

export interface Cell {
  cellId: number;
  row: number;
  column: number;
  claimedAt: string | null;
  owner: CellOwner | null;
}

export interface BoardStats {
  total: number;
  claimed: number;
  available: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  color: string;
  claimedCount: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'offline';

