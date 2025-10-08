# RevenueCat Dashboard Setup

Diese Anleitung hilft dir beim Setup von RevenueCat für die Sudoku Duo App mit dem neuen Supporter-System.

## 📋 Überblick

Das Supporter-System nutzt **ein einziges Entitlement** (`supporter`), das sowohl durch Einmalkäufe als auch durch Abos aktiviert wird. Jeder Kauf (egal welcher Betrag) gibt die gleichen Benefits:
- 2× EP Bonus
- 1 Bild pro Monat sofort freischalten

---

## 1. Entitlements erstellen

### Entitlement: `supporter`
1. Navigiere zu **Project Settings → Entitlements**
2. Klicke auf **"Create Entitlement"**
3. **Identifier**: `supporter`
4. **Display Name**: `Supporter`
5. Speichern

**Wichtig**: Alle 6 Products (4 Einmalkäufe + 2 Abos) werden diesem Entitlement zugeordnet!

---

## 2. Products konfigurieren

### 2.1 Einmalkäufe (One-Time Purchases)

Navigiere zu **Products** und erstelle folgende Managed Products:

| Product ID | Name | Type | Preis | Entitlement |
|------------|------|------|-------|-------------|
| `sudoku_coffee` | Kaffee | Consumable/Non-Consumable* | 1,99 € | `supporter` |
| `sudoku_breakfast` | Frühstück | Consumable/Non-Consumable* | 4,99 € | `supporter` |
| `sudoku_lunch` | Mittagessen | Consumable/Non-Consumable* | 9,99 € | `supporter` |
| `sudoku_feast` | Festmahl | Consumable/Non-Consumable* | 19,99 € | `supporter` |

**Hinweis**: *Verwende **Non-Consumable** (nicht verbrauchbar), damit Käufe dauerhaft bleiben und über "Restore Purchases" wiederhergestellt werden können.*

### 2.2 Abonnements (Subscriptions)

| Subscription ID | Name | Preis | Billing Period | Entitlement |
|-----------------|------|-------|----------------|-------------|
| `monthly_support` | Monatlicher Support | 2,99 €/Monat | 1 Monat | `supporter` |
| `yearly_support` | Jährlicher Support | 29,99 €/Jahr | 1 Jahr | `supporter` |

**Wichtig**: Grace Period für Abos aktivieren (7 Tage), damit Nutzer bei Zahlungsproblemen nicht sofort ihre Benefits verlieren.

---

## 3. Offerings konfigurieren

Offerings gruppieren deine Products für die Shop-Ansicht.

### Default Offering
1. Navigiere zu **Offerings**
2. Erstelle ein **"default" Offering**
3. Füge folgende Packages hinzu:

#### One-Time Purchases
- Package: `coffee` → Product: `sudoku_coffee`
- Package: `breakfast` → Product: `sudoku_breakfast`
- Package: `lunch` → Product: `sudoku_lunch`
- Package: `feast` → Product: `sudoku_feast`

#### Subscriptions
- Package: `$rc_monthly` → Product: `monthly_support`
- Package: `$rc_annual` → Product: `yearly_support`

**Tipp**: Die `$rc_monthly` und `$rc_annual` Prefixes sind RevenueCat-Konventionen für Standard-Subscription-Packages.

---

## 4. API Keys prüfen

### Android API Key
1. Navigiere zu **Project Settings → API Keys**
2. Kopiere den **Public SDK Key (Android)**
3. Prüfe, dass er in deinem Code korrekt eingetragen ist:

```typescript
// screens/SupportShop/utils/billing/config.ts
export const REVENUECAT_CONFIG = {
  apiKey: {
    android: 'goog_qNBqCJdmLfwCXpjoccatTQOJZSd',
    ios: '', // Später hinzufügen
  },
};
```

### iOS API Key (später)
Wenn du die iOS-Version baust:
1. Erstelle iOS App in RevenueCat
2. Kopiere iOS Public SDK Key
3. Trage ihn in `config.ts` ein

---

## 5. Google Play Store Integration

### 5.1 Service Account erstellen
1. Gehe zu **Google Play Console → Setup → API access**
2. Erstelle einen **Service Account** (oder nutze existierenden)
3. **Lade die JSON-Datei herunter** (enthält Private Key)

### 5.2 Service Account in RevenueCat verbinden
1. Navigiere zu **RevenueCat → Project Settings → Integrations → Google Play**
2. Klicke auf **"Connect"**
3. Lade die **Service Account JSON-Datei** hoch
4. RevenueCat validiert die Verbindung

**Wichtig**: Stelle sicher, dass der Service Account die Berechtigung **"View financial data"** hat!

---

## 6. Test-Purchase durchführen

### 6.1 Sandbox-Account anlegen
1. Gehe zu **Google Play Console → Setup → License Testing**
2. Füge deine **Test-E-Mail-Adresse** hinzu
3. Diese Adresse kann nun Testkäufe ohne echte Zahlung durchführen

### 6.2 Purchase testen
1. Baue die App mit deinem **Test-Build** (Debug oder Internal Testing)
2. Installiere auf einem echten Gerät (Emulator funktioniert nicht für IAP)
3. Melde dich mit dem **Test-Account** an
4. Öffne den **Support Shop**
5. Kaufe ein Produkt (z.B. "Kaffee")
6. Prüfe im Code-Log, ob das `supporter` Entitlement erkannt wird

### 6.3 Entitlement-Check im Code
Nutze das Debug-Log:
```typescript
import { useSupporter } from '@/modules/subscriptions/hooks/useSupporter';

const { status, isSupporter } = useSupporter();
console.log('Supporter Status:', status);
console.log('Is Supporter:', isSupporter); // Sollte true sein nach Kauf
```

### 6.4 RevenueCat Dashboard prüfen
1. Navigiere zu **RevenueCat → Customers**
2. Suche nach deiner Test-User-ID
3. Prüfe, ob das **`supporter` Entitlement** aktiv ist
4. Prüfe, ob der **Purchase** unter "Transactions" erscheint

---

## 7. Restore Purchases

### Implementierung prüfen
```typescript
// In BillingManager.ts
async restorePurchases(): Promise<void> {
  await Purchases.restorePurchases();
  // Status wird automatisch aktualisiert via CustomerInfo-Event
}
```

### Test
1. Deinstalliere die App
2. Installiere neu
3. Gehe zum Support Shop
4. Klicke auf "Käufe wiederherstellen" (Button noch zu implementieren!)
5. Prüfe, ob Entitlement wieder aktiv ist

**TODO**: Restore-Button im Shop hinzufügen (z.B. in Header oder Footer)

---

## 8. Webhooks (Optional, empfohlen)

RevenueCat kann dich über wichtige Events benachrichtigen:
- Neue Käufe
- Abo-Verlängerungen
- Abo-Kündigungen
- Rückerstattungen

### Webhook einrichten
1. Navigiere zu **Project Settings → Webhooks**
2. Füge deine **Backend-URL** hinzu (falls vorhanden)
3. Wähle Events aus, die du tracken möchtest

**Für diese Version**: Webhooks sind optional, da alles clientseitig läuft. Nützlich für späteres Backend-Integration.

---

## 9. Analytics & Monitoring

### Charts ansehen
1. Navigiere zu **Overview** oder **Charts**
2. Prüfe folgende Metriken:
   - **Active Subscribers**: Anzahl aktiver Abos
   - **Trials Started**: Anzahl gestarteter Trials (falls du welche anbietest)
   - **Revenue**: Einnahmen über Zeit
   - **Churn Rate**: Abo-Abbruchrate

### Customer Lists
1. Navigiere zu **Customers**
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
- [ ] Test-Käufe erfolgreich durchgeführt
- [ ] Entitlements im Dashboard sichtbar
- [ ] Restore Purchases funktioniert
- [ ] API Keys in Production-Code korrekt
- [ ] Grace Period aktiviert (7 Tage)

---

## 🔧 Troubleshooting

### Problem: "Product not found"
**Lösung**:
- Prüfe, ob Product-IDs in Google Play und RevenueCat übereinstimmen
- Warte 1-2 Stunden nach Erstellung in Google Play Console (Sync-Zeit)
- Prüfe, dass App in Internal/Closed Testing ist (nicht Draft)

### Problem: Entitlement nicht aktiv nach Kauf
**Lösung**:
- Prüfe RevenueCat Dashboard → Customers → Transactions
- Prüfe Entitlement-Zuordnung in Products
- Prüfe Service Account Permissions (View Financial Data)

### Problem: Restore Purchases funktioniert nicht
**Lösung**:
- Prüfe, dass Products als **Non-Consumable** markiert sind
- Google-Account muss derselbe sein
- App-Package-Name muss identisch sein

---

## 📚 Weiterführende Ressourcen

- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [Google Play Billing Docs](https://developer.android.com/google/play/billing)
- [RevenueCat + React Native Guide](https://www.revenuecat.com/docs/getting-started/installation/reactnative)

---

**Hinweis**: Diese Anleitung basiert auf der Implementierung in Sudoku Duo. Passe Produkt-IDs und Preise nach Bedarf an.
