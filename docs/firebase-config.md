# Firebase Configuration

Diese Anleitung erklärt, wie du `google-services.json` für Firebase Authentication (inkl. Google Sign-In) einrichtest.

## Übersicht

Die `google-services.json` verbindet die App mit deinem Firebase-Projekt. Sie enthält:
- Firebase Project ID
- API Keys (öffentlich, eingeschränkt auf deine App)
- OAuth Client IDs
- SHA-1 Fingerprints für Google Sign-In

> **Hinweis:** Diese Datei ist in `.gitignore` und wird nicht committed. Du musst sie lokal haben.

## Benötigte SHA-1 Fingerprints

Für Google Sign-In brauchst du **ZWEI SHA-1s** in Firebase:

| SHA-1 Quelle | Verwendung | Wo zu finden |
|--------------|------------|--------------|
| EAS Upload Key | Development & Preview | [expo.dev](https://expo.dev) → Projekt → Credentials → Android |
| Google Play App Signing Key | Production (Play Store) | [Play Console](https://play.google.com/console) → App → Einrichtung → App-Integrität |

## SHA-1 von EAS holen (Development/Preview)

1. Öffne [expo.dev](https://expo.dev)
2. Wähle dein Projekt
3. Gehe zu **Credentials** → **Android**
4. Unter "Keystore" findest du den **SHA-1 Fingerprint**
5. Kopiere den SHA-1

## SHA-1 von Google Play holen (Production)

1. Öffne die [Google Play Console](https://play.google.com/console)
2. Wähle deine App
3. Im Menü: **Einrichtung** → **App-Integrität**
4. Wähle den Tab **App-Signatur**
5. Unter "Zertifikat für den App-Signaturschlüssel" findest du den **SHA-1**
6. Kopiere den SHA-1

## SHA-1 zu Firebase hinzufügen

1. Öffne die [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf ⚙️ → **Projekteinstellungen**
3. Scrolle zu deiner **Android App**
4. Klicke **"Fingerabdruck hinzufügen"**
5. Füge den SHA-1 ein → **Speichern**
6. Wiederhole für den zweiten SHA-1

## google-services.json aktualisieren

Nach dem Hinzufügen von SHA-1s:

1. In Firebase Console: Klicke **"google-services.json herunterladen"**
2. Ersetze die Datei im **Projekt-Root** (`./google-services.json`)
3. Erstelle einen neuen Build:

```bash
# Development
eas build --profile development --platform android

# Production (Play Store)
eas build --platform android
```

## Wann muss ich das machen?

| Situation | Aktion |
|-----------|--------|
| Neuer EAS Keystore | SHA-1 von expo.dev hinzufügen |
| Erste Play Store Veröffentlichung | SHA-1 von Play Console hinzufügen |
| `DEVELOPER_ERROR` bei Google Sign-In | Prüfen ob SHA-1 fehlt |
| Firebase-Projekt geändert | Neue google-services.json downloaden |

## Fehlerbehebung

### DEVELOPER_ERROR bei Google Sign-In

Dieses Problem tritt auf, wenn der SHA-1 Fingerprint nicht in Firebase registriert ist.

**Lösung:**
1. Prüfe welcher Build betroffen ist (Development oder Production)
2. Hole den entsprechenden SHA-1 (von expo.dev oder Play Console)
3. Füge ihn zu Firebase hinzu
4. Lade neue google-services.json herunter
5. Erstelle neuen Build
