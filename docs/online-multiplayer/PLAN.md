# 🎮 Sudoku Duo - Online Multiplayer Implementation Plan

**Version:** 1.0
**Created:** 2025-01-20
**Last Updated:** 2025-01-20
**Status:** 📋 Planning
**Estimated Duration:** 10-14 Weeks

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Decisions](#architecture-decisions)
3. [Technical Stack](#technical-stack)
4. [Database Schema](#database-schema)
5. [Security Rules](#security-rules)
6. [Cloud Functions](#cloud-functions)
7. [Frontend Architecture](#frontend-architecture)
8. [Implementation Phases](#implementation-phases)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Known Issues & TODOs](#known-issues--todos)

---

## 🎯 Executive Summary

### **Ziel**
Erweiterung des bestehenden lokalen Duo-Modus um ein **kompetitives Online-Multiplayer-System** mit:
- ⚡ Schnellem Matchmaking (max. 5 Sek Wartezeit)
- 🤖 Adaptiver KI als Fallback-Gegner
- 🏆 ELO-basiertes Ranking-System
- 🔗 Social Sharing (WhatsApp, etc.)
- 📊 Umfassende Stats & Achievements
- 👥 Support für Auth + Anonymous Users

### **Scope**
- **In Scope:**
  - Ranked Matchmaking
  - Private Match System (Einladungs-Links)
  - KI-Gegner mit dynamischer Schwierigkeitsanpassung
  - ELO Rating System
  - Online Stats & Achievements
  - Lokaler Modus bleibt erhalten

- **Out of Scope (Tier 2 Features):**
  - Spectator Mode
  - Voice Chat
  - Tournaments
  - Replay System

### **Success Criteria**
- [ ] User kann binnen 5 Sekunden ein Match starten
- [ ] 60%+ Win-Rate gegen KI (adaptive Balancierung)
- [ ] Einladungs-Links funktionieren über alle Messaging-Apps
- [ ] ELO-System korrekt implementiert (+/- 50 ELO pro Match)
- [ ] 0% Data Loss bei Connection-Drops
- [ ] < 200ms Latenz für Spielzüge

---

## 🏗️ Architecture Decisions

### **Decision 1: Firestore vs Realtime Database**

**✅ ENTSCHEIDUNG: Firestore**

**Begründung:**

| Kriterium | Realtime DB | Firestore | Winner |
|-----------|-------------|-----------|--------|
| Latenz | 50-100ms | 100-200ms | RTDB ⚡ |
| Kosten bei vielen Updates | Günstiger | Teurer | RTDB 💰 |
| Queries (Matchmaking) | ❌ Limitiert | ✅ Flexibel | Firestore 🔍 |
| Bereits eingerichtet | ❌ Nein | ✅ Ja | Firestore ✅ |
| Skalierung | Schwieriger | Einfacher | Firestore 📈 |
| Zukunftssicherheit | Legacy | Modern | Firestore 🚀 |
| Offline-Support | ✅ | ✅ | Tie |
| **Sudoku-Spezifisch:** | | | |
| Update-Frequenz | 10+/Sek | 0.5/Sek | Firestore ✅ |
| Latenz-Toleranz | < 100ms | < 500ms | Firestore ✅ |

**Warum Firestore für Sudoku perfekt ist:**
1. **Niedrige Update-Frequenz**: Züge alle 2-5 Sekunden (nicht 60fps Gaming!)
2. **Matchmaking benötigt Queries**: `where('elo', '>=', ...)`, `orderBy('timestamp')`
3. **Bereits vorhanden**: Keine zusätzliche Setup-Arbeit
4. **Flexiblere Datenstruktur**: Collections für Users, Matches, Stats
5. **Bessere Integration**: Auth, Functions, Analytics aus einem System

**Latenz ist kein Problem:**
- Firestore: ~100-200ms
- Sudoku-Zug: alle 2-5 Sekunden
- Menschliche Reaktionszeit: 200-300ms
- **Fazit**: 200ms Overhead = unwahrnehmbar!

---

### **Decision 2: State Management für Realtime Sync**

**✅ ENTSCHEIDUNG: Firestore Realtime Listeners + React Context**

**Architektur:**
```typescript
// Realtime Sync Flow
Firestore Document
     ↓ (onSnapshot)
  Realtime Listener
     ↓ (setState)
  React Context (MatchContext)
     ↓ (useContext)
  UI Components

// Optimistic Updates
User Action
     ↓ (immediate)
  Local State Update
     ↓ (async)
  Firestore Write
     ↓ (onSnapshot)
  Server Confirmation
```

**Warum nicht Redux/Zustand?**
- ✅ React Context ist ausreichend für Match-State
- ✅ Weniger Boilerplate
- ✅ Firestore Listeners sind bereits "Global State"
- ❌ Redux würde Overhead ohne Mehrwert hinzufügen

---

### **Decision 3: Adaptive KI Algorithmus**

**✅ ENTSCHEIDUNG: Dynamic Difficulty Adjustment (DDA) Client-Side**

**Warum Client-Side?**
- ⚡ Keine Server-Latenz für KI-Züge
- 💰 Keine Cloud Function Costs
- 🎮 Bessere Performance
- 🔒 KI-Logik kann verschleiert werden (gegen Reverse-Engineering)

**DDA Metriken:**
```typescript
interface AIProfile {
  userSpeedAvg: number;        // Durchschnitt letzte 10 Züge
  userErrorRate: number;        // 0-1
  aiSpeedMultiplier: number;    // 0.5 - 1.5
  aiErrorProbability: number;   // 0.0 - 0.15
  targetWinRate: 0.55;          // User soll ~55% gewinnen
  recentWinRate: number;        // Sliding window (5 Matches)
}
```

---

## 🛠️ Technical Stack

### **Frontend (React Native + Expo)**
```json
{
  "dependencies": {
    "react-native": "0.73.x",
    "expo": "~50.x",
    "@react-native-firebase/app": "^18.x",
    "@react-native-firebase/firestore": "^18.x",
    "@react-native-firebase/auth": "^18.x",
    "@react-native-firebase/functions": "^18.x",
    "react-native-share": "^10.x",
    "uuid": "^9.x",
    "react-i18next": "^13.x",
    "expo-linking": "~6.x"
  }
}
```

### **Backend (Firebase)**
```
Firebase Project: sudoku-duo-prod
├── Authentication (Google, Apple, Anonymous)
├── Firestore Database
│   ├── users/
│   ├── matches/
│   ├── matchmaking/
│   └── leaderboards/
├── Cloud Functions (Node.js 18)
│   ├── matchmaking
│   ├── eloUpdate
│   ├── cleanupMatches
│   └── sendMatchInvite
└── Cloud Storage (Optional: für Replays)
```

### **Development Tools**
- **Firestore Emulator**: Lokales Testing
- **Firebase CLI**: Deployment
- **Postman**: Cloud Functions Testing
- **Jest + React Native Testing Library**: Unit Tests
- **Detox**: E2E Tests

---

## 🗄️ Database Schema

### **Firestore Collections Overview**

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile
│       ├── onlineStats
│       └── achievements
│
├── matches/
│   └── {matchId}/
│       ├── metadata
│       ├── players[]
│       ├── gameState
│       └── result
│
├── matchmaking/
│   └── {userId}/
│       └── searchCriteria
│
└── leaderboards/
    └── {rankType}/
        └── rankings[]
```

---

### **Collection: `users/{userId}`**

```typescript
interface UserDocument {
  // Profile (bestehend + erweitert)
  profile: {
    displayName: string;
    avatarUri?: string;
    titleLevelIndex?: number;
    isAnonymous: boolean;           // NEU
    createdAt: number;
    lastSeen: number;               // NEU: Für Cleanup
  };

  // Online Statistics (NEU)
  onlineStats: {
    // Match Stats
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;

    // Ranked Stats
    rankedMatches: number;
    rankedWins: number;
    rankedLosses: number;

    // vs Human vs AI
    winsVsHumans: number;
    winsVsAI: number;
    lossesVsHumans: number;
    lossesVsAI: number;

    // Performance
    averageMatchTime: number;       // Seconds
    fastestWin: number;             // Seconds
    errorFreeWins: number;

    // Streaks
    currentWinStreak: number;
    longestWinStreak: number;
    currentLossStreak: number;

    // Rankings
    currentElo: number;
    highestElo: number;
    currentRank: 'novice' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'master' | 'grandmaster';

    // Timestamps
    firstMatchAt?: number;
    lastMatchAt?: number;
    eloLastUpdated: number;
  };

  // Achievements (NEU)
  achievements: {
    [achievementId: string]: {
      unlockedAt: number;
      progress?: number;            // Für progressive Achievements
    };
  };

  // Match History (Subcollection)
  // matches/{matchId} (siehe unten)
}
```

**Firestore Security Rule:**
```javascript
match /users/{userId} {
  // User kann eigenes Dokument lesen/schreiben
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;

  // Öffentliche Felder (für Matchmaking)
  allow read: if resource.data.keys().hasAll(['profile', 'onlineStats'])
               && request.auth != null;
}
```

---

### **Collection: `matches/{matchId}`**

```typescript
interface MatchDocument {
  // Metadata
  matchId: string;                  // Auto-generated
  status: 'searching' | 'lobby' | 'active' | 'completed' | 'abandoned';
  type: 'ranked' | 'private' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  createdAt: number;
  startedAt?: number;               // When both players ready
  completedAt?: number;

  // Players
  players: [
    {
      uid: string | null,           // null = anonymous
      playerNumber: 1 | 2,
      displayName: string,
      elo: number,
      isAI: boolean,
      isReady: boolean,             // For lobby
      joinedAt: number
    },
    // Player 2 (same structure)
  ];

  // Private Match
  privateMatch: boolean;
  inviteCode?: string;              // "ABC123" for sharing
  hostUid: string;                  // Creator

  // Game State (Realtime Sync)
  gameState: {
    // Board
    board: number[][];              // 9x9 Grid (0 = empty)
    solution: number[][];           // 9x9 Grid (correct answers)
    initialBoard: number[][];       // Starting state (for restart)

    // Player Progress
    player1Moves: CellMove[];
    player2Moves: CellMove[];

    // Player State
    player1Complete: boolean;
    player2Complete: boolean;
    player1Errors: number;
    player2Errors: number;
    player1Hints: number;
    player2Hints: number;

    // Game Time
    elapsedTime: number;            // Seconds
    lastMoveAt: number;             // Timestamp
  };

  // Result (when status = 'completed')
  result?: {
    winner: 0 | 1 | 2,              // 0 = tie, 1 = player1, 2 = player2
    reason: 'completion' | 'errors' | 'timeout' | 'forfeit';
    winnerUid?: string;
    eloChanges?: {
      [uid: string]: number;        // +25 or -15
    };
    finalTime: number;
    player1Stats: {
      cellsSolved: number;
      errors: number;
      hintsUsed: number;
      averageTimePerCell: number;
    };
    player2Stats: {
      // same structure
    };
  };

  // Realtime TTL (Firestore)
  expireAt?: number;                // Timestamp for cleanup
}

interface CellMove {
  timestamp: number;
  row: number;
  col: number;
  value: number;                    // 1-9 or 0 (clear)
  isCorrect: boolean;
  isNote?: boolean;
}
```

**Firestore Security Rule:**
```javascript
match /matches/{matchId} {
  // Alle können lesen (für Spectator Mode später)
  allow read: if request.auth != null;

  // Nur Players können schreiben
  allow write: if request.auth != null
               && request.auth.uid in resource.data.players[].uid;

  // Create: Nur authenticated users
  allow create: if request.auth != null;
}
```

**Firestore Indexes:**
```javascript
// Composite Index für Matchmaking
{
  collectionGroup: "matches",
  fields: [
    { fieldPath: "status", order: "ASCENDING" },
    { fieldPath: "type", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "ASCENDING" }
  ]
}

// Index für Private Match Code Lookup
{
  collectionGroup: "matches",
  fields: [
    { fieldPath: "inviteCode", order: "ASCENDING" },
    { fieldPath: "status", order: "ASCENDING" }
  ]
}
```

---

### **Collection: `matchmaking/{userId}`**

**Ephemeral Document (für aktive Suche)**

```typescript
interface MatchmakingDocument {
  userId: string;
  searching: boolean;
  searchStartedAt: number;

  // Search Criteria
  type: 'ranked' | 'private';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  // ELO Range (for Ranked)
  elo: number;
  eloMin: number;                   // elo - 200
  eloMax: number;                   // elo + 200

  // Connection Info
  isOnline: boolean;
  lastHeartbeat: number;            // Updated every 5 seconds

  // Firestore TTL
  expireAt: number;                 // Auto-delete after 2 minutes
}
```

**Firestore Security Rule:**
```javascript
match /matchmaking/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;

  // Matchmaking Service kann lesen (Cloud Function)
  allow read: if request.auth.token.admin == true;
}
```

**Firestore Index:**
```javascript
// Für Matchmaking Query
{
  collectionGroup: "matchmaking",
  fields: [
    { fieldPath: "searching", order: "ASCENDING" },
    { fieldPath: "type", order: "ASCENDING" },
    { fieldPath: "elo", order: "ASCENDING" },
    { fieldPath: "searchStartedAt", order: "ASCENDING" }
  ]
}
```

---

### **Collection: `leaderboards/{rankType}`**

```typescript
interface LeaderboardDocument {
  rankType: 'global' | 'monthly' | 'weekly';
  lastUpdated: number;

  // Top 100 Rankings
  rankings: [
    {
      rank: number;                 // 1-100
      uid: string;
      displayName: string;
      elo: number;
      wins: number;
      losses: number;
      winRate: number;
      tier: 'grandmaster' | 'master' | ...;
    }
  ];
}
```

**Update Trigger:**
- Cloud Function triggered nach jedem Match
- Rankings werden gecached (Update alle 5 Minuten)

---

### **Subcollection: `users/{userId}/matches/{matchId}`**

**Match History (persönlich)**

```typescript
interface MatchHistoryEntry {
  matchId: string;
  timestamp: number;

  // Opponent
  opponent: {
    displayName: string;
    elo: number;
    isAI: boolean;
  };

  // Result
  result: 'win' | 'loss';
  eloChange: number;                // +25 or -15

  // Performance
  duration: number;                 // Seconds
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  yourErrors: number;
  opponentErrors: number;
  errorFree: boolean;

  // Match Link
  matchDocPath: string;             // Reference to matches/{matchId}
}
```

**Firestore Security Rule:**
```javascript
match /users/{userId}/matches/{matchId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 🔒 Security Rules

### **Comprehensive Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ===== Helper Functions =====

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isPlayerInMatch(matchData) {
      return isSignedIn()
             && request.auth.uid in matchData.players[].uid;
    }

    function isValidEloChange(oldElo, newElo) {
      let diff = newElo - oldElo;
      return diff >= -50 && diff <= 50;  // Max ±50 ELO per match
    }

    function isValidMove(move) {
      return move.row >= 0 && move.row < 9
             && move.col >= 0 && move.col < 9
             && move.value >= 0 && move.value <= 9;
    }

    // ===== Users Collection =====

    match /users/{userId} {
      // Read: Own document OR public profile fields
      allow read: if isOwner(userId)
                  || (isSignedIn() && resource.data.keys().hasAll(['profile']));

      // Write: Only own document
      allow write: if isOwner(userId);

      // Validation: ELO changes must be reasonable
      allow update: if isOwner(userId)
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['onlineStats.currentElo'])
                        || isValidEloChange(resource.data.onlineStats.currentElo,
                                            request.resource.data.onlineStats.currentElo));

      // Match History Subcollection
      match /matches/{matchId} {
        allow read, write: if isOwner(userId);
      }
    }

    // ===== Matches Collection =====

    match /matches/{matchId} {
      // Read: Anyone authenticated (for spectator mode later)
      allow read: if isSignedIn();

      // Create: Anyone authenticated
      allow create: if isSignedIn()
                    && request.resource.data.players[0].uid == request.auth.uid;

      // Update: Only players in the match
      allow update: if isPlayerInMatch(resource.data);

      // Validation: Moves must be valid
      allow update: if !request.resource.data.diff(resource.data).affectedKeys().hasAny(['gameState.player1Moves', 'gameState.player2Moves'])
                    || request.resource.data.gameState.player1Moves.size() <= 81
                    && request.resource.data.gameState.player2Moves.size() <= 81;
    }

    // ===== Matchmaking Collection =====

    match /matchmaking/{userId} {
      // Read/Write: Only own document
      allow read, write: if isOwner(userId);

      // Validation: Search timeout (max 2 minutes)
      allow create, update: if request.resource.data.searchStartedAt <= request.time.toMillis()
                             && request.resource.data.expireAt <= request.time.toMillis() + 120000;
    }

    // ===== Leaderboards Collection =====

    match /leaderboards/{rankType} {
      // Read: Anyone authenticated
      allow read: if isSignedIn();

      // Write: Only Cloud Functions (admin token)
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## ☁️ Cloud Functions

### **Function 1: `matchmaking` - Find or Create Match**

**Trigger:** HTTPS Callable
**Purpose:** Findet einen passenden Gegner oder erstellt KI-Match nach 5 Sekunden

```typescript
// functions/src/matchmaking.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const matchmaking = functions.https.onCall(async (data, context) => {
  // Auth Check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { type, difficulty, elo } = data;

  // Validation
  if (!['ranked', 'ai'].includes(type)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid match type');
  }

  const db = admin.firestore();

  // 1. Create Matchmaking Document
  await db.collection('matchmaking').doc(userId).set({
    userId,
    searching: true,
    searchStartedAt: Date.now(),
    type,
    difficulty,
    elo: elo || 1000,
    eloMin: (elo || 1000) - 200,
    eloMax: (elo || 1000) + 200,
    isOnline: true,
    lastHeartbeat: Date.now(),
    expireAt: Date.now() + 120000  // 2 minutes TTL
  });

  // 2. Search for Available Opponents (if ranked)
  if (type === 'ranked') {
    const opponents = await db.collection('matchmaking')
      .where('searching', '==', true)
      .where('type', '==', 'ranked')
      .where('difficulty', '==', difficulty)
      .where('elo', '>=', elo - 200)
      .where('elo', '<=', elo + 200)
      .where('userId', '!=', userId)
      .limit(1)
      .get();

    if (!opponents.empty) {
      const opponentDoc = opponents.docs[0];
      const opponentData = opponentDoc.data();

      // Match Found! Create Match Document
      const matchId = db.collection('matches').doc().id;

      // Get user profiles
      const userProfile = await db.collection('users').doc(userId).get();
      const opponentProfile = await db.collection('users').doc(opponentData.userId).get();

      // Generate game board
      const gameData = generateSudokuBoard(difficulty);

      await db.collection('matches').doc(matchId).set({
        matchId,
        status: 'lobby',
        type: 'ranked',
        difficulty,
        createdAt: Date.now(),
        players: [
          {
            uid: userId,
            playerNumber: 1,
            displayName: userProfile.data()?.profile.displayName || 'Player 1',
            elo: elo || 1000,
            isAI: false,
            isReady: false,
            joinedAt: Date.now()
          },
          {
            uid: opponentData.userId,
            playerNumber: 2,
            displayName: opponentProfile.data()?.profile.displayName || 'Player 2',
            elo: opponentData.elo,
            isAI: false,
            isReady: false,
            joinedAt: Date.now()
          }
        ],
        privateMatch: false,
        gameState: {
          board: gameData.board,
          solution: gameData.solution,
          initialBoard: gameData.board,
          player1Moves: [],
          player2Moves: [],
          player1Complete: false,
          player2Complete: false,
          player1Errors: 0,
          player2Errors: 0,
          player1Hints: 3,
          player2Hints: 3,
          elapsedTime: 0,
          lastMoveAt: Date.now()
        },
        expireAt: Date.now() + 3600000  // 1 hour TTL
      });

      // Remove matchmaking documents
      await db.collection('matchmaking').doc(userId).delete();
      await db.collection('matchmaking').doc(opponentData.userId).delete();

      return {
        success: true,
        matchId,
        opponent: {
          displayName: opponentProfile.data()?.profile.displayName,
          elo: opponentData.elo,
          isAI: false
        }
      };
    }
  }

  // 3. Wait 5 Seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 4. Check again (maybe someone joined)
  const matchmakingDoc = await db.collection('matchmaking').doc(userId).get();
  if (!matchmakingDoc.exists || !matchmakingDoc.data()?.searching) {
    // User cancelled or match was found by another function
    return { success: false, reason: 'cancelled' };
  }

  // 5. No opponent found → Create AI Match
  const matchId = db.collection('matches').doc().id;
  const userProfile = await db.collection('users').doc(userId).get();
  const gameData = generateSudokuBoard(difficulty);

  await db.collection('matches').doc(matchId).set({
    matchId,
    status: 'lobby',
    type: 'ai',
    difficulty,
    createdAt: Date.now(),
    players: [
      {
        uid: userId,
        playerNumber: 1,
        displayName: userProfile.data()?.profile.displayName || 'Player 1',
        elo: elo || 1000,
        isAI: false,
        isReady: true,
        joinedAt: Date.now()
      },
      {
        uid: null,
        playerNumber: 2,
        displayName: generateAIName(),
        elo: elo || 1000,
        isAI: true,
        isReady: true,
        joinedAt: Date.now()
      }
    ],
    privateMatch: false,
    gameState: {
      board: gameData.board,
      solution: gameData.solution,
      initialBoard: gameData.board,
      player1Moves: [],
      player2Moves: [],
      player1Complete: false,
      player2Complete: false,
      player1Errors: 0,
      player2Errors: 0,
      player1Hints: 3,
      player2Hints: 3,
      elapsedTime: 0,
      lastMoveAt: Date.now()
    },
    expireAt: Date.now() + 3600000
  });

  // Remove matchmaking document
  await db.collection('matchmaking').doc(userId).delete();

  return {
    success: true,
    matchId,
    opponent: {
      displayName: 'AI Opponent',
      elo: elo || 1000,
      isAI: true
    }
  };
});

// Helper: Generate AI Name
function generateAIName(): string {
  const names = ['Spieler', 'Solver', 'Genius', 'Master', 'Pro'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 9999);
  return `${randomName}_${randomNumber}`;
}

// Helper: Generate Sudoku Board
function generateSudokuBoard(difficulty: string): { board: number[][], solution: number[][] } {
  // Use existing sudoku generator from utils/sudoku/generator.ts
  // This is a placeholder - actual implementation würde existierenden Code importieren
  return {
    board: [], // 9x9 with some cells filled
    solution: [] // Complete 9x9 solution
  };
}
```

---

### **Function 2: `updateElo` - Calculate ELO Changes**

**Trigger:** HTTPS Callable
**Purpose:** Berechnet und aktualisiert ELO nach Match-Ende

```typescript
// functions/src/eloUpdate.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateElo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { matchId } = data;
  const db = admin.firestore();

  // 1. Get Match Document
  const matchDoc = await db.collection('matches').doc(matchId).get();
  if (!matchDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Match not found');
  }

  const matchData = matchDoc.data();
  if (matchData.status !== 'completed' || matchData.result) {
    throw new functions.https.HttpsError('failed-precondition', 'Match not completed or ELO already updated');
  }

  // 2. Calculate ELO Changes (only for human vs human ranked matches)
  if (matchData.type !== 'ranked' || matchData.players.some(p => p.isAI)) {
    return { success: false, reason: 'Not a ranked human match' };
  }

  const player1 = matchData.players[0];
  const player2 = matchData.players[1];
  const winner = matchData.result.winner;

  if (winner === 0) {
    // Tie - no ELO change
    return { success: true, changes: {} };
  }

  const player1Won = winner === 1;
  const eloChange = calculateEloChange(
    player1.elo,
    player2.elo,
    player1Won,
    32  // K-Factor
  );

  // 3. Update ELO in Transaction
  await db.runTransaction(async (transaction) => {
    const user1Ref = db.collection('users').doc(player1.uid);
    const user2Ref = db.collection('users').doc(player2.uid);

    const user1Doc = await transaction.get(user1Ref);
    const user2Doc = await transaction.get(user2Ref);

    const user1Stats = user1Doc.data()?.onlineStats;
    const user2Stats = user2Doc.data()?.onlineStats;

    // Player 1 ELO
    const newElo1 = user1Stats.currentElo + (player1Won ? eloChange : -eloChange);
    transaction.update(user1Ref, {
      'onlineStats.currentElo': newElo1,
      'onlineStats.highestElo': Math.max(newElo1, user1Stats.highestElo || 0),
      'onlineStats.eloLastUpdated': Date.now(),
      'onlineStats.currentRank': calculateRank(newElo1)
    });

    // Player 2 ELO
    const newElo2 = user2Stats.currentElo + (player1Won ? -eloChange : eloChange);
    transaction.update(user2Ref, {
      'onlineStats.currentElo': newElo2,
      'onlineStats.highestElo': Math.max(newElo2, user2Stats.highestElo || 0),
      'onlineStats.eloLastUpdated': Date.now(),
      'onlineStats.currentRank': calculateRank(newElo2)
    });

    // Update Match Document
    transaction.update(matchDoc.ref, {
      'result.eloChanges': {
        [player1.uid]: player1Won ? eloChange : -eloChange,
        [player2.uid]: player1Won ? -eloChange : eloChange
      }
    });
  });

  return {
    success: true,
    changes: {
      [player1.uid]: player1Won ? eloChange : -eloChange,
      [player2.uid]: player1Won ? -eloChange : eloChange
    }
  };
});

// ELO Calculation
function calculateEloChange(
  playerRating: number,
  opponentRating: number,
  won: boolean,
  kFactor: number = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = won ? 1 : 0;
  return Math.round(kFactor * (actualScore - expectedScore));
}

// Rank Calculation
function calculateRank(elo: number): string {
  if (elo >= 1500) return 'grandmaster';
  if (elo >= 1300) return 'master';
  if (elo >= 1100) return 'diamond';
  if (elo >= 900) return 'gold';
  if (elo >= 700) return 'silver';
  if (elo >= 500) return 'bronze';
  return 'novice';
}
```

---

### **Function 3: `cleanupMatches` - Scheduled Cleanup**

**Trigger:** Scheduled (every 1 hour)
**Purpose:** Löscht abgelaufene Matches und Matchmaking-Dokumente

```typescript
// functions/src/cleanup.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const cleanupMatches = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();

    // 1. Cleanup expired Matches
    const expiredMatches = await db.collection('matches')
      .where('expireAt', '<', now)
      .limit(100)
      .get();

    const matchDeletePromises = expiredMatches.docs.map(doc => doc.ref.delete());
    await Promise.all(matchDeletePromises);

    console.log(`Deleted ${expiredMatches.size} expired matches`);

    // 2. Cleanup stale Matchmaking documents
    const staleMatchmaking = await db.collection('matchmaking')
      .where('expireAt', '<', now)
      .limit(100)
      .get();

    const matchmakingDeletePromises = staleMatchmaking.docs.map(doc => doc.ref.delete());
    await Promise.all(matchmakingDeletePromises);

    console.log(`Deleted ${staleMatchmaking.size} stale matchmaking entries`);

    return null;
  });
```

---

### **Function 4: `createPrivateMatch` - Private Match Setup**

**Trigger:** HTTPS Callable
**Purpose:** Erstellt Private Match mit Einladungs-Code

```typescript
// functions/src/privateMatch.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createPrivateMatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { difficulty } = data;

  const db = admin.firestore();

  // Generate unique invite code
  const inviteCode = generateInviteCode();

  // Get user profile
  const userProfile = await db.collection('users').doc(userId).get();

  // Generate game board
  const gameData = generateSudokuBoard(difficulty);

  // Create Match
  const matchId = db.collection('matches').doc().id;

  await db.collection('matches').doc(matchId).set({
    matchId,
    status: 'lobby',
    type: 'private',
    difficulty,
    createdAt: Date.now(),
    privateMatch: true,
    inviteCode,
    hostUid: userId,
    players: [
      {
        uid: userId,
        playerNumber: 1,
        displayName: userProfile.data()?.profile.displayName || 'Host',
        elo: userProfile.data()?.onlineStats.currentElo || 1000,
        isAI: false,
        isReady: false,
        joinedAt: Date.now()
      },
      {
        uid: null,  // Waiting for guest
        playerNumber: 2,
        displayName: 'Waiting...',
        elo: 0,
        isAI: false,
        isReady: false,
        joinedAt: null
      }
    ],
    gameState: {
      board: gameData.board,
      solution: gameData.solution,
      initialBoard: gameData.board,
      player1Moves: [],
      player2Moves: [],
      player1Complete: false,
      player2Complete: false,
      player1Errors: 0,
      player2Errors: 0,
      player1Hints: 3,
      player2Hints: 3,
      elapsedTime: 0,
      lastMoveAt: Date.now()
    },
    expireAt: Date.now() + 1800000  // 30 minutes TTL for lobby
  });

  return {
    success: true,
    matchId,
    inviteCode,
    shareLink: `https://sudokuduo.app/join/${inviteCode}`
  };
});

export const joinPrivateMatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { inviteCode } = data;

  const db = admin.firestore();

  // Find match by invite code
  const matchQuery = await db.collection('matches')
    .where('inviteCode', '==', inviteCode)
    .where('status', '==', 'lobby')
    .limit(1)
    .get();

  if (matchQuery.empty) {
    throw new functions.https.HttpsError('not-found', 'Match not found or already started');
  }

  const matchDoc = matchQuery.docs[0];
  const matchData = matchDoc.data();

  // Check if match is full
  if (matchData.players[1].uid !== null) {
    throw new functions.https.HttpsError('failed-precondition', 'Match is full');
  }

  // Get user profile
  const userProfile = await db.collection('users').doc(userId).get();

  // Update match with guest player
  await matchDoc.ref.update({
    'players.1': {
      uid: userId,
      playerNumber: 2,
      displayName: userProfile.data()?.profile.displayName || 'Guest',
      elo: userProfile.data()?.onlineStats.currentElo || 1000,
      isAI: false,
      isReady: false,
      joinedAt: Date.now()
    }
  });

  return {
    success: true,
    matchId: matchData.matchId
  };
});

// Helper: Generate 6-character invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  // No confusing chars (I, O, 0, 1)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

---

## 🎨 Frontend Architecture

### **New Folder Structure**

```
screens/
├── DuoGame/  (bestehend)
│   ├── DuoGame.tsx
│   ├── components/
│   └── hooks/
│
└── DuoOnline/  (NEU)
    ├── DuoOnlineMenu.tsx           # Entry Point: Local vs Online
    ├── OnlinePlayMenu.tsx           # Ranked/Private/AI Selection
    │
    ├── Ranked/
    │   ├── RankedMatchmaking.tsx   # Searching for opponent
    │   ├── RankedGame.tsx           # Game with Realtime Sync
    │   └── RankedResults.tsx        # Post-match ELO screen
    │
    ├── Private/
    │   ├── PrivateLobby.tsx         # Waiting for guest
    │   ├── PrivateJoin.tsx          # Join via invite code
    │   └── PrivateGame.tsx          # Game with Realtime Sync
    │
    ├── AI/
    │   ├── AISelection.tsx          # Difficulty selector
    │   ├── AIGame.tsx               # Game with AI logic
    │   └── AIProfile.tsx            # AI personality settings
    │
    ├── Stats/
    │   ├── StatsOverview.tsx        # Dashboard
    │   ├── MatchHistory.tsx         # List of past matches
    │   ├── Leaderboard.tsx          # Global rankings
    │   └── Achievements.tsx         # Achievement list
    │
    ├── components/
    │   ├── OnlineGameBoard.tsx      # Board with Realtime Sync
    │   ├── OnlineGameControls.tsx
    │   ├── OpponentCard.tsx         # Shows opponent info
    │   ├── EloChange.tsx            # Animated ELO display
    │   ├── InviteShareSheet.tsx     # Share invite link
    │   └── MatchLoadingState.tsx    # Searching animation
    │
    ├── hooks/
    │   ├── useRealtimeMatch.ts      # Firestore listener
    │   ├── useMatchmaking.ts        # Matchmaking logic
    │   ├── useAIOpponent.ts         # AI move generation
    │   ├── useEloCalculation.ts     # Client-side ELO preview
    │   └── useMatchStats.ts         # Track match statistics
    │
    └── contexts/
        ├── MatchContext.tsx         # Current match state
        └── OnlineStatsContext.tsx   # User's online stats
```

---

### **Component: `DuoOnlineMenu.tsx`**

**Purpose:** Entry Point - User wählt Local oder Online

```typescript
// screens/DuoOnline/DuoOnlineMenu.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

export const DuoOnlineMenu: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('duoOnline');

  return (
    <View>
      <Text>{t('menu.title')}</Text>

      {/* Local Play */}
      <TouchableOpacity onPress={() => router.push('/duo-game')}>
        <Feather name="smartphone" />
        <Text>{t('menu.local')}</Text>
        <Text>{t('menu.localDesc')}</Text>
      </TouchableOpacity>

      {/* Online Play */}
      <TouchableOpacity onPress={() => router.push('/duo-online/online-play')}>
        <Feather name="wifi" />
        <Text>{t('menu.online')}</Text>
        <Text>{t('menu.onlineDesc')}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### **Hook: `useRealtimeMatch.ts`**

**Purpose:** Firestore Realtime Listener für Match State

```typescript
// screens/DuoOnline/hooks/useRealtimeMatch.ts
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

interface MatchState {
  matchId: string;
  status: 'lobby' | 'active' | 'completed';
  players: Player[];
  gameState: GameState;
  result?: MatchResult;
}

export const useRealtimeMatch = (matchId: string | null) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!matchId) return;

    // Firestore Realtime Listener
    const unsubscribe = firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            setMatchState(snapshot.data() as MatchState);
            setLoading(false);
          } else {
            setError(new Error('Match not found'));
            setLoading(false);
          }
        },
        (err) => {
          console.error('[useRealtimeMatch] Error:', err);
          setError(err);
          setLoading(false);
        }
      );

    // Cleanup on unmount
    return () => unsubscribe();
  }, [matchId]);

  // Update Game State (Optimistic Update)
  const makeMove = async (move: CellMove) => {
    if (!matchId || !matchState) return;

    try {
      // Optimistic local update
      setMatchState(prev => ({
        ...prev,
        gameState: {
          ...prev.gameState,
          player1Moves: [...prev.gameState.player1Moves, move]
        }
      }));

      // Firestore update
      await firestore()
        .collection('matches')
        .doc(matchId)
        .update({
          'gameState.player1Moves': firestore.FieldValue.arrayUnion(move),
          'gameState.lastMoveAt': Date.now()
        });
    } catch (err) {
      console.error('[useRealtimeMatch] Move error:', err);
      // Rollback optimistic update
      // (onSnapshot will revert to server state automatically)
    }
  };

  return {
    matchState,
    loading,
    error,
    makeMove
  };
};
```

---

## 📝 Implementation Phases

### **Phase 1: Foundation & Infrastructure (Week 1-2)**

**Goal:** Setup backend infrastructure, database schema, basic Firestore sync

**Tasks:**
- [ ] **1.1 Firebase Setup**
  - [ ] Upgrade Firebase project plan (Blaze Plan für Cloud Functions)
  - [ ] Enable Cloud Functions in Firebase Console
  - [ ] Install Firebase CLI: `npm install -g firebase-tools`
  - [ ] Init Cloud Functions: `firebase init functions`
  - [ ] Setup Firebase Emulators: `firebase init emulators`

- [ ] **1.2 Database Schema**
  - [ ] Create Firestore collections: `users`, `matches`, `matchmaking`
  - [ ] Setup Composite Indexes (see [Database Schema](#database-schema))
  - [ ] Implement Security Rules (see [Security Rules](#security-rules))
  - [ ] Test Security Rules with Emulator

- [ ] **1.3 Cloud Functions**
  - [ ] Implement `matchmaking` function
  - [ ] Implement `updateElo` function
  - [ ] Implement `cleanupMatches` scheduled function
  - [ ] Implement `createPrivateMatch` function
  - [ ] Implement `joinPrivateMatch` function
  - [ ] Write unit tests for functions
  - [ ] Deploy functions to Firebase: `firebase deploy --only functions`

- [ ] **1.4 Frontend Dependencies**
  - [ ] Install `@react-native-firebase/functions`
  - [ ] Install `react-native-share`
  - [ ] Install `uuid`
  - [ ] Install `expo-linking` (Deep Linking)
  - [ ] Test imports and compatibility

- [ ] **1.5 Basic Realtime Sync**
  - [ ] Create `useRealtimeMatch` hook
  - [ ] Test Firestore listeners with Emulator
  - [ ] Implement optimistic updates
  - [ ] Handle connection loss scenarios

**Deliverables:**
- ✅ Firebase project upgraded
- ✅ Cloud Functions deployed
- ✅ Firestore schema live
- ✅ Security Rules active
- ✅ Realtime sync working in Emulator

**Testing:**
- [ ] Run all Cloud Functions locally with Emulator
- [ ] Test Security Rules deny unauthorized access
- [ ] Test Realtime Sync with 2 Emulator connections

---

### **Phase 2: Ranked Matchmaking & Core Gameplay (Week 3-5)**

**Goal:** Implement Ranked Match flow end-to-end

**Tasks:**
- [ ] **2.1 Matchmaking UI**
  - [ ] Create `DuoOnlineMenu.tsx` (Local vs Online selection)
  - [ ] Create `OnlinePlayMenu.tsx` (Ranked/Private/AI selection)
  - [ ] Create `RankedMatchmaking.tsx` (Searching animation)
  - [ ] Implement loading states (5-second countdown)
  - [ ] Add "Cancel Search" button

- [ ] **2.2 Matchmaking Logic**
  - [ ] Implement `useMatchmaking` hook
  - [ ] Call Cloud Function `matchmaking`
  - [ ] Handle opponent found vs AI fallback
  - [ ] Implement retry logic on function timeout

- [ ] **2.3 Online Game Board**
  - [ ] Create `OnlineGameBoard.tsx` (fork from `DuoGameBoard.tsx`)
  - [ ] Integrate `useRealtimeMatch` hook
  - [ ] Display opponent moves in real-time
  - [ ] Implement optimistic updates for own moves
  - [ ] Add connection status indicator

- [ ] **2.4 Game State Sync**
  - [ ] Sync player moves (cell value changes)
  - [ ] Sync player errors
  - [ ] Sync game completion
  - [ ] Handle simultaneous moves (conflict resolution)

- [ ] **2.5 Match Completion**
  - [ ] Create `RankedResults.tsx` screen
  - [ ] Display match result (Win/Loss)
  - [ ] Call `updateElo` Cloud Function
  - [ ] Display ELO change with animation
  - [ ] Save match to user's match history

- [ ] **2.6 ELO System**
  - [ ] Implement `useEloCalculation` hook
  - [ ] Calculate ELO changes client-side (preview)
  - [ ] Verify server-side calculation matches
  - [ ] Update user's `onlineStats` document

**Deliverables:**
- ✅ End-to-end Ranked Match flow working
- ✅ Matchmaking finds opponents or falls back to AI
- ✅ Real-time board synchronization
- ✅ ELO system correctly updating

**Testing:**
- [ ] Test matchmaking with 2 devices (find each other)
- [ ] Test matchmaking solo (fall back to AI after 5 sec)
- [ ] Test simultaneous moves (no conflicts)
- [ ] Test connection loss during match (graceful reconnect)
- [ ] Verify ELO calculations match expectations

---

### **Phase 3: Private Matches & Social Features (Week 6-7)**

**Goal:** Implement Private Match system with invite links

**Tasks:**
- [ ] **3.1 Deep Linking Setup**
  - [ ] Configure `app.json` for Universal Links (iOS)
  - [ ] Configure `app.json` for App Links (Android)
  - [ ] Test deep link: `sudokuduo://join/ABC123`
  - [ ] Test universal link: `https://sudokuduo.app/join/ABC123`

- [ ] **3.2 Private Match Creation**
  - [ ] Create `PrivateLobby.tsx` screen
  - [ ] Call `createPrivateMatch` Cloud Function
  - [ ] Generate invite code (6 characters)
  - [ ] Display invite code prominently

- [ ] **3.3 Invite Sharing**
  - [ ] Create `InviteShareSheet.tsx` component
  - [ ] Integrate `react-native-share`
  - [ ] Share message: "Spiele Sudoku Duo mit mir! [Link]"
  - [ ] Test sharing to WhatsApp, Telegram, Copy Link

- [ ] **3.4 Private Match Joining**
  - [ ] Create `PrivateJoin.tsx` screen
  - [ ] Handle deep link: Extract invite code from URL
  - [ ] Call `joinPrivateMatch` Cloud Function
  - [ ] Navigate to lobby (wait for host to start)

- [ ] **3.5 Lobby System**
  - [ ] Display "Waiting for player..." in lobby
  - [ ] Realtime update when guest joins
  - [ ] "Ready" button for both players
  - [ ] Start match when both ready
  - [ ] Add "Cancel" button for host

- [ ] **3.6 Private Game**
  - [ ] Fork `RankedGame.tsx` → `PrivateGame.tsx`
  - [ ] Same realtime sync as Ranked
  - [ ] Different stats tracking (no ELO)
  - [ ] Track "vs Friends" win/loss separately

**Deliverables:**
- ✅ Deep linking working on iOS & Android
- ✅ Invite links shareable via all messaging apps
- ✅ Private matches work end-to-end
- ✅ Lobby system with ready checks

**Testing:**
- [ ] Test deep link on iOS (tap link → opens app)
- [ ] Test deep link on Android (tap link → opens app)
- [ ] Test sharing to WhatsApp, SMS, Telegram
- [ ] Test joining from different device
- [ ] Test lobby with host cancel

---

### **Phase 4: AI Opponent & Adaptive Difficulty (Week 8-10)**

**Goal:** Implement intelligent AI opponent with adaptive difficulty

**Tasks:**
- [ ] **4.1 AI Algorithm Foundation**
  - [ ] Create `utils/ai/aiOpponent.ts`
  - [ ] Implement basic Sudoku solving algorithm
  - [ ] Implement move selection strategy
  - [ ] Add configurable speed multiplier

- [ ] **4.2 AI Move Generation**
  - [ ] Prioritize "easy" cells first (like humans)
  - [ ] Add realistic delays (2-5 seconds per move)
  - [ ] Implement random jitter (±20%)
  - [ ] Add occasional "thinking pauses" (5-8 sec)

- [ ] **4.3 AI Error Injection**
  - [ ] Implement error probability (0-15%)
  - [ ] Make errors look realistic (not random gibberish)
  - [ ] Correct errors after 1-2 moves (like humans)

- [ ] **4.4 Dynamic Difficulty Adjustment (DDA)**
  - [ ] Create `AIProfile` interface
  - [ ] Track user speed (cells/minute)
  - [ ] Track user error rate
  - [ ] Calculate target win rate (55-60%)

- [ ] **4.5 Adaptive Tuning**
  - [ ] If user win rate < 50%: Slow down AI, increase errors
  - [ ] If user win rate > 65%: Speed up AI, decrease errors
  - [ ] Update AI profile after each match
  - [ ] Persist AI profile in user document

- [ ] **4.6 AI Game Mode**
  - [ ] Create `AIGame.tsx` screen
  - [ ] Integrate `useAIOpponent` hook
  - [ ] Display AI moves with delay
  - [ ] Add "AI Personality" selector (optional)

- [ ] **4.7 AI Personality Variants**
  - [ ] **Methodical**: Slow, low errors
  - [ ] **Speedster**: Fast, more errors
  - [ ] **Balanced**: Default profile

**Deliverables:**
- ✅ AI opponent plays realistically
- ✅ AI adapts to user skill level
- ✅ User wins ~55-60% of matches
- ✅ AI indistinguishable from humans (no obvious patterns)

**Testing:**
- [ ] Test AI completes board correctly (no cheating)
- [ ] Test AI speed feels natural (not instant)
- [ ] Test AI makes realistic errors
- [ ] Play 20 matches → verify win rate ~55-60%
- [ ] Test DDA: Lose 5 in a row → AI should slow down

---

### **Phase 5: Stats, Achievements & Polish (Week 11-14)**

**Goal:** Implement stats dashboard, achievements, and final polish

**Tasks:**
- [ ] **5.1 Stats Dashboard**
  - [ ] Create `StatsOverview.tsx` screen
  - [ ] Display total matches, wins, losses, win rate
  - [ ] Display current ELO and rank
  - [ ] Display win streak, longest streak
  - [ ] Add charts (optional): Win rate over time

- [ ] **5.2 Match History**
  - [ ] Create `MatchHistory.tsx` screen
  - [ ] List last 20 matches
  - [ ] Show opponent, result, ELO change, duration
  - [ ] Filter: All / Ranked / Private / AI
  - [ ] Tap match → show details

- [ ] **5.3 Leaderboard**
  - [ ] Create `Leaderboard.tsx` screen
  - [ ] Fetch from `leaderboards/global`
  - [ ] Display top 100 players
  - [ ] Show rank, name, ELO, wins, win rate
  - [ ] Highlight user's position
  - [ ] Add "Monthly" and "Weekly" tabs (optional)

- [ ] **5.4 Achievements System**
  - [ ] Create `utils/achievements/achievementDefinitions.ts`
  - [ ] Define all achievements (see concept)
  - [ ] Implement achievement checker
  - [ ] Display achievement pop-up on unlock
  - [ ] Create `Achievements.tsx` screen (list all)

- [ ] **5.5 Achievement Tracking**
  - [ ] Track in Firestore: `users/{userId}/achievements`
  - [ ] Update after each match
  - [ ] Grant XP bonus for achievements

- [ ] **5.6 Anonymous User Support**
  - [ ] Generate temporary anonymous UID (UUID)
  - [ ] Create anonymous user document (temp stats)
  - [ ] Prompt after 3 matches: "Create account to save progress"
  - [ ] Implement account conversion flow

- [ ] **5.7 Internationalization (i18n)**
  - [ ] Add translations: `locales/de/duoOnline.json`
  - [ ] Add translations: `locales/en/duoOnline.json`
  - [ ] Add translations: `locales/hi/duoOnline.json`
  - [ ] Translate all new screens and messages

- [ ] **5.8 Performance Optimization**
  - [ ] Optimize Firestore reads (use caching)
  - [ ] Reduce unnecessary re-renders
  - [ ] Lazy-load match history (pagination)
  - [ ] Compress game state documents

- [ ] **5.9 Error Handling**
  - [ ] Handle connection loss during match
  - [ ] Handle opponent disconnect (forfeit after 2 min)
  - [ ] Handle Cloud Function errors (retry)
  - [ ] Display user-friendly error messages

- [ ] **5.10 Final Polish**
  - [ ] Add animations (ELO change, win/loss)
  - [ ] Add sound effects (opponent move, match found)
  - [ ] Improve loading states
  - [ ] Add haptic feedback
  - [ ] Final UI/UX review

**Deliverables:**
- ✅ Stats dashboard fully functional
- ✅ Achievements system working
- ✅ Anonymous users supported
- ✅ All screens translated (DE, EN, HI)
- ✅ Performance optimized
- ✅ Error handling comprehensive

**Testing:**
- [ ] Test stats update correctly after each match
- [ ] Test achievements unlock on trigger
- [ ] Test anonymous user flow (3 matches → prompt)
- [ ] Test account conversion (anonymous → auth)
- [ ] Test all error scenarios (disconnect, timeout, etc.)
- [ ] Performance test: Load 100 matches in history

---

## 🧪 Testing Strategy

### **Unit Tests (Jest)**

**Target Coverage:** > 80%

```typescript
// Example: Test ELO Calculation
describe('calculateEloChange', () => {
  test('equal ratings, winner gains ~16 ELO', () => {
    const change = calculateEloChange(1000, 1000, true, 32);
    expect(change).toBe(16);
  });

  test('underdog wins, large ELO gain', () => {
    const change = calculateEloChange(800, 1200, true, 32);
    expect(change).toBeGreaterThan(25);
  });

  test('favorite loses, large ELO loss', () => {
    const change = calculateEloChange(1200, 800, false, 32);
    expect(change).toBeLessThan(-25);
  });
});
```

**Test Files:**
- [ ] `utils/ai/aiOpponent.test.ts`
- [ ] `utils/elo/calculateElo.test.ts`
- [ ] `utils/achievements/checker.test.ts`
- [ ] `hooks/useRealtimeMatch.test.ts`
- [ ] `hooks/useMatchmaking.test.ts`

---

### **Integration Tests**

**Focus:** Firestore interactions, Cloud Functions

```typescript
// Example: Test Matchmaking Flow
describe('Matchmaking Integration', () => {
  test('creates AI match after 5 seconds', async () => {
    const result = await functions().httpsCallable('matchmaking')({
      type: 'ranked',
      difficulty: 'medium',
      elo: 1000
    });

    expect(result.data.success).toBe(true);
    expect(result.data.opponent.isAI).toBe(true);
  });
});
```

**Test Suites:**
- [ ] Matchmaking (find opponent, fallback to AI)
- [ ] Private Match (create, join, start)
- [ ] ELO Update (transaction, correct calculation)
- [ ] Realtime Sync (moves, completion)

---

### **End-to-End Tests (Detox)**

**Critical User Flows:**

1. **Ranked Match Flow**
   - User taps "Ranked Match"
   - Matchmaking finds opponent (or AI after 5 sec)
   - Game starts
   - User makes moves
   - Game completes
   - ELO updates
   - Stats update

2. **Private Match Flow**
   - User taps "Create Private Match"
   - Lobby screen opens
   - User shares invite link
   - Guest joins via deep link
   - Both players ready up
   - Game starts
   - Match completes
   - No ELO change (private match)

3. **AI Match Flow**
   - User taps "VS AI"
   - Game starts immediately
   - AI makes realistic moves
   - User wins (verify ~55-60% win rate over 20 matches)
   - Stats update (separate AI win counter)

**Detox Test Files:**
- [ ] `e2e/rankedMatch.test.ts`
- [ ] `e2e/privateMatch.test.ts`
- [ ] `e2e/aiMatch.test.ts`

---

### **Manual Testing Checklist**

**Pre-Release QA:**

- [ ] **Matchmaking**
  - [ ] Finds real opponent when available
  - [ ] Falls back to AI after 5 seconds
  - [ ] Cancel search works
  - [ ] Handles function timeout gracefully

- [ ] **Realtime Sync**
  - [ ] Opponent moves appear instantly (< 500ms)
  - [ ] Simultaneous moves don't conflict
  - [ ] Connection loss shows indicator
  - [ ] Reconnect resumes game correctly

- [ ] **Private Matches**
  - [ ] Deep link works on iOS
  - [ ] Deep link works on Android
  - [ ] Share to WhatsApp/Telegram works
  - [ ] Lobby updates when guest joins
  - [ ] Ready system works

- [ ] **AI Opponent**
  - [ ] Moves feel natural (not instant)
  - [ ] Makes realistic errors
  - [ ] Win rate ~55-60% after 10 matches
  - [ ] Adapts to user skill (play poorly → AI slows down)

- [ ] **Stats & Achievements**
  - [ ] Stats update after each match
  - [ ] ELO changes correctly
  - [ ] Achievements unlock on trigger
  - [ ] Match history shows correct data

- [ ] **Anonymous Users**
  - [ ] Can play without account
  - [ ] Prompt appears after 3 matches
  - [ ] Account conversion works
  - [ ] Stats transfer correctly

- [ ] **Edge Cases**
  - [ ] Opponent disconnects (forfeit after 2 min)
  - [ ] App backgrounded during match (reconnect)
  - [ ] No internet during matchmaking (error message)
  - [ ] Invalid invite code (error message)

---

## 🚀 Deployment

### **Pre-Deployment Checklist**

- [ ] **Code Quality**
  - [ ] All TypeScript errors fixed
  - [ ] All ESLint warnings addressed
  - [ ] Code review completed
  - [ ] Git commit history clean

- [ ] **Testing**
  - [ ] All unit tests passing (> 80% coverage)
  - [ ] All integration tests passing
  - [ ] E2E tests passing
  - [ ] Manual QA completed

- [ ] **Firebase**
  - [ ] Firestore Indexes created
  - [ ] Security Rules deployed
  - [ ] Cloud Functions deployed
  - [ ] Production API keys configured

- [ ] **App Configuration**
  - [ ] Deep linking configured (iOS & Android)
  - [ ] App Store / Play Store metadata updated
  - [ ] Privacy Policy updated (mention online play)
  - [ ] Terms of Service updated

---

### **Deployment Steps**

#### **1. Deploy Cloud Functions**

```bash
# 1. Test locally with emulators
firebase emulators:start

# 2. Deploy to production
firebase deploy --only functions

# 3. Verify deployment
firebase functions:log --only matchmaking
```

#### **2. Deploy Firestore Rules & Indexes**

```bash
# Deploy Security Rules
firebase deploy --only firestore:rules

# Deploy Indexes
firebase deploy --only firestore:indexes

# Verify in Firebase Console
# → Firestore → Rules
# → Firestore → Indexes
```

#### **3. Build & Deploy App**

```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

#### **4. Gradual Rollout**

- [ ] **Day 1**: 5% of users (Beta testers)
- [ ] **Day 3**: 25% of users
- [ ] **Day 7**: 50% of users
- [ ] **Day 14**: 100% of users

Monitor metrics at each stage:
- Crash rate
- Match success rate
- ELO distribution
- User feedback

---

### **Rollback Plan**

If critical issues occur:

1. **Immediate Actions:**
   - Disable online mode via Feature Flag (if implemented)
   - OR: Deploy hotfix build removing online mode
   - Notify users via in-app message

2. **Revert Backend:**
   ```bash
   # List previous function deployments
   firebase functions:log

   # Rollback to previous version
   firebase deploy --only functions --force
   ```

3. **Data Cleanup:**
   - Run cleanup Cloud Function manually
   - Check for orphaned match documents
   - Verify ELO calculations

---

## 📊 Monitoring & Analytics

### **Firebase Analytics Events**

**Custom Events to Track:**

```typescript
// Matchmaking
analytics().logEvent('matchmaking_started', {
  type: 'ranked' | 'private' | 'ai',
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
});

analytics().logEvent('matchmaking_completed', {
  duration_seconds: number,
  found_opponent: boolean,  // true = human, false = AI
  elo: number
});

// Match
analytics().logEvent('match_started', {
  type: 'ranked' | 'private' | 'ai',
  opponent_is_ai: boolean
});

analytics().logEvent('match_completed', {
  result: 'win' | 'loss' | 'tie',
  duration_seconds: number,
  elo_change: number,
  errors: number
});

// Social
analytics().logEvent('private_match_created', {
  invite_code: string
});

analytics().logEvent('private_match_joined', {
  invite_code: string,
  source: 'deeplink' | 'manual_code'
});

analytics().logEvent('invite_shared', {
  method: 'whatsapp' | 'telegram' | 'copy' | 'other'
});

// Achievements
analytics().logEvent('achievement_unlocked', {
  achievement_id: string,
  achievement_name: string
});

// Anonymous Conversion
analytics().logEvent('anonymous_to_auth_prompted', {
  matches_played: number
});

analytics().logEvent('anonymous_to_auth_converted', {
  method: 'google' | 'apple'
});
```

---

### **Key Metrics Dashboard**

**Firebase Console → Analytics**

1. **Engagement Metrics**
   - Daily Active Users (DAU)
   - Average Session Length
   - Matches per User per Day
   - Retention (Day 1, Day 7, Day 30)

2. **Matchmaking Metrics**
   - Average Matchmaking Duration
   - Human vs AI Match Ratio
   - Matchmaking Success Rate (found opponent)
   - Matchmaking Cancellation Rate

3. **Match Metrics**
   - Average Match Duration
   - Match Completion Rate (vs abandonment)
   - Average Errors per Match
   - Win Rate Distribution (should cluster around 50%)

4. **Social Metrics**
   - Private Matches Created
   - Private Matches Joined (via invite)
   - Invite Shares (by platform)
   - Invite Conversion Rate

5. **Monetization Potential**
   - Anonymous → Auth Conversion Rate
   - Average Matches Before Conversion
   - User Lifetime Value (proxy)

---

### **Alerting & Monitoring**

**Firebase Performance Monitoring:**
- [ ] Network request latency (Firestore writes)
- [ ] Cloud Function execution time
- [ ] App startup time (with online features)

**Firebase Crashlytics:**
- [ ] Monitor crash rate (target: < 1%)
- [ ] Fatal errors during matchmaking
- [ ] Errors during realtime sync

**Custom Alerts (Cloud Monitoring):**
```yaml
# Alert if matchmaking fails > 10% of the time
- name: high_matchmaking_failure_rate
  condition: failure_rate > 0.10
  notification: email + slack

# Alert if ELO calculation errors
- name: elo_update_errors
  condition: function_errors(updateElo) > 5/hour
  notification: email + pagerduty

# Alert if match abandonment rate high
- name: high_abandonment_rate
  condition: abandonment_rate > 0.30
  notification: email
```

---

## ⚠️ Known Issues & TODOs

### **Known Limitations**

1. **Firestore Latency**
   - Typ: ~100-200ms for writes
   - Impact: Slight delay before opponent sees move
   - Mitigation: Optimistic updates, "Sending..." indicator

2. **Matchmaking Cold Start**
   - Cloud Functions cold start: ~3-5 seconds
   - Impact: First matchmaking request slower
   - Mitigation: Keep-alive pings (optional)

3. **Anonymous User Data Loss**
   - Anonymous match history expires after 24h (Firestore TTL)
   - Impact: Lost history if user doesn't convert
   - Mitigation: Warn user, incentivize conversion

4. **ELO Inflation (AI Matches)**
   - If users only play AI, ELO could inflate
   - Impact: Ranking system less accurate
   - Mitigation: Separate ELO pools? Decay system?

---

### **Future Enhancements (Post-Launch)**

**Tier 2 Features:**
- [ ] Spectator Mode (watch friends play)
- [ ] Tournaments (bracket-style, 8-16 players)
- [ ] Voice Chat (Agora/Twilio integration)
- [ ] Replay System (watch past matches)
- [ ] Custom Boards (user-generated puzzles)
- [ ] Team Battles (2v2?)
- [ ] Seasonal Rankings (reset every 3 months)
- [ ] Push Notifications (match found, friend online)

**Tier 3 Features:**
- [ ] Twitch/YouTube Streaming Integration
- [ ] Esports Events (live tournaments)
- [ ] Coaching System (high-ELO players can coach)
- [ ] Clan/Guild System

---

## 📚 Appendix

### **A. Useful Resources**

- **Firebase Docs**: https://firebase.google.com/docs
- **React Native Firebase**: https://rnfirebase.io
- **ELO Rating System**: https://en.wikipedia.org/wiki/Elo_rating_system
- **Deep Linking (Expo)**: https://docs.expo.dev/guides/linking/

---

### **B. Glossary**

- **ELO**: Rating system for competitive matches
- **Matchmaking**: Process of finding a suitable opponent
- **DDA**: Dynamic Difficulty Adjustment (adaptive AI)
- **Firestore**: NoSQL cloud database
- **Cloud Functions**: Serverless backend functions
- **Deep Link**: URL that opens app directly
- **Optimistic Update**: Update UI before server confirms

---

### **C. Contact & Support**

**Development Team:**
- Lead Developer: [Your Name]
- Backend: Firebase
- Frontend: React Native + Expo

**Questions?**
- Email: support@sudokuduo.app
- GitHub Issues: https://github.com/yourusername/sudoku-duo/issues

---

**Last Updated:** 2025-01-20
**Next Review:** After Phase 1 completion
**Version:** 1.0
