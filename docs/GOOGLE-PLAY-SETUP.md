# Google Play Console Setup

Diese Anleitung zeigt dir, wie du In-App-Käufe und Abonnements in der Google Play Console für Sudoku Duo einrichtest.

## 📋 Überblick

Das Supporter-System besteht aus:
- **4 Einmalkäufe** (One-Time Purchases): Kaffee, Frühstück, Mittagessen, Festmahl
- **2 Abonnements**: Monatlich, Jährlich

Alle Produkte geben dieselben Benefits: **2× EP + 1 Bild/Monat**.

---

## 1. Voraussetzungen

### App muss in der Console eingerichtet sein
- [ ] App erstellt in Google Play Console
- [ ] Package Name: `de.playfusiongate.sudokuduo`
- [ ] App muss mindestens im **Internal Testing** sein (nicht Draft)
- [ ] APK/AAB hochgeladen

### Billing eingerichtet
- [ ] Zahlungsprofil erstellt (Geschäftsinformationen)
- [ ] Steuernummer hinterlegt
- [ ] Bankkonto verbunden

---

## 2. In-App-Produkte erstellen (Einmalkäufe)

### 2.1 Produkte-Seite öffnen
1. Navigiere zu **Monetize → In-app products**
2. Klicke auf **"Create product"**

### 2.2 Produkte anlegen

Erstelle folgende 4 Produkte:

#### Produkt 1: Kaffee
- **Product ID**: `sudoku_coffee`
- **Name**: `Kaffee` (DE) / `Coffee` (EN) / `कॉफ़ी` (HI)
- **Description**:
  ```
  DE: Ein Kaffee für neue Rätsel-Ideen. Unterstütze die App und erhalte 2× EP sowie 1 Bild pro Monat zum sofortigen Freischalten.
  EN: A coffee for new puzzle ideas. Support the app and get 2× EP plus 1 image per month to unlock instantly.
  HI: नई पहेली विचारों के लिए एक कॉफी। ऐप का समर्थन करें और 2× EP तथा तुरंत अनलॉक करने के लिए प्रति माह 1 चित्र प्राप्त करें।
  ```
- **Price**: `€1.99` (Base Price)
- **Product Type**: **Non-consumable** (nicht verbrauchbar)
- **Status**: Active

#### Produkt 2: Frühstück
- **Product ID**: `sudoku_breakfast`
- **Name**: `Frühstück` / `Breakfast` / `नाश्ता`
- **Description**: (analog zu Kaffee, angepasst)
- **Price**: `€4.99`
- **Product Type**: Non-consumable
- **Status**: Active

#### Produkt 3: Mittagessen
- **Product ID**: `sudoku_lunch`
- **Name**: `Mittagessen` / `Lunch` / `दोपहर का भोजन`
- **Description**: (analog)
- **Price**: `€9.99`
- **Product Type**: Non-consumable
- **Status**: Active

#### Produkt 4: Festmahl
- **Product ID**: `sudoku_feast`
- **Name**: `Festmahl` / `Feast` / `दावत`
- **Description**: (analog)
- **Price**: `€19.99`
- **Product Type**: Non-consumable
- **Status**: Active

### 2.3 Wichtige Einstellungen

**Product Type: Non-consumable vs Consumable**
- ✅ **Non-consumable**: Produkt kann nicht erneut gekauft werden, bleibt dauerhaft
- ❌ **Consumable**: Produkt kann mehrfach gekauft werden
- **Für Sudoku Duo**: Nutze **Non-consumable**, damit Käufe dauerhaft sind und via "Restore Purchases" wiederhergestellt werden können

**Pricing**:
- Setze Base Price in Euro
- Google Play rechnet automatisch in andere Währungen um
- Du kannst Preise pro Land manuell anpassen (optional)

---

## 3. Abonnements erstellen

### 3.1 Subscription-Seite öffnen
1. Navigiere zu **Monetize → Subscriptions**
2. Klicke auf **"Create subscription"**

### 3.2 Abonnement 1: Monatlicher Support

#### Basic Details
- **Subscription ID**: `monthly_support`
- **Name**: `Monatlicher Support` / `Monthly Support` / `मासिक समर्थन`
- **Description**:
  ```
  DE: Unterstütze die App monatlich und erhalte dauerhaft 2× EP sowie 1 Bild pro Monat zum sofortigen Freischalten.
  EN: Support the app monthly and get permanent 2× EP plus 1 image per month to unlock instantly.
  HI: ऐप का मासिक समर्थन करें और स्थायी रूप से 2× EP तथा तुरंत अनलॉक करने के लिए प्रति माह 1 चित्र प्राप्त करें।
  ```

#### Base Plan
- **Plan ID**: `monthly`
- **Billing Period**: **1 Month**
- **Price**: `€2.99/Monat`
- **Auto-Renewal**: ✅ Enabled
- **Free Trial**: ❌ Optional (erstmal nein)
- **Grace Period**: ✅ **7 days** (empfohlen!)
- **Account Hold**: ❌ Optional

#### Benefits (optional anzeigen)
- 2× Experience Points
- 1 Image Unlock per month
- Ad-free support

### 3.3 Abonnement 2: Jährlicher Support

#### Basic Details
- **Subscription ID**: `yearly_support`
- **Name**: `Jährlicher Support` / `Yearly Support` / `वार्षिक समर्थन`
- **Description**: (analog zu monatlich)

#### Base Plan
- **Plan ID**: `yearly`
- **Billing Period**: **1 Year**
- **Price**: `€29.99/Jahr` (Ersparnis gegenüber monatlich: ~16%)
- **Auto-Renewal**: ✅ Enabled
- **Free Trial**: ❌ Optional
- **Grace Period**: ✅ **7 days**
- **Account Hold**: ❌ Optional

### 3.4 Grace Period erklärt

**Was ist Grace Period?**
- Nutzer behält Zugang trotz fehlgeschlagener Zahlung
- Dauer: 7 Tage (empfohlen)
- Nutzer kann Zahlungsmethode aktualisieren
- Verhindert ungewollten Benefit-Verlust

**Im Code**:
```typescript
interface SupporterStatus {
  isInGracePeriod: boolean; // true während Grace Period
  // User behält Benefits, aber wird bald deaktiviert
}
```

**Anzeige im Code**: Grace-Period-Nutzer sehen eine Warnung im Shop ("Zahlungsproblem - bitte aktualisiere deine Zahlungsmethode").

---

## 4. Länder freischalten

### 4.1 Distribution Countries
1. Navigiere zu **Release → Production → Countries/regions**
2. Wähle Länder aus, in denen die App verfügbar sein soll

**Empfehlung für Start**:
- ✅ Deutschland
- ✅ Österreich
- ✅ Schweiz
- ✅ Optional: Weitere DACH-Region-Länder

**Später erweitern**:
- EU-weit
- USA, UK, Kanada
- Weitere Märkte

### 4.2 Pricing per Country (optional)
- Standard: Google rechnet automatisch um
- Optional: Manuell Preise pro Land setzen
- Beispiel: In USA `$2.99` statt automatisch umgerechnet

---

## 5. Test-Tracks einrichten

### 5.1 Internal Testing Track
1. Navigiere zu **Release → Testing → Internal testing**
2. Erstelle neue Release
3. Upload APK/AAB
4. Füge **Tester-E-Mail-Adressen** hinzu

**Tester**:
- Füge deine eigene E-Mail hinzu
- Füge Team-Mitglieder hinzu (falls vorhanden)
- Max. 100 Tester für Internal Testing

### 5.2 License Testing
1. Navigiere zu **Setup → License testing**
2. Füge **Test-E-Mail-Adressen** hinzu
3. Diese Accounts können Produkte **ohne echte Zahlung** kaufen

**Wichtig**:
- Test-Käufe erscheinen in RevenueCat
- Test-Käufe kosten kein echtes Geld
- Nutze für alle Tests

### 5.3 Closed Testing (optional)
- Für größere Beta-Tests (bis 1000 Tester)
- Nutze Google Groups für einfache Verwaltung
- Tester bekommen Opt-in-Link

---

## 6. Product Integration mit RevenueCat

### 6.1 Product IDs prüfen
Stelle sicher, dass Product IDs in RevenueCat identisch sind:

| Google Play Console | RevenueCat | Code |
|---------------------|------------|------|
| `sudoku_coffee` | `sudoku_coffee` | `PRODUCT_IDS.COFFEE` |
| `sudoku_breakfast` | `sudoku_breakfast` | `PRODUCT_IDS.BREAKFAST` |
| `sudoku_lunch` | `sudoku_lunch` | `PRODUCT_IDS.LUNCH` |
| `sudoku_feast` | `sudoku_feast` | `PRODUCT_IDS.FEAST` |
| `monthly_support` | `monthly_support` | `PRODUCT_IDS.MONTHLY` |
| `yearly_support` | `yearly_support` | `PRODUCT_IDS.YEARLY` |

### 6.2 Service Account verbinden
Siehe [REVENUECAT-SETUP.md](./REVENUECAT-SETUP.md) Abschnitt 5.

---

## 7. Testing Checklist

### 7.1 Pre-Launch Tests

- [ ] App im Internal Testing verfügbar
- [ ] Test-Account in License Testing eingetragen
- [ ] Alle 6 Produkte erstellt und aktiv
- [ ] RevenueCat mit Google Play verbunden
- [ ] Produkt-IDs überall identisch

### 7.2 Purchase-Flow testen

1. **Einmalkauf testen**:
   - [ ] Kaffee kaufen (€1.99)
   - [ ] Entitlement wird aktiviert
   - [ ] EP-Bonus funktioniert (2×)
   - [ ] Image-Unlock verfügbar (1/Monat)

2. **Abo testen**:
   - [ ] Monatliches Abo abschließen
   - [ ] Entitlement wird aktiviert
   - [ ] Benefits identisch zu Einmalkauf

3. **Restore Purchases testen**:
   - [ ] App deinstallieren
   - [ ] Neu installieren
   - [ ] "Käufe wiederherstellen" klicken
   - [ ] Entitlement wieder aktiv

4. **Grace Period testen** (schwierig, meist nicht lokal testbar):
   - Zahlungsmethode im Google-Account auf ungültig setzen
   - Warten bis Billing-Datum
   - Prüfen, ob Grace Period aktiv ist

### 7.3 Edge Cases

- [ ] Offline-Kauf → Sync beim nächsten App-Start
- [ ] Quota-Reset am Monatsersten
- [ ] Expired Subscription → Benefits weg
- [ ] Mehrfachkauf verhindern (Non-consumable)

---

## 8. Launch Vorbereitung

### 8.1 Pre-Launch Checklist

- [ ] Alle Produkte auf **Active** gesetzt
- [ ] Preise final bestätigt
- [ ] Beschreibungen in allen Sprachen (DE/EN/HI)
- [ ] Test-Käufe erfolgreich
- [ ] RevenueCat Dashboard zeigt Transaktionen
- [ ] Restore Purchases funktioniert
- [ ] Grace Period aktiviert (7 Tage)

### 8.2 Legal Requirements

- [ ] **Impressum** in App integriert
- [ ] **Datenschutzerklärung** (Privacy Policy) hinterlegt
- [ ] **Terms of Service** für Abos hinterlegt
- [ ] **Widerrufsrecht** erklärt (EU-Gesetz)
- [ ] **Kontakt-Info** für Support angegeben

**Google Play Requirements**:
- Privacy Policy muss öffentlich zugänglich sein (URL)
- Terms of Service für Abos erforderlich
- Widerrufsbelehrung für EU-Nutzer

### 8.3 Store Listing prüfen
1. Navigiere zu **Store presence → Main store listing**
2. Prüfe:
   - App-Name
   - Kurzbeschreibung
   - Beschreibung (erwähne In-App-Käufe!)
   - Screenshots (zeige Shop!)
   - Feature Graphic

**Wichtig**: Erwähne in der Beschreibung, dass die App **In-App-Käufe** enthält!

---

## 9. Monitoring nach Launch

### 9.1 Play Console Analytics
1. Navigiere zu **Monetization → Overview**
2. Prüfe Metriken:
   - **Buyers**: Anzahl zahlender Nutzer
   - **Revenue**: Einnahmen
   - **Subscriptions**: Aktive Abos
   - **Cancellations**: Abo-Kündigungen

### 9.2 RevenueCat Analytics
- Nutze RevenueCat Charts für detailliertere Insights
- Cross-Platform-Vergleich (Android vs iOS später)
- Churn Rate überwachen

### 9.3 User Feedback
- Prüfe Reviews in Play Store
- Achte auf Beschwerden über Billing
- Reagiere schnell auf Probleme

---

## 10. Troubleshooting

### Problem: "This item is not available in your country"
**Lösung**:
- Prüfe, dass Land in Distribution Countries aktiviert ist
- Warte 1-2 Stunden nach Aktivierung
- Prüfe App-Status (muss mindestens Internal Testing sein)

### Problem: "Product already owned"
**Lösung**:
- Non-consumable Products können nicht mehrfach gekauft werden
- Nutze "Restore Purchases", um Entitlement zu reaktivieren
- Bei Test: Konto wechseln oder Produkt refunden via Play Console

### Problem: Subscription auto-cancels after purchase
**Lösung**:
- Prüfe Payment Method des Test-Accounts
- Test-Accounts brauchen gültige Zahlungsmethode (auch wenn nicht belastet wird)
- Nutze "Test Cards" von Google

### Problem: Products nicht sichtbar in App
**Lösung**:
- Warte 1-2 Stunden nach Erstellung (Google Play Sync)
- Prüfe, dass Produkte auf "Active" stehen
- Prüfe RevenueCat Connection
- Force-close App und neu öffnen

---

## 11. Support Resources

### Google Play Console
- [Billing Documentation](https://support.google.com/googleplay/android-developer/topic/9857952)
- [Subscription Best Practices](https://developer.android.com/google/play/billing/subscriptions)
- [Test Purchases](https://developer.android.com/google/play/billing/test)

### RevenueCat
- [Google Play Integration](https://www.revenuecat.com/docs/google-play-store)
- [Testing Guide](https://www.revenuecat.com/docs/test-and-launch)

### Legal
- [EU Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package)
- [Google Play Developer Policy](https://support.google.com/googleplay/android-developer/answer/9899234)

---

**Hinweis**: Diese Anleitung basiert auf Google Play Console Stand 2025. Interface kann sich ändern, aber Konzepte bleiben gleich.
