/**
 * useRealtimeMatch Hook
 *
 * Real-time synchronization for online matches via Firestore listeners
 *
 * Features:
 * - Real-time match state updates
 * - Connection status tracking
 * - Optimistic updates for moves (with race condition protection)
 * - Error handling & complete rollback
 *
 * Bug Fixes (2025):
 * - Fixed race condition: updatedRowForFirestore now calculated from latest state
 * - Fixed incomplete rollback: now restores board, errors, and lastMoveAt
 * - Fixed over-aggressive filtering: uses 2-second threshold instead of strict comparison
 * - Fixed state closure bug: calculate row before setState to prevent null values sent to Firestore
 */

import { useState, useEffect, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
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
  avatarUri?: string; // Profile picture URI (e.g., "default://avatar17")
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
            const board = firestoreBoardToArray(firestoreData.gameState.board);
            const solution = firestoreBoardToArray(firestoreData.gameState.solution);
            const initialBoard = firestoreBoardToArray(firestoreData.gameState.initialBoard);

            // Validate boards are complete (9x9) AND have valid content
            const isBoardValid = board.length === 9 && board.every(row => row && row.length === 9);
            const isSolutionValid = solution.length === 9 && solution.every(row => row && row.length === 9);
            const isInitialBoardValid = initialBoard.length === 9 && initialBoard.every(row => row && row.length === 9);

            if (!isBoardValid || !isSolutionValid || !isInitialBoardValid) {
              console.error(
                `[useRealtimeMatch] Invalid board data detected:`,
                `board=${isBoardValid ? 'OK' : 'INVALID (empty rows)'}`,
                `solution=${isSolutionValid ? 'OK' : 'INVALID'}`,
                `initialBoard=${isInitialBoardValid ? 'OK' : 'INVALID'}`
              );
              console.error(`[useRealtimeMatch] Board rows:`, board.map(r => r?.length || 0));
              return; // Skip this update if boards have empty/invalid rows
            }

            const clientData: MatchState = {
              ...firestoreData,
              players: firestoreData.players as [PlayerInfo, PlayerInfo],
              gameState: {
                ...firestoreData.gameState,
                board,
                solution,
                initialBoard,
              },
            };

            console.log(
              `[useRealtimeMatch] Received update for ${matchId}: status=${clientData.status}, lastMoveAt=${clientData.gameState.lastMoveAt}, board size=${board.length}x${board[0]?.length || 0}`
            );

            // Optimistic update protection: Only ignore updates that are significantly older
            // This prevents race conditions while still accepting recent updates that may
            // contain changes from other players or the server
            setMatchState((prev) => {
              if (prev) {
                const timeDiff = prev.gameState.lastMoveAt - clientData.gameState.lastMoveAt;

                // Ignore only if update is more than 2 seconds older than current state
                // This allows recent updates to come through even if slightly out of order
                if (timeDiff > 2000) {
                  console.log(
                    `[useRealtimeMatch] Ignoring stale update (${timeDiff}ms old): ` +
                    `${clientData.gameState.lastMoveAt} < ${prev.gameState.lastMoveAt}`
                  );
                  return prev; // Keep current state
                }
              }
              return clientData; // Update to new state
            });
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

      // Variables to track state for rollback
      const previousState = {
        boardState: [] as number[][],
        p1Errors: 0,
        p2Errors: 0,
        lastMoveAt: 0,
      };

      try {
        // FIX: Calculate updated row BEFORE setState from current matchState
        // This prevents closure scope issues while still allowing optimistic updates
        const currentRow = matchState.gameState.board[row];

        // Validate current row
        if (!currentRow || !Array.isArray(currentRow) || currentRow.length !== 9) {
          console.error(`[useRealtimeMatch] FATAL ERROR: Invalid currentRow at index ${row}:`, currentRow);
          console.error(`[useRealtimeMatch] Full board:`, matchState.gameState.board);
          throw new Error(`Invalid board state at row ${row}: expected array of length 9, got ${currentRow?.length || 'undefined'}`);
        }

        // Calculate the updated row for Firestore (from current state)
        const updatedRowForFirestore = currentRow.map((cell, colIndex) =>
          colIndex === col ? value : cell
        );

        // Sanity check
        if (!Array.isArray(updatedRowForFirestore) || updatedRowForFirestore.length !== 9) {
          console.error(`[useRealtimeMatch] IMPOSSIBLE ERROR: Failed to create valid updated row`);
          throw new Error(`Failed to calculate valid row update`);
        }

        console.log(`[useRealtimeMatch] Calculated updatedRowForFirestore:`, updatedRowForFirestore);

        // Optimistic update (instant UI) - recalculate from prev for race condition protection
        setMatchState((prev) => {
          if (!prev) return prev;

          // Store previous state for potential rollback
          previousState.boardState = prev.gameState.board.map(r => [...r]);
          previousState.p1Errors = prev.gameState.player1Errors;
          previousState.p2Errors = prev.gameState.player2Errors;
          previousState.lastMoveAt = prev.gameState.lastMoveAt;

          // Update board using latest state from prev
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

        // Prepare Firestore update with row calculated from current state
        // Note: We must update the entire row, not a single cell
        // Firestore doesn't support updating array elements by index in nested paths

        console.log(`[useRealtimeMatch] Updating row ${row} in Firestore:`, updatedRowForFirestore);

        const updateData: any = {
          [movesField]: firestore.FieldValue.arrayUnion(move),
          "gameState.lastMoveAt": move.timestamp,
          [`gameState.board.${row}`]: updatedRowForFirestore, // Update entire row
        };

        // Increment error counter if move was wrong
        if (isError) {
          updateData[errorsField] = firestore.FieldValue.increment(1);
        }

        console.log(`[useRealtimeMatch] Update data keys:`, Object.keys(updateData));

        // Write to Firestore
        await firestore().collection("matches").doc(matchId).update(updateData);

        // Real-time listener will confirm the update
      } catch (err: any) {
        console.error(`[useRealtimeMatch] Move failed:`, err);

        // Rollback optimistic update on error - restore ALL changed state
        setMatchState((prev) => {
          if (!prev) return prev;

          // Rollback moves
          const rollbackMoves =
            playerNumber === 1
              ? prev.gameState.player1Moves.slice(0, -1)
              : prev.gameState.player1Moves;

          const rollbackMoves2 =
            playerNumber === 2
              ? prev.gameState.player2Moves.slice(0, -1)
              : prev.gameState.player2Moves;

          // Rollback board (restore entire board from previous state)
          const rollbackBoard = prev.gameState.board.map((r, ri) =>
            r.map((c, ci) =>
              (ri === row && ci === col)
                ? (previousState.boardState[ri]?.[ci] ?? c) // Restore previous value
                : c
            )
          );

          // Rollback errors
          const rollbackP1Errors =
            playerNumber === 1 && isError
              ? Math.max(0, prev.gameState.player1Errors - 1)
              : prev.gameState.player1Errors;

          const rollbackP2Errors =
            playerNumber === 2 && isError
              ? Math.max(0, prev.gameState.player2Errors - 1)
              : prev.gameState.player2Errors;

          return {
            ...prev,
            gameState: {
              ...prev.gameState,
              board: rollbackBoard,
              player1Moves: rollbackMoves,
              player2Moves: rollbackMoves2,
              player1Errors: rollbackP1Errors,
              player2Errors: rollbackP2Errors,
              lastMoveAt: previousState.lastMoveAt,
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

  // Auto-detect game over on 3 errors (hearts lost)
  useEffect(() => {
    if (!matchState || matchState.status !== "active") return;

    const maxErrors = 3;
    const p1Errors = matchState.gameState.player1Errors;
    const p2Errors = matchState.gameState.player2Errors;

    // Check if anyone lost all hearts (3 errors)
    if (p1Errors >= maxErrors) {
      console.log(`[useRealtimeMatch] Player 1 lost all hearts (${p1Errors} errors). Player 2 wins!`);

      updateMatchStatus("completed", {
        completedAt: Date.now(),
        result: {
          winner: 2,
          reason: "errors",
          winnerUid: matchState.players[1].uid,
          finalTime: matchState.gameState.elapsedTime,
          player1Stats: {
            cellsSolved: matchState.gameState.player1Moves.filter(m => m.isCorrect).length,
            errors: p1Errors,
            hintsUsed: matchState.gameState.player1Hints,
            averageTimePerCell: matchState.gameState.player1Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player1Moves.length
              : 0,
          },
          player2Stats: {
            cellsSolved: matchState.gameState.player2Moves.filter(m => m.isCorrect).length,
            errors: p2Errors,
            hintsUsed: matchState.gameState.player2Hints,
            averageTimePerCell: matchState.gameState.player2Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player2Moves.length
              : 0,
          },
        },
      });
    } else if (p2Errors >= maxErrors) {
      console.log(`[useRealtimeMatch] Player 2 lost all hearts (${p2Errors} errors). Player 1 wins!`);

      updateMatchStatus("completed", {
        completedAt: Date.now(),
        result: {
          winner: 1,
          reason: "errors",
          winnerUid: matchState.players[0].uid,
          finalTime: matchState.gameState.elapsedTime,
          player1Stats: {
            cellsSolved: matchState.gameState.player1Moves.filter(m => m.isCorrect).length,
            errors: p1Errors,
            hintsUsed: matchState.gameState.player1Hints,
            averageTimePerCell: matchState.gameState.player1Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player1Moves.length
              : 0,
          },
          player2Stats: {
            cellsSolved: matchState.gameState.player2Moves.filter(m => m.isCorrect).length,
            errors: p2Errors,
            hintsUsed: matchState.gameState.player2Hints,
            averageTimePerCell: matchState.gameState.player2Moves.length > 0
              ? matchState.gameState.elapsedTime / matchState.gameState.player2Moves.length
              : 0,
          },
        },
      });
    }
  }, [matchState?.gameState.player1Errors, matchState?.gameState.player2Errors, matchState?.status, updateMatchStatus]);

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
