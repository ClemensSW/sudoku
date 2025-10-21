/**
 * Cloud Function: createPrivateMatch
 *
 * Creates a private match lobby with invite code
 *
 * Flow:
 * 1. Generate unique invite code
 * 2. Create match in lobby status
 * 3. Return invite code for sharing
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { generateSudokuPuzzle, generateInviteCode } from "./utils/sudokuGenerator";
import type { Difficulty, MatchDocument } from "./types/firestore";

/**
 * Converts 2D array to Firestore-compatible object
 * Firestore doesn't support nested arrays, so we convert to { "0": [...], "1": [...], ... }
 */
function boardToFirestore(board: number[][]): { [key: string]: number[] } {
  const result: { [key: string]: number[] } = {};
  board.forEach((row, index) => {
    result[index.toString()] = row;
  });
  return result;
}

// Use europe-west3 region only in production (for GDPR compliance)
// Emulator ignores region and uses default us-central1
const options = process.env.FUNCTIONS_EMULATOR
  ? {}
  : { region: "europe-west3" as const };

export const createPrivateMatch = onCall(options, async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = request.auth.uid;
    const { difficulty, displayName } = request.data;

    // Validation
    const validDifficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];
    if (!validDifficulties.includes(difficulty)) {
      throw new HttpsError(
        "invalid-argument",
        "Invalid difficulty. Must be: easy, medium, hard, or expert"
      );
    }

    // Private matches don't use ELO - just use default 1000
    const elo = 1000;

    const db = admin.firestore();
    const now = Date.now();

    // 1. Generate unique invite code
    let inviteCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      inviteCode = generateInviteCode();

      // Check if code already exists
      const existing = await db
        .collection("matches")
        .where("inviteCode", "==", inviteCode)
        .where("status", "in", ["lobby", "active"])
        .limit(1)
        .get();

      if (existing.empty) {
        isUnique = true;
      }

      attempts++;
    }

    if (!isUnique) {
      throw new HttpsError(
        "internal",
        "Failed to generate unique invite code"
      );
    }

    console.log(`[CreatePrivateMatch] User ${userId} creating private match (Code: ${inviteCode})`);

    // 2. Generate game board
    const { board, solution } = generateSudokuPuzzle(difficulty);

    // Convert 2D arrays to Firestore-compatible format
    const boardFirestore = boardToFirestore(board);
    const solutionFirestore = boardToFirestore(solution);
    const initialBoardFirestore = boardToFirestore(board);

    // 3. Create match in lobby status
    const matchId = db.collection("matches").doc().id;
    const matchData: Partial<MatchDocument> = {
      matchId,
      status: "lobby",
      type: "private",
      difficulty,
      createdAt: now,
      players: [
        {
          uid: userId,
          playerNumber: 1,
          displayName: displayName || "Host",
          elo: elo,
          isAI: false,
          isReady: false,
          joinedAt: now,
        },
        {
          uid: "waiting", // Placeholder for empty slot
          playerNumber: 2,
          displayName: "Waiting...",
          elo: 0,
          isAI: false,
          isReady: false,
          joinedAt: 0,
        },
      ],
      privateMatch: true,
      inviteCode,
      hostUid: userId,
      gameState: {
        board: boardFirestore,
        solution: solutionFirestore,
        initialBoard: initialBoardFirestore,
        player1Moves: [],
        player2Moves: [],
        player1Complete: false,
        player2Complete: false,
        player1Errors: 0,
        player2Errors: 0,
        player1Hints: 0,
        player2Hints: 0,
        elapsedTime: 0,
        lastMoveAt: now,
      },
      expireAt: now + 600000, // 10 minutes expiry for lobby
    };

    await db.collection("matches").doc(matchId).set(matchData);

    console.log(`[CreatePrivateMatch] ✅ Private match created: ${matchId}`);

    return {
      matchId,
      inviteCode,
      inviteUrl: `sudokuduo://join/${inviteCode}`,
    };
  }
);
