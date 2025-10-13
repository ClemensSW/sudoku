# RevenueCat Dashboard Setup

Diese Anleitung hilft dir beim Setup von RevenueCat für die Sudoku Duo App.

## 📋 Überblick

**Ein Entitlement für alles:** `supporter`
- 4 Einmalkäufe + 2 Abos → unterschiedliche Benefits

**Benefits nach Typ:**
- **Einmalkäufe:** 2× EP + 1 Bild freischalten (einmalig)
- **Monatliches Abo:** 2× EP + 1 Bild/Monat
- **Jährliches Abo:** 2× EP + 2 Bilder/Monat

---

## 1. Entitlement erstellen

**Ziel:** Ein Entitlement für alle Products.

### Schritte:
1. Gehe zu **Project Settings → Entitlements**
2. Klicke **"Create Entitlement"**
3. **Identifier:** `supporter`
4. **Display Name:** `Supporter`
5. Speichern

**Wichtig:** Alle 6 Products nutzen dieses eine Entitlement!

---

## 2. Products konfigurieren

### 2.1 Einmalkäufe (One-Time Purchases)

Gehe zu **Products** → **"Create Product"**

| Product ID | Name | Type | Preis | Entitlement |
|------------|------|------|-------|-------------|
| `de.playfusiongate.sudokuduo.coffee` | Kaffee | **Non-Consumable** | 1,99 € | `supporter` |
| `de.playfusiongate.sudokuduo.breakfast` | Frühstück | **Non-Consumable** | 4,99 € | `supporter` |
| `de.playfusiongate.sudokuduo.lunch` | Mittagessen | **Non-Consumable** | 9,99 € | `supporter` |
| `de.playfusiongate.sudokuduo.feast` | Festmahl | **Non-Consumable** | 19,99 € | `supporter` |

**⚠️ Wichtig:**
- Nutze **Non-Consumable**, damit Käufe dauerhaft sind
- "Restore Purchases" funktioniert nur bei Non-Consumable

### 2.2 Abonnements (Subscriptions)

| Subscription ID | Name | Preis | Billing | Entitlement |
|-----------------|------|-------|---------|-------------|
| `de.playfusiongate.sudokuduo.monthly:monthly` | Monatlich | 1,99 €/Monat | 1 Monat | `supporter` |
| `de.playfusiongate.sudokuduo.yearly:yearly` | Jährlich | 19,99 €/Jahr | 1 Jahr | `supporter` |

**⚠️ Aktiviere Grace Period (7 Tage):**
- Nutzer behält Benefits bei Zahlungsproblemen
- Zeit zum Zahlungsmethode aktualisieren

---

## 3. Offerings konfigurieren

**Offerings** gruppieren Products für die App.

### Default Offering erstellen:
1. Gehe zu **Offerings** → **"Create Offering"**
2. **Identifier:** `default`
3. Füge Packages hinzu:

#### One-Time Purchases
- Package: `coffee` → Product: `de.playfusiongate.sudokuduo.coffee`
- Package: `breakfast` → Product: `de.playfusiongate.sudokuduo.breakfast`
- Package: `lunch` → Product: `de.playfusiongate.sudokuduo.lunch`
- Package: `feast` → Product: `de.playfusiongate.sudokuduo.feast`

#### Subscriptions
- Package: `$rc_monthly` → Product: `de.playfusiongate.sudokuduo.monthly:monthly`
- Package: `$rc_annual` → Product: `de.playfusiongate.sudokuduo.yearly:yearly`

**Tipp:** `$rc_monthly` und `$rc_annual` sind RevenueCat-Standard-Prefixes.

---

## 4. API Keys prüfen

### Android API Key
1. Gehe zu **Project Settings → API Keys**
2. Kopiere **Public SDK Key (Android)**
3. Prüfe in [config.ts](../screens/SupportShop/utils/billing/config.ts:7):

```typescript
REVENUECAT_API_KEY_ANDROID: "goog_qNBqCJdmLfwCXpjoccatTQOJZSd"
```

### iOS API Key (später)
1. Erstelle iOS App in RevenueCat
2. Kopiere iOS Public SDK Key
3. Trage in [config.ts](../screens/SupportShop/utils/billing/config.ts:8) ein

---

## 5. Google Play Store verbinden

### 5.1 Service Account erstellen
1. Gehe zu **Google Play Console → Setup → API access**
2. Erstelle **Service Account**
3. **Lade JSON-Datei herunter**

### 5.2 Service Account in RevenueCat verbinden
1. Gehe zu **RevenueCat → Project Settings → Integrations → Google Play**
2. Klicke **"Connect"**
3. Lade **Service Account JSON** hoch
4. RevenueCat validiert automatisch

**⚠️ Wichtig:** Service Account braucht **"View financial data"** Berechtigung!

---

## 6. Test-Purchase durchführen

### 6.1 Test-Account einrichten
1. Gehe zu **Google Play Console → Setup → License Testing**
2. Füge deine **Test-E-Mail** hinzu
3. Account kann nun ohne echte Zahlung testen

### 6.2 Kauf testen
1. Baue **Test-Build** (Debug oder Internal Testing)
2. Installiere auf echtem Gerät (Emulator funktioniert nicht!)
3. Melde dich mit **Test-Account** an
4. Öffne **Support Shop**
5. Kaufe ein Produkt (z.B. "Kaffee")

### 6.3 Entitlement prüfen

**Im Code:**
```typescript
import { useSupporter } from '@/modules/subscriptions/hooks/useSupporter';

const { status, isSupporter } = useSupporter();
console.log('Is Supporter:', isSupporter); // Sollte true sein
```

**Im RevenueCat Dashboard:**
1. Gehe zu **Customers**
2. Suche deine Test-User-ID
3. Prüfe: **`supporter` Entitlement** aktiv?
4. Prüfe: **Purchase** unter "Transactions"?

---

## 7. Restore Purchases

### Implementierung
Die App hat bereits eine `restorePurchases()` Funktion in [BillingManager.ts](../screens/SupportShop/utils/billing/BillingManager.ts:250):

```typescript
async restorePurchases(): Promise<void> {
  const customerInfo = await Purchases.restorePurchases();
  this.emit('restore-completed', customerInfo);
}
```

### Test
1. Deinstalliere App
2. Installiere neu
3. Gehe zum Support Shop
4. Klicke "Käufe wiederherstellen"
5. Prüfe: Entitlement wieder aktiv?

**✅ Funktioniert nur bei Non-Consumable Products!**

---

## 8. Webhooks (Optional)

RevenueCat kann dich über Events benachrichtigen:
- Neue Käufe
- Abo-Verlängerungen
- Abo-Kündigungen
- Rückerstattungen

### Einrichten:
1. Gehe zu **Project Settings → Webhooks**
2. Füge **Backend-URL** hinzu (falls vorhanden)
3. Wähle Events aus

**Für diese Version:** Optional, da App clientseitig läuft.

---

## 9. Analytics & Monitoring

### Charts
1. Gehe zu **Overview** oder **Charts**
2. Prüfe Metriken:
   - **Active Subscribers:** Aktive Abos
   - **Revenue:** Einnahmen über Zeit
   - **Churn Rate:** Abo-Abbruchrate

### Customer Lists
1. Gehe zu **Customers**
2. Filter nach:
   - Active Entitlements
   - Cancelled Subscriptions
   - Grace Period

---

## 10. Launch Checklist

Vor dem Live-Gang:

- [ ] Alle 6 Products in Google Play Console erstellt
- [ ] Products mit RevenueCat verbunden
- [ ] `supporter` Entitlement allen Products zugeordnet
- [ ] Service Account JSON hochgeladen
- [ ] Test-Käufe erfolgreich
- [ ] Entitlements im Dashboard sichtbar
- [ ] Restore Purchases funktioniert
- [ ] API Keys in Production-Code korrekt
- [ ] Grace Period aktiviert (7 Tage)

---

## 🔧 Troubleshooting

### "Product not found"
**Lösung:**
- Product-IDs in Google Play und RevenueCat identisch?
- Warte 1-2 Stunden nach Erstellung (Sync-Zeit)
- App muss in Internal/Closed Testing sein (nicht Draft)

### Entitlement nicht aktiv nach Kauf
**Lösung:**
- RevenueCat Dashboard → Customers → Transactions prüfen
- Entitlement-Zuordnung in Products prüfen
- Service Account Permissions prüfen (View Financial Data)

### Restore Purchases funktioniert nicht
**Lösung:**
- Products als **Non-Consumable** markiert?
- Gleicher Google-Account?
- App-Package-Name identisch?

---

## 🌍 Internationaler Verkauf

### Was funktioniert automatisch:
- ✅ RevenueCat global einsatzbereit
- ✅ Google Play rechnet Währungen automatisch um
- ✅ Billing API funktioniert weltweit

### Was du zusätzlich tun musst:

#### 1. Länder freischalten
```
Play Console → Release → Production → Countries/regions
```
- Wähle Zielländer aus (z.B. EU, USA, UK)
- Siehe [GOOGLE-PLAY-SETUP.md](./GOOGLE-PLAY-SETUP.md) Abschnitt 4

#### 2. Steuern & Rechtliches
- **Google zieht Steuern automatisch ab** (in EU, USA, etc.)
- **EU:** Ggf. OSS-Verfahren (One-Stop-Shop) für B2C-Verkäufe
- **Datenschutz:** DSGVO-konform für alle Länder
- **Impressum:** Muss für alle Länder gültig sein

#### 3. App-Listing übersetzen (optional)
```
Play Console → Store presence → Store listings
```
- Beschreibung in Zielsprachen (EN, FR, ES, etc.)
- Screenshots mit lokalisierten Texten
- Produktbeschreibungen übersetzen

#### 4. Preise anpassen (optional)
- **Standard:** Google rechnet automatisch um
- **Optional:** Preise pro Land manuell setzen
- **Beispiel:** €1.99 → USA: $1.99 (statt $2.19)

### Empfohlene Strategie:
1. **Start:** DACH-Region (DE, AT, CH)
2. **Phase 2:** EU-weit erweitern
3. **Phase 3:** Global (USA, UK, etc.)

**Siehe detaillierte Anleitung:** [GOOGLE-PLAY-SETUP.md Abschnitt 11](#)

---

## 📚 Ressourcen

- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [Google Play Billing Docs](https://developer.android.com/google/play/billing)
- [RevenueCat + React Native Guide](https://www.revenuecat.com/docs/getting-started/installation/reactnative)

---

**Hinweis:** Anleitung basiert auf der Sudoku Duo Implementierung.
