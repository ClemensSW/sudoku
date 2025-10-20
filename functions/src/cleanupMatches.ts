/**
 * Cloud Function: cleanupMatches
 *
 * Scheduled function that runs every hour to cleanup old matches
 *
 * Removes:
 * - Expired matches (expireAt < now)
 * - Abandoned matches in lobby for > 10 minutes
 * - Expired matchmaking entries
 */

import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

export const cleanupMatches = onSchedule({schedule: "every 1 hours"}, async (event) => {
    const db = admin.firestore();
    const now = Date.now();

    console.log("[CleanupMatches] Starting cleanup...");

    let deletedMatches = 0;
    let deletedMatchmaking = 0;

    // 1. Cleanup expired matches
    const expiredMatches = await db
      .collection("matches")
      .where("expireAt", "<=", now)
      .limit(500) // Process in batches
      .get();

    if (!expiredMatches.empty) {
      const batch = db.batch();
      expiredMatches.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedMatches++;
      });
      await batch.commit();
      console.log(`[CleanupMatches] Deleted ${deletedMatches} expired matches`);
    }

    // 2. Cleanup abandoned lobbies (> 10 minutes old)
    const abandonedLobbies = await db
      .collection("matches")
      .where("status", "==", "lobby")
      .where("createdAt", "<=", now - 600000) // 10 minutes ago
      .limit(500)
      .get();

    if (!abandonedLobbies.empty) {
      const batch = db.batch();
      let abandonedCount = 0;
      abandonedLobbies.docs.forEach((doc) => {
        batch.delete(doc.ref);
        abandonedCount++;
      });
      await batch.commit();
      console.log(`[CleanupMatches] Deleted ${abandonedCount} abandoned lobbies`);
      deletedMatches += abandonedCount;
    }

    // 3. Cleanup expired matchmaking entries
    const expiredMatchmaking = await db
      .collection("matchmaking")
      .where("expireAt", "<=", now)
      .limit(500)
      .get();

    if (!expiredMatchmaking.empty) {
      const batch = db.batch();
      expiredMatchmaking.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedMatchmaking++;
      });
      await batch.commit();
      console.log(
        `[CleanupMatches] Deleted ${deletedMatchmaking} expired matchmaking entries`
      );
    }

    // 4. Cleanup very old completed matches (> 30 days)
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const oldMatches = await db
      .collection("matches")
      .where("status", "==", "completed")
      .where("completedAt", "<=", thirtyDaysAgo)
      .limit(500)
      .get();

    if (!oldMatches.empty) {
      const batch = db.batch();
      let oldCount = 0;
      oldMatches.docs.forEach((doc) => {
        batch.delete(doc.ref);
        oldCount++;
      });
      await batch.commit();
      console.log(`[CleanupMatches] Deleted ${oldCount} old completed matches`);
      deletedMatches += oldCount;
    }

    console.log(
      `[CleanupMatches] ✅ Cleanup complete: ${deletedMatches} matches, ${deletedMatchmaking} matchmaking entries`
    );
});
