# 🏗️ Sudoku Duo Online Multiplayer - Technical Architecture

**Version:** 1.0
**Last Updated:** 2025-01-20
**Status:** Planning Phase Complete

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Flow Diagrams](#2-data-flow-diagrams)
3. [State Management Strategy](#3-state-management-strategy)
4. [Real-Time Synchronization](#4-real-time-synchronization)
5. [Offline-First Design](#5-offline-first-design)
6. [Adaptive AI Algorithm](#6-adaptive-ai-algorithm)
7. [ELO Rating System](#7-elo-rating-system)
8. [Matchmaking Algorithm](#8-matchmaking-algorithm)
9. [Deep Linking & Invitations](#9-deep-linking--invitations)
10. [Security Architecture](#10-security-architecture)
11. [Performance Optimization](#11-performance-optimization)
12. [Error Handling & Recovery](#12-error-handling--recovery)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Native App (Expo)                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │  │
│  │  │  UI Layer  │  │  Context   │  │  Custom Hooks   │    │  │
│  │  │ Components │←→│  Providers │←→│  useRealtime... │    │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘    │  │
│  │         ↓               ↓                  ↓              │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         Firebase SDK (Local Cache + Sync)          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / WebSocket
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Firebase Backend                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   Firestore DB   │  │ Cloud Functions  │  │  Firebase    │  │
│  │                  │  │                  │  │     Auth     │  │
│  │  • users/        │  │  • matchmaking   │  │              │  │
│  │  • matches/      │←→│  • updateElo     │←→│ • Google     │  │
│  │  • matchmaking/  │  │  • createPrivate │  │ • Apple      │  │
│  │  • leaderboards/ │  │  • joinPrivate   │  │ • Anonymous  │  │
│  │                  │  │  • cleanupOld    │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Architecture

```
App Root (_layout.tsx)
│
├─── Providers (Nested Order)
│    ├─ GestureHandlerRootView
│    ├─ SafeAreaProvider
│    ├─ I18nProvider
│    ├─ ThemeProvider
│    ├─ ColorProvider
│    ├─ BackgroundMusicProvider
│    ├─ NavigationProvider
│    ├─ AuthProvider ⭐ NEW
│    ├─ BottomSheetModalProvider
│    └─ AlertProvider
│
├─── Routes (Expo Router)
│    ├─ /index (Start Screen)
│    ├─ /game (Single Player)
│    ├─ /duo (Local Duo)
│    │
│    ├─ /duo-online ⭐ NEW (Online Menu)
│    │   ├─ /ranked-match ⭐ NEW
│    │   ├─ /private-match ⭐ NEW
│    │   └─ /ai-match ⭐ NEW
│    │
│    ├─ /settings
│    ├─ /leistung (Stats)
│    └─ /gallery
│
└─── Bottom Navigation
```

### 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native + Expo | Cross-platform mobile app |
| **UI Framework** | React Native Elements | Component library |
| **Navigation** | Expo Router | File-based routing |
| **State Management** | React Context API | Global state |
| **Backend** | Firebase Cloud Functions | Serverless compute |
| **Database** | Firestore | NoSQL document database |
| **Authentication** | Firebase Auth | User management |
| **Real-Time** | Firestore Listeners | Live data sync |
| **Deep Linking** | Expo Linking | Invite URLs |
| **AI** | Custom Algorithm | Adaptive opponent |
| **Ranking** | ELO Rating | Competitive balance |

---

## 2. Data Flow Diagrams

### 2.1 Ranked Matchmaking Flow

```
User Action                Client                  Firestore              Cloud Function
─────────────────────────────────────────────────────────────────────────────────────
    │
    ├─ Tap "Ranked Match"
    │                          │
    │                          ├─ Call matchmaking()
    │                          │   with (difficulty, elo)
    │                          │                              │
    │                          │                              ├─ Search for opponent
    │                          │                              │   (±200 ELO range)
    │                          │                              │
    │                          │                              ├─ If found: Create match
    │                          │                              │   Write to matches/
    │                          │                              │             │
    │                          │  ←── matchId + opponent ─────┤             │
    │                          │                                            │
    │                          ├─ Listen to matches/{matchId} ─────────────→│
    │  ←─ Navigate to Game ───┤                                            │
    │                          │                                            │
    │  [During Game]           │                                            │
    │                          │                                            │
    ├─ Make Move (4, 5) = 7   │                                            │
    │                          │                                            │
    │                          ├─ Optimistic Update (instant UI)           │
    │                          │                                            │
    │                          ├─ Write to Firestore ──────────────────────→│
    │                          │   gameState.player1Moves.push(...)         │
    │                          │                                            │
    │                          │  ←── Real-time Update ─────────────────────┤
    │                          │   (opponent's move)                        │
    │  ←─ Update Opponent ─────┤                                            │
    │                          │                                            │
    │  [Game Complete]         │                                            │
    │                          │                                            │
    ├─ Last Cell Filled       │                                            │
    │                          │                                            │
    │                          ├─ Call updateElo()
    │                          │   with (matchId, winner)
    │                          │                              │
    │                          │                              ├─ Calculate ELO change
    │                          │                              │   (K-Factor = 32)
    │                          │                              │
    │                          │                              ├─ Update users/{uid}
    │                          │                              │   onlineStats.elo
    │                          │                              │             │
    │                          │  ←── eloChange ──────────────┤             │
    │                          │                                            │
    │  ←─ Show Results ────────┤                                            │
    │     (+24 ELO)            │                                            │
```

### 2.2 Private Match Flow

```
Host Device                  Guest Device              Firestore         Cloud Function
──────────────────────────────────────────────────────────────────────────────────────
    │
    ├─ Create Private Match
    │       │
    │       ├─ Call createPrivateMatch()
    │       │                                               │
    │       │                                               ├─ Generate matchCode (6 chars)
    │       │                                               │   Create match document
    │       │                                               │   status = 'lobby'
    │       │                                               │             │
    │       │  ←── matchCode: "ABC123" ────────────────────┤             │
    │       │                                                             │
    │       ├─ Generate invite URL:                                      │
    │       │   sudokuduo://join/ABC123                                  │
    │       │                                                             │
    │       ├─ Share via WhatsApp/Messenger                              │
    │       │   (react-native-share)                                     │
    │       │                               │                            │
    │       │                               ├─ Receive Link              │
    │       │                               │                            │
    │       │                               ├─ Deep Link Handled         │
    │       │                               │   (expo-linking)           │
    │       │                               │                            │
    │       │                               ├─ Extract code: "ABC123"    │
    │       │                               │                            │
    │       │                               ├─ Call joinPrivateMatch()
    │       │                               │   with (matchCode)
    │       │                               │                      │
    │       │                               │                      ├─ Find match by code
    │       │                               │                      │   Update players[]
    │       │                               │                      │   status = 'active'
    │       │                               │                      │             │
    │       │  ←─── Real-time Update ───────┼──────────────────────┼─────────────┤
    │       │   (Guest joined)              │                                    │
    │       │                               │  ←── Success ───────────────────────┤
    │       │                               │                                    │
    ├─ Navigate to Game                    ├─ Navigate to Game                  │
    │       │                               │                                    │
    │       ├───────────────── Both players in game ──────────────→             │
    │       │                               │                                    │
    │       ├─────────────── Real-time sync via Firestore ────────→             │
    │       │                               │                                    │
```

### 2.3 AI Opponent Flow

```
User                    Client                     AI Worker               Firestore
────────────────────────────────────────────────────────────────────────────────────
  │
  ├─ Select "Play vs AI"
  │                        │
  │                        ├─ Create AI match locally
  │                        │   (no Cloud Function needed)
  │                        │
  │                        ├─ Initialize AI Profile
  │                        │   • Load user's avgSpeed
  │                        │   • Load user's avgErrors
  │                        │   • Set speedMultiplier = 1.0
  │                        │   • Set errorProbability = 5%
  │                        │                │
  │  [Game Running]        │                │
  │                        │                │
  ├─ User makes move      │                │
  │   (4, 5) = 7          │                │
  │                        │                │
  │                        ├─ Trigger AI turn after 500ms delay
  │                        │                │
  │                        │                ├─ Analyze board
  │                        │                │   Find solvable cells
  │                        │                │
  │                        │                ├─ Sort by difficulty
  │                        │                │   (cells with 1 option = easy)
  │                        │                │
  │                        │                ├─ Select cell
  │                        │                │   • 70% easy cells
  │                        │                │   • 20% medium cells
  │                        │                │   • 10% hard cells
  │                        │                │
  │                        │                ├─ Calculate delay
  │                        │                │   delay = baseCellTime *
  │                        │                │           speedMultiplier *
  │                        │                │           cellDifficulty
  │                        │                │
  │                        │                ├─ Inject error?
  │                        │                │   Math.random() < errorProb
  │                        │                │
  │                        │  ←─ AI Move ──┤
  │                        │   (2, 3) = 9
  │                        │   after 1800ms
  │                        │
  │  ←─ Update Board ─────┤
  │                        │
  │  [Game Complete]       │
  │                        │
  ├─ User wins             │
  │                        │                ├─ Adjust Difficulty
  │                        │                │   speedMultiplier += 0.05
  │                        │                │   errorProbability += 1%
  │                        │                │
  │                        ├─ Save AI profile to AsyncStorage
  │                        │   (for next game)
```

---

## 3. State Management Strategy

### 3.1 State Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Global State (Context)                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   Theme    │  │    Auth    │  │   Navigation State  │   │
│  │  Provider  │  │  Provider  │  │      Provider       │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│                                                              │
│  Persisted: AsyncStorage                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Firestore-Synced State (Real-Time)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              useRealtimeMatch Hook                    │  │
│  │                                                        │  │
│  │  const [matchState, setMatchState] = useState(null);  │  │
│  │                                                        │  │
│  │  useEffect(() => {                                    │  │
│  │    const unsubscribe = firestore()                    │  │
│  │      .collection('matches')                           │  │
│  │      .doc(matchId)                                    │  │
│  │      .onSnapshot((snap) => {                          │  │
│  │        setMatchState(snap.data());                    │  │
│  │      });                                              │  │
│  │    return () => unsubscribe();                        │  │
│  │  }, [matchId]);                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Persisted: Firestore Offline Cache                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               Local Component State (Ephemeral)             │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │  Selected  │  │   Modal    │  │   Animation State   │   │
│  │    Cell    │  │   Visible  │  │                     │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│                                                              │
│  Lifecycle: Component Mount → Unmount                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 State Update Patterns

#### Pattern 1: Optimistic Update (Online Moves)

```typescript
const makeMove = async (row: number, col: number, value: number) => {
  // 1. Optimistic Update (Instant UI)
  setMatchState(prev => ({
    ...prev,
    gameState: {
      ...prev.gameState,
      player1Moves: [...prev.gameState.player1Moves, { row, col, value, timestamp: Date.now() }]
    }
  }));

  try {
    // 2. Write to Firestore
    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        'gameState.player1Moves': firestore.FieldValue.arrayUnion({
          row, col, value, timestamp: Date.now()
        })
      });

    // 3. Real-time listener will confirm the update
    //    (no action needed - onSnapshot handles it)
  } catch (error) {
    // 4. Rollback on error
    console.error('Move failed:', error);
    setMatchState(prev => ({
      ...prev,
      gameState: {
        ...prev.gameState,
        player1Moves: prev.gameState.player1Moves.slice(0, -1)
      }
    }));

    // Show error to user
    showAlert('Connection Error', 'Failed to sync move. Check internet connection.');
  }
};
```

#### Pattern 2: Server-Authoritative Update (ELO Changes)

```typescript
const completeMatch = async (winner: 1 | 2) => {
  try {
    // 1. Call Cloud Function (server calculates ELO)
    const result = await functions().httpsCallable('updateElo')({
      matchId,
      winner
    });

    // 2. Server responds with calculated changes
    const { player1EloChange, player2EloChange, newElos } = result.data;

    // 3. Update UI with server values (NOT client calculation)
    setMatchResult({
      winner,
      eloChange: winner === 1 ? player1EloChange : player2EloChange,
      newElo: winner === 1 ? newElos.player1 : newElos.player2
    });

    // 4. Navigate to results screen
    router.push({
      pathname: '/duo-online/results',
      params: { matchId }
    });
  } catch (error) {
    console.error('Failed to update ELO:', error);
    // Handle error gracefully
  }
};
```

---

## 4. Real-Time Synchronization

### 4.1 Firestore Listener Lifecycle

```typescript
// hooks/useRealtimeMatch.ts
export const useRealtimeMatch = (matchId: string | null) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    console.log('[useRealtimeMatch] Setting up listener for:', matchId);

    // Setup Firestore listener
    const unsubscribe = firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(
        (snapshot) => {
          // Success handler
          if (snapshot.exists) {
            const data = snapshot.data() as MatchState;
            console.log('[useRealtimeMatch] Received update:', data.gameState);
            setMatchState(data);
            setIsConnected(true);
            setError(null);
          } else {
            console.warn('[useRealtimeMatch] Match not found:', matchId);
            setError('Match not found');
          }
        },
        (err) => {
          // Error handler
          console.error('[useRealtimeMatch] Snapshot error:', err);
          setIsConnected(false);
          setError(err.message);
        }
      );

    // Cleanup on unmount
    return () => {
      console.log('[useRealtimeMatch] Cleaning up listener');
      unsubscribe();
    };
  }, [matchId]);

  return { matchState, isConnected, error };
};
```

### 4.2 Conflict Resolution Strategy

Sudoku Duo is a **conflict-free game** because:
- Each cell can only be filled **once**
- Players have **separate zones** (top half vs bottom half, center cell always pre-filled)
- Moves are **append-only** (no deletion/editing)

**Conflict Scenario:** Both players try to fill the same cell simultaneously (edge case)

**Resolution:**
```typescript
// Security Rules handle this:
match /matches/{matchId} {
  allow update: if (
    // Cell must be empty (value = 0)
    request.resource.data.gameState.board[row][col] == 0 &&

    // Cell must be in player's zone
    isInPlayerZone(request.auth.uid, row)
  );
}
```

If both players somehow write simultaneously, **Firestore's last-write-wins** handles it. The losing player's `onSnapshot` will receive the corrected state within 100-200ms.

### 4.3 Latency Optimization

**Problem:** Firestore listeners have 100-200ms latency.

**Solution:** Optimistic Updates

```typescript
// User taps cell (4, 5) and enters 7
const handleCellInput = async (row: number, col: number, value: number) => {
  // ⚡ INSTANT (0ms) - Update UI immediately
  setLocalBoard(prev => updateCell(prev, row, col, value));

  // 🔄 ASYNC (100-200ms) - Sync to Firestore
  await syncMoveToFirestore(row, col, value);

  // ✅ CONFIRMED (200-400ms) - Real-time listener confirms
  // (useRealtimeMatch hook receives update)
};
```

**User Experience:**
- User sees their move **instantly** (0ms)
- Opponent's move appears in **100-200ms** (acceptable for turn-based game)
- Network errors trigger rollback with user feedback

---

## 5. Offline-First Design

### 5.1 Firestore Offline Persistence

```typescript
// utils/cloudSync/firebaseConfig.ts
import firestore from '@react-native-firebase/firestore';

// Enable offline persistence (already configured)
firestore().settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});
```

**Behavior:**
- All Firestore data is cached locally
- Writes succeed immediately (queued if offline)
- Reads return cached data if available
- Automatic sync when connection restored

### 5.2 Offline State Handling

```typescript
// hooks/useOnlineStatus.ts
import NetInfo from '@react-native-community/netinfo';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};

// Usage in component:
const OnlineGameBoard = () => {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <OfflineBanner message="No internet connection. Moves will sync when reconnected." />;
  }

  return <GameBoard />;
};
```

### 5.3 Queued Writes

```
User                   Firestore SDK              Firestore Server
───────────────────────────────────────────────────────────────────
  │
  ├─ Make move (4, 5) = 7
  │         │
  │         ├─ Write to cache ✅
  │         ├─ Queue for sync 📝
  │         │
  │  ←── UI updates immediately
  │
  │  [Internet disconnected]
  │
  ├─ Make move (3, 2) = 4
  │         │
  │         ├─ Write to cache ✅
  │         ├─ Queue for sync 📝
  │         │
  │  ←── UI updates immediately
  │
  │  [Internet reconnected]
  │         │
  │         ├─ Auto-sync queued writes ──────→ Server processes
  │         │                                       │
  │         │  ←─── Confirmation ───────────────────┤
  │         │
  │  ←── "Synced" indicator
```

---

## 6. Adaptive AI Algorithm

### 6.1 AI Difficulty Profile

```typescript
interface AIProfile {
  // Performance Tracking
  userAvgSpeed: number;        // Average seconds per cell (user)
  userAvgErrors: number;       // Average errors per game (user)
  userWinRate: number;         // Win rate vs AI (0.0 - 1.0)
  gamesPlayed: number;         // Total AI games played

  // Dynamic Adjustments
  speedMultiplier: number;     // 0.5 = 2x faster, 1.5 = 0.67x speed
  errorProbability: number;    // 0.0 - 0.15 (0% - 15% chance)

  // Personality (optional future feature)
  personality: 'cautious' | 'balanced' | 'aggressive';
}
```

### 6.2 Move Selection Algorithm

```typescript
// utils/ai/aiOpponent.ts

/**
 * Selects next AI move based on difficulty profile
 */
export const selectAIMove = (
  board: number[][],
  solution: number[][],
  profile: AIProfile
): { row: number; col: number; value: number; isError: boolean } => {
  // 1. Find all solvable cells
  const solvableCells = findSolvableCells(board, solution);

  // 2. Categorize by difficulty
  const easyCells = solvableCells.filter(cell => cell.candidateCount === 1);
  const mediumCells = solvableCells.filter(cell => cell.candidateCount >= 2 && cell.candidateCount <= 4);
  const hardCells = solvableCells.filter(cell => cell.candidateCount >= 5);

  // 3. Select cell based on distribution
  let selectedCell: Cell;
  const rand = Math.random();

  if (rand < 0.7 && easyCells.length > 0) {
    // 70% of time: Pick easy cell
    selectedCell = easyCells[Math.floor(Math.random() * easyCells.length)];
  } else if (rand < 0.9 && mediumCells.length > 0) {
    // 20% of time: Pick medium cell
    selectedCell = mediumCells[Math.floor(Math.random() * mediumCells.length)];
  } else if (hardCells.length > 0) {
    // 10% of time: Pick hard cell
    selectedCell = hardCells[Math.floor(Math.random() * hardCells.length)];
  } else {
    // Fallback: Any available cell
    selectedCell = solvableCells[Math.floor(Math.random() * solvableCells.length)];
  }

  // 4. Determine if AI makes error
  const willMakeError = Math.random() < profile.errorProbability;

  let value: number;
  if (willMakeError) {
    // Pick wrong value from candidates
    const wrongCandidates = selectedCell.candidates.filter(
      v => v !== solution[selectedCell.row][selectedCell.col]
    );
    value = wrongCandidates[Math.floor(Math.random() * wrongCandidates.length)];
  } else {
    // Pick correct value
    value = solution[selectedCell.row][selectedCell.col];
  }

  return {
    row: selectedCell.row,
    col: selectedCell.col,
    value,
    isError: willMakeError
  };
};
```

### 6.3 Timing Calculation

```typescript
/**
 * Calculates realistic delay before AI makes move
 */
export const calculateAIDelay = (
  cellDifficulty: 'easy' | 'medium' | 'hard',
  profile: AIProfile
): number => {
  // Base time per cell difficulty
  const baseTimes = {
    easy: 1500,    // 1.5 seconds
    medium: 3000,  // 3 seconds
    hard: 5000     // 5 seconds
  };

  const baseTime = baseTimes[cellDifficulty];

  // Apply speed multiplier (0.5 = faster, 1.5 = slower)
  const adjustedTime = baseTime * profile.speedMultiplier;

  // Add random variance (±20%)
  const variance = adjustedTime * 0.2;
  const randomOffset = (Math.random() - 0.5) * 2 * variance;

  const finalDelay = Math.max(500, adjustedTime + randomOffset); // Min 500ms

  return Math.round(finalDelay);
};
```

### 6.4 Dynamic Difficulty Adjustment (DDA)

```typescript
/**
 * Adjusts AI difficulty after each game to maintain ~55-60% user win rate
 */
export const adjustAIDifficulty = (
  profile: AIProfile,
  userWon: boolean
): AIProfile => {
  const targetWinRate = 0.575; // 57.5% (middle of 55-60%)
  const learningRate = 0.05;   // How quickly to adjust

  // Update stats
  const newGamesPlayed = profile.gamesPlayed + 1;
  const newWinRate = (profile.userWinRate * profile.gamesPlayed + (userWon ? 1 : 0)) / newGamesPlayed;

  // Calculate adjustment direction
  const winRateDiff = newWinRate - targetWinRate;

  let newSpeedMultiplier = profile.speedMultiplier;
  let newErrorProbability = profile.errorProbability;

  if (winRateDiff > 0.1) {
    // User winning too much (>65%) → Make AI harder
    newSpeedMultiplier = Math.max(0.5, profile.speedMultiplier - learningRate);
    newErrorProbability = Math.max(0, profile.errorProbability - 0.01);
  } else if (winRateDiff < -0.1) {
    // User losing too much (<45%) → Make AI easier
    newSpeedMultiplier = Math.min(1.5, profile.speedMultiplier + learningRate);
    newErrorProbability = Math.min(0.15, profile.errorProbability + 0.01);
  }
  // Else: Win rate is within target range (45-65%) → No adjustment

  return {
    ...profile,
    userWinRate: newWinRate,
    gamesPlayed: newGamesPlayed,
    speedMultiplier: newSpeedMultiplier,
    errorProbability: newErrorProbability
  };
};
```

### 6.5 AI Execution Loop

```typescript
// hooks/useAIOpponent.ts
export const useAIOpponent = (
  board: number[][],
  solution: number[][],
  isAITurn: boolean,
  profile: AIProfile
) => {
  const [aiMove, setAIMove] = useState<AIMove | null>(null);

  useEffect(() => {
    if (!isAITurn) return;

    // Select move
    const move = selectAIMove(board, solution, profile);

    // Calculate delay
    const delay = calculateAIDelay(
      getCellDifficulty(move.candidates.length),
      profile
    );

    // Execute after delay
    const timer = setTimeout(() => {
      setAIMove(move);
    }, delay);

    return () => clearTimeout(timer);
  }, [isAITurn, board]);

  return aiMove;
};
```

---

## 7. ELO Rating System

### 7.1 ELO Calculation Formula

```typescript
/**
 * Calculates ELO change using standard formula
 *
 * Formula: ΔR = K × (S - E)
 * Where:
 *   ΔR = Rating change
 *   K  = K-Factor (maximum change, default 32)
 *   S  = Actual Score (1 for win, 0 for loss)
 *   E  = Expected Score (probability of winning)
 *
 * Expected Score: E = 1 / (1 + 10^((R_opponent - R_player) / 400))
 */
export const calculateEloChange = (
  playerRating: number,
  opponentRating: number,
  won: boolean,
  kFactor: number = 32
): number => {
  // Calculate expected score (probability of winning)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  // Actual score
  const actualScore = won ? 1 : 0;

  // Calculate change
  const change = kFactor * (actualScore - expectedScore);

  // Round and cap at ±50
  return Math.max(-50, Math.min(50, Math.round(change)));
};
```

### 7.2 ELO Examples

| Player ELO | Opponent ELO | Win? | Expected Score | Actual Score | Change |
|-----------|-------------|------|----------------|--------------|--------|
| 1500 | 1500 | ✅ Yes | 0.50 | 1.0 | **+16** |
| 1500 | 1500 | ❌ No | 0.50 | 0.0 | **-16** |
| 1500 | 1700 | ✅ Yes | 0.24 | 1.0 | **+24** |
| 1500 | 1700 | ❌ No | 0.24 | 0.0 | **-8** |
| 1700 | 1500 | ✅ Yes | 0.76 | 1.0 | **+8** |
| 1700 | 1500 | ❌ No | 0.76 | 0.0 | **-24** |
| 1500 | 2000 | ✅ Yes | 0.05 | 1.0 | **+30** |
| 2000 | 1500 | ❌ No | 0.95 | 0.0 | **-30** |

**Key Insights:**
- Beating stronger opponent → Large gain (+24 to +30)
- Losing to weaker opponent → Large loss (-24 to -30)
- Even match → Medium swing (±16)
- Beating much weaker opponent → Small gain (+8)

### 7.3 Rank Tiers

```typescript
export const getRankTier = (elo: number): RankTier => {
  if (elo < 1000) return { tier: 'Novice', icon: '🌱', color: '#8B4513' };
  if (elo < 1200) return { tier: 'Bronze', icon: '🥉', color: '#CD7F32' };
  if (elo < 1400) return { tier: 'Silver', icon: '🥈', color: '#C0C0C0' };
  if (elo < 1600) return { tier: 'Gold', icon: '🥇', color: '#FFD700' };
  if (elo < 1800) return { tier: 'Diamond', icon: '💎', color: '#00CED1' };
  if (elo < 2000) return { tier: 'Master', icon: '👑', color: '#9370DB' };
  return { tier: 'Grandmaster', icon: '🏆', color: '#FF4500' };
};
```

### 7.4 ELO Update Flow (Cloud Function)

```typescript
// functions/src/updateElo.ts
export const updateElo = functions.https.onCall(async (data, context) => {
  const { matchId, winner } = data;

  // 1. Get match document
  const matchDoc = await admin.firestore().collection('matches').doc(matchId).get();
  const match = matchDoc.data();

  if (!match || match.status !== 'completed') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid match');
  }

  const player1 = match.players[0];
  const player2 = match.players[1];

  // 2. Calculate ELO changes
  const player1Change = calculateEloChange(
    player1.elo,
    player2.elo,
    winner === 1
  );
  const player2Change = calculateEloChange(
    player2.elo,
    player1.elo,
    winner === 2
  );

  // 3. Update both players in batch
  const batch = admin.firestore().batch();

  batch.update(admin.firestore().collection('users').doc(player1.uid), {
    'onlineStats.elo': player1.elo + player1Change,
    'onlineStats.gamesPlayed': admin.firestore.FieldValue.increment(1),
    'onlineStats.wins': winner === 1 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0)
  });

  batch.update(admin.firestore().collection('users').doc(player2.uid), {
    'onlineStats.elo': player2.elo + player2Change,
    'onlineStats.gamesPlayed': admin.firestore.FieldValue.increment(1),
    'onlineStats.wins': winner === 2 ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0)
  });

  await batch.commit();

  // 4. Return results
  return {
    player1EloChange: player1Change,
    player2EloChange: player2Change,
    newElos: {
      player1: player1.elo + player1Change,
      player2: player2.elo + player2Change
    }
  };
});
```

---

## 8. Matchmaking Algorithm

### 8.1 Matchmaking Flow

```typescript
// functions/src/matchmaking.ts
export const matchmaking = functions.https.onCall(async (data, context) => {
  const { difficulty, elo } = data;
  const uid = context.auth?.uid;

  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  console.log(`[Matchmaking] User ${uid} searching for opponent (ELO: ${elo}, Difficulty: ${difficulty})`);

  const db = admin.firestore();
  const matchmakingRef = db.collection('matchmaking');

  // 1. Search for existing opponent in queue
  const potentialOpponents = await matchmakingRef
    .where('difficulty', '==', difficulty)
    .where('elo', '>=', elo - 200)
    .where('elo', '<=', elo + 200)
    .where('status', '==', 'searching')
    .limit(1)
    .get();

  if (!potentialOpponents.empty) {
    // Match found!
    const opponentDoc = potentialOpponents.docs[0];
    const opponent = opponentDoc.data();

    console.log(`[Matchmaking] Match found! Opponent: ${opponent.uid}`);

    // Create match document
    const matchId = db.collection('matches').doc().id;

    await db.collection('matches').doc(matchId).set({
      matchId,
      status: 'active',
      type: 'ranked',
      difficulty,
      players: [
        {
          uid: uid,
          playerNumber: 1,
          displayName: data.displayName,
          elo: elo,
          isAI: false
        },
        {
          uid: opponent.uid,
          playerNumber: 2,
          displayName: opponent.displayName,
          elo: opponent.elo,
          isAI: false
        }
      ],
      gameState: generateGameState(difficulty),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      startedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Remove opponent from queue
    await opponentDoc.ref.delete();

    return {
      matchId,
      opponentFound: true,
      opponent: {
        displayName: opponent.displayName,
        elo: opponent.elo
      }
    };
  }

  // 2. No opponent found - Add to queue
  console.log(`[Matchmaking] No opponent found. Adding to queue...`);

  await matchmakingRef.doc(uid).set({
    uid,
    displayName: data.displayName,
    elo,
    difficulty,
    status: 'searching',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // 3. Wait 5 seconds for opponent
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 4. Check if matched during wait
  const myDoc = await matchmakingRef.doc(uid).get();
  if (!myDoc.exists) {
    // Matched with someone during wait!
    // Find the created match
    const recentMatches = await db.collection('matches')
      .where('players', 'array-contains', { uid })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!recentMatches.empty) {
      const match = recentMatches.docs[0].data();
      const opponent = match.players.find((p: any) => p.uid !== uid);

      return {
        matchId: match.matchId,
        opponentFound: true,
        opponent: {
          displayName: opponent.displayName,
          elo: opponent.elo
        }
      };
    }
  }

  // 5. Still no opponent - Create AI match
  console.log(`[Matchmaking] No opponent after 5s. Creating AI match...`);

  // Remove from queue
  await matchmakingRef.doc(uid).delete();

  // Create AI match
  const matchId = db.collection('matches').doc().id;

  await db.collection('matches').doc(matchId).set({
    matchId,
    status: 'active',
    type: 'ranked',
    difficulty,
    players: [
      {
        uid: uid,
        playerNumber: 1,
        displayName: data.displayName,
        elo: elo,
        isAI: false
      },
      {
        uid: null,
        playerNumber: 2,
        displayName: generateAIName(),
        elo: elo + Math.floor((Math.random() - 0.5) * 100), // ±50 ELO
        isAI: true
      }
    ],
    gameState: generateGameState(difficulty),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    startedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    matchId,
    opponentFound: false,
    aiOpponent: true
  };
});
```

### 8.2 ELO Range Strategy

```
User ELO: 1500

Search Range: 1300 - 1700 (±200)

┌─────────────────────────────────────────────────────────┐
│                   ELO Distribution                      │
│                                                         │
│  1000   1200   1400   1600   1800   2000   2200        │
│   │      │      │      │      │      │      │          │
│   ├──────┼──────┼──────┼──────┼──────┼──────┤          │
│          │      ▼             ▼      │                 │
│          │   ┌─────────────────┐    │                 │
│          │   │  Search Range   │    │                 │
│          │   │   (±200 ELO)    │    │                 │
│          │   └─────────────────┘    │                 │
│          │                           │                 │
│        1300         1500          1700                 │
│                   (User ELO)                            │
└─────────────────────────────────────────────────────────┘

Why ±200?
- Tight enough to ensure balanced matches
- Wide enough to find opponents in low population
- Expected score range: 0.24 - 0.76
- ELO change range: ±8 to ±24 (fair stakes)
```

### 8.3 AI Name Generation

```typescript
const AI_FIRST_NAMES = ['Alex', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn'];
const AI_LAST_NAMES = ['Smith', 'Chen', 'Kumar', 'Müller', 'Garcia', 'Johnson', 'Lee', 'Brown'];

export const generateAIName = (): string => {
  const first = AI_FIRST_NAMES[Math.floor(Math.random() * AI_FIRST_NAMES.length)];
  const last = AI_LAST_NAMES[Math.floor(Math.random() * AI_LAST_NAMES.length)];
  return `${first} ${last}`;
};
```

**Bot Masking:** AI opponents get realistic names to make the experience feel like playing against a human. No "Bot_123" names.

---

## 9. Deep Linking & Invitations

### 9.1 Deep Link URL Scheme

```
Universal Link (iOS): https://sudokuduo.app/join/ABC123
App Link (Android):    https://sudokuduo.app/join/ABC123
Custom Scheme:         sudokuduo://join/ABC123
```

### 9.2 Deep Link Configuration

**app.json:**
```json
{
  "expo": {
    "scheme": "sudokuduo",
    "ios": {
      "associatedDomains": ["applinks:sudokuduo.app"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "sudokuduo.app",
              "pathPrefix": "/join"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 9.3 Deep Link Handling

```typescript
// app/_layout.tsx
import * as Linking from 'expo-linking';

export default function RootLayout() {
  useEffect(() => {
    // Handle initial URL (app was closed)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle incoming URLs (app was backgrounded)
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    console.log('[DeepLink] Received URL:', url);

    // Parse URL
    const { hostname, path, queryParams } = Linking.parse(url);

    if (path === 'join') {
      const matchCode = queryParams?.code || path.split('/')[1];

      if (matchCode) {
        // Navigate to join screen
        router.push({
          pathname: '/duo-online/join',
          params: { code: matchCode }
        });
      }
    }
  };

  return <App />;
}
```

### 9.4 Invite Sharing

```typescript
// screens/DuoOnline/PrivateLobby.tsx
import Share from 'react-native-share';

const shareInvite = async (matchCode: string) => {
  const url = `https://sudokuduo.app/join/${matchCode}`;
  const message = `Join my Sudoku Duo match! Code: ${matchCode}`;

  try {
    await Share.open({
      title: 'Sudoku Duo Invite',
      message: `${message}\n${url}`,
      url: url, // iOS shares as clickable link
    });
  } catch (error) {
    console.log('[Share] User cancelled or error:', error);
  }
};
```

### 9.5 Join Flow

```
Host                        Guest                        Firestore
───────────────────────────────────────────────────────────────────
  │
  ├─ Create Private Match
  │       │
  │       ├─ Generate code: "ABC123"
  │       ├─ Create match doc (status: 'lobby')
  │       │                                                   │
  │       ├─ Share link:                                      │
  │       │   "sudokuduo://join/ABC123"                       │
  │       │                                                   │
  │       │                   │                               │
  │       │                   ├─ Click link in WhatsApp       │
  │       │                   │   (Deep link opens app)       │
  │       │                   │                               │
  │       │                   ├─ Extract code: "ABC123"       │
  │       │                   │                               │
  │       │                   ├─ Call joinPrivateMatch()
  │       │                   │   (matchCode: "ABC123")
  │       │                   │                         │
  │       │                   │                         ├─ Find match
  │       │                   │                         │   by code
  │       │                   │                         │
  │       │                   │                         ├─ Validate
  │       │                   │                         │   (not full)
  │       │                   │                         │
  │       │                   │                         ├─ Add guest
  │       │                   │                         │   to players[]
  │       │                   │                         │
  │       │                   │                         ├─ Update status
  │       │                   │                         │   = 'active'
  │       │                   │                               │
  │       │  ←─── Real-time update (guest joined) ────────────┤
  │       │                   │                               │
  │       │                   │  ←─── Success ────────────────┤
  │       │                   │                               │
  ├─ Navigate to game        ├─ Navigate to game             │
  │       │                   │                               │
  │       ├───────────── Both players in match ──────────────→│
```

---

## 10. Security Architecture

### 10.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ===== Helper Functions =====

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return request.auth.uid == uid;
    }

    function isPlayer(matchData) {
      return matchData.players[0].uid == request.auth.uid ||
             matchData.players[1].uid == request.auth.uid;
    }

    function isInPlayerZone(row) {
      // Player 1: Top half (rows 0-3)
      // Player 2: Bottom half (rows 5-8)
      // Middle row (4): Neutral (pre-filled)
      let matchData = resource.data;
      let playerNumber = matchData.players[0].uid == request.auth.uid ? 1 : 2;

      return (playerNumber == 1 && row <= 3) ||
             (playerNumber == 2 && row >= 5);
    }

    // ===== Users Collection =====

    match /users/{userId} {
      // Users can read their own document
      allow read: if isAuthenticated() && isOwner(userId);

      // Users can update their own profile
      allow update: if isAuthenticated() && isOwner(userId) &&
                       // Cannot modify ELO directly (only Cloud Functions)
                       request.resource.data.onlineStats.elo == resource.data.onlineStats.elo;

      // Sub-collection: data
      match /data/{document} {
        allow read: if isAuthenticated() && isOwner(userId);
        allow write: if isAuthenticated() && isOwner(userId);
      }
    }

    // ===== Matches Collection =====

    match /matches/{matchId} {
      // Players can read their own matches
      allow read: if isAuthenticated() && isPlayer(resource.data);

      // Players can update game state (moves only)
      allow update: if isAuthenticated() &&
                       isPlayer(resource.data) &&
                       // Can only add moves
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['gameState']) &&
                       // Cannot change board directly
                       request.resource.data.gameState.board == resource.data.gameState.board &&
                       // Cannot change solution
                       request.resource.data.gameState.solution == resource.data.gameState.solution;
    }

    // ===== Matchmaking Collection =====

    match /matchmaking/{userId} {
      // Users can create/delete their own queue entry
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // ===== Leaderboards Collection =====

    match /leaderboards/{difficulty} {
      // Anyone can read leaderboards
      allow read: if true;

      // Only Cloud Functions can write
      allow write: if false;
    }
  }
}
```

### 10.2 Cloud Function Authorization

```typescript
// All Cloud Functions check authentication
export const matchmaking = functions.https.onCall(async (data, context) => {
  // ✅ Authenticated users only
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be logged in'
    );
  }

  const uid = context.auth.uid;

  // Function logic...
});
```

### 10.3 Data Validation

```typescript
// Validate all inputs in Cloud Functions
export const createPrivateMatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
  if (!validDifficulties.includes(data.difficulty)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid difficulty. Must be: easy, medium, hard, or expert'
    );
  }

  // Validate displayName
  if (!data.displayName || data.displayName.length > 50) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Display name must be 1-50 characters'
    );
  }

  // Function logic...
});
```

---

## 11. Performance Optimization

### 11.1 Firestore Read Optimization

**Problem:** Leaderboards could require reading 1000s of documents.

**Solution:** Composite Indexes + Pagination

```typescript
// Firestore Composite Index (firestore.indexes.json)
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "onlineStats.elo", "order": "DESCENDING" },
        { "fieldPath": "onlineStats.gamesPlayed", "order": "DESCENDING" }
      ]
    }
  ]
}

// Query with limit
const getLeaderboard = async (limit: number = 50) => {
  const snapshot = await firestore()
    .collection('users')
    .orderBy('onlineStats.elo', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => doc.data());
};
```

**Cost:** 1 read per document (50 reads for top 50 players)

### 11.2 Real-Time Listener Optimization

**Problem:** Listening to entire match document wastes bandwidth.

**Solution:** Field-level listeners (future optimization)

```typescript
// Option 1: Listen to entire document (current approach)
firestore().collection('matches').doc(matchId).onSnapshot(/* ... */);

// Option 2: Listen to specific fields only (future)
firestore()
  .collection('matches')
  .doc(matchId)
  .collection('gameState')
  .doc('moves')
  .onSnapshot(/* ... */);
```

**Current:** ~2KB per update (entire match document)
**Optimized:** ~200 bytes per update (moves only)

**Trade-off:** Current approach is simpler; optimize only if bandwidth becomes issue.

### 11.3 Memoization

```typescript
// Expensive calculation: Find available cells
const availableCells = useMemo(() => {
  return findAvailableCells(board, solution);
}, [board]); // Only recalculate when board changes

// Expensive render: Leaderboard table
const LeaderboardTable = memo(({ players }) => {
  return (
    <FlatList
      data={players}
      renderItem={({ item }) => <PlayerRow player={item} />}
      keyExtractor={(item) => item.uid}
    />
  );
});
```

---

## 12. Error Handling & Recovery

### 12.1 Network Error Handling

```typescript
// hooks/useRealtimeMatch.ts
const [error, setError] = useState<string | null>(null);
const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  const unsubscribe = firestore()
    .collection('matches')
    .doc(matchId)
    .onSnapshot(
      (snapshot) => {
        // Success
        setError(null);
        setRetryCount(0);
      },
      (err) => {
        // Error
        console.error('[Firestore] Snapshot error:', err);

        if (err.code === 'unavailable' && retryCount < 3) {
          // Firestore offline → Retry
          setError('Connection lost. Retrying...');
          setRetryCount(prev => prev + 1);
        } else {
          // Permanent error
          setError('Failed to sync. Check internet connection.');
        }
      }
    );

  return () => unsubscribe();
}, [matchId, retryCount]);

// Show error banner in UI
if (error) {
  return <ErrorBanner message={error} onRetry={() => setRetryCount(0)} />;
}
```

### 12.2 Graceful Degradation

```typescript
// If opponent disconnects
const checkOpponentConnection = (match: MatchState) => {
  const now = Date.now();
  const lastMove = match.gameState.player2Moves[match.gameState.player2Moves.length - 1];

  if (lastMove && now - lastMove.timestamp > 60000) {
    // No move in 60 seconds → Show warning
    return {
      disconnected: true,
      message: 'Opponent may have disconnected. Wait or forfeit match.'
    };
  }

  return { disconnected: false };
};
```

### 12.3 Cloud Function Retry Logic

```typescript
// Client-side retry for Cloud Functions
const callWithRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.code?.startsWith('invalid-argument') ||
          error.code?.startsWith('permission-denied')) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Usage
const result = await callWithRetry(() =>
  functions().httpsCallable('matchmaking')({ difficulty, elo })
);
```

---

## Appendix A: File Structure

```
screens/
├── DuoOnline/
│   ├── DuoOnlineMenu.tsx          [NEW] Online menu (Ranked/Private/AI)
│   ├── RankedMatchmaking.tsx      [NEW] Matchmaking screen
│   ├── PrivateLobby.tsx           [NEW] Private match lobby
│   ├── PrivateJoin.tsx            [NEW] Join via invite code
│   ├── OnlineGameBoard.tsx        [NEW] Game screen (real-time sync)
│   ├── RankedResults.tsx          [NEW] Match results + ELO change
│   ├── components/
│   │   ├── MatchmakingLoader.tsx  [NEW] Searching for opponent...
│   │   ├── InviteShareSheet.tsx   [NEW] Share invite UI
│   │   ├── OpponentCard.tsx       [NEW] Opponent info display
│   │   └── EloChangeAnimation.tsx [NEW] +24 ELO animation
│   └── hooks/
│       ├── useRealtimeMatch.ts    [NEW] Firestore listener hook
│       ├── useMatchmaking.ts      [NEW] Matchmaking logic
│       ├── useAIOpponent.ts       [NEW] AI move generation
│       └── useEloCalculation.ts   [NEW] ELO preview calculation

utils/
├── ai/
│   ├── aiOpponent.ts              [NEW] AI algorithm
│   ├── difficultyAdjustment.ts    [NEW] DDA logic
│   └── aiProfile.ts               [NEW] AI profile storage
├── online/
│   ├── matchmaking.ts             [NEW] Client-side matchmaking helpers
│   ├── eloCalculator.ts           [NEW] ELO calculation
│   └── deepLinking.ts             [NEW] Deep link parsing

functions/
├── src/
│   ├── matchmaking.ts             [NEW] Cloud Function
│   ├── updateElo.ts               [NEW] Cloud Function
│   ├── createPrivateMatch.ts      [NEW] Cloud Function
│   ├── joinPrivateMatch.ts        [NEW] Cloud Function
│   ├── cleanupMatches.ts          [NEW] Scheduled function
│   └── utils/
│       ├── eloCalculator.ts       [NEW] Shared ELO logic
│       └── sudokuGenerator.ts     [NEW] Puzzle generation
```

---

## Appendix B: Database Size Estimates

### Match Document Size

```typescript
// Average match document: ~4 KB
{
  matchId: "abc123",                    // 24 bytes
  status: "active",                     // 10 bytes
  type: "ranked",                       // 10 bytes
  difficulty: "medium",                 // 10 bytes

  players: [                            // ~200 bytes
    { uid, playerNumber, displayName, elo, isAI },
    { uid, playerNumber, displayName, elo, isAI }
  ],

  gameState: {
    board: [[...]],                     // 81 cells × 4 bytes = 324 bytes
    solution: [[...]],                  // 324 bytes
    player1Moves: [                     // ~40 moves × 30 bytes = 1.2 KB
      { row, col, value, timestamp }
    ],
    player2Moves: [...]                 // 1.2 KB
  },

  createdAt: Timestamp,                 // 8 bytes
  startedAt: Timestamp,                 // 8 bytes
  completedAt: Timestamp                // 8 bytes
}

// Total: ~4 KB per match
```

### Storage Costs (Firestore Pricing)

| Metric | Cost (USD) | Calculation |
|--------|-----------|-------------|
| **Storage** | $0.18/GB/month | 10,000 matches × 4KB = 40MB = $0.007/month |
| **Reads** | $0.06 per 100K | 1 match = ~3 reads (initial + updates) × 10K matches = $0.002 |
| **Writes** | $0.18 per 100K | 1 match = ~100 writes (moves) × 10K matches = $0.18 |
| **Cloud Functions** | $0.40 per 1M invocations | 10K matches × 3 calls = 30K calls = $0.012 |

**Total for 10,000 matches/month:** ~$0.20

**Blaze Plan Free Tier:**
- 1 GB storage (25,000 matches)
- 50K reads/day (16,000 matches/day)
- 20K writes/day (200 matches/day)

**Conclusion:** Very affordable. Won't exceed free tier until ~5,000 daily active users.

---

**End of Architecture Document**

**Last Updated:** 2025-01-20
**Status:** Planning Phase Complete ✅
**Next Step:** Begin Phase 1 Implementation (Firebase Setup)
