# PlayerProgressionCard

Eine refaktorierte und modular aufgebaute Komponente zur Darstellung des Spielerfortschritts im Level- und Pfadsystem.

## Struktur

```
PlayerProgressionCard/
├── PlayerProgressionCard.tsx          # Hauptkomponente (~200 Zeilen)
├── PlayerProgressionCard.styles.ts    # Styles
├── index.ts                           # Exports
├── components/                        # UI-Komponenten
│   ├── LevelSection.tsx              # Level Badge + XP Bar + Titel
│   ├── PathSection.tsx               # "Deine Reise" + Trail + Pfad-Details
│   ├── PathTrail.tsx                 # Geschwungener SVG-Pfad
│   ├── MilestoneNotification.tsx     # Meilenstein-Banner
│   ├── LevelUpOverlay.tsx            # Level-Up Animation
│   ├── LevelBadge.tsx                # Animated Level Badge
│   └── TitleSelect.tsx               # Titel-Auswahl Chips
├── hooks/                             # Custom Hooks
│   ├── useProgressAnimations.ts      # Alle Fortschritts-Animationen
│   └── useMilestoneHandling.ts       # Meilenstein-Logik
└── utils/                             # Utilities
    ├── types.ts                       # TypeScript Types
    ├── levelData.ts                   # Level/Pfad Definitionen + XP-Calc
    ├── useLevelInfo.ts                # Level-Info Hook
    └── index.ts                       # Utils Exports
```

## Verwendung

### GameCompletionModal (Nach Spielabschluss)
```tsx
<PlayerProgressionCard
  stats={stats}
  difficulty={difficulty}
  justCompleted={true}
  xpGain={xpGain}
  selectedTitle={selectedTitle}
  onTitleSelect={handleTitleSelect}
/>
```

### LeistungScreen/LevelTab (Statische Übersicht)
```tsx
<PlayerProgressionCard
  stats={stats}
  xp={stats.totalXP}
  previousXp={stats.totalXP}
  xpGain={0}
  justCompleted={false}
  options={{
    showPathDescription: true,
    showMilestones: true,
    textVisibility: "always",
  }}
  selectedTitle={selectedTitle}
  onTitleSelect={onTitleSelect}
/>
```

## Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `stats` | `GameStats` | - | Spieler-Statistiken |
| `xp` | `number` | `stats.totalXP` | Aktuelle XP |
| `previousXp` | `number` | berechneter Wert | Vorherige XP |
| `xpGain` | `number` | `0` | XP-Gewinn aus letztem Spiel |
| `justCompleted` | `boolean` | `false` | Wurde gerade Spiel abgeschlossen? |
| `difficulty` | `Difficulty \| string` | - | Schwierigkeitsgrad |
| `compact` | `boolean` | `false` | Kompakte Ansicht |
| `selectedTitle` | `string \| null` | `null` | Aktuell gewählter Titel |
| `onTitleSelect` | `(title) => void` | - | Callback bei Titel-Auswahl |
| `onLevelUp` | `(old, new) => void` | - | Callback bei Level-Up |
| `options` | `LevelProgressOptions` | siehe unten | UI-Optionen |

### LevelProgressOptions

```typescript
{
  enableLevelUpAnimation?: boolean;      // Level-Up Animation (default: true)
  usePathColors?: boolean;               // Pfad-Farben verwenden (default: true)
  showPathDescription?: boolean;         // Pfad-Beschreibung (default: !compact)
  showMilestones?: boolean;              // Meilensteine anzeigen (default: true)
  textVisibility?: 'always' | 'toggle' | 'compact';  // (default: 'toggle')
  highContrastText?: boolean;            // Höherer Kontrast (default: false)
}
```

## Komponenten-Details

### LevelSection
- Zeigt Level-Badge mit aktueller Stufe
- XP-Fortschrittsbalken mit Animationen
- Collapsible Titel-Auswahl Dropdown

### PathSection
- "Deine Reise" Header mit Icon
- Geschwungener Trail mit Meilensteinen
- Collapsible Pfad-Beschreibung
- Enthält MilestoneNotification

### PathTrail
- SVG-basierter geschwungener Pfad
- Animierte Nodes für Meilensteine
- Beweglicher Marker mit Puls-Animation

### MilestoneNotification
- Inline-Banner in PathSection
- Zeigt erreichte Meilensteine (Level 5, 10, 15, 20)
- Schließbar mit Animation

### LevelUpOverlay
- Fullscreen Overlay bei Level-Up
- Animated Badge mit Glow-Effekt
- Automatisches Ausblenden nach 4s

## Hooks

### useProgressAnimations
Verwaltet alle Animationen:
- Container Scale
- Progress Bar Fill
- XP Gain Highlight
- Badge Pulse
- Level-Up Sequence

### useMilestoneHandling
Verwaltet Meilenstein-Logik:
- Prüft erreichte Meilensteine
- Markiert als erreicht in Storage
- Zeigt Benachrichtigung
- Animation & Haptic Feedback

## Vorteile der Refaktorierung

✅ **Bessere Wartbarkeit**: Jede Datei < 300 Zeilen
✅ **Klare Verantwortlichkeiten**: Eine Komponente = Ein Zweck
✅ **Wiederverwendbarkeit**: Komponenten können einzeln genutzt werden
✅ **Testbarkeit**: Isolierbare Units
✅ **Lesbarkeit**: Selbsterklärender Code
✅ **Performance**: Optimierte Hooks und Memoization
