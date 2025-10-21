/**
 * Firestore TypeScript Interfaces
 *
 * Definiert die Struktur aller Firestore Collections
 * für Sudoku Duo Online Multiplayer
 */

// ===== Common Types =====

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type MatchStatus =
  | "searching"
  | "lobby"
  | "active"
  | "completed"
  | "abandoned";

export type MatchType = "ranked" | "private" | "ai";

export type RankTier =
  | "novice"
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "master"
  | "grandmaster";

export type WinReason = "completion" | "errors" | "timeout" | "forfeit";

export type LeaderboardType = "global" | "monthly" | "weekly";

// ===== Collection: users/{userId} =====

export interface UserDocument {
  // Profile (existing + extended)
  profile: {
    displayName: string;
    avatarUri?: string;
    titleLevelIndex?: number;
    isAnonymous: boolean;
    createdAt: number;
    lastSeen: number;
  };

  // Online Statistics
  onlineStats: {
    // Match Stats
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;

    // Ranked Stats
    rankedMatches: number;
    rankedWins: number;
    rankedLosses: number;

    // vs Human vs AI
    winsVsHumans: number;
    winsVsAI: number;
    lossesVsHumans: number;
    lossesVsAI: number;

    // Performance
    averageMatchTime: number; // Seconds
    fastestWin: number; // Seconds
    errorFreeWins: number;

    // Streaks
    currentWinStreak: number;
    longestWinStreak: number;
    currentLossStreak: number;

    // Rankings
    currentElo: number;
    highestElo: number;
    currentRank: RankTier;

    // Timestamps
    firstMatchAt?: number;
    lastMatchAt?: number;
    eloLastUpdated: number;
  };

  // Achievements
  achievements: {
    [achievementId: string]: {
      unlockedAt: number;
      progress?: number;
    };
  };
}

// ===== Collection: matches/{matchId} =====

export interface MatchDocument {
  // Metadata
  matchId: string;
  status: MatchStatus;
  type: MatchType;
  difficulty: Difficulty;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;

  // Players (array of 2 players)
  players: PlayerInfo[];

  // Indexed player UIDs for efficient querying
  player1Uid: string;
  player2Uid: string;

  // Private Match
  privateMatch: boolean;
  inviteCode?: string;
  hostUid: string;

  // Game State (Realtime Sync)
  gameState: GameState;

  // Result (when status = 'completed')
  result?: MatchResult;

  // Firestore TTL
  expireAt?: number;
}

export interface PlayerInfo {
  uid: string; // "ai" for AI, "waiting" for empty slot, or user ID
  playerNumber: 1 | 2;
  displayName: string;
  avatarUri?: string; // Profile picture URI (e.g., "default://avatar17")
  elo: number;
  isAI: boolean;
  isReady: boolean;
  joinedAt: number;
}

export interface GameState {
  // Board - stored as object with row keys (Firestore doesn't support nested arrays)
  // { "0": [1,2,3...], "1": [4,5,6...], ... "8": [7,8,9...] }
  board: { [rowIndex: string]: number[] };
  solution: { [rowIndex: string]: number[] };
  initialBoard: { [rowIndex: string]: number[] };

  // Player Progress
  player1Moves: CellMove[];
  player2Moves: CellMove[];

  // Player State
  player1Complete: boolean;
  player2Complete: boolean;
  player1Errors: number;
  player2Errors: number;
  player1Hints: number;
  player2Hints: number;

  // Game Time
  elapsedTime: number; // Seconds
  lastMoveAt: number; // Timestamp
}

export interface CellMove {
  timestamp: number;
  row: number;
  col: number;
  value: number; // 1-9 or 0 (clear)
  isCorrect: boolean;
  isNote?: boolean;
}

export interface MatchResult {
  winner: 0 | 1 | 2; // 0 = tie, 1 = player1, 2 = player2
  reason: WinReason;
  winnerUid?: string;
  eloChanges?: {
    [uid: string]: number;
  };
  finalTime: number;
  player1Stats: PlayerMatchStats;
  player2Stats: PlayerMatchStats;
}

export interface PlayerMatchStats {
  cellsSolved: number;
  errors: number;
  hintsUsed: number;
  averageTimePerCell: number;
}

// ===== Collection: matchmaking/{userId} =====

export interface MatchmakingDocument {
  userId: string;
  searching: boolean;
  searchStartedAt: number;

  // Search Criteria
  type: "ranked" | "private";
  difficulty: Difficulty;

  // ELO Range (for Ranked)
  elo: number;
  eloMin: number; // elo - 200
  eloMax: number; // elo + 200

  // Connection Info
  isOnline: boolean;
  lastHeartbeat: number; // Updated every 5 seconds

  // Firestore TTL
  expireAt: number; // Auto-delete after 2 minutes
}

// ===== Collection: leaderboards/{rankType} =====

export interface LeaderboardDocument {
  rankType: LeaderboardType;
  lastUpdated: number;

  // Top 100 Rankings
  rankings: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number; // 1-100
  uid: string;
  displayName: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  tier: RankTier;
}

// ===== Subcollection: users/{userId}/matches/{matchId} =====

export interface MatchHistoryEntry {
  matchId: string;
  timestamp: number;

  // Opponent
  opponent: {
    displayName: string;
    elo: number;
    isAI: boolean;
  };

  // Result
  result: "win" | "loss";
  eloChange: number; // +25 or -15

  // Performance
  duration: number; // Seconds
  difficulty: Difficulty;
  yourErrors: number;
  opponentErrors: number;
  errorFree: boolean;

  // Match Link
  matchDocPath: string; // Reference to matches/{matchId}
}
