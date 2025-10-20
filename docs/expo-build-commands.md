# Expo Development Build - Command Cheat Sheet 📋

## 🔧 Tägliche Entwicklung

```bash
# App starten (normalerweise)
npx expo start --dev-client

# App starten + Cache leeren (bei Problemen)
npx expo start --dev-client -c
```

**Nach dem Start:** App auf dem Handy öffnen (nicht Expo Go!)

---

## 🏗️ Neu builden (nur wenn nötig)

### Wann neu builden?
- ✅ Neue native Dependencies installiert
- ✅ `app.json` geändert (Permissions, Name, etc.)
- ✅ Native Code geändert
- ✅ Nach erstem Clone/Setup

```bash
# Android Build (lokal, schnell)
npx expo run:android

# iOS Build (lokal, braucht Mac)
npx expo run:ios
```

**Dauer:** 2-5 Minuten beim ersten Mal, danach schneller

---

## 📦 APK/AAB für andere Leute

```bash
# Preview APK (für Tester ohne USB)
eas build --profile preview --platform android

# Production AAB (für Google Play Store)
eas build --profile production --platform android

# Beide Plattformen gleichzeitig
eas build --profile production --platform all
```

**Dauer:** 10-20 Minuten (läuft in der Cloud)

---

## 🚨 Problem-Solving

```bash
# Level 1: Cache leeren
npx expo start --dev-client -c

# Level 2: Node Modules neu
rm -rf node_modules
npm install

# Level 3: Android Clean
cd android
./gradlew clean
cd ..

# Level 4: Komplett-Reset
rm -rf node_modules
npm install
cd android && ./gradlew clean && cd ..
npx expo run:android
```

---

## 📱 Workflow-Übersicht

```bash
# ── Morgens / Projekt öffnen ──
npx expo start --dev-client

# ── Code ändern ──
# → Automatisches Hot Reload ✅

# ── Native Dependency hinzugefügt ──
npx expo run:android

# ── Tester-APK erstellen ──
eas build --profile preview --platform android

# ── Release vorbereiten ──
eas build --profile production --platform android
```

---

## 💡 Quick Reference

| Befehl | Wann? | Dauer |
|--------|-------|-------|
| `expo start --dev-client` | **Jeden Tag** | Sofort |
| `expo start --dev-client -c` | Bei Cache-Problemen | Sofort |
| `expo run:android` | Native Änderungen | 2-5 Min |
| `eas build --profile preview` | APK für Tester | 10-20 Min |
| `eas build --profile production` | Play Store Release | 10-20 Min |

---

## 🎯 99% der Zeit brauchst du nur:

```bash
npx expo start --dev-client
```

---

## 📝 Notizen

### Expo Go vs Development Build
- ❌ **Expo Go:** Funktioniert NICHT mehr (wegen Google Auth)
- ✅ **Development Build:** Deine eigene App mit native Code

### Hot Reload
- Funktioniert wie bei Expo Go
- Code ändern → Automatisch neu laden
- Kein manuelles Neu-Builden nötig (außer bei native Änderungen)

### EAS Builds
- Benötigt Expo Account (kostenlos)
- Login: `eas login`
- Build-Status: https://expo.dev/accounts/[dein-username]/projects

---

**Erstellt:** Oktober 2025  
**Projekt:** Sudoku App mit Google Auth