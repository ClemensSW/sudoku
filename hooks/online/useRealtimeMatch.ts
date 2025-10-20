/**
 * useRealtimeMatch Hook
 *
 * Real-time synchronization for online matches via Firestore listeners
 *
 * Features:
 * - Real-time match state updates
 * - Connection status tracking
 * - Optimistic updates for moves
 * - Error handling & retry
 */

import { useState, useEffect, useCallback } from "react";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

// ===== Types =====

export interface MatchState {
  matchId: string;
  status: "searching" | "lobby" | "active" | "completed" | "abandoned";
  type: "ranked" | "private" | "ai";
  difficulty: "easy" | "medium" | "hard" | "expert";
  createdAt: number;
  startedAt?: number;
  completedAt?: number;

  players: [PlayerInfo, PlayerInfo];

  privateMatch: boolean;
  inviteCode?: string;
  hostUid: string;

  gameState: GameState;
  result?: MatchResult;
  expireAt?: number;
}

export interface PlayerInfo {
  uid: string | null;
  playerNumber: 1 | 2;
  displayName: string;
  elo: number;
  isAI: boolean;
  isReady: boolean;
  joinedAt: number;
}

export interface GameState {
  board: number[][];
  solution: number[][];
  initialBoard: number[][];
  player1Moves: CellMove[];
  player2Moves: CellMove[];
  player1Complete: boolean;
  player2Complete: boolean;
  player1Errors: number;
  player2Errors: number;
  player1Hints: number;
  player2Hints: number;
  elapsedTime: number;
  lastMoveAt: number;
}

export interface CellMove {
  timestamp: number;
  row: number;
  col: number;
  value: number;
  isCorrect: boolean;
  isNote?: boolean;
}

export interface MatchResult {
  winner: 0 | 1 | 2;
  reason: "completion" | "errors" | "timeout" | "forfeit";
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

// ===== Hook =====

export function useRealtimeMatch(matchId: string | null) {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Setup Firestore listener
  useEffect(() => {
    if (!matchId) {
      setMatchState(null);
      setIsLoading(false);
      return;
    }

    console.log(`[useRealtimeMatch] Setting up listener for match: ${matchId}`);

    setIsLoading(true);
    setError(null);

    const unsubscribe = firestore()
      .collection("matches")
      .doc(matchId)
      .onSnapshot(
        (snapshot) => {
          // Success handler
          if (snapshot.exists()) {
            const data = snapshot.data() as MatchState;
            console.log(
              `[useRealtimeMatch] Received update for ${matchId}: status=${data.status}`
            );
            setMatchState(data);
            setIsConnected(true);
            setError(null);
          } else {
            console.warn(`[useRealtimeMatch] Match not found: ${matchId}`);
            setError("Match not found");
            setMatchState(null);
          }
          setIsLoading(false);
        },
        (err) => {
          // Error handler
          console.error(`[useRealtimeMatch] Snapshot error:`, err);
          setIsConnected(false);
          setError(err.message || "Connection error");
          setIsLoading(false);
        }
      );

    // Cleanup on unmount
    return () => {
      console.log(`[useRealtimeMatch] Cleaning up listener for ${matchId}`);
      unsubscribe();
    };
  }, [matchId]);

  // Make a move (with optimistic update)
  const makeMove = useCallback(
    async (
      playerNumber: 1 | 2,
      row: number,
      col: number,
      value: number
    ): Promise<void> => {
      if (!matchId || !matchState) {
        throw new Error("No active match");
      }

      const move: CellMove = {
        timestamp: Date.now(),
        row,
        col,
        value,
        isCorrect: matchState.gameState.solution[row][col] === value,
      };

      const movesField =
        playerNumber === 1 ? "gameState.player1Moves" : "gameState.player2Moves";

      console.log(
        `[useRealtimeMatch] Player ${playerNumber} making move: (${row}, ${col}) = ${value}`
      );

      try {
        // Optimistic update (instant UI)
        setMatchState((prev) => {
          if (!prev) return prev;

          const updatedMoves =
            playerNumber === 1
              ? [...prev.gameState.player1Moves, move]
              : prev.gameState.player1Moves;

          const updatedMoves2 =
            playerNumber === 2
              ? [...prev.gameState.player2Moves, move]
              : prev.gameState.player2Moves;

          return {
            ...prev,
            gameState: {
              ...prev.gameState,
              player1Moves: updatedMoves,
              player2Moves: updatedMoves2,
              lastMoveAt: move.timestamp,
            },
          };
        });

        // Write to Firestore
        await firestore()
          .collection("matches")
          .doc(matchId)
          .update({
            [movesField]: firestore.FieldValue.arrayUnion(move),
            "gameState.lastMoveAt": move.timestamp,
          });

        // Real-time listener will confirm the update
      } catch (err: any) {
        console.error(`[useRealtimeMatch] Move failed:`, err);

        // Rollback optimistic update on error
        setMatchState((prev) => {
          if (!prev) return prev;

          const rollbackMoves =
            playerNumber === 1
              ? prev.gameState.player1Moves.slice(0, -1)
              : prev.gameState.player1Moves;

          const rollbackMoves2 =
            playerNumber === 2
              ? prev.gameState.player2Moves.slice(0, -1)
              : prev.gameState.player2Moves;

          return {
            ...prev,
            gameState: {
              ...prev.gameState,
              player1Moves: rollbackMoves,
              player2Moves: rollbackMoves2,
            },
          };
        });

        throw err;
      }
    },
    [matchId, matchState]
  );

  // Update match status
  const updateMatchStatus = useCallback(
    async (
      newStatus: MatchState["status"],
      additionalData?: Partial<MatchState>
    ): Promise<void> => {
      if (!matchId) {
        throw new Error("No active match");
      }

      console.log(`[useRealtimeMatch] Updating status to: ${newStatus}`);

      try {
        await firestore()
          .collection("matches")
          .doc(matchId)
          .update({
            status: newStatus,
            ...additionalData,
          });
      } catch (err: any) {
        console.error(`[useRealtimeMatch] Status update failed:`, err);
        throw err;
      }
    },
    [matchId]
  );

  return {
    matchState,
    isLoading,
    isConnected,
    error,
    makeMove,
    updateMatchStatus,
  };
}

export default useRealtimeMatch;
