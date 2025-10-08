# Testing Guide - Supporter System

Diese Anleitung beschreibt alle Testszenarien für das Supporter-System in Sudoku Duo.

## 📋 Überblick

Das Supporter-System muss in folgenden Bereichen getestet werden:
1. **Purchase Flow** (Einmalkauf + Abo)
2. **EP-Bonus System** (2× Multiplier)
3. **Image-Unlock Flow** (1/Monat Quota)
4. **Edge Cases** (Offline, Grace Period, Quota-Reset)
5. **UI/UX** (Dark Mode, Accessibility, Animationen)

---

## 1. End-to-End Tests

### 1.1 Einmalkauf (One-Time Purchase)

#### Test Case 1.1.1: Kaffee kaufen
**Schritte**:
1. Öffne Support Shop
2. Klicke auf "Kaffee" (€1.99)
3. Bestätige Kauf im Google Play Dialog
4. Warte auf Success-Screen

**Expected**:
- ✅ ThankYouModal erscheint mit Confetti
- ✅ BenefitsBanner zeigt "Danke!" mit ⭐ Icon
- ✅ `isSupporter` = true
- ✅ `epMultiplier` = 2
- ✅ `remainingUnlocks` = 1

**Verify**:
```typescript
const { isSupporter, epMultiplier } = useSupporter();
const { remainingUnlocks } = useImageUnlock();
console.log('Is Supporter:', isSupporter); // true
console.log('EP Multiplier:', epMultiplier); // 2
console.log('Remaining Unlocks:', remainingUnlocks); // 1
```

#### Test Case 1.1.2: Alle 4 Einmalkäufe testen
**Schritte**: Wiederhole 1.1.1 für:
- Frühstück (€4.99)
- Mittagessen (€9.99)
- Festmahl (€19.99)

**Expected**: Identisches Verhalten, alle Benefits gleich!

---

### 1.2 Abonnement (Subscription)

#### Test Case 1.2.1: Monatliches Abo abschließen
**Schritte**:
1. Öffne Support Shop
2. Klicke auf "Monatlicher Support" (€2.99/Monat)
3. Bestätige Abo-Abschluss
4. Warte auf Success-Screen

**Expected**:
- ✅ ThankYouModal erscheint
- ✅ `isSupporter` = true
- ✅ `isPremiumSubscriber` = true
- ✅ `supportType` = 'subscription'
- ✅ `expiresAt` = Datum in ~1 Monat
- ✅ BenefitsBanner zeigt "Danke!" (purple gradient)

#### Test Case 1.2.2: Jährliches Abo abschließen
**Schritte**: Analog zu 1.2.1, aber "Jährlicher Support" (€29.99/Jahr)

**Expected**:
- ✅ `expiresAt` = Datum in ~1 Jahr
- ✅ Sonst identisch zu monatlich

---

### 1.3 EP-Bonus System

#### Test Case 1.3.1: EP-Bonus beim Spielen
**Schritte**:
1. Stelle sicher, dass `isSupporter` = true
2. Starte ein neues Sudoku (beliebige Schwierigkeit)
3. Löse das Sudoku vollständig
4. Prüfe EP-Gain im Erfolgs-Screen

**Expected**:
- ✅ Base EP wird mit 2× multipliziert
- ✅ Console-Log zeigt: "XP gained: X (base: Y, multiplier: 2x)"
- ✅ Stats zeigen erhöhtes EP

**Verify**:
```typescript
// In utils/storage.ts → updateStatsAfterGame
const baseXp = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);
const xpGain = await calculateEpWithBonus(baseXp);
console.log(`XP gained: ${xpGain} (base: ${baseXp}...)`);
```

#### Test Case 1.3.2: Kein Bonus ohne Support
**Schritte**:
1. Stelle sicher, dass `isSupporter` = false
2. Löse ein Sudoku
3. Prüfe EP-Gain

**Expected**:
- ✅ EP ohne Multiplikation (1×)
- ✅ Console-Log zeigt: "multiplier: 1x"

---

### 1.4 Image-Unlock Flow

#### Test Case 1.4.1: Bild sofort freischalten
**Schritte**:
1. Stelle sicher, dass `isSupporter` = true und `remainingUnlocks` = 1
2. Öffne Galerie
3. Klicke auf ein **unvollständiges** Bild
4. ImageDetailModal öffnet sich
5. Klicke auf "🎁 Sofort freischalten"
6. Bestätige im UnlockConfirmationDialog

**Expected**:
- ✅ UnlockConfirmationDialog zeigt Bildname + verbleibende Unlocks
- ✅ Nach Confirm: Bild wird sofort vollständig freigeschaltet
- ✅ `remainingUnlocks` = 0
- ✅ Bild erscheint als `isComplete` in Galerie
- ✅ Success-Haptic-Feedback

**Verify**:
```typescript
const result = await unlockImageAsSupporter(imageId);
console.log('Unlock Result:', result);
// { success: true, imageId: '...', quotaUsed: true }
```

#### Test Case 1.4.2: Quota aufgebraucht
**Schritte**:
1. Verbrauche 1 Unlock (siehe 1.4.1)
2. Versuche, ein weiteres Bild freizuschalten

**Expected**:
- ✅ "🎁 Sofort freischalten" Button ist nicht sichtbar
- ✅ SupporterBadge zeigt "Noch 0 verfügbar"
- ✅ Nur segment-basiertes Unlock möglich

---

### 1.5 Restore Purchases

#### Test Case 1.5.1: Restore nach App-Neuinstallation
**Schritte**:
1. Kaufe ein Produkt (z.B. Kaffee)
2. Deinstalliere die App
3. Installiere die App neu
4. Öffne Support Shop
5. Klicke auf "Käufe wiederherstellen" (TODO: Button noch hinzufügen!)

**Expected**:
- ✅ `isSupporter` = true nach Restore
- ✅ Benefits wieder aktiv
- ✅ Quota bleibt erhalten (via AsyncStorage)

**TODO**: Restore-Button im Shop hinzufügen!

---

## 2. Edge Cases

### 2.1 Expired Subscription

#### Test Case 2.1.1: Abo läuft ab
**Schritte**:
1. Schließe Monats-Abo ab
2. Warte bis Ablaufdatum (oder simuliere mit RevenueCat Sandbox)
3. Öffne App nach Ablauf

**Expected**:
- ✅ `isSupporter` = false
- ✅ `isPremiumSubscriber` = false
- ✅ `supportType` = 'none'
- ✅ Benefits deaktiviert (1× EP, kein Image-Unlock)
- ✅ BenefitsBanner zeigt wieder Benefit-Varianten (nicht "Danke!")

---

### 2.2 Grace Period

#### Test Case 2.2.1: Zahlung fehlgeschlagen
**Schritte**:
1. Abo mit ungültiger Zahlungsmethode
2. Warte bis Billing-Datum
3. Google versucht Abrechnung, schlägt fehl
4. Grace Period startet (7 Tage)

**Expected**:
- ✅ `isInGracePeriod` = true
- ✅ Benefits bleiben aktiv
- ✅ Warnung im Shop: "Zahlungsproblem - bitte aktualisiere deine Zahlungsmethode"
- ✅ Nach 7 Tagen ohne Zahlung: Abo wird gekündigt

**Code**:
```typescript
interface SupporterStatus {
  isInGracePeriod: boolean;
}

// UI zeigt Warnung:
if (status.isInGracePeriod) {
  showPaymentWarning();
}
```

**Hinweis**: Grace Period ist schwer lokal zu testen. Nutze RevenueCat Sandbox oder warte auf echte Billing-Fehler.

---

### 2.3 Offline Purchase

#### Test Case 2.3.1: Kauf im Offline-Modus
**Schritte**:
1. Aktiviere Flugmodus
2. Öffne Support Shop
3. Versuche, ein Produkt zu kaufen

**Expected**:
- ✅ Google Play zeigt Fehler: "No internet connection"
- ✅ Purchase schlägt fehl
- ✅ Keine Änderung an Supporter-Status

#### Test Case 2.3.2: Offline-Kauf mit späterer Synchronisation
**Schritte**:
1. Kaufe ein Produkt (online)
2. Schließe App
3. Aktiviere Flugmodus
4. Öffne App (offline)
5. Deaktiviere Flugmodus nach 5 Min
6. App im Hintergrund lassen

**Expected**:
- ✅ Offline: Status aus Cache (AsyncStorage)
- ✅ Online: SubscriptionService sync automatisch
- ✅ CustomerInfo-Update-Event triggert Status-Refresh

**Code**:
```typescript
// SubscriptionService.ts
private handleCustomerInfoUpdate = async (info: CustomerInfo) => {
  const newStatus = await getSupporterStatus();
  this.emit('status-updated', newStatus);
};
```

---

### 2.4 Quota-Reset am Monatsersten

#### Test Case 2.4.1: Monatswechsel
**Schritte**:
1. Nutze 1 Image-Unlock im aktuellen Monat
2. `remainingUnlocks` = 0
3. Warte bis zum 1. des nächsten Monats (oder ändere Systemdatum)
4. Öffne App

**Expected**:
- ✅ `remainingUnlocks` = 1 (zurückgesetzt)
- ✅ `usedThisMonth` = 0
- ✅ `lastUnlockDate` zeigt alten Monat
- ✅ `nextResetDate` zeigt 1. des nächsten Monats

**Verify**:
```typescript
// modules/subscriptions/entitlements.ts
export async function getImageUnlockQuota(): Promise<ImageUnlockQuota> {
  // Prüft Monat/Jahr-Wechsel
  const now = new Date();
  const lastUnlock = new Date(lastUnlockDate);

  if (now.getMonth() !== lastUnlock.getMonth() ||
      now.getFullYear() !== lastUnlock.getFullYear()) {
    // Reset!
    usedThisMonth = 0;
  }
}
```

---

### 2.5 Mehrfachkauf verhindern

#### Test Case 2.5.1: Versuch, selbes Produkt zweimal zu kaufen
**Schritte**:
1. Kaufe "Kaffee" (€1.99)
2. Versuche erneut, "Kaffee" zu kaufen

**Expected (Non-Consumable)**:
- ✅ Google Play Dialog zeigt: "You already own this item"
- ✅ Purchase schlägt fehl
- ✅ Keine doppelte Belastung

**Hinweis**: Daher ist "Non-Consumable" wichtig!

---

## 3. UI/UX Tests

### 3.1 Dark Mode

#### Test Case 3.1.1: Alle neuen Screens im Dark Mode
**Schritte**:
1. Aktiviere Dark Mode in Einstellungen
2. Öffne Support Shop
3. Prüfe alle neuen Komponenten:
   - BenefitsBanner
   - ThankYouModal
   - SupporterBadge
   - UnlockConfirmationDialog

**Expected**:
- ✅ Alle Komponenten nutzen theme-aware colors
- ✅ Text ist lesbar (Kontraste WCAG AA)
- ✅ Buttons sind erkennbar
- ✅ Blur-Effekte funktionieren

#### Test Case 3.1.2: Light Mode
**Schritte**: Analog zu 3.1.1, aber im Light Mode

---

### 3.2 Accessibility

#### Test Case 3.2.1: Screen Reader Labels
**Schritte**:
1. Aktiviere TalkBack (Android)
2. Navigiere durch Support Shop
3. Prüfe, dass alle Buttons/Elemente vorgelesen werden

**Expected**:
- ✅ ProductCard hat accessible Label
- ✅ SubscriptionCard hat accessible Label
- ✅ Unlock-Buttons haben klare Labels
- ✅ Preis wird vorgelesen

**TODO**: Accessibility-Labels hinzufügen wo nötig!

#### Test Case 3.2.2: Kontraste (WCAG AA)
**Tools**: Nutze Contrast Checker (z.B. WebAIM)

**Prüfe**:
- ✅ Text auf Banner-Gradient: mindestens 4.5:1
- ✅ Button-Text auf Primary-Color: mindestens 4.5:1
- ✅ Secondary-Text: mindestens 3:1

#### Test Case 3.2.3: Touch Targets
**Schritte**: Prüfe alle interaktiven Elemente

**Expected**:
- ✅ Alle Buttons mindestens 44×44 dp
- ✅ Close-Buttons mindestens 40×40 dp
- ✅ Product/Subscription Cards: volle Breite, leicht tappbar

---

### 3.3 Animationen

#### Test Case 3.3.1: Kein Jank bei Transitions
**Schritte**:
1. Öffne Support Shop
2. Beobachte BenefitsBanner Rotation (4s)
3. Öffne ThankYouModal nach Kauf
4. Öffne UnlockConfirmationDialog

**Expected**:
- ✅ FadeIn/FadeOut smooth (60 FPS)
- ✅ Confetti-Animation flüssig
- ✅ Icon-Pulse nicht ruckelig
- ✅ Modal-Slide smooth

**Tools**: Nutze React Native Performance Monitor

---

## 4. Performance Tests

### 4.1 EP-Berechnung

#### Test Case 4.1.1: Schnelle EP-Berechnung
**Schritte**:
1. Löse Sudoku
2. Messe Zeit für EP-Berechnung

**Expected**:
- ✅ `calculateEpWithBonus()` dauert < 50ms
- ✅ Keine UI-Blockierung
- ✅ Async, aber keine spürbare Verzögerung

**Code**:
```typescript
const startTime = Date.now();
const xpGain = await calculateEpWithBonus(baseXp);
const duration = Date.now() - startTime;
console.log('EP Calculation took:', duration, 'ms');
```

---

### 4.2 Quota-Checks

#### Test Case 4.2.1: Gecachte Quota-Checks
**Schritte**:
1. Öffne Galerie
2. Öffne mehrere Bilder nacheinander
3. Prüfe, dass Quota nicht jedes Mal neu berechnet wird

**Expected**:
- ✅ `useImageUnlock()` Hook cached Werte
- ✅ Nur bei Unlock oder App-Start neu berechnen

---

## 5. Internationalisierung

### 5.1 Alle Texte übersetzt

#### Test Case 5.1.1: Deutsche App
**Schritte**:
1. Setze Sprache auf Deutsch
2. Prüfe alle neuen Texte

**Expected**:
- ✅ BenefitsBanner Varianten: DE
- ✅ UnlockDialog: DE
- ✅ SupporterBadge: DE
- ✅ ThankYouModal: DE

#### Test Case 5.1.2: Englische App
**Schritte**: Analog, Sprache auf Englisch

#### Test Case 5.1.3: Hindi App
**Schritte**: Analog, Sprache auf Hindi

---

## 6. Final Checklist vor Launch

### 6.1 Functional
- [ ] Alle 4 Einmalkäufe funktionieren
- [ ] Beide Abos funktionieren
- [ ] EP-Bonus funktioniert (2×)
- [ ] Image-Unlock funktioniert (1/Monat)
- [ ] Quota-Reset am Monatsersten
- [ ] Restore Purchases funktioniert
- [ ] Offline-Kauf Sync funktioniert
- [ ] Grace Period erkannt

### 6.2 UI/UX
- [ ] Dark Mode: alle Screens
- [ ] Light Mode: alle Screens
- [ ] Animationen flüssig
- [ ] Haptic Feedback funktioniert
- [ ] Accessibility-Labels vorhanden
- [ ] Touch Targets ≥ 44dp

### 6.3 Performance
- [ ] Kein Jank bei Animationen
- [ ] EP-Berechnung < 50ms
- [ ] Quota-Checks cached
- [ ] Keine Memory Leaks

### 6.4 Internationalisierung
- [ ] Alle Texte in DE/EN/HI
- [ ] Währungen automatisch (RevenueCat)
- [ ] Preise korrekt angezeigt

### 6.5 Integration
- [ ] RevenueCat Dashboard zeigt Transactions
- [ ] Google Play Console zeigt Käufe
- [ ] Service Account verbunden
- [ ] Entitlements korrekt zugeordnet

---

## 7. Bug Report Template

Wenn du einen Bug findest, nutze dieses Template:

```markdown
## Bug Report

**Title**: [Kurze Beschreibung]

**Steps to Reproduce**:
1. ...
2. ...
3. ...

**Expected Behavior**:
...

**Actual Behavior**:
...

**Environment**:
- Device: [z.B. Pixel 7]
- Android Version: [z.B. 14]
- App Version: [z.B. 1.0.0]
- Test Account: [Email]

**Logs** (optional):
```typescript
// Console output
```

**Screenshots** (optional):
[Attach images]
```

---

## 8. Nächste Schritte

Nach erfolgreichem Testing:
1. ✅ Alle Tests grün
2. ✅ RevenueCat Setup komplett
3. ✅ Google Play Console Setup komplett
4. ✅ Legal Requirements erfüllt (Privacy Policy, etc.)
5. 🚀 **Launch!**

---

**Hinweis**: Diese Testing-Guide deckt die wichtigsten Szenarien ab. Weitere Tests können je nach Nutzerfeedback hinzugefügt werden.
