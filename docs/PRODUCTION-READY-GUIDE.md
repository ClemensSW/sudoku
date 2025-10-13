# 🚀 Production Ready Guide - Sudoku Duo

**In-App-Käufe & Abonnements Live schalten**

---

## ✅ Voraussetzungen-Check

Bevor du startest:

- [ ] Code kompiliert ohne Fehler
- [ ] Preise korrekt: €1,99/Monat & €19,99/Jahr
- [ ] Alle Tests bestanden
- [ ] RevenueCat API Key eingetragen (`config.ts`)

---

## 📝 Schritt 1: Google Play Console Setup (30 Min)

### 1.1 Einmalkäufe erstellen

Gehe zu **Monetize → In-app products** → **Create product**

| Product ID | Name | Preis | Type |
|------------|------|-------|------|
| `de.playfusiongate.sudokuduo.coffee` | Kaffee | €1,99 | Non-consumable |
| `de.playfusiongate.sudokuduo.breakfast` | Frühstück | €4,99 | Non-consumable |
| `de.playfusiongate.sudokuduo.lunch` | Mittagessen | €9,99 | Non-consumable |
| `de.playfusiongate.sudokuduo.feast` | Festmahl | €19,99 | Non-consumable |

**Wichtig:** Type = **Non-consumable** (für "Restore Purchases")

### 1.2 Abonnements erstellen

Gehe zu **Monetize → Subscriptions** → **Create subscription**

#### Abo 1: Monatlich
- **ID:** `de.playfusiongate.sudokuduo.monthly`
- **Base Plan ID:** `monthly`
- **Preis:** €1,99/Monat
- **Grace Period:** 7 Tage ✅

#### Abo 2: Jährlich
- **ID:** `de.playfusiongate.sudokuduo.yearly`
- **Base Plan ID:** `yearly`
- **Preis:** €19,99/Jahr
- **Grace Period:** 7 Tage ✅

### 1.3 Produkte aktivieren

- [ ] Alle 6 Products auf **"Active"** setzen
- [ ] App in **Internal Testing** (min.)

---

## 🔧 Schritt 2: RevenueCat Setup (20 Min)

### 2.1 Entitlement erstellen

1. Gehe zu **Project Settings → Entitlements**
2. **Create Entitlement**
3. Identifier: `supporter`
4. Display Name: `Supporter`

**Wichtig:** ALLE 6 Products nutzen dieses eine Entitlement!

### 2.2 Products verknüpfen

Gehe zu **Products** → **Create Product**

Erstelle 6 Products:

**Einmalkäufe:**
- `de.playfusiongate.sudokuduo.coffee` → Entitlement: `supporter`
- `de.playfusiongate.sudokuduo.breakfast` → Entitlement: `supporter`
- `de.playfusiongate.sudokuduo.lunch` → Entitlement: `supporter`
- `de.playfusiongate.sudokuduo.feast` → Entitlement: `supporter`

**Abos:**
- `de.playfusiongate.sudokuduo.monthly:monthly` → Entitlement: `supporter`
- `de.playfusiongate.sudokuduo.yearly:yearly` → Entitlement: `supporter`

### 2.3 Offerings erstellen

1. Gehe zu **Offerings** → **Create Offering**
2. Identifier: `default`
3. Füge Packages hinzu:

**One-Time:**
- Package: `coffee` → Product: `coffee`
- Package: `breakfast` → Product: `breakfast`
- Package: `lunch` → Product: `lunch`
- Package: `feast` → Product: `feast`

**Subscriptions:**
- Package: `$rc_monthly` → Product: `monthly:monthly`
- Package: `$rc_annual` → Product: `yearly:yearly`

### 2.4 Service Account verbinden

1. Gehe zu **Google Play Console → Setup → API access**
2. Erstelle **Service Account** (falls noch nicht vorhanden)
3. Lade **JSON-Datei** herunter
4. In RevenueCat: **Project Settings → Integrations → Google Play**
5. **Upload JSON-Datei**

**Wichtig:** Service Account braucht "View financial data" Berechtigung!

---

## ⚖️ Schritt 3: Legal Docs erstellen (2-4 Std)

### 3.1 Impressum (PFLICHT in DE/AT/CH)

**Vorlage:** https://www.e-recht24.de/impressum-generator.html

Inhalt:
```
Name: [Dein Name/Firma]
Anschrift: [Straße, PLZ, Ort]
E-Mail: [support@domain.de]
```

Speichere als: `assets/legal/impressum-de.md` & `impressum-en.md`

### 3.2 Datenschutzerklärung (PFLICHT EU)

**Vorlage:** https://www.e-recht24.de/muster-datenschutzerklaerung.html

Drittanbieter erwähnen:
- **RevenueCat** (Payment Processing)
- **Google Play Billing** (Zahlungsabwicklung)
- **AsyncStorage** (Lokale Daten)

Speichere als: `assets/legal/datenschutz-de.md` & `privacy-policy-en.md`

### 3.3 Nutzungsbedingungen (PFLICHT für Abos)

Vorlage in `docs/EXTERNAL-TASKS.md` Abschnitt 1.3

Wichtig:
- Preise nennen (€1,99 & €19,99)
- Kündigung beschreiben
- Widerrufsrecht (EU)

Speichere als: `assets/legal/nutzungsbedingungen-de.md` & `terms-en.md`

### 3.4 Dokumente veröffentlichen

**Option A: In der App** (empfohlen)
- Erstelle Ordner `assets/legal/`
- Kopiere alle .md Dateien
- Implementiere LegalScreen.tsx

**Option B: GitHub Pages** (für Play Store URLs)
1. Erstelle Repo `sudoku-duo-legal`
2. Upload Legal Docs
3. Aktiviere GitHub Pages
4. URLs: `https://dein-user.github.io/sudoku-duo-legal/privacy`

### 3.5 URLs in Play Console eintragen

1. **App content → Privacy policy**
   - URL eintragen (PFLICHT!)

2. **Monetization → Subscriptions → [Abo auswählen] → Terms of service**
   - URL eintragen (PFLICHT!)

---

## 🧪 Schritt 4: Testing (30 Min)

### 4.1 License Testing aktivieren

1. **Google Play Console → Setup → License testing**
2. Füge Test-E-Mail hinzu
3. Diese Accounts kaufen OHNE echte Zahlung

### 4.2 Test-Käufe durchführen

#### Test 1: Einmalkauf
1. Baue **Internal Testing Build**
2. Installiere auf **echtem Gerät**
3. Melde dich mit **Test-Account** an
4. Kaufe "Kaffee" (€1,99)
5. Prüfe:
   - [ ] Entitlement `supporter` aktiv?
   - [ ] 2× EP funktioniert?
   - [ ] 1 Bild/Monat verfügbar?
   - [ ] Schutzschilder aufgefüllt?

#### Test 2: Abo
1. Kaufe "Monatliches Abo" (€1,99)
2. Prüfe:
   - [ ] Entitlement `supporter` aktiv?
   - [ ] 3 Schutzschilder verfügbar?
   - [ ] Im Support Shop als "Aktiv" angezeigt?

#### Test 3: Restore Purchases
1. App deinstallieren
2. Neu installieren
3. "Käufe wiederherstellen" klicken
4. Prüfe:
   - [ ] Entitlement wieder aktiv?
   - [ ] Benefits verfügbar?

### 4.3 RevenueCat Dashboard prüfen

1. Gehe zu **Customers**
2. Suche deine Test-User-ID
3. Prüfe:
   - [ ] `supporter` Entitlement aktiv?
   - [ ] Kauf unter "Transactions"?

---

## 🎉 Schritt 5: Go Live

### 5.1 Finale Checkliste

**Google Play Console:**
- [ ] Alle 6 Products auf "Active"
- [ ] Grace Period aktiviert (7 Tage)
- [ ] Preise korrekt (€1,99 & €19,99)
- [ ] Privacy Policy URL eingetragen
- [ ] Terms of Service URL eingetragen

**RevenueCat:**
- [ ] Entitlement `supporter` erstellt
- [ ] Alle 6 Products verknüpft
- [ ] Offerings konfiguriert
- [ ] Service Account verbunden
- [ ] Test-Kauf erfolgreich

**Code:**
- [ ] API Key in `config.ts` gesetzt
- [ ] Alle Preise synchronisiert
- [ ] Legal Docs eingebunden
- [ ] Error Handling getestet

**Legal:**
- [ ] Impressum erstellt (DE/EN)
- [ ] Datenschutz erstellt (DE/EN)
- [ ] Nutzungsbedingungen erstellt (DE/EN)
- [ ] URLs online verfügbar

### 5.2 App veröffentlichen

1. Gehe zu **Google Play Console → Release → Production**
2. **Create new release**
3. Upload signiertes AAB
4. **Review** und **Go Live** klicken

🎊 **FERTIG! Deine In-App-Käufe sind jetzt live!**

---

## 📊 Nach dem Launch: Monitoring

### Google Play Analytics
**Monetization → Overview:**
- Buyers (zahlende Nutzer)
- Revenue (Einnahmen)
- Subscriptions (aktive Abos)

### RevenueCat Charts
**Overview / Charts:**
- Active Subscribers
- Revenue über Zeit
- Churn Rate

### Reviews beobachten
- Play Store Reviews prüfen
- Auf Billing-Probleme achten
- Schnell reagieren

---

## 🆘 Troubleshooting

### "Product not found"
**Lösung:**
- Product-IDs in Play Console & RevenueCat identisch?
- Warte 1-2 Stunden (Google Sync-Zeit)
- App in Internal Testing (nicht Draft)?

### Entitlement nicht aktiv nach Kauf
**Lösung:**
- RevenueCat Dashboard → Customers → Transactions prüfen
- Service Account Permissions prüfen
- Entitlement-Zuordnung in Products prüfen

### Restore Purchases funktioniert nicht
**Lösung:**
- Products als **Non-consumable** markiert?
- Gleicher Google-Account verwendet?
- App-Package-Name identisch?

### "Item already owned"
**Lösung:**
- Non-consumable kann nicht mehrfach gekauft werden
- Nutze "Restore Purchases"
- Bei Test: Account wechseln oder Refund via Play Console

---

## 🌍 Internationaler Verkauf

### Was automatisch funktioniert:
✅ Google Play rechnet Währungen automatisch um
✅ Steuern werden automatisch abgezogen
✅ RevenueCat funktioniert global

### Was du tun musst:

#### 1. Länder freischalten
```
Play Console → Release → Production → Countries/regions
```

**Empfohlen:**
- **Phase 1:** DACH (DE, AT, CH)
- **Phase 2:** EU (FR, IT, ES, NL, etc.)
- **Phase 3:** Global (USA, UK, CA, AU)

#### 2. Preise anpassen (optional)
- **Standard:** Google rechnet um (€1.99 → $2.19)
- **Optional:** Manuell setzen (€1.99 → $1.99)
- **Tipp:** Runde Beträge wirken attraktiver

#### 3. App übersetzen (optional)
Deine App unterstützt bereits:
- ✅ Deutsch (DE)
- ✅ English (EN)
- ✅ हिन्दी (Hindi)

Für weitere Länder:
- Französisch, Spanisch, Italienisch ergänzen
- Play Store Listing übersetzen
- Screenshots lokalisieren

---

## 📚 Weitere Ressourcen

**Detaillierte Anleitungen:**
- [REVENUECAT-SETUP.md](./REVENUECAT-SETUP.md) - RevenueCat im Detail
- [GOOGLE-PLAY-SETUP.md](./GOOGLE-PLAY-SETUP.md) - Play Console im Detail
- [EXTERNAL-TASKS.md](./EXTERNAL-TASKS.md) - Legal Docs Vorlagen

**Externe Docs:**
- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [DSGVO Info](https://gdpr.eu/)

---

**🎯 Mit dieser Anleitung bist du produktionsbereit!**

Fragen? Schau in die detaillierten Guides oder Google Play / RevenueCat Support.
