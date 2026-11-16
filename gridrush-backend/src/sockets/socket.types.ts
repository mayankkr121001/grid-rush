export interface CapturedCellPayload {
  cellId: number;
  owner: {
    id: string;
    username: string;
    color: string;
  };
  claimedAt?: string;
}

export interface PresencePayload {
  count: number;
}

export interface ServerToClientEvents {
  'board:cell-captured': (data: CapturedCellPayload) => void;
  'presence:count': (data: PresencePayload) => void;
  'presence:initial': (data: PresencePayload) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}

export interface SocketData {
  player?: {
    id: string;
    username: string;
    color: string;
  };
}

