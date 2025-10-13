# Daily Streak System – Implementierungsplan

## 📋 Übersicht
Transformation des Win-Streak-Systems in ein tägliches Engagement-System mit Kalender-Visualisierung und Streak-Schutz-Mechanik.

---

## 🎯 Kernziele

### 1. **Daily Streak Mechanik**
- **Trigger**: +1 Streak pro Tag bei mind. 1 abgeschlossenem Sudoku
- **Reset**: Automatisch um Mitternacht (lokale Zeit) wenn kein Spiel gespielt
- **Visualisierung**: Monatlicher Kalender mit Success-Markierungen

### 2. **Schutzschild System** (Streak Freeze)
- **Free User**: 2 Schutzschilder/Woche (Reset: Montag 00:00)
- **Premium Subscriber**: 3 Schutzschilder/Woche
- **Funktion**: Verhindert Streak-Verlust bei 1 Tag Inaktivität
- **Auto-Einsatz**: Automatisch bei Inaktivität

### 3. **Monthly Completion Rewards**
- Vollständiger Monat = Belohnung
- **Reward-Ideen**:
  - 🛡️ +2 Extra Schutzschilder (lifetime/bonus pool)
  - ⚡ 500 EP Bonus
  - 🎨 Exklusive Avatar-Rahmen
  - 🏆 Spezielle Titel-Badge ("Streak Master März 2025")

### 4. **UI Integration**
- **ProfileHeader**: Zeigt aktuellen Daily Streak
- **StreakTab**: Vollständiger Kalender + Statistiken
- **Support Shop**: Abo-Cards um "3 Schutzschilder" ergänzen

---

## 🗂️ Datenstruktur

### Storage Schema Erweiterung (`storage.ts`)
```typescript
export type GameStats = {
  // ... existing fields

  // NEU: Daily Streak System
  dailyStreak: {
    currentStreak: number;              // Aktueller Streak-Counter
    longestDailyStreak: number;         // Historischer Rekord
    lastPlayedDate: string;             // ISO date (YYYY-MM-DD)

    // Streak Freeze Management
    shieldsAvailable: number;           // Verfügbare Schutzschilder
    shieldsUsedThisWeek: number;        // Verbrauchte Schutzschilder diese Woche
    lastShieldResetDate: string;        // Letzter Montag (wöchentlicher Reset)
    bonusShields: number;               // Lifetime Bonus-Schutzschilder (aus Rewards)

    // Kalender-Daten (letzte 12 Monate)
    playHistory: {
      [yearMonth: string]: {            // Format: "2025-01"
        days: number[];                 // Array von Tagen: [1, 3, 5, 7, ...] = gespielt
        completed: boolean;             // true wenn alle Tage gespielt
        reward: {
          claimed: boolean;
          type: string;                 // "bonus_shields" | "ep_boost" | "avatar_frame"
          value: any;
        } | null;
      };
    };

    // Statistiken
    totalDaysPlayed: number;
    completedMonths: string[];          // ["2024-12", "2025-01"]
  };

  // DEPRECATED (behalten für Migration)
  currentStreak: number;                // -> wird zu "consecutiveWins"
  longestStreak: number;
};
```

### Migration Strategy
```typescript
// utils/storage.ts - migrateOldStreakData()
async function migrateToDailyStreak(stats: GameStats): Promise<GameStats> {
  if (!stats.dailyStreak) {
    return {
      ...stats,
      dailyStreak: {
        currentStreak: 0,
        longestDailyStreak: stats.longestStreak || 0, // Historischer Win-Streak als Basis
        lastPlayedDate: new Date().toISOString().split('T')[0],
        shieldsAvailable: 2,
        shieldsUsedThisWeek: 0,
        lastShieldResetDate: getLastMonday(),
        bonusShields: 0,
        playHistory: {},
        totalDaysPlayed: 0,
        completedMonths: [],
      },
    };
  }
  return stats;
}
```

---

## 🏗️ Komponenten-Architektur

### Neue Komponenten

#### 1. **StreakCalendar** (`screens/Leistung/components/StreakTab/components/StreakCalendar.tsx`)
```
┌──────────────────────────────────────┐
│  ◀ Januar 2025 ▶                     │  <- Monat-Navigation
├──────────────────────────────────────┤
│  Mo  Di  Mi  Do  Fr  Sa  So          │
│  --  --   1✓  2✓  3✗  4   5          │  <- ✓ = gespielt, ✗ = Schutzschild, leer = verpasst
│   6✓  7✓  8✓  9✓ 10✓ 11  12          │
│  13✓ 14✓ 15✓ 16  17  18  19          │
│  20  21  22  23  24  25  26          │
│  27  28  29  30  31  --  --          │
├──────────────────────────────────────┤
│  🔥 Aktueller Streak: 15 Tage        │
│  🏆 Rekord: 42 Tage                  │
└──────────────────────────────────────┘
```

**Features**:
- Swipe horizontal für Monats-Navigation
- Taps auf Tage → Tooltip mit Details
- Animierte Markierungen (FadeIn)
- Monthly Progress Ring (z.B. 20/31 Tage)

#### 2. **ShieldIndicator** (`screens/Leistung/components/StreakTab/components/ShieldIndicator.tsx`)
```
┌──────────────────────────────────────┐
│  🛡️ Schutzschilder                   │
├──────────────────────────────────────┤
│  Verfügbar: ●●○ (2/3)                │  <- Filled/Empty circles
│  Nächster Reset: in 4 Tagen          │
│                                       │
│  💎 Bonus: +5 Schutzschilder         │  <- Aus Monthly Rewards
│                                       │
│  ℹ️ Schützt deinen Streak automatisch│
│     wenn du einen Tag verpasst       │
└──────────────────────────────────────┘
```

#### 3. **MonthlyRewardModal** (`screens/Leistung/components/StreakTab/components/MonthlyRewardModal.tsx`)
```
┌──────────────────────────────────────┐
│           🎉 Gratulation!            │
│                                       │
│    Du hast den Januar vollständig    │
│           abgeschlossen!             │
│                                       │
│         [Animated Badge/Icon]        │
│                                       │
│  🎁 Deine Belohnung:                 │
│  🛡️ +2 Bonus-Schutzschilder          │
│  ⚡ +500 EP Boost                    │
│                                       │
│  [ Belohnung einlösen ]              │
└──────────────────────────────────────┘
```

#### 4. **StreakStats** (`screens/Leistung/components/StreakTab/components/StreakStats.tsx`)
```
┌──────────────────────────────────────┐
│  📊 Deine Streak-Statistik           │
├──────────────────────────────────────┤
│  🔥 Aktueller Streak    15 Tage      │
│  🏆 Längster Streak     42 Tage      │
│  📅 Gespielte Tage      127          │
│  🌟 Vollständige Monate  2           │
│  🛡️ Eingesetzte Shields  8           │
└──────────────────────────────────────┘
```

---

### Aktualisierte Komponenten

#### **StreakTab.tsx** (Vollständiges Redesign)
```tsx
<ScrollView>
  {/* Aktueller Streak - Hero Card */}
  <CurrentStreakCard
    streak={dailyStreak.currentStreak}
    longestStreak={dailyStreak.longestDailyStreak}
  />

  {/* Schutzschilder */}
  <ShieldIndicator
    available={shieldsAvailable}
    maxRegular={isPremium ? 3 : 2}
    bonusShields={bonusShields}
    nextReset={nextResetDate}
  />

  {/* Monatskalender */}
  <StreakCalendar
    currentMonth={currentMonth}
    playHistory={playHistory}
    onMonthChange={handleMonthChange}
  />

  {/* Statistiken */}
  <StreakStats stats={dailyStreak} />

  {/* Motivations-Card */}
  <MotivationCard
    streak={dailyStreak.currentStreak}
    completedMonths={dailyStreak.completedMonths.length}
  />
</ScrollView>
```

#### **ProfileHeader.tsx** (Anpassung StatTile)
```tsx
<StatTile
  customIcon={<LightningIcon width={40} height={40} />}
  value={formatNumber(stats.dailyStreak.currentStreak)} // <- GEÄNDERT
  label={t('profile.dailyStreak')}                      // <- NEU
  description={t('profile.dailyStreakDescription')}     // <- NEU
  onPress={onStreakPress}
/>
```

#### **SupportShop - SubscriptionCard** (Benefits erweitern)
```tsx
// supportShop.json
{
  "benefits": {
    "doubleEp": "2× EP",
    "imagePerMonth": "1 Bild/Monat",
    "streakShields": "3 Schutzschilder/Woche"  // <- NEU
  }
}

// SubscriptionCard.tsx
<View style={styles.benefitsBadge}>
  <Text>
    🚀 {t('benefits.doubleEp')} +
    🖼️ {t('benefits.imagePerMonth')} +
    🛡️ {t('benefits.streakShields')}  // <- NEU
  </Text>
</View>
```

---

## 🔄 Business Logic

### Core Module: `utils/dailyStreak.ts` (NEU)
```typescript
/**
 * Tägliche Streak-Logik - aufgerufen bei jedem Spielstart
 */
export async function updateDailyStreak(): Promise<void> {
  const stats = await loadStats();
  const today = getTodayDate(); // "2025-01-15"
  const lastPlayed = stats.dailyStreak.lastPlayedDate;

  // Fall 1: Heute bereits gespielt → nichts tun
  if (lastPlayed === today) return;

  // Fall 2: Gestern gespielt → Streak +1
  if (isYesterday(lastPlayed)) {
    stats.dailyStreak.currentStreak++;
    stats.dailyStreak.lastPlayedDate = today;
    addToPlayHistory(stats, today);
    await saveStats(stats);
    return;
  }

  // Fall 3: Vor 2+ Tagen gespielt → Prüfe Schutzschild
  const daysMissed = getDaysBetween(lastPlayed, today);
  if (daysMissed === 2) {
    // Genau 1 Tag verpasst → Schutzschild einsetzen
    if (canUseShield(stats)) {
      useShield(stats);
      stats.dailyStreak.currentStreak++; // Streak bleibt
      addToPlayHistory(stats, today, { shieldUsed: true });
      showShieldNotification(); // Toast: "Schutzschild aktiviert!"
    } else {
      resetStreak(stats);
      showStreakLostNotification();
    }
  } else {
    // 2+ Tage verpasst → Streak verloren (auch mit Schutzschild)
    resetStreak(stats);
    showStreakLostNotification();
  }

  stats.dailyStreak.lastPlayedDate = today;
  await saveStats(stats);
}

/**
 * Wöchentlicher Reset (Montags 00:00)
 */
export async function checkWeeklyShieldReset(): Promise<void> {
  const stats = await loadStats();
  const lastReset = new Date(stats.dailyStreak.lastShieldResetDate);
  const nextMonday = getNextMonday(lastReset);

  if (new Date() >= nextMonday) {
    const isPremium = await isPremiumSubscriber();
    stats.dailyStreak.shieldsAvailable = isPremium ? 3 : 2;
    stats.dailyStreak.shieldsUsedThisWeek = 0;
    stats.dailyStreak.lastShieldResetDate = formatDate(nextMonday);
    await saveStats(stats);
  }
}

/**
 * Monthly Completion Check
 */
export async function checkMonthlyCompletion(yearMonth: string): Promise<void> {
  const stats = await loadStats();
  const monthData = stats.dailyStreak.playHistory[yearMonth];

  if (!monthData || monthData.completed) return;

  const daysInMonth = getDaysInMonth(yearMonth);
  if (monthData.days.length === daysInMonth) {
    monthData.completed = true;
    monthData.reward = {
      claimed: false,
      type: "bonus_shields",
      value: 2,
    };
    await saveStats(stats);
    showMonthlyRewardModal(yearMonth);
  }
}
```

### Integration: `screens/Game/hooks/useGameState.ts`
```typescript
// Bei Spielstart
useEffect(() => {
  (async () => {
    await checkWeeklyShieldReset(); // Wöchentlicher Check
    await updateDailyStreak();      // Täglicher Streak-Update
  })();
}, []);

// Bei Spielende (Win)
const handleGameWin = async () => {
  await updateStatsAfterGame(true, difficulty, timeElapsed);
  await checkMonthlyCompletion(getCurrentYearMonth()); // Check für Monthly Reward
};
```

---

## 🎨 Design-Spezifikation

### Kalender-Visualisierung

**Tag-States**:
- ✅ **Gespielt** (Grün): `#34A853` mit Checkmark Icon
- 🛡️ **Schutzschild** (Blau): `#4285F4` mit Shield Icon
- ❌ **Verpasst** (Grau): `rgba(255,255,255,0.1)` / `rgba(0,0,0,0.05)`
- ⏳ **Zukünftig** (Disabled): Opacity 0.3

**Card-Konsistenz**:
- Border Radius: `14px` (wie LevelCard/PathCard)
- Padding: `spacing.lg` (24px)
- Elevation: `4` (Android) / Shadow Radius `6` (iOS)
- Surface Color: `colors.surface` (Theme-aware)

**Animationen**:
- Tages-Markierung: `FadeIn.duration(200).delay(index * 30)` (Stagger)
- Monatswechsel: `SlideInLeft/Right.duration(300)`
- Shield-Aktivierung: `withSequence(scale(1.2), scale(1))` + Success Haptic

---

## 📝 Translation Keys

### `locales/de/leistung.json`
```json
{
  "profile": {
    "dailyStreak": "Tagesstreak",
    "dailyStreakDescription": "Deine Serie"
  },
  "streakTab": {
    "title": "Täglicher Streak",
    "currentStreak": "Aktueller Streak",
    "longestStreak": "Längster Streak",
    "days": "Tage",
    "shields": {
      "title": "Schutzschilder",
      "available": "Verfügbar",
      "nextReset": "Nächster Reset",
      "bonusShields": "Bonus-Schutzschilder",
      "description": "Schützt deinen Streak automatisch, wenn du einen Tag verpasst"
    },
    "calendar": {
      "played": "Gespielt",
      "shieldUsed": "Schutzschild eingesetzt",
      "missed": "Verpasst",
      "monthProgress": "{{count}}/{{total}} Tage"
    },
    "stats": {
      "totalDaysPlayed": "Gespielte Tage",
      "completedMonths": "Vollständige Monate",
      "shieldsUsed": "Eingesetzte Schutzschilder"
    },
    "monthlyReward": {
      "title": "Gratulation!",
      "subtitle": "Du hast den {{month}} vollständig abgeschlossen!",
      "claim": "Belohnung einlösen"
    }
  }
}
```

### `locales/de/supportShop.json`
```json
{
  "benefits": {
    "streakShields": "3 Schutzschilder/Woche"
  }
}
```

---

## 📅 Implementierungs-Phasen

### **Phase 1: Datenstruktur & Migration** (Session 1)
- [ ] Storage-Schema erweitern (`GameStats.dailyStreak`)
- [ ] Migration-Funktion schreiben
- [ ] `dailyStreak.ts` Core-Logik implementieren
- [ ] Unit Tests für Streak-Berechnungen

### **Phase 2: Basis-Komponenten** (Session 2)
- [ ] `StreakCalendar` Komponente (statische Ansicht)
- [ ] `ShieldIndicator` Komponente
- [ ] `StreakStats` Komponente
- [ ] Styling gemäß LevelCard/PathCard

### **Phase 3: StreakTab Redesign** (Session 3)
- [ ] `StreakTab.tsx` vollständig überarbeiten
- [ ] Kalender-Interaktivität (Swipe, Tap)
- [ ] Animations-Integration
- [ ] Translation Keys

### **Phase 4: Game Integration** (Session 4)
- [ ] `useGameState` Hook erweitern
- [ ] `updateDailyStreak()` bei Spielstart aufrufen
- [ ] `checkMonthlyCompletion()` bei Spielende
- [ ] Shield-Notifications

### **Phase 5: ProfileHeader & Shop** (Session 5)
- [ ] ProfileHeader StatTile anpassen
- [ ] SubscriptionCard Benefits erweitern
- [ ] Premium-Check für 3 Shields
- [ ] Translation Updates

### **Phase 6: Rewards & Gamification** (Session 6)
- [ ] `MonthlyRewardModal` implementieren
- [ ] Reward-Claim-Logik
- [ ] Bonus-Shields ins System integrieren
- [ ] Achievement-Tracking (optional)

### **Phase 7: Testing & Polish** (Session 7)
- [ ] Edge Cases testen (Timezone-Wechsel, Mitternacht)
- [ ] Performance-Optimierung (useMemo/useCallback)
- [ ] Accessibility (Screen Reader Support)
- [ ] Animations polieren

---

## 🧪 Testing-Strategie

### Unit Tests
```typescript
// utils/__tests__/dailyStreak.test.ts
describe('Daily Streak Logic', () => {
  it('increments streak when played yesterday', () => {...});
  it('uses shield when missed 1 day', () => {...});
  it('resets streak when missed 2+ days', () => {...});
  it('does not double-count same day', () => {...});
  it('resets shields weekly on Monday', () => {...});
});
```

### Integration Tests
- Simuliere Tages-/Wochenwechsel (Mock Date)
- Premium vs. Free User Shield-Count
- Monthly Completion Trigger

### Manual QA Checklist
- [ ] Kalender zeigt korrekten Monat
- [ ] Swipe-Navigation funktioniert
- [ ] Shield-Indikator zeigt korrekte Anzahl
- [ ] Premium-User haben 3 Shields
- [ ] Monthly Reward erscheint bei 100%
- [ ] ProfileHeader zeigt richtigen Streak

---

## 📊 Visuelle Mockups

### StreakTab - Full View
```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │  🔥 15 Tage Streak                  │ │ <- Current Streak Card (Hero)
│ │  🏆 Rekord: 42 Tage                 │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │  🛡️ Schutzschilder                  │ │ <- Shield Indicator
│ │  Verfügbar: ●●○ (2/3)               │ │
│ │  Nächster Reset: in 4 Tagen         │ │
│ │  💎 Bonus: +5                        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │  ◀ Januar 2025 ▶                    │ │ <- Calendar
│ │  Mo Di Mi Do Fr Sa So               │ │
│ │  -- --  1✓ 2✓ 3✗ 4  5              │ │
│ │   6✓ 7✓ 8✓ 9✓10✓11 12              │ │
│ │  13✓14✓15✓16 17 18 19              │ │
│ │  ...                                 │ │
│ │  ────────────────────                │ │
│ │  20/31 Tage gespielt                │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │  📊 Statistik                       │ │ <- Stats Card
│ │  Gespielte Tage: 127                │ │
│ │  Vollständige Monate: 2             │ │
│ │  Eingesetzte Shields: 8             │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │  💪 Weiter so!                      │ │ <- Motivation Card
│ │  Noch 11 Tage bis zum vollständigen │ │
│ │  Januar. Du schaffst das!           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### ProfileHeader - StatTile Updated
```
┌──────────────────────────────────────────┐
│  [Avatar]                                │
│  Clemens                                 │
│  🏆 Wanderer der Klarheit               │
│                                           │
│ ┌────────────────────────────────────┐  │
│ │ 🥾     🖼️     ⚡                   │  │
│ │ 1,250  12    15                     │  │
│ │ EP     Bilder Tages-               │  │ <- GEÄNDERT: "Tages-streak" statt "In Serie"
│ │              streak                 │  │
│ │ Deine  Galerie Deine               │  │
│ │ Reise        Serie                  │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 🚀 Deployment-Notes

### Breaking Changes
- `stats.currentStreak` → `stats.dailyStreak.currentStreak` (Migration erforderlich)
- ProfileHeader zeigt Daily Streak statt Win Streak

### Backend (RevenueCat)
- Keine Änderungen erforderlich (Shield-Count Client-Side)

### App Store Updates
- **Feature Highlight**: "Neues Daily Streak System mit Schutzschild-Mechanik"
- Screenshots aktualisieren (StreakTab Kalender)

---

## ✅ Erfolgskriterien

1. ✅ Nutzer können täglichen Fortschritt im Kalender sehen
2. ✅ Schutzschilder verhindern Streak-Verlust bei 1 Tag Inaktivität
3. ✅ Premium-User haben 3 statt 2 Shields/Woche
4. ✅ Monthly Rewards motivieren zu konsistentem Spielen
5. ✅ Design konsistent mit bestehenden Cards
6. ✅ Performance: Kalender rendert flüssig (<16ms/Frame)
7. ✅ Migration von alten Streak-Daten funktioniert fehlerfrei

---

**Erstellt**: 2025-01-13
**Letzte Aktualisierung**: 2025-01-13
**Version**: 1.0.0
