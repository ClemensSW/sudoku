# Testing Guide Updates - One-Time vs. Subscription Quota

Diese Datei enthält die Änderungen am TESTING-GUIDE.md für die neue Logik:
**Einmalkauf = 1 Bild lifetime** | **Subscription = 1 Bild/Monat**

## Änderungen am Original TESTING-GUIDE.md

### 1. Zeile 10: Überblick aktualisieren

**ALT**:
```
3. **Image-Unlock Flow** (1/Monat Quota)
```

**NEU**:
```
3. **Image-Unlock Flow** (Quota: **One-time = 1 lifetime**, **Subscription = 1/Monat**)
```

---

### 2. Test Case 1.1.1: Expected erweitern

**Nach Zeile 32 hinzufügen**:
```
- ✅ `remainingUnlocks` = 1 **(lifetime, kein monatliches Reset)**
- ✅ `isSubscription` = false
```

---

### 3. Test Case 1.4.2 komplett ersetzen

**ALT (Zeile 138-147)**:
```markdown
#### Test Case 1.4.2: Quota aufgebraucht
**Schritte**:
1. Verbrauche 1 Unlock (siehe 1.4.1)
2. Versuche, ein weiteres Bild freizuschalten

**Expected**:
- ✅ "🎁 Sofort freischalten" Button ist nicht sichtbar
- ✅ SupporterBadge zeigt "Noch 0 verfügbar"
- ✅ Nur segment-basiertes Unlock möglich
```

**NEU**:
```markdown
#### Test Case 1.4.2: Quota aufgebraucht

**WICHTIG**: Unterscheidet sich für One-time vs. Subscription!

**Schritte (One-time)**:
1. Simuliere Einmalkauf
2. Verbrauche 1 Unlock (siehe 1.4.1)
3. Versuche, ein weiteres Bild freizuschalten

**Expected (One-time)**:
- ✅ "🎁 Sofort freischalten" Button ist nicht sichtbar
- ✅ Fehlermeldung: "Du hast dein Bild bereits freigeschaltet. Schließe ein Abo ab, um jeden Monat 1 Bild freizuschalten."
- ✅ `remainingUnlocks` = 0 (bleibt 0, **kein monatliches Reset!**)
- ✅ `lifetimeUnlocks` = 1

**Schritte (Subscription)**:
1. Simuliere Abo
2. Verbrauche 1 Unlock (siehe 1.4.1)
3. Versuche, ein weiteres Bild freizuschalten

**Expected (Subscription)**:
- ✅ "🎁 Sofort freischalten" Button ist nicht sichtbar
- ✅ Fehlermeldung: "Du kannst nur 1 Bild pro Monat freischalten. Nächster Unlock am [Datum]."
- ✅ `remainingUnlocks` = 0 (wird am 1. des nächsten Monats zurückgesetzt)
- ✅ `usedThisMonth` = 1
```

---

### 4. Test Case 2.4.1: Hinweis hinzufügen

**Nach Zeile 257 (vor den Schritten) hinzufügen**:
```
**WICHTIG**: Dieser Test Case gilt **nur für Subscriptions**!
One-time purchases haben kein monatliches Reset.
```

---

### 5. NEUER Test Case 2.6 hinzufügen

**Nach Test Case 2.5 (Zeile 304) einfügen**:

```markdown
### 2.6 One-Time vs. Subscription Quota

#### Test Case 2.6.1: One-Time Purchase - Kein monatliches Reset
**Schritte**:
1. Simuliere Einmalkauf (z.B. Kaffee)
2. Schalte 1 Bild frei (`lifetimeUnlocks` = 1)
3. Warte bis zum 1. des nächsten Monats (oder ändere Systemdatum)
4. Öffne App

**Expected**:
- ✅ `remainingUnlocks` = 0 (bleibt 0, **kein Reset!**)
- ✅ `lifetimeUnlocks` = 1 (bleibt 1)
- ✅ `nextResetDate` = null
- ✅ Unlock-Button nicht mehr sichtbar
- ✅ `isSubscription` = false

**Verify**:
```typescript
const quota = await getImageUnlockQuota();
console.log('Is Subscription:', quota.isSubscription); // false
console.log('Lifetime Unlocks:', quota.lifetimeUnlocks); // 1
console.log('Next Reset:', quota.nextResetDate); // null
console.log('Can Unlock:', quota.canUnlock); // false
```

#### Test Case 2.6.2: Subscription - Monatliches Reset
**Schritte**:
1. Simuliere Abo (monthly oder yearly)
2. Schalte 1 Bild frei (`usedThisMonth` = 1)
3. Warte bis zum 1. des nächsten Monats (oder ändere Systemdatum)
4. Öffne App

**Expected**:
- ✅ `remainingUnlocks` = 1 (**zurückgesetzt!**)
- ✅ `usedThisMonth` = 0 (zurückgesetzt)
- ✅ `lifetimeUnlocks` = 0 (bleibt 0)
- ✅ `nextResetDate` = 1. des nächsten Monats
- ✅ Unlock-Button wieder sichtbar
- ✅ `isSubscription` = true

**Verify**:
```typescript
const quota = await getImageUnlockQuota();
console.log('Is Subscription:', quota.isSubscription); // true
console.log('Used This Month:', quota.usedThisMonth); // 0
console.log('Next Reset:', quota.nextResetDate); // Date object
console.log('Can Unlock:', quota.canUnlock); // true
```

---

#### Test Case 2.6.3: Upgrade von One-Time zu Subscription
**Schritte**:
1. Simuliere Einmalkauf, schalte 1 Bild frei
2. Schließe Abo ab (upgrade)
3. Prüfe Quota

**Expected**:
- ✅ `isSubscription` = true
- ✅ `remainingUnlocks` = 1 (monatliches Limit jetzt aktiv)
- ✅ `lifetimeUnlocks` = 1 (bleibt erhalten, aber wird nicht mehr verwendet)
- ✅ `usedThisMonth` = 0
- ✅ Kann sofort wieder ein Bild freischalten

**Important**: Bei Upgrade von one-time zu subscription wird die Quota **zurückgesetzt**, da jetzt monatliches Limit gilt!
```

---

## Zusammenfassung der Änderungen

1. **Überblick**: Klarstellung One-time vs. Subscription Quota
2. **Test Case 1.1.1**: `isSubscription = false` erwähnt
3. **Test Case 1.4.2**: Komplett neu mit Unterscheidung beider Typen
4. **Test Case 2.4.1**: Hinweis, dass nur für Subscriptions relevant
5. **NEU Test Case 2.6**: Drei neue Test Cases für Quota-Unterschiede

## Integration

Diese Änderungen in `docs/TESTING-GUIDE.md` manuell einfügen oder diese Datei als Ergänzung verwenden.
