/**
 * Sudoku Duo - Cloud Functions
 *
 * Entry point for all Cloud Functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// ===== Exports =====

// Health Check Function (Test-Funktion)
export const healthCheck = onRequest((req, res) => {
  res.json({
    status: "ok",
    message: "Sudoku Duo Cloud Functions are running!",
    timestamp: Date.now(),
  });
});

// ===== Cloud Functions (Phase 1.3) =====

export { matchmaking } from "./matchmaking";
export { updateElo } from "./updateElo";
export { createPrivateMatch } from "./createPrivateMatch";
export { joinPrivateMatch } from "./joinPrivateMatch";
export { cleanupMatches } from "./cleanupMatches";
