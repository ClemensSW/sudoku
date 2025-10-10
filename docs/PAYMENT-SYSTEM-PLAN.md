# Payment System - Production-Ready Plan

**Ziel:** Payment-System Production-Ready machen für Android (Google Play)

**Status:** In Progress (gestartet am 2025-10-10)

**Gesamtaufwand geschätzt:** 15-22 Stunden über mehrere Sessions

---

## 🎯 ÜBERSICHT: HAUPTAUFGABEN

| # | Aufgabe | Status | Priorität | Zeitaufwand |
|---|---------|--------|-----------|-------------|
| 1 | Multiple Unlocks (Quota-System) | 🔄 TODO | **CRITICAL** | 4-6h |
| 2 | Restore Purchases Button | 🔄 TODO | **CRITICAL** | 1-2h |
| 3 | Error Handling erweitern | 🔄 TODO | **CRITICAL** | 2-3h |
| 4 | Legal Requirements (Settings) | 🔄 TODO | **CRITICAL** | 3-4h |
| 5 | Tests schreiben | 🔄 TODO | HIGH | 4-6h |
| 6 | iOS Vorbereitung | 🔄 TODO | LOW | 1-2h |
| 7 | Production Polish | 🔄 TODO | MEDIUM | 2-3h |

**Status-Legende:**
- ✅ DONE
- 🔄 TODO
- ⏸️ BLOCKED
- 🚧 IN PROGRESS

---

## 📋 SESSION 1: Multiple Unlocks + Quick Wins

### AUFGABE 1: Multiple Unlocks (Quota-System) ⚡ CRITICAL

**Problem:**
- Aktuell: Nutzer kann max. 1 Unlock gleichzeitig haben (lifetime)
- Soll: Multiple Unlocks möglich
  - 3× Kaffee kaufen → 3 Unlocks verfügbar
  - Yearly Abo → 2 Unlocks/Monat (akkumulieren nicht!)

**Dateien zu ändern:**
- `modules/subscriptions/types.ts`
- `modules/subscriptions/entitlements.ts`
- `modules/gallery/supporterUnlocks.ts`
- `screens/Gallery/components/.../ImageDetailModal.tsx`
- `screens/Settings/DevTestingMenu.tsx`

**Schritte:**
1. ✅ Analysiere aktuelles Quota-System
2. ⬜ Ändere `lifetimeUnlocks` → unlimited für One-time
3. ⬜ Implementiere Purchase-Counter (wie oft gekauft?)
4. ⬜ Teste DevTestingMenu mit 3× Kaffee
5. ⬜ Teste Gallery-Integration

**Akzeptanzkriterien:**
- [ ] DevTestingMenu: 3× Kaffee kaufen funktioniert
- [ ] DevTestingMenu: Status zeigt "3 Bilder übrig"
- [ ] Gallery: Alle 3 Unlocks nacheinander möglich
- [ ] Yearly Abo: Max 2 Unlocks gleichzeitig (reset am 1. des Monats)

---

### AUFGABE 2: Restore Purchases Button ⚡ CRITICAL

**Dateien zu ändern:**
- `screens/SupportShop/SupportShop.tsx`
- `locales/de|en|hi/supportShop.json`

**Schritte:**
1. ⬜ Button in Header/Footer hinzufügen
2. ⬜ Event-Handler `handleRestorePurchases`
3. ⬜ Loading-State während Restore
4. ⬜ Success-Toast: "Käufe wiederhergestellt"
5. ⬜ Übersetzungen hinzufügen

**Akzeptanzkriterien:**
- [ ] Button sichtbar im Support Shop
- [ ] Restore funktioniert (testet mit DevTool)
- [ ] User-Feedback bei Erfolg/Fehler

---

### AUFGABE 3: Error Handling erweitern ⚡ CRITICAL

**Dateien zu ändern:**
- `screens/SupportShop/utils/billing/BillingManager.ts`
- `locales/de|en|hi/supportShop.json`

**Schritte:**
1. ⬜ Network Error Detection
2. ⬜ Product Not Found Error
3. ⬜ Already Owned Error
4. ⬜ Übersetzungen für alle Error-Codes
5. ⬜ User-friendly Error-Messages

**Akzeptanzkriterien:**
- [ ] Network Error zeigt "Keine Verbindung"
- [ ] Product Not Found zeigt "Produkt nicht verfügbar"
- [ ] Already Owned zeigt "Bereits gekauft"

---

## 📋 SESSION 2: Legal Requirements

### AUFGABE 4: Legal Requirements (Settings) ⚡ CRITICAL

**Was muss rechtlich angezeigt werden (EU/DE):**

1. **Impressum** (TMG §5 - Pflicht in DE!)
   - Name, Adresse, E-Mail
   - Umsatzsteuer-ID (falls vorhanden)

2. **Datenschutzerklärung** (DSGVO Art. 13)
   - Welche Daten werden gesammelt?
   - RevenueCat, Google Analytics (falls verwendet)
   - Nutzerrechte (Auskunft, Löschung)

3. **Nutzungsbedingungen/AGB** (für Abos)
   - Abo-Laufzeit, Kündigungsfrist
   - Preise, Zahlungsbedingungen
   - Widerrufsrecht (14 Tage)

4. **Widerrufsbelehrung** (EU-Richtlinie 2011/83/EU)
   - Widerruf innerhalb 14 Tagen
   - Formular oder Muster-Widerruf

**UI/UX Integration in Settings:**

```
Settings Screen
├── Allgemein
│   ├── Sprache
│   ├── Theme
│   └── ...
├── Support
│   ├── Support Shop
│   └── Käufe wiederherstellen ← NEU
├── Rechtliches ← NEU SECTION
│   ├── Impressum
│   ├── Datenschutz
│   ├── Nutzungsbedingungen
│   └── Widerrufsrecht
└── App-Info
    ├── Version
    └── Lizenzen
```

**Dateien zu ändern:**
- `screens/Settings/Settings.tsx`
- `screens/Settings/LegalScreen.tsx` (NEU)
- `locales/de|en|hi/settings.json`

**Schritte:**
1. ⬜ Erstelle `LegalScreen.tsx` (WebView oder ScrollView)
2. ⬜ Füge "Rechtliches" Section in Settings hinzu
3. ⬜ Erstelle Markdown-Dateien für Legal Docs
4. ⬜ Implementiere ScrollView mit Markdown-Rendering
5. ⬜ Füge "Käufe wiederherstellen" in Settings hinzu

**Akzeptanzkriterien:**
- [ ] Impressum anzeigbar
- [ ] Datenschutz anzeigbar
- [ ] AGB anzeigbar
- [ ] Widerrufsrecht anzeigbar
- [ ] UI harmonisch integriert
- [ ] Alle Texte übersetzt (DE/EN)

---

## 📋 SESSION 3: Testing & Polish

### AUFGABE 5: Tests schreiben

**Test-Dateien zu erstellen:**
- `modules/subscriptions/__tests__/entitlements.test.ts`
- `screens/SupportShop/__tests__/BillingManager.test.ts`
- `modules/subscriptions/__tests__/SubscriptionService.test.ts`

**Test-Cases:**
1. ⬜ Purchase Flow (Success)
2. ⬜ Purchase Flow (Cancelled)
3. ⬜ Purchase Flow (Network Error)
4. ⬜ Restore Purchases
5. ⬜ Multiple Unlocks (One-time)
6. ⬜ Monthly Quota Reset
7. ⬜ Yearly Quota (2/Monat)

---

### AUFGABE 6: iOS Vorbereitung (LOW PRIORITY)

**Dateien zu ändern:**
- `screens/SupportShop/utils/billing/config.ts`
- `app.json`

**Schritte:**
1. ⬜ Placeholder für iOS API Key lassen
2. ⬜ iOS Bundle Identifier in app.json vorbereiten
3. ⬜ Kommentare für spätere iOS-Integration
4. ⬜ iOS-spezifische Docs erstellen

---

### AUFGABE 7: Production Polish

**Schritte:**
1. ⬜ Debug-Logs für Production bereinigen
2. ⬜ Performance-Optimierung (Memoization)
3. ⬜ Error-Boundary für SupportShop
4. ⬜ Analytics-Events für Käufe
5. ⬜ Final Testing auf echtem Gerät

---

## 🔗 ABHÄNGIGKEITEN

```
SESSION 1:
- Multiple Unlocks (KEINE Abhängigkeiten) → START HIER
- Restore Button (KEINE Abhängigkeiten) → Parallel möglich
- Error Handling (KEINE Abhängigkeiten) → Parallel möglich

SESSION 2:
- Legal Requirements (Abhängig: EXTERNAL-TASKS.md) → Externe Docs zuerst

SESSION 3:
- Tests (Abhängig: Alle anderen fertig)
- iOS Prep (KEINE Abhängigkeiten)
- Production Polish (Abhängig: Alle anderen fertig)
```

---

## 📊 FORTSCHRITT TRACKING

**Siehe:** [PAYMENT-SYSTEM-PROGRESS.md](./PAYMENT-SYSTEM-PROGRESS.md)

**Update nach jeder Session:**
```bash
# Markiere Task als DONE
# Notiere Probleme/Learnings
# Update Zeitaufwand
```

---

## 🚀 LAUNCH CHECKLIST (Final)

**Vor dem Launch:**

- [ ] Alle CRITICAL Tasks erledigt
- [ ] Tests laufen grün
- [ ] Test-Käufe auf echtem Gerät erfolgreich
- [ ] Legal Docs veröffentlicht (Website/GitHub)
- [ ] URLs in app.json + Play Console eingetragen
- [ ] RevenueCat Dashboard konfiguriert
- [ ] Google Play Products erstellt
- [ ] Service Account JSON hochgeladen
- [ ] Internal Testing erfolgreich

**Nach dem Launch:**

- [ ] Analytics überwachen (erste 48h)
- [ ] Reviews checken (Billing-Probleme?)
- [ ] RevenueCat Dashboard täglich prüfen
- [ ] Support-Anfragen beantworten

---

**Next Step:** Starte mit SESSION 1, Task 1 (Multiple Unlocks)
