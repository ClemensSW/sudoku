# 🚀 Firebase Deployment Guide - Sudoku Duo Online Multiplayer

## 📋 Voraussetzungen

### 1. Firebase Billing aktivieren (WICHTIG!)

Cloud Functions erfordern den **Blaze Plan** (Pay-as-you-go):

1. Gehe zu [Firebase Console](https://console.firebase.google.com)
2. Wähle dein Projekt: **sudoku-duo-79ddf**
3. Klicke auf **Upgrade** (links unten)
4. Wähle **Blaze Plan**
5. Verbinde eine Zahlungsmethode

**Kosten:**
- Spark Plan (kostenlos): Keine Cloud Functions
- Blaze Plan: Pay-as-you-go (sehr günstig für kleine Apps)
- Erste 2 Millionen Invocations pro Monat: KOSTENLOS
- Erste 400.000 GB-Sekunden: KOSTENLOS
- Für eine App mit <1000 Nutzern: ~$0-5/Monat

### 2. Firebase CLI installiert?

```bash
# Prüfen
firebase --version

# Falls nicht installiert:
npm install -g firebase-tools

# Login
firebase login
```

### 3. Projekt-Status prüfen

```bash
# Zeige aktuelles Projekt
firebase projects:list

# Sollte zeigen: sudoku-duo-79ddf (default)
firebase use default
```

---

## 🔧 Deployment Schritte

### Schritt 1: Functions Build erstellen

```bash
# In das functions Verzeichnis wechseln
cd functions

# Dependencies installieren (falls noch nicht geschehen)
npm install

# TypeScript zu JavaScript kompilieren
npm run build

# Zurück zum Root
cd ..
```

**Erwartete Ausgabe:**
```
✓ TypeScript compilation successful
✓ lib/ folder created with compiled JS
```

### Schritt 2: Firestore Indexes deployen

Die Indexes sind wichtig für performante Queries!

```bash
firebase deploy --only firestore:indexes
```

**Was wird deployed:**
- `firestore.indexes.json` mit Composite Indexes für:
  - Matchmaking queries (status + type + difficulty + elo + timestamp)
  - Match queries (inviteCode + status)
  - User queries (elo + totalMatches)

**Erwartete Ausgabe:**
```
✓ Firestore indexes deployed successfully
⚠ Index creation in progress (kann 5-10 Minuten dauern)
```

### Schritt 3: Firestore Security Rules deployen

```bash
firebase deploy --only firestore:rules
```

**Was wird deployed:**
- Sicherheitsregeln aus `firestore.rules`
- Schutz für users, matches, matchmaking, leaderboards

**Erwartete Ausgabe:**
```
✓ Firestore rules deployed successfully
```

### Schritt 4: Cloud Functions deployen

**⚠️ WICHTIG: Blaze Plan muss aktiviert sein!**

```bash
# Alle Functions deployen
firebase deploy --only functions

# Oder einzelne Functions:
firebase deploy --only functions:matchmaking
firebase deploy --only functions:createPrivateMatch
firebase deploy --only functions:joinPrivateMatch
firebase deploy --only functions:updateElo
firebase deploy --only functions:cleanupMatches
```

**Erwartete Ausgabe:**
```
✓ functions[matchmaking(us-central1)] Successful update operation.
✓ functions[createPrivateMatch(us-central1)] Successful create operation.
✓ functions[joinPrivateMatch(us-central1)] Successful create operation.
✓ functions[updateElo(us-central1)] Successful create operation.
✓ functions[cleanupMatches(us-central1)] Successful create operation.

Function URL (matchmaking): https://us-central1-sudoku-duo-79ddf.cloudfunctions.net/matchmaking
```

**⏱️ Dauer:** 2-5 Minuten pro Function

### Schritt 5: Alles auf einmal deployen

```bash
# Deploy ALLES (Indexes + Rules + Functions)
firebase deploy
```

---

## 🧪 Testing: Emulator vs Production

### Option A: Lokal mit Emulator testen (EMPFOHLEN für Entwicklung)

```bash
# Emulator starten
firebase emulators:start

# Öffnet:
# - Emulator UI: http://localhost:4000
# - Functions: http://localhost:5001
# - Firestore: http://localhost:8080
# - Auth: http://localhost:9099
```

**In deiner App:**
- Emulator wird automatisch verwendet wenn in Development Build
- Keine echten Kosten
- Schnelles Testing

### Option B: Production Testing

1. **Functions deployen** (siehe oben)
2. **App Build erstellen:**

```bash
# Development Build mit Production Backend
eas build --profile development --platform android

# Oder iOS
eas build --profile development --platform ios
```

3. **In der App testen:**
   - Functions werden von echtem Firebase aufgerufen
   - Zählt gegen Free Tier / Billing
   - Langsamer als Emulator (Cold Starts)

---

## 🔍 Functions Status überprüfen

### Via Firebase Console

1. Gehe zu: https://console.firebase.google.com/project/sudoku-duo-79ddf/functions
2. Siehst du alle 5 Functions:
   - ✅ matchmaking
   - ✅ createPrivateMatch
   - ✅ joinPrivateMatch
   - ✅ updateElo
   - ✅ cleanupMatches (Scheduled)

### Via CLI

```bash
# Liste alle Functions
firebase functions:list

# Logs einer Function anschauen
firebase functions:log matchmaking

# Real-time Logs
firebase functions:log --only matchmaking
```

---

## 📊 Firestore Indexes Status

### Via Console

1. Gehe zu: https://console.firebase.google.com/project/sudoku-duo-79ddf/firestore/indexes
2. Warte bis alle Indexes "Enabled" sind (nicht "Building")

### Via CLI

```bash
firebase firestore:indexes
```

---

## 🐛 Troubleshooting

### Error: "Billing account not configured"

**Problem:** Blaze Plan nicht aktiviert

**Lösung:**
1. Firebase Console → Upgrade → Blaze Plan
2. Zahlungsmethode hinzufügen
3. Nochmal deployen

### Error: "Build failed"

**Problem:** TypeScript Compilation Fehler

**Lösung:**
```bash
cd functions
npm run build
# Behebe TypeScript Fehler
cd ..
firebase deploy --only functions
```

### Error: "Index creation failed"

**Problem:** Index Konflikt

**Lösung:**
1. Firebase Console → Firestore → Indexes
2. Lösche alte/duplizierte Indexes
3. Nochmal deployen

### Functions sind deployed aber antworten nicht

**Mögliche Ursachen:**
1. **Cold Start:** Erste Invocation dauert 5-10 Sekunden
2. **Network:** App kann Firebase nicht erreichen
3. **Rules:** Firestore Security Rules blockieren Zugriff

**Debug:**
```bash
# Logs in Echtzeit anschauen
firebase functions:log

# Specific function
firebase functions:log matchmaking
```

---

## ✅ Deployment Checkliste

- [ ] Firebase Billing aktiviert (Blaze Plan)
- [ ] Firebase CLI installiert (`firebase --version`)
- [ ] Logged in (`firebase login`)
- [ ] Projekt ausgewählt (`firebase use sudoku-duo-79ddf`)
- [ ] Functions gebaut (`npm run build` in functions/)
- [ ] Firestore Indexes deployed (`firebase deploy --only firestore:indexes`)
- [ ] Firestore Rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Cloud Functions deployed (`firebase deploy --only functions`)
- [ ] Alle Indexes sind "Enabled" (Firebase Console)
- [ ] Functions Status "Active" (Firebase Console)
- [ ] Testing via Emulator funktioniert
- [ ] Testing via Production funktioniert

---

## 📈 Monitoring & Kosten

### Kosten im Auge behalten

```bash
# Zeige Quota/Usage
firebase projects:list

# Oder via Console:
https://console.firebase.google.com/project/sudoku-duo-79ddf/usage
```

### Function Invocations limitieren

In `functions/src/index.ts` kannst du Rate Limiting hinzufügen:

```typescript
import * as rateLimit from 'express-rate-limit';

export const matchmaking = functions
  .runWith({ maxInstances: 10 }) // Max 10 parallel instances
  .https.onCall(async (data, context) => {
    // ...
  });
```

---

## 🚀 Quick Reference

| Command | Beschreibung |
|---------|-------------|
| `firebase deploy` | Deploy alles |
| `firebase deploy --only functions` | Nur Functions |
| `firebase deploy --only firestore:indexes` | Nur Indexes |
| `firebase deploy --only firestore:rules` | Nur Rules |
| `firebase emulators:start` | Emulator starten |
| `firebase functions:log` | Function Logs anschauen |
| `firebase functions:list` | Functions auflisten |

---

## 📝 Nächste Schritte nach Deployment

1. ✅ **Testing:**
   - Teste Matchmaking (Ranked)
   - Teste Private Matches (Invite Codes)
   - Teste AI Opponent
   - Teste Error Handling

2. ✅ **Monitoring:**
   - Firebase Console → Functions → Metrics
   - Schaue auf Errors/Timeouts
   - Prüfe Performance

3. ✅ **Optimization:**
   - Reduziere Cold Starts (keep-warm functions)
   - Cache häufige Queries
   - Optimiere Firestore Reads

---

**Ready to deploy? 🚀**

Starte mit: `firebase deploy --only firestore:indexes,firestore:rules`

Dann: `firebase deploy --only functions`
