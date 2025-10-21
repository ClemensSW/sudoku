/**
 * Cloud Function: matchmaking
 *
 * Finds an opponent or creates AI match after 5-second timeout
 *
 * Flow:
 * 1. Add user to matchmaking queue
 * 2. Search for available opponents (±200 ELO)
 * 3. If found: Create ranked match
 * 4. Wait 5 seconds
 * 5. Check if matched during wait
 * 6. If still no match: Create AI match
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { generateSudokuPuzzle, generateAIName } from "./utils/sudokuGenerator";
import type { Difficulty, MatchDocument } from "./types/firestore";

// Use europe-west3 region only in production (for GDPR compliance)
// Emulator ignores region and uses default us-central1
const options = process.env.FUNCTIONS_EMULATOR
  ? {}
  : { region: "europe-west3" as const };

export const matchmaking = onCall(options, async (request) => {
  // Auth check
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const userId = request.auth.uid;
  const data = request.data;
  const { difficulty, elo, displayName } = data;

  // Validation
  const validDifficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];
  if (!validDifficulties.includes(difficulty)) {
    throw new HttpsError(
      "invalid-argument",
      "Invalid difficulty. Must be: easy, medium, hard, or expert"
    );
  }

  if (typeof elo !== "number" || elo < 0 || elo > 3000) {
    throw new HttpsError(
      "invalid-argument",
      "Invalid ELO. Must be between 0 and 3000"
    );
  }

  const db = admin.firestore();
  const now = Date.now();

  console.log(`[Matchmaking] User ${userId} searching (ELO: ${elo}, Difficulty: ${difficulty})`);

  // 1. Add to matchmaking queue
  await db.collection("matchmaking").doc(userId).set({
    userId,
    searching: true,
    searchStartedAt: now,
    type: "ranked",
    difficulty,
    elo,
    eloMin: elo - 200,
    eloMax: elo + 200,
    isOnline: true,
    lastHeartbeat: now,
    expireAt: now + 120000, // 2 minutes TTL
  });

  // 2. Search for available opponents
  const opponents = await db
    .collection("matchmaking")
    .where("searching", "==", true)
    .where("type", "==", "ranked")
    .where("difficulty", "==", difficulty)
    .where("elo", ">=", elo - 200)
    .where("elo", "<=", elo + 200)
    .limit(10) // Get multiple candidates
    .get();

  // Filter out self
  const validOpponents = opponents.docs.filter((doc) => doc.id !== userId);

  if (validOpponents.length > 0) {
    // Match found!
    const opponentDoc = validOpponents[0];
    const opponentData = opponentDoc.data();

    console.log(`[Matchmaking] Match found! Opponent: ${opponentData.userId}`);

    // Get user profiles
    const userProfile = await db.collection("users").doc(userId).get();
    const opponentProfile = await db
      .collection("users")
      .doc(opponentData.userId)
      .get();

    // Generate game board
    const { board, solution } = generateSudokuPuzzle(difficulty);

    // Create match
    const matchId = db.collection("matches").doc().id;
    const matchData: Partial<MatchDocument> = {
      matchId,
      status: "lobby",
      type: "ranked",
      difficulty,
      createdAt: now,
      players: [
        {
          uid: userId,
          playerNumber: 1,
          displayName:
            displayName ||
            userProfile.data()?.profile?.displayName ||
            "Player 1",
          elo: elo,
          isAI: false,
          isReady: false,
          joinedAt: now,
        },
        {
          uid: opponentData.userId,
          playerNumber: 2,
          displayName: opponentData.displayName || opponentProfile.data()?.profile?.displayName || "Player 2",
          elo: opponentData.elo,
          isAI: false,
          isReady: false,
          joinedAt: now,
        },
      ],
      privateMatch: false,
      hostUid: userId,
      gameState: {
        board,
        solution,
        initialBoard: board.map((row) => [...row]),
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
      expireAt: now + 3600000, // 1 hour expiry
    };

    await db.collection("matches").doc(matchId).set(matchData);

    // Remove both from queue
    await opponentDoc.ref.delete();
    await db.collection("matchmaking").doc(userId).delete();

    return {
      matchId,
      opponentFound: true,
      opponent: {
        displayName: matchData.players![1].displayName,
        elo: opponentData.elo,
        isAI: false,
      },
    };
  }

  // 3. No opponent found - wait 5 seconds
  console.log(`[Matchmaking] No opponent found. Waiting 5 seconds...`);
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 4. Check if matched during wait
  const myDoc = await db.collection("matchmaking").doc(userId).get();
  if (!myDoc.exists) {
    // Matched with someone during wait!
    const recentMatches = await db
      .collection("matches")
      .where("players", "array-contains", { uid: userId })
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!recentMatches.empty) {
      const match = recentMatches.docs[0].data() as MatchDocument;
      const opponent = match.players.find((p) => p.uid !== userId)!;

      console.log(`[Matchmaking] Matched during wait! Match: ${match.matchId}`);

      return {
        matchId: match.matchId,
        opponentFound: true,
        opponent: {
          displayName: opponent.displayName,
          elo: opponent.elo,
          isAI: false,
        },
      };
    }
  }

  // 5. Still no opponent - create AI match
  console.log(`[Matchmaking] Creating AI match...`);

  // Remove from queue
  await db.collection("matchmaking").doc(userId).delete();

  // Generate AI opponent
  const aiElo = elo + Math.floor((Math.random() - 0.5) * 100); // ±50 ELO
  const aiName = generateAIName();

  // Generate game board
  const { board, solution } = generateSudokuPuzzle(difficulty);

  // Create AI match
  const matchId = db.collection("matches").doc().id;
  const matchData: Partial<MatchDocument> = {
    matchId,
    status: "active", // AI matches start immediately
    type: "ai",
    difficulty,
    createdAt: now,
    startedAt: now,
    players: [
      {
        uid: userId,
        playerNumber: 1,
        displayName: displayName || "Player 1",
        elo: elo,
        isAI: false,
        isReady: true,
        joinedAt: now,
      },
      {
        uid: null, // AI has no UID
        playerNumber: 2,
        displayName: aiName,
        elo: aiElo,
        isAI: true,
        isReady: true,
        joinedAt: now,
      },
    ],
    privateMatch: false,
    hostUid: userId,
    gameState: {
      board,
      solution,
      initialBoard: board.map((row) => [...row]),
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
    expireAt: now + 3600000, // 1 hour expiry
  };

  await db.collection("matches").doc(matchId).set(matchData);

  console.log(`[Matchmaking] AI match created: ${matchId}`);

  return {
    matchId,
    opponentFound: false,
    aiOpponent: true,
    opponent: {
      displayName: aiName,
      elo: aiElo,
      isAI: true,
    },
  };
});
