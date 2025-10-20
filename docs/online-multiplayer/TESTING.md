# 🧪 Testing Guide - Sudoku Duo Online Multiplayer

## 🎯 Quick Start: Lokales Testing mit Emulator

**EMPFOHLEN für Entwicklung** - keine Kosten, schnell, einfach!

### Schritt 1: Emulator starten

```bash
# Im Projektverzeichnis
firebase emulators:start
```

**Was passiert:**
- ✅ Firestore Emulator startet auf Port 8080
- ✅ Functions Emulator startet auf Port 5001
- ✅ Auth Emulator startet auf Port 9099
- ✅ Emulator UI öffnet sich: http://localhost:4000

**Erwartete Ausgabe:**
```
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000                │
└─────────────────────────────────────────────────────────────┘

┌────────────┬──────────────┬─────────────────────────────────┐
│ Emulator   │ Host:Port    │ View in Emulator UI             │
├────────────┼──────────────┼─────────────────────────────────┤
│ Auth       │ 0.0.0.0:9099 │ http://127.0.0.1:4000/auth      │
│ Functions  │ 0.0.0.0:5001 │ http://127.0.0.1:4000/functions │
│ Firestore  │ 0.0.0.0:8080 │ http://127.0.0.1:4000/firestore │
└────────────┴──────────────┴─────────────────────────────────┘
```

### Schritt 2: App mit Emulator verbinden

**Automatisch:** Die App verbindet sich automatisch mit dem Emulator wenn:
1. Development Build (`npx expo start`)
2. Emulator läuft
3. `__DEV__` ist true

**Manuell prüfen in `app/_layout.tsx`:**
```typescript
if (__DEV__) {
  functions().useEmulator('localhost', 5001);
  firestore().useEmulator('localhost', 8080);
  auth().useEmulator('http://localhost:9099');
}
```

### Schritt 3: App starten

```bash
# In neuem Terminal
npx expo start
```

**Dann:**
- Drücke `a` für Android
- Drücke `i` für iOS
- Oder scanne QR-Code mit Expo Go

---

## 📱 Testing Scenarios

### Scenario 1: Ranked Matchmaking

1. **In der App:**
   - Tippe auf "Duo" Tab (Bottom Navigation)
   - Wähle "Online Play"
   - Wähle "Ranked Match"
   - Wähle Schwierigkeit (z.B. "Medium")
   - Tippe "Find Match"

2. **Was passiert:**
   - App ruft `matchmaking` Function auf
   - Function sucht nach Gegnern in Firestore
   - Nach 5 Sekunden Timeout → AI Fallback
   - Match wird erstellt mit:
     - Du als Spieler 1
     - AI als Spieler 2 (getarnt als echter Spieler)

3. **Im Emulator UI prüfen:**
   - Öffne http://localhost:4000
   - Gehe zu "Firestore"
   - Siehst du `matches` Collection
   - Neues Match-Dokument mit deiner UID

4. **In der App:**
   - Du wirst zum Game Screen navigiert
   - Sudoku Board wird angezeigt
   - Du kannst Züge machen
   - Nach Completion: ELO wird berechnet

### Scenario 2: Private Match (2 Geräte)

**Gerät 1 (Host):**
1. "Online Play" → "Private Match"
2. Wähle Schwierigkeit
3. Tippe "Create Match"
4. Kopiere Invite Code (z.B. "ABC123")

**Gerät 2 (Guest):**
1. Klicke Deep Link: `sudokuduo://join/ABC123`
2. Oder: Manuell `/duo-online/private-join?inviteCode=ABC123` öffnen
3. Tippe "Join Match"

**Beide Geräte:**
- Werden zum Game Screen navigiert
- Sehen dasselbe Board
- Züge synchronisieren in Echtzeit
- Wer zuerst fertig ist gewinnt

**Emulator Logs prüfen:**
```bash
# Siehe Function Calls
# Terminal wo Emulator läuft zeigt:
>  functions: Beginning execution of "createPrivateMatch"
>  functions: [createPrivateMatch] Created match with code: ABC123
>  functions: Finished "createPrivateMatch" in ~500ms

>  functions: Beginning execution of "joinPrivateMatch"
>  functions: [joinPrivateMatch] Player joined match: ABC123
>  functions: Finished "joinPrivateMatch" in ~300ms
```

### Scenario 3: AI Opponent

1. "Online Play" → "Play vs AI"
2. Wähle Schwierigkeit (Easy/Medium/Hard/Expert)
3. Wähle AI Persönlichkeit:
   - Methodical (langsam, wenige Fehler)
   - Balanced (normal)
   - Speedster (schnell, mehr Fehler)
4. Spiel startet sofort (kein Server-Call)
5. AI macht Züge alle 2-5 Sekunden
6. Bei Completion: Navigiert zu Private Results (kein ELO)

---

## 🔍 Emulator UI Features

### Firestore Tab

**Sehe alle Daten:**
- `users/{uid}`: Spieler-Profile mit ELO
- `matches/{matchId}`: Laufende und beendete Matches
- `matchmaking/{uid}`: Matchmaking-Requests
- `leaderboards/global`: Ranglisten (wenn implementiert)

**Manuell Daten erstellen:**
1. Klicke "Start Collection"
2. Füge Dokumente hinzu
3. Teste mit realistischen Daten

### Functions Tab

**Sehe alle Function Calls:**
- Request payload
- Response data
- Execution time
- Logs/Errors

**Manuell Functions testen:**
1. Klicke auf Function (z.B. "matchmaking")
2. Füge JSON Payload ein:
```json
{
  "difficulty": "medium",
  "userElo": 1200,
  "displayName": "Test User"
}
```
3. Klicke "Run"
4. Siehe Response

### Logs

**Real-time Logs sehen:**
- Console.log outputs
- Errors
- Function starts/ends
- Firestore reads/writes

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused" Error

**Symptom:** App kann Emulator nicht erreichen

**Lösung:**
```bash
# Android Emulator: Verwende 10.0.2.2 statt localhost
# In app/_layout.tsx:
if (__DEV__) {
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  functions().useEmulator(localhost, 5001);
  firestore().useEmulator(localhost, 8080);
}
```

### Issue: Functions nicht gefunden

**Symptom:** "Function not found: matchmaking"

**Lösung:**
1. Prüfe ob Emulator läuft
2. Prüfe Functions Build:
```bash
cd functions
npm run build
cd ..
firebase emulators:start
```

### Issue: Firestore Permission Denied

**Symptom:** "PERMISSION_DENIED: Missing or insufficient permissions"

**Lösung:**
- Emulator ignoriert Security Rules standardmäßig
- Falls aktiviert: Deploye Rules zum Emulator
```bash
firebase deploy --only firestore:rules
```

### Issue: Cold Start Delay

**Symptom:** Erste Function Call dauert 5-10 Sekunden

**Lösung:**
- Normal für Cold Starts (auch in Production)
- Emulator: Functions werden bei jedem Neustart neu geladen
- Production: Verwende `minInstances: 1` für wichtige Functions

---

## ✅ Testing Checklist

### Matchmaking Flow
- [ ] Find Match Button funktioniert
- [ ] Loading State wird angezeigt
- [ ] Nach 5 Sekunden: Match gefunden (AI Fallback)
- [ ] Navigation zu Game Screen
- [ ] Board wird korrekt angezeigt
- [ ] Züge können gemacht werden
- [ ] Completion Detection funktioniert
- [ ] ELO wird berechnet (in Firestore sichtbar)
- [ ] Navigation zu Results Screen

### Private Match Flow
- [ ] Create Match Button funktioniert
- [ ] Invite Code wird generiert (6 Zeichen)
- [ ] Copy Code funktioniert
- [ ] Share funktioniert (iOS/Android)
- [ ] Join via Deep Link funktioniert
- [ ] Join via Manual Code funktioniert
- [ ] Beide Spieler sehen dasselbe Board
- [ ] Real-time Sync funktioniert (Züge von Spieler 1 → Spieler 2)
- [ ] Completion für beide Spieler funktioniert
- [ ] Navigation zu Private Results (kein ELO)

### AI Opponent Flow
- [ ] Schwierigkeit wählbar
- [ ] Persönlichkeit wählbar
- [ ] Spiel startet sofort (lokal)
- [ ] AI macht Züge (2-5 Sekunden Verzögerung)
- [ ] AI Thinking Indicator wird angezeigt
- [ ] AI macht gelegentlich Fehler (realistisch)
- [ ] Completion Detection funktioniert
- [ ] Navigation zu Private Results

### Error Handling
- [ ] Connection Loss während Spiel: Warning Banner
- [ ] Retry Button auf Error Screen funktioniert
- [ ] Back Button funktioniert
- [ ] Reconnection State wird angezeigt

### Internationalization
- [ ] Deutsch: Alle Texte korrekt
- [ ] Englisch: Alle Texte korrekt
- [ ] Hindi: Alle Texte korrekt (optional)
- [ ] Sprachwechsel funktioniert

---

## 📊 Performance Testing

### Firestore Reads

**Prüfe im Emulator UI:**
1. Firestore Tab
2. Klicke auf "Usage" (oben rechts)
3. Siehe Read/Write Count

**Optimierungsziele:**
- Matchmaking: <10 reads pro Search
- Game Screen: <5 reads pro Load
- Private Match Join: <3 reads

### Function Execution Time

**Prüfe im Emulator:**
1. Functions Tab
2. Siehe "Duration" für jeden Call

**Optimierungsziele:**
- `matchmaking`: <2000ms
- `createPrivateMatch`: <1000ms
- `joinPrivateMatch`: <1000ms
- `updateElo`: <500ms

---

## 🚀 Next Steps: Production Testing

Wenn alles im Emulator funktioniert:

1. **Deploy zu Firebase:**
```bash
firebase deploy
```

2. **Build Development App:**
```bash
eas build --profile development --platform android
```

3. **Test mit echter Firebase:**
   - Deaktiviere Emulator in Code (auskommentieren)
   - Rebuild App
   - Teste alle Flows nochmal
   - Prüfe Kosten in Firebase Console

---

## 🎯 Quick Commands

| Command | Beschreibung |
|---------|-------------|
| `firebase emulators:start` | Emulator starten |
| `firebase emulators:start --only functions,firestore` | Nur Functions + Firestore |
| `firebase emulators:export ./emulator-data` | Daten exportieren |
| `firebase emulators:start --import ./emulator-data` | Mit Daten starten |
| `npx expo start` | App starten (Development) |
| `npx expo start --clear` | App mit Cache-Clear starten |

---

**Happy Testing! 🎮**

Fragen? Schaue in `DEPLOYMENT.md` für Production Deployment.
