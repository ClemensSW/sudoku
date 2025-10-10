# Externe Aufgaben - Payment System Launch

**Diese Aufgaben müssen AUSSERHALB der Codebase erledigt werden.**

**Zeitaufwand gesamt:** 4-8 Stunden (einmalig)

---

## 📋 AUFGABE 1: Legal Dokumente erstellen

**Priorität:** ⚡ CRITICAL (Blocker für Launch!)
**Zeitaufwand:** 3-6 Stunden
**Reihenfolge:** Zuerst erledigen!

---

### 1.1 Impressum erstellen (TMG §5)

**Pflicht in:** Deutschland, Österreich, Schweiz

**Was muss rein:**
```
Angaben gemäß § 5 TMG:

Name: [Dein vollständiger Name oder Firmenname]
Anschrift: [Straße, Hausnummer]
          [PLZ, Ort]
          [Land]

Kontakt:
E-Mail: [deine@email.de]
Telefon: [optional, aber empfohlen]

Umsatzsteuer-ID (falls vorhanden):
USt-IdNr.: [DE123456789]

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
[Dein Name]
[Adresse]
```

**Vorlage:** https://www.e-recht24.de/impressum-generator.html

**Schritte:**
1. ⬜ Gehe zu e-recht24.de Impressum-Generator
2. ⬜ Fülle alle Felder aus (App als "Telemedium")
3. ⬜ Kopiere generierten Text
4. ⬜ Speichere als `legal/impressum-de.md`
5. ⬜ Übersetze für EN: `legal/impressum-en.md`

**Wo eintragen:**
- In App: Settings → Rechtliches → Impressum
- Play Store: App-Beschreibung (Link)

---

### 1.2 Datenschutzerklärung erstellen (DSGVO)

**Pflicht in:** EU, UK (GDPR)

**Was muss rein:**

#### A) Verantwortlicher
```
Verantwortlicher für die Datenverarbeitung:
[Dein Name]
[Adresse]
[E-Mail]
```

#### B) Welche Daten werden gesammelt?
```
1. Automatisch gesammelte Daten:
   - Geräte-ID (Android ID)
   - App-Version, OS-Version
   - Crash-Logs (falls Analytics verwendet)

2. Daten bei In-App-Käufen:
   - Google Play Nutzer-ID
   - Kauf-Historie (über RevenueCat)
   - Zeitstempel der Käufe

3. Optional (falls verwendet):
   - Google Analytics Daten
   - Firebase Crashlytics
```

#### C) Dienste/Drittanbieter

**RevenueCat (Payment Processing):**
```
Anbieter: RevenueCat, Inc.
Zweck: Verwaltung von In-App-Käufen und Abonnements
Daten: Google Play Nutzer-ID, Kauf-Historie, Geräte-ID
Datenschutz: https://www.revenuecat.com/privacy
Server-Standort: USA (Privacy Shield zertifiziert)
```

**Google Play Billing:**
```
Anbieter: Google LLC
Zweck: Zahlungsabwicklung
Daten: Zahlungsinformationen, Kauf-Historie
Datenschutz: https://policies.google.com/privacy
```

**AsyncStorage (Lokal):**
```
Zweck: App-Einstellungen, Spielfortschritt
Daten: Thema-Präferenz, Schwierigkeitsgrad, EP-Punkte
Speicherort: Gerät des Nutzers (lokal, nicht übertragen)
```

#### D) Rechtsgrundlage (DSGVO Art. 6)
```
- Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bei Käufen)
- Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse für Analytics)
```

#### E) Nutzerrechte
```
Du hast folgende Rechte:
- Auskunft über deine Daten (Art. 15 DSGVO)
- Berichtigung falscher Daten (Art. 16 DSGVO)
- Löschung deiner Daten (Art. 17 DSGVO)
- Einschränkung der Verarbeitung (Art. 18 DSGVO)
- Datenübertragbarkeit (Art. 20 DSGVO)
- Widerspruch (Art. 21 DSGVO)

Kontakt: [deine@email.de]
Beschwerdestelle: Landesdatenschutzbehörde deines Bundeslandes
```

**Vorlage:** https://www.e-recht24.de/muster-datenschutzerklaerung.html

**Schritte:**
1. ⬜ Gehe zu e-recht24.de Datenschutz-Generator
2. ⬜ Wähle "Mobile App" + "In-App-Käufe"
3. ⬜ Füge RevenueCat als Drittanbieter hinzu
4. ⬜ Füge Google Play als Drittanbieter hinzu
5. ⬜ Optional: Google Analytics, Firebase (falls verwendet)
6. ⬜ Generiere und speichere als `legal/datenschutz-de.md`
7. ⬜ Übersetze für EN: `legal/privacy-policy-en.md`

**Wo eintragen:**
- In App: Settings → Rechtliches → Datenschutz
- Play Store: Privacy Policy URL (PFLICHT!)

---

### 1.3 Nutzungsbedingungen/AGB erstellen

**Pflicht für:** Abonnements (Google Play Policy)

**Was muss rein:**

```
# Nutzungsbedingungen / Terms of Service

## 1. Geltungsbereich
Diese Nutzungsbedingungen gelten für die Nutzung der App "Sudoku Duo"
und der In-App-Käufe.

## 2. Leistungsumfang
Die App bietet:
- Kostenlose Grundfunktionen (Sudoku spielen)
- Optional: In-App-Käufe und Abonnements für zusätzliche Funktionen

## 3. In-App-Käufe

### 3.1 Einmalkäufe (One-Time Purchases)
- Produkte: Kaffee (€1,99), Frühstück (€4,99), Mittagessen (€9,99), Festmahl (€19,99)
- Leistung: 2× EP Bonus + 1 Bild freischalten (einmalig)
- Einmalige Zahlung, keine automatische Verlängerung

### 3.2 Abonnements
- Monatlich: €2,99/Monat
  - Leistung: 2× EP Bonus + 1 Bild pro Monat freischalten
- Jährlich: €29,99/Jahr
  - Leistung: 2× EP Bonus + 2 Bilder pro Monat freischalten

### 3.3 Zahlungsabwicklung
- Zahlung erfolgt über Google Play
- Preise inkl. gesetzlicher MwSt.
- Abonnements verlängern sich automatisch

### 3.4 Kündigung von Abonnements
- Kündigung jederzeit über Google Play möglich
- Keine Kündigungsfrist
- Leistungen enden zum Ende der Laufzeit
- Bereits gezahlte Beträge werden nicht erstattet

## 4. Widerrufsrecht (nur EU)
Siehe separate Widerrufsbelehrung.

## 5. Haftungsausschluss
- App wird "as is" bereitgestellt
- Keine Garantie für Verfügbarkeit
- Haftung nur bei Vorsatz und grober Fahrlässigkeit

## 6. Änderungen
Wir behalten uns vor, diese Bedingungen zu ändern.
Nutzer werden über Änderungen informiert.

## 7. Anwendbares Recht
Es gilt das Recht der Bundesrepublik Deutschland.

## 8. Kontakt
[Dein Name]
[E-Mail]

Stand: [Datum]
```

**Schritte:**
1. ⬜ Kopiere obige Vorlage
2. ⬜ Passe an deine Daten an
3. ⬜ Speichere als `legal/nutzungsbedingungen-de.md`
4. ⬜ Übersetze für EN: `legal/terms-of-service-en.md`

**Wo eintragen:**
- In App: Settings → Rechtliches → Nutzungsbedingungen
- Play Store: "Terms of Service" (bei Abo-Apps PFLICHT!)

---

### 1.4 Widerrufsbelehrung erstellen (EU-Richtlinie)

**Pflicht für:** EU-Nutzer bei Abonnements

**Vorlage:**

```
# Widerrufsbelehrung / Right of Withdrawal

## Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
[Dein Name]
[Adresse]
[E-Mail]

mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.

Sie können dafür das beigefügte Muster-Widerrufsformular verwenden,
das jedoch nicht vorgeschrieben ist.

## Widerrufsfolgen

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen
vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
Ihren Widerruf dieses Vertrags bei uns eingegangen ist.

Die Rückzahlung erfolgt über Google Play.

## Ausschluss des Widerrufsrechts

Das Widerrufsrecht erlischt bei digitalen Inhalten, wenn Sie der
Ausführung vor Ablauf der Widerrufsfrist ausdrücklich zugestimmt haben.

Durch den Kauf im Google Play Store stimmen Sie zu, dass die Leistung
sofort erbracht wird, wodurch Ihr Widerrufsrecht erlischt.

---

## Muster-Widerrufsformular

Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus:

An:
[Dein Name]
[Adresse]
[E-Mail]

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der
folgenden Dienstleistung (*)

Bestellt am (*)/erhalten am (*)
Name des/der Verbraucher(s)
Anschrift des/der Verbraucher(s)
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
Datum

(*) Unzutreffendes streichen
```

**Schritte:**
1. ⬜ Kopiere obige Vorlage
2. ⬜ Passe an deine Daten an
3. ⬜ Speichere als `legal/widerrufsbelehrung-de.md`
4. ⬜ Übersetze für EN: `legal/right-of-withdrawal-en.md`

**Wo eintragen:**
- In App: Settings → Rechtliches → Widerrufsrecht
- Play Store: Bei Abo-Beschreibung erwähnen

---

### 1.5 Legal Docs veröffentlichen

**Option A: In der App (empfohlen)**
✅ Nutzer kann offline lesen
✅ Keine externe Website nötig
❌ Updates nur mit App-Update

**Schritte:**
1. ⬜ Erstelle Ordner `assets/legal/`
2. ⬜ Kopiere alle .md Dateien dorthin
3. ⬜ Implementiere LegalScreen.tsx (wird im Code gemacht)

**Option B: Website/GitHub (zusätzlich empfohlen)**
✅ Einfach aktualisierbar
✅ Öffentlich zugänglich (für Play Store)
❌ Benötigt Hosting

**Schritte:**
1. ⬜ Erstelle GitHub Repo (z.B. `sudoku-duo-legal`)
2. ⬜ Upload alle Legal Docs
3. ⬜ Aktiviere GitHub Pages
4. ⬜ URL: `https://dein-user.github.io/sudoku-duo-legal/privacy`

---

## 📋 AUFGABE 2: Google Play Console konfigurieren

**Priorität:** ⚡ CRITICAL
**Zeitaufwand:** 30-60 Minuten
**Voraussetzung:** Legal Docs erstellt

---

### 2.1 Privacy Policy URL eintragen

**Schritte:**
1. ⬜ Gehe zu **Google Play Console**
2. ⬜ Wähle deine App
3. ⬜ **App content → Privacy policy**
4. ⬜ Trage URL ein (GitHub Pages oder eigene Website)
5. ⬜ Speichern

**Beispiel-URL:**
```
https://dein-user.github.io/sudoku-duo-legal/privacy-policy
```

---

### 2.2 Terms of Service eintragen

**Schritte:**
1. ⬜ In Play Console: **Monetization → Subscriptions**
2. ⬜ Wähle jedes Abo aus
3. ⬜ **Subscription details → Terms of service**
4. ⬜ Trage URL ein
5. ⬜ Speichern

---

### 2.3 Store Listing aktualisieren

**Schritte:**
1. ⬜ **Store presence → Main store listing**
2. ⬜ **App description:** Erwähne In-App-Käufe
3. ⬜ Füge Link zu Datenschutz hinzu (optional)
4. ⬜ Speichern

**Beispiel-Text (DE):**
```
Sudoku Duo - Rätselspaß zu zweit!

Spiele Sudoku kostenlos oder unterstütze die Entwicklung mit
freiwilligen In-App-Käufen (ab €1,99).

Features:
- Kostenlos spielbar
- 2× EP Bonus für Supporter
- Bildergalerie freischalten

Datenschutz: [URL]
Impressum: [URL]
```

---

## 📋 AUFGABE 3: RevenueCat Dashboard konfigurieren

**Priorität:** MEDIUM (kann auch nach Code-Änderungen gemacht werden)
**Zeitaufwand:** 30 Minuten
**Voraussetzung:** Google Play Products erstellt

**Schritte:**
1. ⬜ Folge [REVENUECAT-SETUP.md](./REVENUECAT-SETUP.md)
2. ⬜ Erstelle Entitlement `supporter`
3. ⬜ Erstelle alle 6 Products
4. ⬜ Erstelle Default Offering
5. ⬜ Verbinde Service Account

---

## 📋 AUFGABE 4: iOS Vorbereitung (OPTIONAL)

**Priorität:** LOW (später)
**Zeitaufwand:** 2-3 Stunden

**Schritte:**
1. ⬜ Apple Developer Account ($99/Jahr)
2. ⬜ iOS App in RevenueCat erstellen
3. ⬜ Bundle Identifier registrieren
4. ⬜ iOS API Key kopieren
5. ⬜ Products in App Store Connect erstellen

**Notiz:** Kann übersprungen werden, da iOS aktuell nicht geplant.

---

## ✅ CHECKLISTE: Alle externen Aufgaben

**Legal Docs:**
- [ ] Impressum (DE)
- [ ] Impressum (EN)
- [ ] Datenschutz (DE)
- [ ] Datenschutz (EN)
- [ ] Nutzungsbedingungen (DE)
- [ ] Nutzungsbedingungen (EN)
- [ ] Widerrufsbelehrung (DE)
- [ ] Widerrufsbelehrung (EN)

**Veröffentlichung:**
- [ ] Docs in `assets/legal/` kopiert
- [ ] Optional: GitHub Pages Setup
- [ ] URLs verfügbar

**Google Play Console:**
- [ ] Privacy Policy URL eingetragen
- [ ] Terms of Service URL eingetragen
- [ ] Store Listing aktualisiert

**RevenueCat:**
- [ ] Dashboard-Setup abgeschlossen (siehe REVENUECAT-SETUP.md)

---

## 📚 HILFREICHE RESSOURCEN

**Legal Generators:**
- e-recht24.de (DE, kostenlos mit Registrierung)
- datenschutz-generator.de
- termsfeed.com (EN, kostenlos)

**DSGVO Infos:**
- https://gdpr.eu/
- https://dsgvo-gesetz.de/

**Google Play Policies:**
- https://play.google.com/about/developer-content-policy/
- https://support.google.com/googleplay/android-developer/answer/9899234

**RevenueCat Docs:**
- https://www.revenuecat.com/docs

---

**Nach Abschluss:** Kehre zum Code zurück und starte mit SESSION 1!
