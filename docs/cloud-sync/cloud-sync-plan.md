# Cloud Sync & Google Authentication - Technical Plan

**Project:** Sudoku Duo
**Feature:** Google/Apple Sign-In + Cloud Synchronization
**Version:** 1.0
**Last Updated:** 2025-10-14

---

## 🎯 Goals

1. **Optional Account Creation** via Google/Apple Sign-In
2. **Offline-First Architecture** - User kann weiterhin offline spielen
3. **Bi-Directional Cloud Sync** mit Conflict Resolution (Timestamp-based)
4. **Data Persistence** - Keine Datenverluste bei Gerätewechsel
5. **Seamless User Experience** - Kein Breaking Change für bestehende User

---

## 📦 Technology Stack

### **Backend: Firebase**
- **Firebase Authentication** - Google & Apple Sign-In
- **Firestore** - User-Daten (Stats, Settings, Streaks, etc.)
- **Cloud Functions** (optional später) - Server-side Validation

### **Frontend: React Native**
- **@react-native-firebase/*** - Native Firebase SDK
- **AsyncStorage** - Lokale Offline-Daten (bleibt primär)
- **@react-native-google-signin** (bereits installiert)
- **expo-apple-authentication** (bereits installiert)

---

## 🗂️ Firestore Data Model

### **Collection Structure**

```
users/{userId}
  ├── profile (document)
  │   ├── name: string
  │   ├── avatarUrl: string | null
  │   ├── title: string | null
  │   ├── titleLevelIndex: number | null
  │   ├── createdAt: timestamp
  │   └── lastSync: timestamp
  │
  ├── stats (document)
  │   ├── gamesPlayed: number
  │   ├── gamesWon: number
  │   ├── bestTimeEasy: number
  │   ├── bestTimeMedium: number
  │   ├── bestTimeHard: number
  │   ├── bestTimeExpert: number
  │   ├── totalXP: number
  │   ├── reachedMilestones: number[]
  │   ├── completedEasy: number
  │   ├── completedMedium: number
  │   ├── completedHard: number
  │   ├── completedExpert: number
  │   └── updatedAt: timestamp
  │
  ├── settings (document)
  │   ├── highlightRelatedCells: boolean
  │   ├── showMistakes: boolean
  │   ├── highlightSameValues: boolean
  │   ├── autoNotes: boolean
  │   ├── darkMode: "light" | "dark"
  │   ├── vibration: boolean
  │   ├── soundEffects: boolean
  │   ├── backgroundMusic: boolean
  │   ├── language: "de" | "en"
  │   └── updatedAt: timestamp
  │
  ├── dailyStreak (document)
  │   ├── currentStreak: number
  │   ├── longestDailyStreak: number
  │   ├── lastPlayedDate: string (ISO date)
  │   ├── firstLaunchDate: string (ISO date)
  │   ├── shieldsAvailable: number
  │   ├── shieldsUsedThisWeek: number
  │   ├── lastShieldResetDate: string
  │   ├── bonusShields: number
  │   ├── totalShieldsUsed: number
  │   ├── playHistory: map<string, MonthlyPlayData>
  │   ├── totalDaysPlayed: number
  │   ├── completedMonths: string[]
  │   └── updatedAt: timestamp
  │
  ├── landscapes (document)
  │   ├── currentImageId: string
  │   ├── favorites: string[]
  │   ├── lastUsedFavoriteIndex: number
  │   ├── lastChangedDate: string
  │   ├── landscapes: map<string, Landscape>
  │   └── updatedAt: timestamp
  │
  └── colorUnlock (document)
      ├── selectedColor: string
      ├── unlockedColors: string[]
      └── updatedAt: timestamp
```

### **Firestore Indexes Required**

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "fields": [
        { "fieldPath": "stats.totalXP", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 🔐 Authentication Flow

### **1. Initial App Launch (First Time User)**

```
App Start
  ↓
Check AsyncStorage for local data
  ↓ (keine Daten)
Initialize with DEFAULT values
  ↓
Show Start Screen
  ↓
User spielt offline (keine Account-Requirement)
```

### **2. Account Creation Flow (Settings > Auth Banner)**

```
Settings Screen
  ↓
User sieht AuthSection Banner (Shield Icon + "Daten sichern")
  ↓
User klickt "Mit Google anmelden"
  ↓
Google Sign-In Popup (Native)
  ↓ (Success)
Firebase Auth creates User
  ↓
Check Firestore: users/{userId} exists?
  ├─ NO → Erstregistrierung Flow
  │   ├─ Upload lokale Daten zu Firestore
  │   ├─ Erstelle alle Sub-Collections
  │   └─ Zeige Success-Message
  │
  └─ YES → Returning User Flow
      ├─ Download Cloud-Daten
      ├─ Merge mit lokalen Daten (Timestamp Conflict Resolution)
      └─ Zeige Success-Message + Sync-Summary
```

### **3. Logout Flow**

```
Settings > "Abmelden"
  ↓
Bestätigungs-Alert:
  "Lokale Daten bleiben erhalten. Du kannst dich jederzeit wieder anmelden."
  ↓
Firebase.auth().signOut()
  ↓
Setze isLoggedIn = false
  ↓
App funktioniert weiter offline (AsyncStorage bleibt)
```

### **4. Re-Login Flow (Same Device)**

```
Settings > "Mit Google anmelden"
  ↓
Google Sign-In
  ↓
Erkenne: User war bereits angemeldet (Firestore hat Daten)
  ↓
Bi-Directional Sync:
  ├─ Vergleiche local.updatedAt vs. cloud.updatedAt
  ├─ Merge Conflicts (z.B. XP addieren, höhere Werte nehmen)
  └─ Update both Local & Cloud
  ↓
Zeige Sync-Summary:
  "Willkommen zurück! 3 neue Achievements vom anderen Gerät synchronisiert."
```

### **5. New Device Login Flow**

```
Neues Gerät - App Install
  ↓
App Start → Keine lokalen Daten
  ↓
Settings > "Mit Google anmelden"
  ↓
Google Sign-In
  ↓
Firestore Download:
  ├─ users/{userId}/profile → profileStorage
  ├─ users/{userId}/stats → GameStats
  ├─ users/{userId}/settings → GameSettings
  ├─ users/{userId}/dailyStreak → DailyStreakData
  ├─ users/{userId}/landscapes → LandscapeCollection
  └─ users/{userId}/colorUnlock → ColorUnlockData
  ↓
Save to AsyncStorage
  ↓
Zeige Success-Message:
  "Willkommen zurück! Alle Daten wurden wiederhergestellt."
```

---

## 🔄 Sync Strategy

### **Sync Triggers**

1. **App Launch** (wenn eingeloggt)
2. **App Pause/Background** (wenn eingeloggt)
3. **Nach jedem Spiel** (wenn eingeloggt)
4. **Manual Sync Button** (in Settings)

### **Conflict Resolution Strategy**

#### **Last-Write-Wins (für Settings)**
```typescript
if (local.updatedAt > cloud.updatedAt) {
  // Upload lokale Daten
  uploadToFirestore(local);
} else if (cloud.updatedAt > local.updatedAt) {
  // Download Cloud-Daten
  saveToAsyncStorage(cloud);
} else {
  // Timestamps gleich → keine Action
}
```

#### **Merge Strategy (für Stats)**
```typescript
// XP: Addiere beide Werte (falls User auf 2 Geräten gespielt hat)
const mergedXP = Math.max(local.totalXP, cloud.totalXP);

// Bestzeiten: Nimm die bessere Zeit
const mergedBestTimeEasy = Math.min(
  local.bestTimeEasy === Infinity ? Infinity : local.bestTimeEasy,
  cloud.bestTimeEasy === Infinity ? Infinity : cloud.bestTimeEasy
);

// Games Played: Nimm höheren Wert (keine Addition, sonst Duplikate)
const mergedGamesPlayed = Math.max(local.gamesPlayed, cloud.gamesPlayed);
```

#### **Cloud-Wins (für Security-Critical Data)**
```typescript
// Daily Streak: Cloud gewinnt immer (gegen Manipulation)
const mergedDailyStreak = cloud.dailyStreak;
```

### **Sync Algorithm Pseudocode**

```typescript
async function syncUserData() {
  const userId = auth.currentUser.uid;

  // 1. Download Cloud-Daten
  const cloudData = await firestore.collection('users').doc(userId).get();

  // 2. Load lokale Daten
  const localData = {
    stats: await loadStats(),
    settings: await loadSettings(),
    profile: await loadUserProfile(),
    dailyStreak: localData.stats.dailyStreak,
    landscapes: await loadLandscapeCollection(),
    colorUnlock: await loadColorUnlock(),
  };

  // 3. Merge Daten
  const mergedData = {
    stats: mergeStats(localData.stats, cloudData.stats),
    settings: mergeSettings(localData.settings, cloudData.settings),
    profile: mergeProfile(localData.profile, cloudData.profile),
    dailyStreak: cloudData.dailyStreak, // Cloud wins
    landscapes: mergeLandscapes(localData.landscapes, cloudData.landscapes),
    colorUnlock: mergeColorUnlock(localData.colorUnlock, cloudData.colorUnlock),
  };

  // 4. Save merged data to BOTH local & cloud
  await Promise.all([
    saveToAsyncStorage(mergedData),
    uploadToFirestore(userId, mergedData),
  ]);

  return mergedData;
}
```

---

## 🛡️ Security & Privacy

### **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users können nur ihre eigenen Daten lesen/schreiben
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Sub-collections
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **Data Privacy**

- **Keine PII in Cloud** (außer Name, den User selbst eingibt)
- **Avatar-Bilder**: Nur URLs, nicht die Bilder selbst (später: Cloud Storage)
- **RevenueCat Purchases**: Bleiben in RevenueCat, NICHT in Firestore
- **Game Boards**: Werden NICHT synchronisiert (zu viel Data)

---

## 🚀 User Scenarios & Edge Cases

### **Scenario 1: Offline User (Never Signs In)**
- ✅ App funktioniert normal
- ✅ Alle Daten in AsyncStorage
- ✅ Kein Banner nach Login

### **Scenario 2: Erstregistrierung (Upload)**
- User hat 100 XP lokal
- User meldet sich an
- → Upload lokale Daten zu Firestore
- → Zeige "Daten gesichert" ✅

### **Scenario 3: Geräte-Wechsel (Download)**
- User installiert App auf neuem Gerät
- User meldet sich an
- → Download Cloud-Daten
- → Zeige "Daten wiederhergestellt" ✅

### **Scenario 4: Parallel Play (Merge)**
- User spielt auf Gerät A (offline), gewinnt 50 XP
- User spielt auf Gerät B (offline), gewinnt 30 XP
- Gerät A synct → Cloud hat 50 XP
- Gerät B synct → Merge: 50 (Cloud) vs. 30 (Local) → Nimm 50
- **PROBLEM:** User verliert 30 XP!
- **LÖSUNG:** XP addieren ODER Timestamp-Check + Warning

### **Scenario 5: Conflict Resolution Example**

**Situation:**
- Local: XP=100, updatedAt=2025-10-14T10:00:00Z
- Cloud: XP=80, updatedAt=2025-10-14T09:00:00Z

**Resolution:**
```typescript
// Local ist neuer → Upload
if (local.updatedAt > cloud.updatedAt) {
  uploadToFirestore({ totalXP: 100 });
}
```

**Situation 2 (Parallel Play):**
- Local: XP=100, updatedAt=2025-10-14T10:00:00Z
- Cloud: XP=120, updatedAt=2025-10-14T10:05:00Z

**Resolution:**
```typescript
// Cloud ist neuer → Download
if (cloud.updatedAt > local.updatedAt) {
  saveToAsyncStorage({ totalXP: 120 });
}
```

### **Scenario 6: Network Failure During Sync**
- User startet Sync
- Network Error
- → Zeige Error-Message: "Sync fehlgeschlagen. Versuche es erneut."
- → Lokale Daten bleiben unverändert
- → Retry-Button

### **Scenario 7: Corrupted Cloud Data**
- Firestore hat ungültige Daten (z.B. XP = -100)
- → Validation beim Download
- → Falls invalid: Nutze lokale Daten + Upload zu Cloud
- → Zeige Warning

### **Scenario 8: User löscht App (Ohne Logout)**
- User löscht App → AsyncStorage weg
- User installiert App neu
- User meldet sich an → Cloud-Daten werden wiederhergestellt ✅

### **Scenario 9: Multiple Sign-In Attempts**
- User klickt "Mit Google anmelden"
- Während Sign-In erneut geklickt
- → Disable Button während Auth
- → Zeige Loading-Spinner

### **Scenario 10: Apple Sign-In (iOS)**
- Gleicher Flow wie Google
- Apple ID → Firebase UID
- → Sync funktioniert identisch

---

## 🎨 UI/UX Changes

### **AuthSection Banner (Existing)**

**Location:** `screens/Settings/components/AuthSection/AuthSection.tsx`

**Current State:**
- ✅ Shield Icon
- ✅ Title: "Daten sichern"
- ✅ Description: "Melde dich an, um deine Fortschritte zu sichern"
- ✅ Google Sign-In Button (Android)
- ✅ Apple Sign-In Button (iOS)
- ❌ Disabled (Development Badge)

**Changes Needed:**
1. Remove `disabled={true}` from AuthButton
2. Implement `onGooglePress` handler
3. Implement `onApplePress` handler
4. Add Loading-State während Auth
5. Success/Error-Feedback nach Auth

### **New Components Needed**

#### **1. SyncIndicator (in Settings Header)**
```typescript
// components/SyncIndicator.tsx
<View>
  {isSyncing ? (
    <ActivityIndicator size="small" color={colors.primary} />
  ) : (
    <Feather name="cloud" size={20} color={colors.primary} />
  )}
  <Text>{lastSyncTime}</Text>
</View>
```

#### **2. AccountInfoCard (After Login)**
```typescript
// Shows after successful login
<Card>
  <Avatar source={user.photoURL} />
  <Text>{user.displayName}</Text>
  <Text>Letzter Sync: {lastSyncTime}</Text>
  <Button onPress={handleSync}>Jetzt synchronisieren</Button>
  <Button onPress={handleLogout}>Abmelden</Button>
</Card>
```

#### **3. SyncSummaryModal**
```typescript
// After successful sync
<Modal>
  <Icon name="check-circle" size={64} color="green" />
  <Text>Synchronisierung erfolgreich!</Text>
  <Text>• 3 neue Achievements</Text>
  <Text>• 150 XP hinzugefügt</Text>
  <Text>• Streak aktualisiert</Text>
  <Button onPress={onClose}>Verstanden</Button>
</Modal>
```

### **Settings Screen Changes**

**Before Login:**
```
┌─────────────────────────────┐
│ ProfileGroup (Avatar, Name) │
└─────────────────────────────┘
┌─────────────────────────────┐
│ AuthSection Banner          │
│  🛡️ Daten sichern           │
│  [Google Sign-In]           │
│  [Apple Sign-In]            │
└─────────────────────────────┘
```

**After Login:**
```
┌─────────────────────────────┐
│ ProfileGroup (Avatar, Name) │
└─────────────────────────────┘
┌─────────────────────────────┐
│ AccountInfoCard             │
│  👤 max@example.com         │
│  ☁️ Letzter Sync: vor 2 Min.│
│  [Sync Button] [Abmelden]   │
└─────────────────────────────┘
```

---

## 📁 File Structure

```
utils/
  ├── auth/
  │   ├── googleAuth.ts          # Google Sign-In Logic
  │   ├── appleAuth.ts           # Apple Sign-In Logic
  │   ├── authHelpers.ts         # Shared Auth Utils
  │   └── types.ts               # Auth Types
  │
  ├── cloudSync/
  │   ├── firebaseConfig.ts      # Firebase Initialization
  │   ├── syncService.ts         # Main Sync Logic
  │   ├── uploadService.ts       # Upload to Firestore
  │   ├── downloadService.ts     # Download from Firestore
  │   ├── mergeService.ts        # Conflict Resolution
  │   └── types.ts               # Sync Types
  │
  └── storage.ts                 # (Existing - No changes needed)

contexts/
  └── AuthProvider.tsx           # Auth Context (isLoggedIn, user, etc.)

screens/Settings/
  └── components/
      ├── AuthSection/
      │   ├── AuthSection.tsx            # (Existing - Update handlers)
      │   ├── AuthButton.tsx             # (Existing - Remove disabled)
      │   └── AccountInfoCard.tsx        # NEW - After login
      │
      └── SyncIndicator/
          └── SyncIndicator.tsx          # NEW - Sync status

components/
  └── SyncSummaryModal/
      └── SyncSummaryModal.tsx           # NEW - After sync
```

---

## 🛠️ Implementation Phases

### **Phase 1: Firebase Setup & Configuration**
- [ ] Firebase Projekt erstellen (Google Console)
- [ ] Firebase Config Files generieren
- [ ] iOS: GoogleService-Info.plist
- [ ] Android: google-services.json
- [ ] Install Firebase Dependencies
- [ ] Initialize Firebase in app.tsx

### **Phase 2: Google Authentication**
- [ ] Implement googleAuth.ts
- [ ] Integrate Google Sign-In Button
- [ ] Test Sign-In Flow (Android)
- [ ] Handle Auth Errors
- [ ] Create AuthContext Provider

### **Phase 3: Apple Authentication (iOS)**
- [ ] Implement appleAuth.ts
- [ ] Integrate Apple Sign-In Button
- [ ] Test Sign-In Flow (iOS)
- [ ] Handle Auth Errors

### **Phase 4: Firestore Setup**
- [ ] Create Firestore Database
- [ ] Define Security Rules
- [ ] Create Indexes
- [ ] Implement firebaseConfig.ts

### **Phase 5: Upload Service (First Sync)**
- [ ] Implement uploadService.ts
- [ ] Upload Stats to Firestore
- [ ] Upload Settings to Firestore
- [ ] Upload Profile to Firestore
- [ ] Upload DailyStreak, Landscapes, ColorUnlock

### **Phase 6: Download Service (Re-Login)**
- [ ] Implement downloadService.ts
- [ ] Download from Firestore
- [ ] Save to AsyncStorage
- [ ] Handle Missing Data

### **Phase 7: Merge Service (Conflict Resolution)**
- [ ] Implement mergeService.ts
- [ ] Merge Stats (Max values)
- [ ] Merge Settings (Last-Write-Wins)
- [ ] Merge Landscapes (Union of unlocked)
- [ ] Test Parallel Play Scenario

### **Phase 8: Sync Service (Main Logic)**
- [ ] Implement syncService.ts
- [ ] Auto-Sync on App Launch
- [ ] Auto-Sync on App Pause
- [ ] Manual Sync Button
- [ ] Sync Indicator in UI

### **Phase 9: UI/UX Implementation**
- [ ] Update AuthSection handlers
- [ ] Create AccountInfoCard
- [ ] Create SyncSummaryModal
- [ ] Add Loading States
- [ ] Add Error Handling

### **Phase 10: Testing & Edge Cases**
- [ ] Test Erstregistrierung Flow
- [ ] Test Re-Login Flow
- [ ] Test Geräte-Wechsel
- [ ] Test Offline → Online Sync
- [ ] Test Network Errors
- [ ] Test Parallel Play
- [ ] Test Logout/Re-Login

### **Phase 11: Polish & Optimization**
- [ ] Add Analytics Events
- [ ] Optimize Firestore Queries
- [ ] Add Retry Logic
- [ ] Add Caching (Reduce Firestore Reads)
- [ ] Documentation

---

## 📊 Analytics Events

Track key events for monitoring:

```typescript
// Auth Events
analytics.logEvent('sign_up', { method: 'google' });
analytics.logEvent('login', { method: 'google' });
analytics.logEvent('logout');

// Sync Events
analytics.logEvent('sync_start');
analytics.logEvent('sync_success', { duration: 1234 });
analytics.logEvent('sync_failure', { error: 'network_error' });
analytics.logEvent('sync_conflict_resolved', {
  type: 'stats',
  strategy: 'merge'
});
```

---

## 🐛 Error Handling

### **Auth Errors**

```typescript
try {
  await signInWithGoogle();
} catch (error) {
  if (error.code === 'auth/popup-closed-by-user') {
    // User cancelled → No action
  } else if (error.code === 'auth/network-request-failed') {
    showAlert('Netzwerkfehler. Prüfe deine Internetverbindung.');
  } else {
    showAlert('Anmeldung fehlgeschlagen. Versuche es erneut.');
  }
}
```

### **Sync Errors**

```typescript
try {
  await syncUserData();
} catch (error) {
  if (error.code === 'permission-denied') {
    // Security Rules Problem → Logout + Alert
    showAlert('Zugriff verweigert. Bitte melde dich erneut an.');
    await signOut();
  } else if (error.code === 'unavailable') {
    // Firestore offline
    showAlert('Cloud-Dienst nicht verfügbar. Versuche es später erneut.');
  } else {
    showAlert('Synchronisierung fehlgeschlagen. Deine Daten sind lokal gespeichert.');
  }
}
```

---

## 🎯 Success Criteria

- ✅ User kann optional Account erstellen (Google/Apple)
- ✅ User kann weiterhin offline spielen (ohne Account)
- ✅ Daten werden automatisch synchronisiert (wenn eingeloggt)
- ✅ Konflikte werden intelligent aufgelöst (keine Datenverluste)
- ✅ Geräte-Wechsel funktioniert nahtlos
- ✅ Keine Breaking Changes für bestehende User
- ✅ < 2 Sekunden Sync-Zeit (für 10 KB Daten)
- ✅ < 5 Firestore Reads pro Sync (Kosten-Optimierung)

---

## 📝 Notes

- **AsyncStorage bleibt primär**: Cloud ist nur Backup
- **Firebase Free Tier**: 50K Reads/day → ausreichend für 10K MAU
- **RevenueCat Integration**: Bleibt unverändert (kein Firestore-Link)
- **Avatar-Bilder**: Erst in Phase 2 (Cloud Storage)
- **Multiplayer**: Separate Planung (Firebase Realtime Database)

---

## 🔗 Related Documentation

- [Firebase Setup Guide](./SETUP-GUIDE.md)
- [Progress Tracking](./cloud-sync-progress.md)
- [API Documentation](./API.md) (TODO)
- [Testing Guide](./TESTING.md) (TODO)
