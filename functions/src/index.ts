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
// Use europe-west3 region only in production (for GDPR compliance)
// Emulator ignores region and uses default us-central1
const healthCheckOptions = process.env.FUNCTIONS_EMULATOR
  ? {}
  : { region: "europe-west3" as const };

export const healthCheck = onRequest(healthCheckOptions, (req, res) => {
  res.json({
    status: "ok",
    message: "Sudoku Duo Cloud Functions are running!",
    timestamp: Date.now(),
    emulator: !!process.env.FUNCTIONS_EMULATOR,
  });
});

// ===== Cloud Functions (Phase 1.3) =====

export { matchmaking } from "./matchmaking";
export { updateElo } from "./updateElo";
export { createPrivateMatch } from "./createPrivateMatch";
export { joinPrivateMatch } from "./joinPrivateMatch";
export { cleanupMatches } from "./cleanupMatches";
