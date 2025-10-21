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
import { firestoreBoardToArray } from "@/utils/firestore/boardConverter";

// ===== Types =====

// Firestore GameState (boards as objects)
interface FirestoreGameState {
  board: { [rowIndex: string]: number[] };
  solution: { [rowIndex: string]: number[] };
  initialBoard: { [rowIndex: string]: number[] };
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

// Firestore MatchState (as stored in Firestore)
interface FirestoreMatchState {
  matchId: string;
  status: "searching" | "lobby" | "active" | "completed" | "abandoned";
  type: "ranked" | "private" | "ai";
  difficulty: "easy" | "medium" | "hard" | "expert";
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  players: PlayerInfo[];
  privateMatch: boolean;
  inviteCode?: string;
  hostUid: string;
  gameState: FirestoreGameState;
  result?: MatchResult;
  expireAt?: number;
}

// Client-side MatchState (boards as 2D arrays)
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
  uid: string;
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
            const firestoreData = snapshot.data() as FirestoreMatchState;

            // Convert Firestore format (object boards) to client format (2D arrays)
            const clientData: MatchState = {
              ...firestoreData,
              players: firestoreData.players as [PlayerInfo, PlayerInfo],
              gameState: {
                ...firestoreData.gameState,
                board: firestoreBoardToArray(firestoreData.gameState.board),
                solution: firestoreBoardToArray(firestoreData.gameState.solution),
                initialBoard: firestoreBoardToArray(firestoreData.gameState.initialBoard),
              },
            };

            console.log(
              `[useRealtimeMatch] Received update for ${matchId}: status=${clientData.status}`
            );
            setMatchState(clientData);
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

      const isCorrect = matchState.gameState.solution[row][col] === value;
      const isError = value !== 0 && !isCorrect; // Error only if non-zero and wrong

      const move: CellMove = {
        timestamp: Date.now(),
        row,
        col,
        value,
        isCorrect,
      };

      const movesField =
        playerNumber === 1 ? "gameState.player1Moves" : "gameState.player2Moves";
      const errorsField =
        playerNumber === 1 ? "gameState.player1Errors" : "gameState.player2Errors";

      console.log(
        `[useRealtimeMatch] Player ${playerNumber} making move: (${row}, ${col}) = ${value} (${isCorrect ? "✓" : "✗"})`
      );

      try {
        // Optimistic update (instant UI)
        setMatchState((prev) => {
          if (!prev) return prev;

          // Update board
          const updatedBoard = prev.gameState.board.map((r, ri) =>
            r.map((c, ci) => (ri === row && ci === col ? value : c))
          );

          // Update moves
          const updatedMoves =
            playerNumber === 1
              ? [...prev.gameState.player1Moves, move]
              : prev.gameState.player1Moves;

          const updatedMoves2 =
            playerNumber === 2
              ? [...prev.gameState.player2Moves, move]
              : prev.gameState.player2Moves;

          // Update errors
          const updatedP1Errors =
            playerNumber === 1 && isError
              ? prev.gameState.player1Errors + 1
              : prev.gameState.player1Errors;

          const updatedP2Errors =
            playerNumber === 2 && isError
              ? prev.gameState.player2Errors + 1
              : prev.gameState.player2Errors;

          return {
            ...prev,
            gameState: {
              ...prev.gameState,
              board: updatedBoard,
              player1Moves: updatedMoves,
              player2Moves: updatedMoves2,
              player1Errors: updatedP1Errors,
              player2Errors: updatedP2Errors,
              lastMoveAt: move.timestamp,
            },
          };
        });

        // Prepare Firestore update
        const updateData: any = {
          [movesField]: firestore.FieldValue.arrayUnion(move),
          "gameState.lastMoveAt": move.timestamp,
          [`gameState.board.${row}.${col}`]: value, // Update specific board cell
        };

        // Increment error counter if move was wrong
        if (isError) {
          updateData[errorsField] = firestore.FieldValue.increment(1);
        }

        // Write to Firestore
        await firestore().collection("matches").doc(matchId).update(updateData);

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

  // Check if player has completed their puzzle
  const checkPlayerCompletion = useCallback((playerNumber: 1 | 2): boolean => {
    if (!matchState) return false;

    const { board, solution, initialBoard } = matchState.gameState;

    // Check all cells
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const initial = initialBoard[row][col];
        if (initial !== 0) continue; // Skip initial cells

        // Check if player made this move
        const playerMoves =
          playerNumber === 1
            ? matchState.gameState.player1Moves
            : matchState.gameState.player2Moves;

        const hasMoveHere = playerMoves.some(m => m.row === row && m.col === col);

        if (hasMoveHere) {
          // Check if cell is correct
          if (board[row][col] !== solution[row][col]) {
            return false; // Wrong value
          }
        } else {
          // No move yet for this cell
          return false;
        }
      }
    }

    return true;
  }, [matchState]);

  // Auto-detect game completion
  useEffect(() => {
    if (!matchState || matchState.status !== "active") return;

    const p1Complete = checkPlayerCompletion(1);
    const p2Complete = checkPlayerCompletion(2);

    // Update completion status if changed
    if (
      p1Complete !== matchState.gameState.player1Complete ||
      p2Complete !== matchState.gameState.player2Complete
    ) {
      console.log(`[useRealtimeMatch] Completion status: P1=${p1Complete}, P2=${p2Complete}`);

      // Update Firestore
      firestore()
        .collection("matches")
        .doc(matchId!)
        .update({
          "gameState.player1Complete": p1Complete,
          "gameState.player2Complete": p2Complete,
        })
        .catch((err) => console.error("Failed to update completion status:", err));
    }

    // Check if match is complete (both players done)
    if (p1Complete && p2Complete) {
      // Determine winner (who completed first)
      const p1LastMove = matchState.gameState.player1Moves[matchState.gameState.player1Moves.length - 1];
      const p2LastMove = matchState.gameState.player2Moves[matchState.gameState.player2Moves.length - 1];

      const winner = p1LastMove && p2LastMove
        ? p1LastMove.timestamp < p2LastMove.timestamp ? 1 : 2
        : p1Complete ? 1 : 2;

      console.log(`[useRealtimeMatch] Match complete! Winner: Player ${winner}`);

      // Update match to completed status
      updateMatchStatus("completed", {
        completedAt: Date.now(),
        result: {
          winner: winner as 1 | 2,
          reason: "completion",
          winnerUid: matchState.players[winner - 1].uid || undefined,
          finalTime: matchState.gameState.elapsedTime,
          player1Stats: {
            cellsSolved: matchState.gameState.player1Moves.length,
            errors: matchState.gameState.player1Errors,
            hintsUsed: matchState.gameState.player1Hints,
            averageTimePerCell: matchState.gameState.player1Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player1Moves.length
              : 0,
          },
          player2Stats: {
            cellsSolved: matchState.gameState.player2Moves.length,
            errors: matchState.gameState.player2Errors,
            hintsUsed: matchState.gameState.player2Hints,
            averageTimePerCell: matchState.gameState.player2Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player2Moves.length
              : 0,
          },
        },
      });
    }
  }, [matchState, checkPlayerCompletion, updateMatchStatus, matchId]);

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
