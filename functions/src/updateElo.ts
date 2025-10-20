/**
 * Cloud Function: updateElo
 *
 * Updates ELO ratings for both players after match completion
 *
 * Flow:
 * 1. Validate match exists and is completed
 * 2. Calculate ELO changes
 * 3. Update both players' ELO
 * 4. Update match with ELO changes
 * 5. Add to match history
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { calculateEloChanges, getRankTier } from "./utils/eloCalculator";
import type { MatchDocument } from "./types/firestore";

export const updateElo = functions.https.onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { matchId, winner } = data;

  // Validation
  if (!matchId || typeof matchId !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid matchId"
    );
  }

  if (![0, 1, 2].includes(winner)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid winner. Must be 0 (tie), 1 (player1), or 2 (player2)"
    );
  }

  const db = admin.firestore();

  // 1. Get match document
  const matchDoc = await db.collection("matches").doc(matchId).get();

  if (!matchDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Match not found");
  }

  const match = matchDoc.data() as MatchDocument;

  // Verify match is completed
  if (match.status !== "completed") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Match is not completed"
    );
  }

  // Verify caller is a player in the match
  const isPlayer =
    match.players[0].uid === context.auth.uid ||
    match.players[1].uid === context.auth.uid;

  if (!isPlayer) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You are not a player in this match"
    );
  }

  const player1 = match.players[0];
  const player2 = match.players[1];

  console.log(
    `[UpdateElo] Match ${matchId}: Winner ${winner}, Player1: ${player1.displayName} (${player1.elo}), Player2: ${player2.displayName} (${player2.elo})`
  );

  // 2. Calculate ELO changes
  const eloChanges = calculateEloChanges(player1.elo, player2.elo, winner as 0 | 1 | 2);

  console.log(
    `[UpdateElo] ELO Changes: Player1 ${eloChanges.player1Change > 0 ? "+" : ""}${eloChanges.player1Change}, Player2 ${eloChanges.player2Change > 0 ? "+" : ""}${eloChanges.player2Change}`
  );

  // 3. Update both players' ELO (in batch)
  const batch = db.batch();

  // Update Player 1 (if not AI)
  if (player1.uid) {
    const player1Ref = db.collection("users").doc(player1.uid);
    batch.update(player1Ref, {
      "onlineStats.currentElo": eloChanges.newPlayer1Elo,
      "onlineStats.currentRank": getRankTier(eloChanges.newPlayer1Elo),
      "onlineStats.totalMatches": admin.firestore.FieldValue.increment(1),
      "onlineStats.wins":
        winner === 1 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0),
      "onlineStats.losses":
        winner === 2 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0),
      "onlineStats.lastMatchAt": Date.now(),
      "onlineStats.eloLastUpdated": Date.now(),
    });

    // Add to match history
    const historyRef = player1Ref.collection("matches").doc(matchId);
    batch.set(historyRef, {
      matchId,
      timestamp: match.completedAt || Date.now(),
      opponent: {
        displayName: player2.displayName,
        elo: player2.elo,
        isAI: player2.isAI,
      },
      result: winner === 1 ? "win" : winner === 2 ? "loss" : "tie",
      eloChange: eloChanges.player1Change,
      duration: match.gameState.elapsedTime,
      difficulty: match.difficulty,
      yourErrors: match.gameState.player1Errors,
      opponentErrors: match.gameState.player2Errors,
      errorFree: match.gameState.player1Errors === 0,
      matchDocPath: `matches/${matchId}`,
    });
  }

  // Update Player 2 (if not AI)
  if (player2.uid) {
    const player2Ref = db.collection("users").doc(player2.uid);
    batch.update(player2Ref, {
      "onlineStats.currentElo": eloChanges.newPlayer2Elo,
      "onlineStats.currentRank": getRankTier(eloChanges.newPlayer2Elo),
      "onlineStats.totalMatches": admin.firestore.FieldValue.increment(1),
      "onlineStats.wins":
        winner === 2 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0),
      "onlineStats.losses":
        winner === 1 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0),
      "onlineStats.lastMatchAt": Date.now(),
      "onlineStats.eloLastUpdated": Date.now(),
    });

    // Add to match history
    const historyRef = player2Ref.collection("matches").doc(matchId);
    batch.set(historyRef, {
      matchId,
      timestamp: match.completedAt || Date.now(),
      opponent: {
        displayName: player1.displayName,
        elo: player1.elo,
        isAI: player1.isAI,
      },
      result: winner === 2 ? "win" : winner === 1 ? "loss" : "tie",
      eloChange: eloChanges.player2Change,
      duration: match.gameState.elapsedTime,
      difficulty: match.difficulty,
      yourErrors: match.gameState.player2Errors,
      opponentErrors: match.gameState.player1Errors,
      errorFree: match.gameState.player2Errors === 0,
      matchDocPath: `matches/${matchId}`,
    });
  }

  // 4. Update match with ELO changes
  const matchRef = db.collection("matches").doc(matchId);
  batch.update(matchRef, {
    "result.eloChanges": {
      [player1.uid || "ai"]: eloChanges.player1Change,
      [player2.uid || "ai"]: eloChanges.player2Change,
    },
  });

  // Commit all updates
  await batch.commit();

  console.log(`[UpdateElo] ✅ ELO updated successfully for match ${matchId}`);

  // Return results
  return {
    player1EloChange: eloChanges.player1Change,
    player2EloChange: eloChanges.player2Change,
    newElos: {
      player1: eloChanges.newPlayer1Elo,
      player2: eloChanges.newPlayer2Elo,
    },
    newRanks: {
      player1: getRankTier(eloChanges.newPlayer1Elo),
      player2: getRankTier(eloChanges.newPlayer2Elo),
    },
  };
});
