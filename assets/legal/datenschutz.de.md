# Datenschutzerklärung

**Stand:** Januar 2025

## 1. Verantwortlicher

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Deutschland
E-Mail: info@playfusion-gate.de

## 2. Allgemeines zur Datenverarbeitung

### 2.1 Umfang der Verarbeitung personenbezogener Daten

Ich verarbeite personenbezogene Daten meiner Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen App und meiner Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten meiner Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.

### 2.2 Rechtsgrundlage für die Verarbeitung personenbezogener Daten

Soweit ich für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen Person einhole, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung (DSGVO) als Rechtsgrundlage.

Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich ist, dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung vorvertraglicher Maßnahmen erforderlich sind.

Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der ich unterliege, dient Art. 6 Abs. 1 lit. c DSGVO als Rechtsgrundlage.

Für den Fall, dass lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen, dient Art. 6 Abs. 1 lit. d DSGVO als Rechtsgrundlage.

Ist die Verarbeitung zur Wahrung eines berechtigten Interesses meines Unternehmens oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse nicht, so dient Art. 6 Abs. 1 lit. f DSGVO als Rechtsgrundlage für die Verarbeitung.

## 3. Datenverarbeitung im Detail

### 3.1 Lokale Datenspeicherung (ohne Serverübertragung)

**Art der Daten:**
- Spielstände und Puzzle-Fortschritt
- Spielstatistiken (gelöste Spiele, Bestzeiten, Streaks)
- App-Einstellungen (Sprache, Theme, Hilfe-Optionen)
- Erfahrungspunkte (XP) und Level-Fortschritt
- Freigeschaltete Inhalte (Farben, Landschaftssegmente, Titel)
- Pausierte Spiele
- Offline-Feedback-Warteschlange

**Zweck:**
Lokale Speicherung Ihres Spielfortschritts und Ihrer Einstellungen, um ein nahtloses Spielerlebnis zu gewährleisten.

**Rechtsgrundlage:**
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Speicherort:**
Ausschließlich lokal auf Ihrem Gerät (AsyncStorage). Diese Daten verlassen Ihr Gerät **nicht**, solange Sie kein Nutzerkonto erstellen.

**Speicherdauer:**
Bis zur Deinstallation der App oder manuellen Löschung über die App-Einstellungen.

**Löschung:**
Sie können alle lokalen Daten jederzeit in der App unter "Einstellungen → Daten löschen" entfernen.

---

### 3.2 Cloud-Synchronisierung (optional mit Nutzerkonto)

**Voraussetzung:**
Sie müssen sich aktiv mit Google oder Apple anmelden, um die Cloud-Synchronisierung zu nutzen. Ohne Anmeldung bleiben alle Daten lokal.

#### 3.2.1 Firebase Authentication (Anmeldung)

**Art der Daten:**
- **Google Sign-In:** E-Mail-Adresse, Name, Profilbild-URL, eindeutige User-ID
- **Apple Sign-In:** E-Mail-Adresse (optional anonymisiert), Name (optional), eindeutige User-ID

**Zweck:**
Authentifizierung und Verwaltung Ihres Nutzerkontos für die Cloud-Synchronisierung.

**Rechtsgrundlage:**
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung - Cloud-Sync-Service)

**Empfänger:**
- Google Firebase Authentication (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland)
- Bei Google Sign-In: Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)
- Bei Apple Sign-In: Apple Inc. (One Apple Park Way, Cupertino, CA 95014, USA)

**Serverstandort:**
EU-Region (Frankfurt/Belgien) - **kein Drittlandtransfer für Firebase-Daten**

**Speicherdauer:**
Solange Ihr Nutzerkonto besteht. Bei Kontolöschung werden alle Daten unwiderruflich gelöscht.

#### 3.2.2 Firestore Cloud-Datenbank (Spielfortschritt-Synchronisierung)

**Art der Daten:**
- Spielstatistiken (gelöste Spiele, Bestzeiten, XP, Level, Streaks)
- App-Einstellungen (Sprache, Theme, Hilfe-Optionen)
- Freigeschaltete Farben
- Landschafts-Fortschritt
- Profildaten (Name, Avatar, Titel)
- Zeitstempel der letzten Synchronisierung

**Zweck:**
Automatische Synchronisierung Ihres Spielfortschritts zwischen mehreren Geräten. Sie können Ihre Daten nach Neuinstallation oder auf einem neuen Gerät wiederherstellen.

**Rechtsgrundlage:**
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung - Cloud-Sync-Service)

**Empfänger:**
Google Firestore (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland)

**Serverstandort:**
EU-Region (Frankfurt/Belgien) - **kein Drittlandtransfer**

**Speicherdauer:**
Solange Ihr Nutzerkonto besteht. Bei Kontolöschung werden alle Daten unwiderruflich gelöscht.

**Synchronisierungs-Zeitpunkte:**
- Beim Anmelden (Download + Merge mit lokalen Daten)
- Bei App-Start (wenn angemeldet)
- Bei App-Wechsel in den Hintergrund (automatisches Backup)
- Manuell über "Einstellungen → Jetzt synchronisieren"

**Konflikt-Auflösung:**
Bei unterschiedlichen Datenständen zwischen Gerät und Cloud wird automatisch die neueste Version verwendet (Last-Write-Wins anhand von Zeitstempeln).

---

### 3.3 Feedback-System

**Art der Daten:**
- Feedback-Rating (1-5 Sterne)
- Feedback-Kategorie (Problem, Funktion fehlt, Idee, etc.)
- Feedback-Text (freiwillig)
- E-Mail-Adresse (optional, nur wenn Sie eine Rückmeldung wünschen)
- **Automatisch erfasst:** Plattform (Android/iOS), App-Version, Betriebssystem-Version
- **Bei Anmeldung:** Ihre User-ID (zur Zuordnung, nicht zur Identifikation)
- Zeitstempel der Übermittlung

**Zweck:**
Verbesserung der App-Qualität, Fehleranalyse, Feature-Entwicklung.

**Rechtsgrundlage:**
Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktives Absenden des Feedbacks)

**Empfänger:**
Google Firestore (Google Ireland Limited) - Speicherung in der EU-Region

**Zugriff:**
Ausschließlich ich persönlich (Clemens Walther) zur Auswertung

**Serverstandort:**
EU-Region (Frankfurt/Belgien) - **kein Drittlandtransfer**

**Speicherdauer:**
- Feedback ohne E-Mail: Unbegrenzt (anonymisiert)
- Feedback mit E-Mail: Bis zur Löschung auf Anfrage oder nach 3 Jahren

**Offline-Modus:**
Wenn Sie offline Feedback abschicken, wird es lokal gespeichert und automatisch übertragen, sobald eine Internetverbindung besteht.

**Anonymes Feedback:**
Sie können Feedback auch ohne Nutzerkonto abgeben. In diesem Fall wird keine User-ID gespeichert.

---

### 3.4 In-App-Käufe und Abonnements

#### 3.4.1 RevenueCat (Payment-Processing)

**Art der Daten:**
- Anonymisierte Customer-ID (generiert von RevenueCat, nicht Ihre E-Mail)
- Gekaufte Produkte (Einmalkäufe: Coffee, Breakfast, Lunch, Feast / Abonnements: Monthly, Yearly)
- Kaufdatum und Zeitstempel
- Plattform (Android/iOS)
- Abonnement-Status (aktiv, abgelaufen, in Grace Period)
- Ablaufdatum (bei Abonnements)

**Zweck:**
Verwaltung und Überprüfung Ihrer In-App-Käufe und Abonnements, Bereitstellung von Supporter-Features (2× EP-Bonus, Bildfreischaltungen).

**Rechtsgrundlage:**
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Empfänger und Auftragsverarbeiter:**
RevenueCat, Inc.
440 N Barranca Avenue #3601
Covina, CA 91723, USA
Datenschutzerklärung: https://www.revenuecat.com/privacy

**⚠️ Drittlandtransfer (USA):**
RevenueCat hostet Daten auf Servern in den USA. Der Datentransfer erfolgt auf Grundlage von **EU-Standardvertragsklauseln (SCCs)** gemäß Art. 46 Abs. 2 lit. c DSGVO. RevenueCat hat sich zur Einhaltung angemessener Datenschutzstandards verpflichtet.

Weitere Informationen: https://www.revenuecat.com/gdpr

**Speicherdauer:**
Solange das Abonnement aktiv ist oder zur Erfüllung gesetzlicher Aufbewahrungspflichten (Steuerrecht: 10 Jahre ab Kaufdatum).

**Keine Zahlungsdaten:**
Ihre Zahlungsdaten (Kreditkarte, PayPal etc.) werden **nicht** an mich oder RevenueCat weitergegeben. Die Zahlung wird direkt über Google Play Store bzw. Apple App Store abgewickelt.

#### 3.4.2 Google Play Store

Bei Käufen über den Google Play Store gelten zusätzlich die Datenschutzbestimmungen von Google:
https://policies.google.com/privacy

**Empfänger:**
Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland

**Art der Daten:**
- Google Account ID
- Kaufhistorie
- Zahlungsinformationen (werden von Google verwaltet)

#### 3.4.3 Apple App Store (geplant für iOS-Version)

Bei Käufen über den Apple App Store gelten zusätzlich die Datenschutzbestimmungen von Apple:
https://www.apple.com/legal/privacy/

**Empfänger:**
Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA

---

## 4. Auftragsverarbeiter und Drittanbieter

### 4.1 Google Firebase / Firestore

**Dienstleister:**
Google Ireland Limited
Gordon House, Barrow Street
Dublin 4, Irland

**Leistungen:**
- Firebase Authentication (Nutzerkonto-Verwaltung)
- Cloud Firestore (Cloud-Datenbank für Spielfortschritt-Synchronisierung)

**Serverstandort:**
EU-Region (europe-west1: Belgien / europe-west3: Frankfurt)

**Auftragsverarbeitungsvertrag:**
Google Cloud Platform Data Processing Terms:
https://cloud.google.com/terms/data-processing-terms

**Datenschutzerklärung:**
https://policies.google.com/privacy

**Kein Analytics:**
Google Analytics ist in dieser App **bewusst deaktiviert**. Es werden **keine** Nutzungsdaten für Tracking-Zwecke erhoben.

### 4.2 RevenueCat

**Dienstleister:**
RevenueCat, Inc.
440 N Barranca Avenue #3601
Covina, CA 91723, USA

**Leistungen:**
In-App-Purchase-Management, Abonnement-Verwaltung

**Serverstandort:**
USA

**Drittlandtransfer:**
Basierend auf EU-Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO

**Datenschutzerklärung:**
https://www.revenuecat.com/privacy

**GDPR-Informationen:**
https://www.revenuecat.com/gdpr

---

## 5. Datenweitergabe

Eine Weitergabe Ihrer Daten an Dritte erfolgt **nur** in folgenden Fällen:

1. **Auftragsverarbeiter** (siehe Abschnitt 4): Firebase/Firestore (EU), RevenueCat (USA)
2. **Payment-Provider**: Google Play Store, Apple App Store (nur bei In-App-Käufen)
3. **Gesetzliche Verpflichtungen**: Wenn ich rechtlich dazu verpflichtet bin (z.B. bei behördlichen Anfragen)

Ihre Daten werden **niemals** zu Werbezwecken an Dritte verkauft oder weitergegeben.

---

## 6. Drittlandtransfer

### 6.1 RevenueCat (USA)

Beim Kauf von In-App-Produkten oder Abonnements werden Daten an RevenueCat in den USA übermittelt. Die USA gelten als Drittland ohne angemessenes Datenschutzniveau gemäß DSGVO.

**Rechtsgrundlage:**
Art. 46 Abs. 2 lit. c DSGVO - **EU-Standardvertragsklauseln (SCCs)**

**Garantien:**
RevenueCat hat sich vertraglich zu angemessenen Datenschutzstandards verpflichtet. Sie finden die SCCs hier:
https://www.revenuecat.com/gdpr

### 6.2 Keine weiteren Drittlandtransfers

Firebase/Firestore-Server befinden sich in der **EU** (Frankfurt/Belgien). Es erfolgt **kein** Drittlandtransfer für Cloud-Sync-Daten.

---

## 7. Datensicherheit

Ich setze technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen:

- **Verschlüsselung:** Alle Datenübertragungen erfolgen verschlüsselt (HTTPS/TLS)
- **Firebase Security Rules:** Zugriff auf Cloud-Daten nur mit gültiger Authentifizierung
- **Keine Cookies/Tracker:** Diese App verwendet keine Cookies oder Tracking-Technologien
- **Keine Analytics:** Kein Google Analytics oder ähnliche Tracking-Dienste

---

## 8. Speicherdauer

| Datentyp | Speicherdauer |
|----------|---------------|
| Lokale Daten (AsyncStorage) | Bis zur App-Deinstallation oder manuellen Löschung |
| Firebase Auth (Nutzerkonto) | Bis zur Kontolöschung |
| Cloud-Sync-Daten (Firestore) | Bis zur Kontolöschung |
| Feedback ohne E-Mail | Unbegrenzt (anonymisiert) |
| Feedback mit E-Mail | 3 Jahre oder bis zur Löschung auf Anfrage |
| RevenueCat Kaufdaten | 10 Jahre (steuerrechtliche Aufbewahrungspflicht) |
| In-App-Käufe (aktive Abos) | Solange das Abo aktiv ist |

---

## 9. Ihre Rechte (Betroffenenrechte)

Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:

### 9.1 Auskunftsrecht (Art. 15 DSGVO)

Sie haben das Recht, von mir eine Bestätigung darüber zu verlangen, ob Sie betreffende personenbezogene Daten verarbeitet werden. Ist dies der Fall, haben Sie ein Recht auf Auskunft über diese personenbezogenen Daten.

**Wie Sie Ihr Recht ausüben:**
- E-Mail an: info@playfusion-gate.de
- In der App: Einstellungen → Account → Daten exportieren

### 9.2 Recht auf Berichtigung (Art. 16 DSGVO)

Sie haben das Recht, die Berichtigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen.

**Wie Sie Ihr Recht ausüben:**
- Profilname & Avatar: In der App unter "Einstellungen → Profil"
- Sonstige Daten: E-Mail an info@playfusion-gate.de

### 9.3 Recht auf Löschung (Art. 17 DSGVO)

Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen.

**Wie Sie Ihr Recht ausüben:**

**Option 1: Lokale Daten löschen (ohne Konto):**
- Einstellungen → Rechtliches & Daten → Alle lokalen Daten löschen
- Löscht alle Spielstände, Statistiken und Einstellungen von Ihrem Gerät

**Option 2: Komplette Kontolöschung (mit Konto):**
- Einstellungen → Account → Konto löschen
- Löscht **unwiderruflich:**
  - Firebase Auth Account
  - Alle Cloud-Daten (Firestore)
  - Alle lokalen Daten
  - Google/Apple-Zugriff wird widerrufen

**⚠️ Wichtig:** Kaufdaten (RevenueCat) werden aus steuerrechtlichen Gründen 10 Jahre aufbewahrt. Diese werden jedoch anonymisiert und können nicht mehr Ihrem Konto zugeordnet werden.

### 9.4 Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)

Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.

**Wie Sie Ihr Recht ausüben:**
E-Mail an: info@playfusion-gate.de

### 9.5 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)

Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.

**Wie Sie Ihr Recht ausüben:**
- In der App: Einstellungen → Account → Daten exportieren (JSON-Format)
- Per E-Mail: info@playfusion-gate.de

### 9.6 Widerspruchsrecht (Art. 21 DSGVO)

Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten zu widersprechen, soweit diese auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen) erfolgt.

**Wie Sie Ihr Recht ausüben:**
E-Mail an: info@playfusion-gate.de

### 9.7 Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)

Sie haben das Recht, Ihre erteilte Einwilligung jederzeit zu widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung wird dadurch nicht berührt.

**Beispiel:**
- Cloud-Sync deaktivieren: Einfach abmelden (Daten bleiben auf dem Gerät)
- Feedback-Einwilligung widerrufen: E-Mail an info@playfusion-gate.de

### 9.8 Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)

Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch mich zu beschweren.

**Zuständige Aufsichtsbehörde:**
Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)
Kavalleriestraße 2-4
40213 Düsseldorf
Telefon: 0211 38424-0
E-Mail: poststelle@ldi.nrw.de
https://www.ldi.nrw.de/

---

## 10. Keine Cookies und Tracking

Diese App verwendet **keine Cookies**, **keine Tracking-Technologien** und **kein Google Analytics** oder ähnliche Dienste. Ihre Nutzung wird **nicht** zu Analysezwecken erfasst.

Die einzigen automatisch erhobenen Daten sind:
- Device-Metadaten beim Feedback (Plattform, OS-Version, App-Version) zur Fehleranalyse
- Sync-Zeitstempel zur Konflikt-Auflösung bei Cloud-Sync

---

## 11. Änderungen dieser Datenschutzerklärung

Ich behalte mir vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder Änderungen der App sowie der Datenverarbeitung anzupassen. Dies gilt jedoch nur für Erklärungen zur Datenverarbeitung. Sofern Einwilligungen der Nutzer erforderlich sind oder Bestandteile der Datenschutzerklärung Regelungen des Vertragsverhältnisses mit den Nutzern enthalten, erfolgen die Änderungen nur mit Zustimmung der Nutzer.

Die Nutzer werden gebeten, sich regelmäßig über den Inhalt der Datenschutzerklärung zu informieren. Die jeweils aktuelle Version finden Sie in der App unter "Einstellungen → Rechtliches → Datenschutz".

---

## 12. Kontakt für Datenschutzanfragen

Bei Fragen zum Datenschutz, zur Ausübung Ihrer Rechte oder bei Beschwerden können Sie sich jederzeit an mich wenden:

**E-Mail:** info@playfusion-gate.de

**Postanschrift:**
Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Deutschland

Ich werde Ihre Anfrage innerhalb von **30 Tagen** beantworten.
