/**
 * Cloud Function: joinPrivateMatch
 *
 * Joins a private match via invite code
 *
 * Flow:
 * 1. Find match by invite code
 * 2. Validate match is in lobby and has empty slot
 * 3. Add guest to match
 * 4. Update match status to active
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import type { MatchDocument } from "./types/firestore";

export const joinPrivateMatch = onCall(
  async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = request.auth.uid;
    const { inviteCode, elo, displayName } = request.data;

    // Validation
    if (!inviteCode || typeof inviteCode !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "Invalid invite code"
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

    console.log(`[JoinPrivateMatch] User ${userId} joining with code: ${inviteCode}`);

    // 1. Find match by invite code
    const matchesSnapshot = await db
      .collection("matches")
      .where("inviteCode", "==", inviteCode.toUpperCase())
      .where("status", "==", "lobby")
      .limit(1)
      .get();

    if (matchesSnapshot.empty) {
      throw new HttpsError(
        "not-found",
        "Match not found or already started"
      );
    }

    const matchDoc = matchesSnapshot.docs[0];
    const match = matchDoc.data() as MatchDocument;

    // 2. Validate match
    if (match.players[0].uid === userId) {
      throw new HttpsError(
        "already-exists",
        "You are the host of this match"
      );
    }

    if (match.players[1].uid !== null) {
      throw new HttpsError(
        "resource-exhausted",
        "Match is already full"
      );
    }

    // 3. Add guest to match
    console.log(`[JoinPrivateMatch] Adding user ${userId} to match ${match.matchId}`);

    await matchDoc.ref.update({
      status: "active", // Match starts when guest joins
      startedAt: now,
      "players.1": {
        uid: userId,
        playerNumber: 2,
        displayName: displayName || "Guest",
        elo: elo,
        isAI: false,
        isReady: true,
        joinedAt: now,
      },
      expireAt: now + 3600000, // 1 hour expiry for active match
    });

    console.log(`[JoinPrivateMatch] ✅ User ${userId} joined match ${match.matchId}`);

    return {
      matchId: match.matchId,
      host: {
        displayName: match.players[0].displayName,
        elo: match.players[0].elo,
      },
      difficulty: match.difficulty,
    };
  }
);
