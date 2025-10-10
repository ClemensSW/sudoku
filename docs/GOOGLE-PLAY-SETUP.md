# Google Play Console Setup

Diese Anleitung zeigt, wie du In-App-Käufe und Abos in der Google Play Console einrichtest.

## 📋 Überblick

**Supporter-System:**
- **4 Einmalkäufe:** Kaffee, Frühstück, Mittagessen, Festmahl
- **2 Abonnements:** Monatlich, Jährlich

**Benefits nach Typ:**
- **Einmalkäufe:** 2× EP + 1 Bild freischalten (einmalig)
- **Monatliches Abo:** 2× EP + 1 Bild/Monat
- **Jährliches Abo:** 2× EP + 2 Bilder/Monat

---

## 1. Voraussetzungen

### App muss bereit sein:
- [ ] App in Google Play Console erstellt
- [ ] Package Name: `de.playfusiongate.sudokuduo`
- [ ] App in **Internal Testing** (nicht Draft!)
- [ ] APK/AAB hochgeladen

### Billing eingerichtet:
- [ ] Zahlungsprofil erstellt
- [ ] Steuernummer hinterlegt
- [ ] Bankkonto verbunden

---

## 2. Einmalkäufe erstellen

### Schritte:
1. Gehe zu **Monetize → In-app products**
2. Klicke **"Create product"**

### Produkte:

#### Produkt 1: Kaffee
- **Product ID:** `de.playfusiongate.sudokuduo.coffee`
- **Name:** `Kaffee` (DE) / `Coffee` (EN)
- **Description:**
  ```
  DE: Ein Kaffee für neue Rätsel-Ideen. 2× EP + 1 Bild freischalten.
  EN: A coffee for new puzzle ideas. 2× EP + unlock 1 image.
  ```
- **Price:** `€1.99`
- **Type:** **Non-consumable**
- **Status:** Active

#### Produkt 2: Frühstück
- **Product ID:** `de.playfusiongate.sudokuduo.breakfast`
- **Name:** `Frühstück` / `Breakfast`
- **Price:** `€4.99`
- **Type:** **Non-consumable**
- **Status:** Active

#### Produkt 3: Mittagessen
- **Product ID:** `de.playfusiongate.sudokuduo.lunch`
- **Name:** `Mittagessen` / `Lunch`
- **Price:** `€9.99`
- **Type:** **Non-consumable**
- **Status:** Active

#### Produkt 4: Festmahl
- **Product ID:** `de.playfusiongate.sudokuduo.feast`
- **Name:** `Festmahl` / `Feast`
- **Price:** `€19.99`
- **Type:** **Non-consumable**
- **Status:** Active

### ⚠️ Wichtig: Non-consumable vs Consumable
- ✅ **Non-consumable:** Kauf dauerhaft, "Restore Purchases" funktioniert
- ❌ **Consumable:** Mehrfachkauf möglich, nicht wiederherstellbar
- **Für Sudoku Duo:** Nutze **Non-consumable**!

---

## 3. Abonnements erstellen

### Schritte:
1. Gehe zu **Monetize → Subscriptions**
2. Klicke **"Create subscription"**

### Abo 1: Monatlich

#### Basic Details
- **Subscription ID:** `de.playfusiongate.sudokuduo.monthly`
- **Name:** `Monatlicher Support` / `Monthly Support`
- **Description:**
  ```
  DE: Unterstütze monatlich. 2× EP + 1 Bild pro Monat freischalten.
  EN: Support monthly. 2× EP + unlock 1 image per month.
  ```

#### Base Plan
- **Plan ID:** `monthly`
- **Billing Period:** 1 Month
- **Price:** `€2.99/Monat`
- **Auto-Renewal:** ✅ Enabled
- **Free Trial:** ❌ Optional
- **Grace Period:** ✅ **7 days** (empfohlen!)
- **Account Hold:** ❌ Optional

### Abo 2: Jährlich

#### Basic Details
- **Subscription ID:** `de.playfusiongate.sudokuduo.yearly`
- **Name:** `Jährlicher Support` / `Yearly Support`
- **Description:**
  ```
  DE: Unterstütze jährlich. 2× EP + 2 Bilder pro Monat freischalten.
  EN: Support yearly. 2× EP + unlock 2 images per month.
  ```

#### Base Plan
- **Plan ID:** `yearly`
- **Billing Period:** 1 Year
- **Price:** `€29.99/Jahr` (16% Ersparnis)
- **Grace Period:** ✅ **7 days**

### Grace Period erklärt:
- **Was:** Nutzer behält Benefits bei Zahlungsproblemen
- **Dauer:** 7 Tage
- **Zweck:** Zeit zum Zahlungsmethode aktualisieren
- **Im Code:** `isInGracePeriod: boolean` in `SupporterStatus`

---

## 4. Länder freischalten

### Distribution konfigurieren:
1. Gehe zu **Release → Production → Countries/regions**
2. Wähle Zielländer aus

### Empfohlene Strategie:

#### Phase 1: DACH (Start)
- ✅ Deutschland
- ✅ Österreich
- ✅ Schweiz

#### Phase 2: EU (später)
- Frankreich, Italien, Spanien, Niederlande, etc.

#### Phase 3: Global (später)
- USA, UK, Kanada, Australien, etc.

### Preise pro Land (optional):
- **Standard:** Google rechnet automatisch um
- **Optional:** Preise manuell setzen
- **Beispiel:** €1.99 → USA: $1.99 (statt $2.19)

---

## 5. Test-Tracks einrichten

### Internal Testing
1. Gehe zu **Release → Testing → Internal testing**
2. Erstelle Release
3. Upload APK/AAB
4. Füge **Tester-E-Mails** hinzu (max. 100)

### License Testing
1. Gehe zu **Setup → License testing**
2. Füge **Test-E-Mails** hinzu
3. Diese Accounts testen **ohne echte Zahlung**

**⚠️ Wichtig:** Nutze License Testing für alle Tests!

---

## 6. RevenueCat verbinden

### Product IDs prüfen:

| Google Play Console | RevenueCat | Code |
|---------------------|------------|------|
| `de.playfusiongate.sudokuduo.coffee` | `de.playfusiongate.sudokuduo.coffee` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.COFFEE` |
| `de.playfusiongate.sudokuduo.breakfast` | `de.playfusiongate.sudokuduo.breakfast` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.BREAKFAST` |
| `de.playfusiongate.sudokuduo.lunch` | `de.playfusiongate.sudokuduo.lunch` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.LUNCH` |
| `de.playfusiongate.sudokuduo.feast` | `de.playfusiongate.sudokuduo.feast` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.FEAST` |
| `de.playfusiongate.sudokuduo.monthly:monthly` | `de.playfusiongate.sudokuduo.monthly:monthly` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.MONTHLY_SUB` |
| `de.playfusiongate.sudokuduo.yearly:yearly` | `de.playfusiongate.sudokuduo.yearly:yearly` | `BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.YEARLY_SUB` |

**⚠️ Wichtig:** IDs müssen überall identisch sein!

### Service Account verbinden:
Siehe [REVENUECAT-SETUP.md Abschnitt 5](./REVENUECAT-SETUP.md#5-google-play-store-verbinden)

---

## 7. Testing Checklist

### Pre-Launch Tests:
- [ ] App in Internal Testing
- [ ] Test-Account in License Testing
- [ ] Alle 6 Produkte erstellt und aktiv
- [ ] RevenueCat mit Google Play verbunden
- [ ] Product IDs überall identisch

### Purchase-Flow testen:

#### 1. Einmalkauf
- [ ] Kaffee kaufen (€1.99)
- [ ] Entitlement aktiviert?
- [ ] EP-Bonus funktioniert (2×)?
- [ ] Image-Unlock verfügbar (1/Monat)?

#### 2. Abo
- [ ] Monatliches Abo abschließen
- [ ] Entitlement aktiviert?
- [ ] Benefits identisch zu Einmalkauf?

#### 3. Restore Purchases
- [ ] App deinstallieren
- [ ] Neu installieren
- [ ] "Käufe wiederherstellen" klicken
- [ ] Entitlement wieder aktiv?

#### 4. Grace Period (schwierig zu testen)
- Zahlungsmethode auf ungültig setzen
- Warten bis Billing-Datum
- Grace Period aktiv?

---

## 8. Launch Vorbereitung

### Pre-Launch Checklist:
- [ ] Alle Produkte auf **Active**
- [ ] Preise final
- [ ] Beschreibungen in DE/EN (mind.)
- [ ] Test-Käufe erfolgreich
- [ ] RevenueCat zeigt Transaktionen
- [ ] Restore Purchases funktioniert
- [ ] Grace Period aktiviert (7 Tage)

### Legal Requirements:
- [ ] **Impressum** in App
- [ ] **Datenschutzerklärung** (Privacy Policy URL)
- [ ] **Terms of Service** für Abos
- [ ] **Widerrufsrecht** (EU-Gesetz)
- [ ] **Kontakt-Info** für Support

**Google Play Requirements:**
- Privacy Policy muss öffentlich zugänglich sein (URL)
- Terms of Service für Abos erforderlich
- Widerrufsbelehrung für EU-Nutzer

### Store Listing prüfen:
1. Gehe zu **Store presence → Main store listing**
2. Prüfe:
   - App-Name
   - Kurzbeschreibung
   - Beschreibung (erwähne In-App-Käufe!)
   - Screenshots (zeige Shop!)
   - Feature Graphic

**⚠️ Wichtig:** Erwähne "In-App-Käufe" in der Beschreibung!

---

## 9. Monitoring nach Launch

### Play Console Analytics:
1. Gehe zu **Monetization → Overview**
2. Prüfe Metriken:
   - **Buyers:** Zahlende Nutzer
   - **Revenue:** Einnahmen
   - **Subscriptions:** Aktive Abos
   - **Cancellations:** Abo-Kündigungen

### RevenueCat Analytics:
- Detailliertere Insights
- Cross-Platform-Vergleich (Android vs iOS)
- Churn Rate überwachen

### User Feedback:
- Reviews in Play Store prüfen
- Auf Billing-Beschwerden achten
- Schnell auf Probleme reagieren

---

## 10. Troubleshooting

### "This item is not available in your country"
**Lösung:**
- Land in Distribution Countries aktiviert?
- Warte 1-2 Stunden nach Aktivierung
- App-Status: Internal Testing oder höher?

### "Product already owned"
**Lösung:**
- Non-consumable kann nicht mehrfach gekauft werden
- Nutze "Restore Purchases" stattdessen
- Bei Test: Account wechseln oder Refund via Play Console

### Subscription auto-cancels
**Lösung:**
- Test-Account braucht gültige Zahlungsmethode
- Nutze "Test Cards" von Google
- Payment Method prüfen

### Products nicht sichtbar
**Lösung:**
- Warte 1-2 Stunden (Google Play Sync)
- Produkte auf "Active"?
- RevenueCat Connection geprüft?
- App force-close und neu öffnen

---

## 11. Internationaler Verkauf

### Was automatisch funktioniert:
- ✅ Google Play rechnet Währungen um
- ✅ Steuern werden automatisch abgezogen
- ✅ Billing API funktioniert weltweit

### Was du tun musst:

#### 1. Länder aktivieren (siehe Abschnitt 4)
```
Play Console → Release → Production → Countries/regions
```
- Wähle Zielländer
- Starte mit DACH, dann EU, dann global

#### 2. Steuern & Rechtliches

| Aspekt | Was tun? |
|--------|----------|
| **Steuern** | Google zieht automatisch ab |
| **EU OSS** | Ggf. OSS-Verfahren für B2C |
| **Impressum** | Für alle Länder gültig |
| **DSGVO** | Konform für alle Länder |
| **Widerrufsrecht** | EU: 14 Tage bei Abos |

#### 3. App-Listing übersetzen (optional)
```
Play Console → Store presence → Store listings
```
- **Beschreibung:** Zielsprachen (EN, FR, ES, etc.)
- **Screenshots:** Mit lokalisierten Texten
- **Produktbeschreibungen:** Übersetzen

**Aktuelle App-Sprachen:**
- ✅ Deutsch (DE)
- ✅ English (EN)
- ✅ हिन्दी (Hindi)

**Ggf. ergänzen:**
- Français (FR)
- Español (ES)
- Italiano (IT)

#### 4. In-App-Texte lokalisieren
Deine App nutzt bereits i18next:
```typescript
// Bereits vorhanden in translations/
- de/supportShop.json
- en/supportShop.json
- hi/supportShop.json
```

Für neue Sprachen:
1. Erstelle z.B. `translations/fr/supportShop.json`
2. Übersetze alle Keys
3. i18next erkennt automatisch

#### 5. Preise anpassen (optional)
```
Play Console → Produkt → Pricing
```
- **Standard:** Google rechnet um (€1.99 → $2.19)
- **Optional:** Manuell setzen (€1.99 → $1.99)
- **Tipp:** Runde Beträge wirken attraktiver

### Empfohlene Strategie:

#### Phase 1: DACH (jetzt)
- ✅ Deutschland, Österreich, Schweiz
- ✅ Texte in DE/EN
- ✅ Steuern automatisch

#### Phase 2: EU (später)
- Frankreich, Italien, Spanien, etc.
- Übersetzungen optional (EN funktioniert)
- OSS-Verfahren prüfen

#### Phase 3: Global (später)
- USA, UK, Kanada, Australien
- Preise anpassen ($1.99 statt €1.99)
- Weitere Sprachen ergänzen

### Wichtige Links:
- **Google Play Länder:** [Supported Locations](https://support.google.com/googleplay/android-developer/answer/9306917)
- **EU OSS:** [One-Stop-Shop](https://ec.europa.eu/taxation_customs/business/vat/oss_en)
- **DSGVO:** [EU GDPR Info](https://gdpr.eu/)

---

## 12. Support Resources

### Google Play Console:
- [Billing Documentation](https://support.google.com/googleplay/android-developer/topic/9857952)
- [Subscription Best Practices](https://developer.android.com/google/play/billing/subscriptions)
- [Test Purchases](https://developer.android.com/google/play/billing/test)

### RevenueCat:
- [Google Play Integration](https://www.revenuecat.com/docs/google-play-store)
- [Testing Guide](https://www.revenuecat.com/docs/test-and-launch)

### Legal:
- [EU Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package)
- [Google Play Developer Policy](https://support.google.com/googleplay/android-developer/answer/9899234)

---

**Hinweis:** Anleitung basiert auf Google Play Console Stand 2025. Interface kann sich ändern, Konzepte bleiben gleich.
