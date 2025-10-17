# Firebase Setup Guide - Schritt für Schritt

**Project:** Sudoku Duo
**Feature:** Google/Apple Sign-In + Cloud Synchronization
**Zielgruppe:** Du (als App-Entwickler)
**Geschätzte Zeit:** 30-45 Minuten

---

## 📋 Voraussetzungen

Bevor du startest, stelle sicher dass du hast:

- ✅ Ein Google-Konto (für Firebase Console)
- ✅ Zugriff auf dein Apple Developer Account (für Apple Sign-In)
- ✅ React Native Entwicklungsumgebung (bereits vorhanden)
- ✅ Xcode installiert (für iOS)
- ✅ Android Studio installiert (für Android)

---

## 🚀 Teil 1: Firebase Projekt erstellen

### **Schritt 1: Firebase Console öffnen**

1. Öffne [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Melde dich mit deinem Google-Konto an
3. Klicke auf **"Projekt hinzufügen"** (oder "Add project")

### **Schritt 2: Projekt-Name eingeben**

1. **Projektname:** `sudoku-duo` (oder ein anderer Name)
2. Klicke **"Weiter"**

### **Schritt 3: Google Analytics deaktiviert lassen**

1. **Wichtig:** **DEAKTIVIERE** Google Analytics für dieses Projekt
2. Wähle **"Don't enable Google Analytics for this project"** oder überspringe den Analytics-Schritt
3. Klicke **"Projekt erstellen"**

⚠️ **Warum kein Analytics?**
- Sudoku Duo nutzt **bewusst KEIN** Google Analytics um Datenschutz zu maximieren
- Keine Nutzer-Tracking-Daten werden erfasst
- Falls Analytics versehentlich aktiviert wurde: In Firebase Console → Projekteinstellungen → Integrationen → Analytics trennen

⏳ **Warte 30-60 Sekunden**, bis das Projekt erstellt wurde.

4. Klicke **"Weiter"**, um zur Übersicht zu gelangen

---

## 🔐 Teil 2: Authentication einrichten

### **Schritt 4: Authentication aktivieren**

1. In der linken Sidebar: **"Build"** → **"Authentication"**
2. Klicke **"Get started"** (oder "Loslegen")

### **Schritt 5: Google Sign-In aktivieren**

1. Im Tab **"Sign-in method"**: Klicke auf **"Google"**
2. Aktiviere den Toggle-Switch: **"Enable"**
3. **Project support email:** Wähle deine E-Mail-Adresse
4. Klicke **"Save"** (oder "Speichern")

✅ **Google Sign-In ist jetzt aktiviert!**

### **Schritt 6: Apple Sign-In aktivieren (iOS)**

1. Im Tab **"Sign-in method"**: Klicke auf **"Apple"**
2. Aktiviere den Toggle-Switch: **"Enable"**
3. Klicke **"Save"**

⚠️ **Wichtig:** Du musst Apple Sign-In auch in deinem Apple Developer Account konfigurieren (siehe Schritt 16).

---

## 🗄️ Teil 3: Firestore Database erstellen

### **Schritt 7: Firestore aktivieren**

1. In der linken Sidebar: **"Build"** → **"Firestore Database"**
2. Klicke **"Create database"** (oder "Datenbank erstellen")

### **Schritt 8: Security Rules auswählen**

1. Wähle: **"Start in production mode"** (sicherer)
2. Klicke **"Next"** (oder "Weiter")

### **Schritt 9: Location auswählen**

1. **Empfehlung:** `europe-west3` (Frankfurt) - für niedrigere Latenz in Europa
2. ⚠️ **Wichtig:** Diese Einstellung kann später NICHT geändert werden!
3. Klicke **"Enable"** (oder "Aktivieren")

⏳ **Warte 1-2 Minuten**, bis die Datenbank erstellt wurde.

---

## 🛡️ Teil 4: Security Rules konfigurieren

### **Schritt 10: Security Rules bearbeiten**

1. In Firestore Database: Klicke auf den Tab **"Rules"** (oder "Regeln")
2. **Lösche** den vorhandenen Code
3. **Kopiere und füge ein:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users können nur ihre eigenen Daten lesen/schreiben
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Sub-collections (profile, stats, settings, etc.)
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

4. Klicke **"Publish"** (oder "Veröffentlichen")

✅ **Security Rules sind jetzt aktiv!**

---

## 📱 Teil 5: iOS App konfigurieren

### **Schritt 11: iOS App hinzufügen**

1. In der Firebase Console: Gehe zur **Projektübersicht** (klicke auf "Project Overview" oben links)
2. Klicke auf das **iOS-Icon** (oder "Add app" → iOS)

### **Schritt 12: Bundle ID eingeben**

1. **Apple bundle ID:** `de.playfusiongate.sudokuduo`
   - ⚠️ **Wichtig:** Muss exakt mit der Bundle ID in deinem Xcode-Projekt übereinstimmen!
   - 📍 Zu finden in: `ios/sudoku.xcodeproj/project.pbxproj` oder Xcode → Projekt → "Bundle Identifier"

2. **App nickname (optional):** "Sudoku Duo iOS"
3. **App Store ID (optional):** Leer lassen (erst später, nach App Store Release)
4. Klicke **"App registrieren"** (oder "Register app")

### **Schritt 13: GoogleService-Info.plist herunterladen**

1. Klicke **"Download GoogleService-Info.plist"**
2. **Speichere die Datei** in einem sicheren Ordner (z.B. Desktop)

⚠️ **WICHTIG:** Diese Datei enthält Secrets - NICHT in Git committen!

3. Klicke **"Weiter"** (oder "Next")

### **Schritt 14: Firebase SDK hinzufügen (überspringen)**

1. **Schritt überspringen** - Wir installieren das SDK später via npm
2. Klicke **"Weiter"** (oder "Next")
3. Klicke **"Weiter zur Konsole"** (oder "Continue to console")

### **Schritt 15: GoogleService-Info.plist ins Projekt kopieren**

⚠️ **STOP! Nicht selbst machen - Ich übernehme das im nächsten Schritt:**

Wenn du die Datei heruntergeladen hast, **teile mir den Speicherort mit** (z.B. "Desktop") und ich kopiere sie automatisch ins Projekt.

**Zielordner:** `ios/GoogleService-Info.plist`

---

## 🍎 Teil 6: Apple Sign-In konfigurieren (iOS)

### **Schritt 16: Apple Developer Portal**

1. Öffne [https://developer.apple.com/account/](https://developer.apple.com/account/)
2. Melde dich an
3. Gehe zu **"Certificates, Identifiers & Profiles"**
4. Wähle **"Identifiers"** in der Sidebar
5. Wähle dein **App Identifier** (`de.playfusiongate.sudokuduo`)
6. Scrolle zu **"Sign in with Apple"**
7. Aktiviere die Checkbox ✅
8. Klicke **"Save"** (oder "Speichern")

⚠️ **Falls du noch keinen App Identifier hast:**
- Klicke auf **"+"** → "App IDs"
- **Bundle ID:** `de.playfusiongate.sudokuduo`
- **Capabilities:** Aktiviere "Sign in with Apple"
- Speichern

✅ **Apple Sign-In ist jetzt für deine App aktiviert!**

---

## 🤖 Teil 7: Android App konfigurieren

### **Schritt 17: Android App hinzufügen**

1. In der Firebase Console: Gehe zur **Projektübersicht**
2. Klicke auf das **Android-Icon** (oder "Add app" → Android)

### **Schritt 18: Package Name eingeben**

1. **Android package name:** `de.playfusiongate.sudokuduo`
   - ⚠️ **Wichtig:** Muss exakt mit der Package ID in `android/app/build.gradle` übereinstimmen!
   - 📍 Zu finden in: `android/app/build.gradle` → `applicationId`

2. **App nickname (optional):** "Sudoku Duo Android"
3. **Debug signing certificate SHA-1 (optional):** Leer lassen für jetzt
4. Klicke **"App registrieren"** (oder "Register app")

### **Schritt 19: google-services.json herunterladen**

1. Klicke **"Download google-services.json"**
2. **Speichere die Datei** in einem sicheren Ordner (z.B. Desktop)

⚠️ **WICHTIG:** Diese Datei enthält Secrets - NICHT in Git committen!

3. Klicke **"Weiter"** (oder "Next")

### **Schritt 20: Firebase SDK hinzufügen (überspringen)**

1. **Schritt überspringen** - Wir konfigurieren das später
2. Klicke **"Weiter"** (oder "Next")
3. Klicke **"Weiter zur Konsole"** (oder "Continue to console")

### **Schritt 21: google-services.json ins Projekt kopieren**

⚠️ **STOP! Nicht selbst machen - Ich übernehme das im nächsten Schritt:**

Wenn du die Datei heruntergeladen hast, **teile mir den Speicherort mit** (z.B. "Desktop") und ich kopiere sie automatisch ins Projekt.

**Zielordner:** `android/app/google-services.json`

---

## 🔑 Teil 8: Google Sign-In für Android (SHA-1)

### **Schritt 22: SHA-1 Fingerprint generieren**

⚠️ **Diesen Schritt machen wir gemeinsam im nächsten Schritt**, aber hier ist die Info:

**Für Debug-Builds:**
```bash
cd android && ./gradlew signingReport
```

**Output:**
```
Variant: debug
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

**Für Release-Builds:**
- Benötigt deinen Keystore (später, vor Release)

### **Schritt 23: SHA-1 in Firebase Console hinzufügen**

1. Firebase Console → **Projekteinstellungen** (⚙️ Icon oben links)
2. Scrolle zu **"Ihre Apps"** → Android-App
3. Klicke **"SHA-Zertifikat-Fingerabdrücke hinzufügen"**
4. Füge den SHA-1 aus Schritt 22 ein
5. Klicke **"Speichern"**

⏭️ **Wir machen das zusammen im nächsten Schritt!**

---

## ✅ Checkliste: Was du jetzt haben solltest

Bevor wir mit der Code-Integration starten, prüfe:

- ✅ **Firebase Projekt erstellt** (`sudoku-duo`)
- ✅ **Authentication aktiviert** (Google + Apple)
- ✅ **Firestore Database erstellt** (europe-west3)
- ✅ **Security Rules konfiguriert**
- ✅ **iOS App registriert** (Bundle ID: `de.playfusiongate.sudokuduo`)
- ✅ **GoogleService-Info.plist heruntergeladen**
- ✅ **Android App registriert** (Package: `de.playfusiongate.sudokuduo`)
- ✅ **google-services.json heruntergeladen**
- ✅ **Apple Sign-In aktiviert** (Developer Portal)

---

## 🎯 Nächste Schritte (Code-Integration)

**Nachdem du die obigen Schritte abgeschlossen hast:**

1. **Teile mir mit:**
   - ✅ "Alle Schritte abgeschlossen"
   - 📍 Speicherort der Config-Files (GoogleService-Info.plist, google-services.json)

2. **Ich werde dann:**
   - ✅ Config-Files ins Projekt kopieren
   - ✅ Firebase Dependencies installieren (`npm install`)
   - ✅ iOS Podfile aktualisieren (`pod install`)
   - ✅ Android build.gradle aktualisieren
   - ✅ Firebase initialisieren in App.tsx
   - ✅ Ersten Test-Build durchführen

3. **Dann starten wir mit:**
   - Phase 2: AuthContext erstellen
   - Phase 3: Google Sign-In implementieren
   - Phase 4: Apple Sign-In implementieren

---

## 🐛 Troubleshooting

### **Problem: "App not registered" Fehler**
**Lösung:** Prüfe ob Bundle ID (iOS) / Package Name (Android) exakt übereinstimmen

### **Problem: "google-services.json not found"**
**Lösung:** Datei muss in `android/app/google-services.json` liegen (nicht in `android/`)

### **Problem: "GoogleService-Info.plist not found"**
**Lösung:** Datei muss in `ios/GoogleService-Info.plist` liegen (nicht in `ios/sudoku/`)

### **Problem: Google Sign-In funktioniert nicht auf Android**
**Lösung:** SHA-1 Fingerprint in Firebase Console hinzufügen (Schritt 23)

### **Problem: Apple Sign-In funktioniert nicht**
**Lösung:**
1. Prüfe ob "Sign in with Apple" im Apple Developer Portal aktiviert ist
2. Prüfe ob Xcode die Capability "Sign in with Apple" hat

### **Problem: Firestore Permission Denied**
**Lösung:** Prüfe Security Rules (Schritt 10) - User muss eingeloggt sein

---

## 📚 Weiterführende Ressourcen

- [React Native Firebase Docs](https://rnfirebase.io/)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)
- [Apple Sign-In](https://developer.apple.com/sign-in-with-apple/)

---

## 📞 Fragen?

Wenn du bei einem Schritt nicht weiterkommst:

1. **Screenshot machen** vom Problem
2. **Mir Bescheid geben** mit:
   - Welcher Schritt?
   - Was ist der Fehler?
   - Screenshot (falls vorhanden)

Ich helfe dir sofort weiter! 🚀

---

**Happy Setup! 🎉**

Wenn du alle Schritte abgeschlossen hast, sag mir Bescheid und wir starten mit der Code-Integration!
