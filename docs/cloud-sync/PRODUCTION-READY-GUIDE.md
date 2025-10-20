# 🚀 Produktions-Guide für Sudoku Duo

**So bringst du In-App-Käufe & Abonnements live!**

Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung - auch ohne vorherige Erfahrung mit App-Monetarisierung.

---

## 📋 Inhaltsverzeichnis

1. [Schnell-Check: Bist du bereit?](#schnell-check)
2. [Google Play Console einrichten (30 Min)](#google-play)
3. [RevenueCat einrichten (20 Min)](#revenuecat)
4. [Legal Docs erstellen (2-4 Std)](#legal-docs)
5. [Testen (30 Min)](#testen)
6. [Live-Schalten](#live-schalten)
7. [Troubleshooting](#troubleshooting)

---

## <a id="schnell-check"></a>✅ Schnell-Check: Bist du bereit?

Bevor du startest, prüfe diese Punkte:

- [ ] App kompiliert ohne Fehler
- [ ] Du hast einen **Google Play Console** Account
- [ ] Du hast einen **RevenueCat** Account (kostenlos: [app.revenuecat.com](https://app.revenuecat.com))
- [ ] Du hast 2-3 Stunden Zeit

**Preise für deine Produkte:**
- ☕ Kaffee: €1,99
- 🥐 Frühstück: €4,99
- 🍱 Mittagessen: €9,99
- 👑 Festmahl: €19,99
- 📅 Monatliches Abo: €1,99/Monat
- 🎯 Jährliches Abo: €19,99/Jahr

---

## <a id="google-play"></a>🎮 Google Play Console einrichten

### Schritt 1: Einmalkäufe erstellen (15 Min)

1. **Öffne Google Play Console:** [play.google.com/console](https://play.google.com/console)
2. **Navigiere zu:** Deine App → **Monetarisierung** → **In-App-Produkte**
3. **Klicke auf:** "Produkt erstellen"

**Erstelle 4 Produkte:**

| Produkt-ID | Name | Beschreibung | Preis | Typ |
|------------|------|--------------|-------|-----|
| `de.playfusiongate.sudokuduo.coffee` | Kaffee | Ein Kaffee für den Entwickler | €1,99 | **Non-consumable** |
| `de.playfusiongate.sudokuduo.breakfast` | Frühstück | Ein leckeres Frühstück | €4,99 | **Non-consumable** |
| `de.playfusiongate.sudokuduo.lunch` | Mittagessen | Ein nahrhaftes Mittagessen | €9,99 | **Non-consumable** |
| `de.playfusiongate.sudokuduo.feast` | Festmahl | Ein königliches Festmahl | €19,99 | **Non-consumable** |

**WICHTIG:**
- ✅ Typ = **"Non-consumable"** (damit "Käufe wiederherstellen" funktioniert)
- ✅ Produkt-IDs **EXAKT** wie oben eingeben (Groß-/Kleinschreibung beachten!)
- ✅ Nach dem Erstellen: Produkte auf **"Aktiv"** setzen

### Schritt 2: Abonnements erstellen (15 Min)

1. **Navigiere zu:** **Monetarisierung** → **Abonnements**
2. **Klicke auf:** "Abonnement erstellen"

**Abo 1: Monatlich**
- **Abonnement-ID:** `de.playfusiongate.sudokuduo.monthly`
- **Name:** Monatlicher Support
- **Basis-Tarif-ID:** `monthly`
- **Preis:** €1,99/Monat
- **Zahlungszyklus:** Monatlich
- **Grace Period:** 7 Tage (empfohlen)

**Abo 2: Jährlich**
- **Abonnement-ID:** `de.playfusiongate.sudokuduo.yearly`
- **Name:** Jährlicher Support
- **Basis-Tarif-ID:** `yearly`
- **Preis:** €19,99/Jahr
- **Zahlungszyklus:** Jährlich
- **Grace Period:** 7 Tage (empfohlen)

**WICHTIG:**
- ✅ Produkt-IDs **EXAKT** wie oben eingeben
- ✅ "Grace Period" aktivieren (gibt Nutzern Zeit bei Zahlungsproblemen)
- ✅ Nach dem Erstellen: Abos auf **"Aktiv"** setzen

### Schritt 3: Service Account erstellen

1. **Navigiere zu:** **Setup** → **API-Zugriff**
2. **Klicke auf:** "Service Account erstellen" (falls noch nicht vorhanden)
3. **Folge der Anleitung:** Link zu Google Cloud Console
4. **Erstelle einen Service Account:**
   - Name: z.B. "RevenueCat Integration"
   - Rolle: **"Viewer"** + **"Financial data viewer"**
5. **Erstelle einen Schlüssel (JSON-Datei):**
   - Im Service Account → "Schlüssel" → "Schlüssel erstellen" → JSON
6. **Lade die JSON-Datei herunter** (du brauchst sie gleich für RevenueCat)

---

## <a id="revenuecat"></a>🔧 RevenueCat einrichten

### Schritt 1: Projekt erstellen

1. **Gehe zu:** [app.revenuecat.com](https://app.revenuecat.com)
2. **Erstelle ein neues Projekt:** "Sudoku Duo"
3. **Wähle:** Android (Google Play)

### Schritt 2: Google Play verbinden

1. **Navigiere zu:** **Project Settings** → **Integrations** → **Google Play**
2. **Lade deine Service Account JSON-Datei hoch** (aus Google Play Console)
3. **Package Name eingeben:** `de.playfusiongate.sudokuduo`
4. **Klicke auf:** "Save"

### Schritt 3: Entitlement erstellen

**Was ist ein Entitlement?**
Ein Entitlement ist wie eine "Zugangsberechtigung". Alle 6 Produkte (4 Einmalkäufe + 2 Abos) geben dem Nutzer das gleiche Entitlement: **"supporter"**.

1. **Navigiere zu:** **Entitlements**
2. **Klicke auf:** "Create Entitlement"
3. **Identifier:** `supporter`
4. **Display Name:** "Supporter"
5. **Klicke auf:** "Create"

### Schritt 4: Produkte hinzufügen

1. **Navigiere zu:** **Products**
2. **Klicke auf:** "Add Product"
3. **Füge alle 6 Produkte hinzu:**

**Einmalkäufe:**
- Product ID: `de.playfusiongate.sudokuduo.coffee` → Entitlement: `supporter`
- Product ID: `de.playfusiongate.sudokuduo.breakfast` → Entitlement: `supporter`
- Product ID: `de.playfusiongate.sudokuduo.lunch` → Entitlement: `supporter`
- Product ID: `de.playfusiongate.sudokuduo.feast` → Entitlement: `supporter`

**Abonnements:**
- Product ID: `de.playfusiongate.sudokuduo.monthly:monthly` → Entitlement: `supporter`
- Product ID: `de.playfusiongate.sudokuduo.yearly:yearly` → Entitlement: `supporter`

**WICHTIG für Abos:**
Die Product ID für Abos ist: `[Abo-ID]:[Basis-Tarif-ID]`
Beispiel: `de.playfusiongate.sudokuduo.monthly:monthly`

### Schritt 5: Offerings erstellen

**Was ist ein Offering?**
Ein Offering ist eine Sammlung von Produkten, die du in der App anzeigst.

1. **Navigiere zu:** **Offerings**
2. **Klicke auf:** "Create Offering"
3. **Identifier:** `default`
4. **Display Name:** "Standard"
5. **Füge Packages hinzu:**

**One-Time Packages:**
- Identifier: `coffee` → Product: `de.playfusiongate.sudokuduo.coffee`
- Identifier: `breakfast` → Product: `de.playfusiongate.sudokuduo.breakfast`
- Identifier: `lunch` → Product: `de.playfusiongate.sudokuduo.lunch`
- Identifier: `feast` → Product: `de.playfusiongate.sudokuduo.feast`

**Subscription Packages:**
- Identifier: `$rc_monthly` → Product: `de.playfusiongate.sudokuduo.monthly:monthly`
- Identifier: `$rc_annual` → Product: `de.playfusiongate.sudokuduo.yearly:yearly`

**WICHTIG:**
- Für Abos verwende die **speziellen Identifier**: `$rc_monthly` und `$rc_annual`
- Diese sorgen dafür, dass RevenueCat die Produkte automatisch richtig zuordnet

### Schritt 6: API Keys kopieren

1. **Navigiere zu:** **Project Settings** → **API Keys**
2. **Kopiere den "Public Android Key"**
3. **Füge ihn in deinen Code ein:**

Öffne: `screens/SupportShop/utils/billing/config.ts`

```typescript
REVENUECAT_API_KEY_ANDROID: "goog_DEIN_KEY_HIER",
```

---

## <a id="legal-docs"></a>📜 Legal Docs erstellen

**Warum brauchst du das?**
Google Play verlangt für Apps mit In-App-Käufen:
- ✅ **Datenschutzerklärung** (Privacy Policy)
- ✅ **Nutzungsbedingungen** (Terms of Service) - PFLICHT für Abos!

### Option A: Einfach mit Generator (empfohlen für Einsteiger)

**1. Datenschutzerklärung erstellen:**
- Gehe zu: [www.e-recht24.de/muster-datenschutzerklaerung.html](https://www.e-recht24.de/muster-datenschutzerklaerung.html)
- Fülle das Formular aus
- Erwähne: RevenueCat, Google Play Billing
- Lade das PDF herunter

**2. Nutzungsbedingungen erstellen:**
- Gehe zu: [www.e-recht24.de/muster-nutzungsbedingungen.html](https://www.e-recht24.de/muster-nutzungsbedingungen.html)
- Wichtig: Erwähne Preise (€1,99 / €19,99), Kündigungsrecht, Widerrufsrecht
- Lade das PDF herunter

**3. Hochladen:**
- Option 1: **In der App** (erstelle einen "Legal"-Screen)
- Option 2: **GitHub Pages** (kostenlos):
  1. Erstelle ein GitHub Repo "sudoku-duo-legal"
  2. Lade PDFs hoch (konvertiere zu HTML/Markdown)
  3. Aktiviere GitHub Pages
  4. URLs: `https://deinuser.github.io/sudoku-duo-legal/privacy`

**4. URLs in Google Play Console eintragen:**
- **App content** → **Privacy policy** → URL eintragen
- **Monetization** → **Subscriptions** → [Abo auswählen] → **Terms of service** → URL eintragen

---

## <a id="testen"></a>🧪 Testen

### Schritt 1: License Testing aktivieren

**Was ist License Testing?**
Du kannst Käufe **ohne echtes Geld** testen!

1. **Google Play Console:** **Setup** → **License testing**
2. **Füge deine Test-E-Mail hinzu** (die du auf deinem Testgerät verwendest)
3. **Klicke auf:** "Save"

### Schritt 2: Test-Build installieren

1. **Erstelle einen Internal Testing Build:**
   ```bash
   eas build --profile preview --platform android
   ```
2. **Installiere die App auf einem echten Gerät** (Emulator funktioniert NICHT für In-App-Käufe!)
3. **Melde dich mit deinem Test-Account an**

### Schritt 3: Kaufe etwas

**Test 1: Einmalkauf**
1. Öffne den Support Shop
2. Kaufe "Kaffee" (€1,99)
3. **Erwartetes Verhalten:**
   - ✅ Kauf wird verarbeitet (Google Play Dialog)
   - ✅ "Vielen Dank"-Meldung
   - ✅ 2× EP ist aktiv
   - ✅ Schutzschilder werden aufgefüllt
   - ✅ 1 Bild kann freigeschaltet werden

**Test 2: Abo**
1. Kaufe "Monatliches Abo" (€1,99/Monat)
2. **Erwartetes Verhalten:**
   - ✅ Abo wird aktiviert
   - ✅ 3 Schutzschilder pro Woche (Montags)
   - ✅ 1 Bild pro Monat freigeschaltet
   - ✅ Im Support Shop steht "Aktives Abo"

**Test 3: Jährliches Abo**
1. Kaufe "Jährliches Abo" (€19,99/Jahr)
2. **Erwartetes Verhalten:**
   - ✅ **4 Schutzschilder pro Woche** (statt 3!)
   - ✅ 2 Bilder pro Monat freigeschaltet

**Test 4: Restore Purchases**
1. Deinstalliere die App
2. Installiere neu
3. Klicke "Käufe wiederherstellen"
4. **Erwartetes Verhalten:**
   - ✅ Alle Benefits sind wieder da

### Schritt 4: RevenueCat Dashboard prüfen

1. **Gehe zu:** [app.revenuecat.com](https://app.revenuecat.com) → **Customers**
2. **Suche deine User-ID** (wird in der App angezeigt)
3. **Prüfe:**
   - ✅ `supporter` Entitlement ist aktiv
   - ✅ Kauf ist unter "Transactions" sichtbar

---

## <a id="live-schalten"></a>🎉 Live-Schalten

### Finale Checkliste

**Google Play Console:**
- [ ] Alle 6 Produkte auf "Aktiv"
- [ ] Grace Period aktiviert (7 Tage)
- [ ] Preise korrekt (€1,99 & €19,99)
- [ ] Privacy Policy URL eingetragen
- [ ] Terms of Service URL eingetragen

**RevenueCat:**
- [ ] Entitlement `supporter` erstellt
- [ ] Alle 6 Products verknüpft
- [ ] Offerings konfiguriert (`default`)
- [ ] Service Account verbunden
- [ ] Test-Kauf erfolgreich

**Code:**
- [ ] API Key in `config.ts` gesetzt
- [ ] App kompiliert ohne Fehler
- [ ] Legal Docs eingebunden

### App veröffentlichen

1. **Erstelle Production Build:**
   ```bash
   eas build --profile production --platform android
   ```

2. **Google Play Console:**
   - **Release** → **Production**
   - **Create new release**
   - Upload AAB
   - **Review** → **Go Live**

🎊 **FERTIG! Deine In-App-Käufe sind jetzt live!**

---

## <a id="troubleshooting"></a>🆘 Troubleshooting

### "Warum zeigt meine APK andere Preise als Expo Go?"

**Problem:**
- Expo Go: €1,99 / €19,99 ✅
- APK Build: €2,99 / €29,99 ❌

**Ursache:**
Expo Go nutzt **hardcoded Fallback-Preise** aus den Übersetzungsdateien.
Die APK verbindet sich mit **RevenueCat**, das die Preise aus der **Google Play Console** holt.

**Lösung:**
1. **Google Play Console öffnen**
2. **Monetarisierung** → **Abonnements** → [Abo auswählen]
3. **Preise bearbeiten:** €1,99/Monat & €19,99/Jahr
4. **Speichern**
5. **Warte 1-2 Stunden** (Google braucht Zeit zum Synchronisieren)
6. **Neuen Build erstellen** → Preise sollten jetzt stimmen!

---

### "Product not found"

**Lösung:**
- ✅ Product-IDs in Google Play Console & RevenueCat **identisch**?
- ✅ Warte 1-2 Stunden nach dem Erstellen (Google braucht Zeit)
- ✅ App in **Internal Testing** (nicht Draft)?
- ✅ RevenueCat Service Account korrekt verbunden?

---

### "Entitlement nicht aktiv nach Kauf"

**Lösung:**
1. **RevenueCat Dashboard** → **Customers** → **Transactions**
2. **Prüfe:** Ist der Kauf dort sichtbar?
3. **Falls NEIN:**
   - Service Account Permissions prüfen (muss "Financial data viewer" haben)
   - RevenueCat → Project Settings → Integrations → Google Play neu verbinden
4. **Falls JA, aber Entitlement nicht aktiv:**
   - Prüfe Entitlement-Zuordnung in RevenueCat Products

---

### "Restore Purchases funktioniert nicht"

**Lösung:**
- ✅ Produkte als **"Non-consumable"** markiert? (in Google Play Console)
- ✅ Gleicher Google-Account auf beiden Geräten?
- ✅ Package Name identisch? (`de.playfusiongate.sudokuduo`)

---

### "Kauf wird nicht registriert / Schilde nicht aufgefüllt"

**Lösung:**
1. **Prüfe Logs:**
   ```
   [BillingManager] Purchase successful
   [Daily Streak] Shields refilled
   ```
2. **Falls Logs fehlen:** SupportShop.tsx → handlePurchaseCompleted nicht aufgerufen
3. **Prüfe:** RevenueCat Events kommen an? (`purchase-completed`)

---

## 📊 Nach dem Launch: Monitoring

### Google Play Analytics
**Monetarisierung → Übersicht:**
- Buyers (zahlende Nutzer)
- Revenue (Einnahmen)
- Subscriptions (aktive Abos)

### RevenueCat Charts
**Overview / Charts:**
- Active Subscribers
- Revenue über Zeit
- Churn Rate

---

## 🌍 Internationaler Verkauf

**Was automatisch funktioniert:**
- ✅ Google Play rechnet Währungen automatisch um
- ✅ Steuern werden automatisch abgezogen
- ✅ RevenueCat funktioniert global

**Was du tun musst:**

### Länder freischalten
```
Play Console → Release → Production → Countries/regions
```

**Empfohlen:**
- **Phase 1:** DACH (DE, AT, CH)
- **Phase 2:** EU (FR, IT, ES, NL, etc.)
- **Phase 3:** Global (USA, UK, CA, AU)

### Preise anpassen (optional)
- **Standard:** Google rechnet um (€1,99 → $2,19)
- **Optional:** Manuell setzen (€1,99 → $1,99)
- **Tipp:** Runde Beträge wirken attraktiver

---

## 🎓 Weitere Ressourcen

**Externe Docs:**
- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [DSGVO Info](https://gdpr.eu/)

---

**🎯 Mit dieser Anleitung bist du produktionsbereit!**

Bei Problemen: Google Play / RevenueCat Support kontaktieren
