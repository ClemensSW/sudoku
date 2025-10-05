# Translation Plan & Progress Tracker

## 📋 Translation Strategy

### File Organization Structure
```
locales/
├── de/
│   ├── common.json           ✅ DONE - Buttons, time, difficulty
│   ├── settings.json         ✅ DONE - Settings screen
│   ├── leistung.json         ✅ DONE - Performance/Stats screen
│   ├── start.json            🔲 TODO - Start/Home screen
│   ├── game.json             🔲 TODO - Game screen & controls
│   ├── duo.json              🔲 TODO - Duo mode screens
│   ├── gallery.json          🔲 TODO - Gallery & landscapes
│   ├── tutorial.json         🔲 TODO - Tutorial pages
│   ├── gameCompletion.json   🔲 TODO - Victory screens
│   ├── supportShop.json      🔲 TODO - Shop & purchases
│   ├── alerts.json           🔲 TODO - All alert messages
│   └── validation.json       🔲 TODO - Error messages & validation
├── en/
│   └── (mirror structure)
└── i18n.ts                   ✅ DONE
```

### Naming Conventions

**Keys**: Descriptive, hierarchical dot notation
- `screen.section.element.property`
- Example: `game.controls.button.hint`

**Values**:
- Short, concise text
- Keep formatting (newlines, punctuation)
- Use placeholders for dynamic content: `{{variable}}`

---

## 🎯 Translation Phases

### Phase 1: Core Screens (Priority 1) ⭐⭐⭐
**Must have for basic functionality**

| File | Status | DE | EN | Components | Priority |
|------|--------|----|----|------------|----------|
| `start.json` | 🔲 TODO | ❌ | ❌ | Start screen, buttons | HIGH |
| `game.json` | 🔲 TODO | ❌ | ❌ | Game board, controls, pause | HIGH |
| `alerts.json` | 🔲 TODO | ❌ | ❌ | All alert messages | HIGH |
| `common.json` | ✅ DONE | ✅ | ✅ | Shared UI elements | - |

### Phase 2: Feature Screens (Priority 2) ⭐⭐
**Important for full user experience**

| File | Status | DE | EN | Components | Priority |
|------|--------|----|----|------------|----------|
| `gameCompletion.json` | 🔲 TODO | ❌ | ❌ | Victory screen, stats | MEDIUM |
| `duo.json` | 🔲 TODO | ❌ | ❌ | Duo mode, matchmaking | MEDIUM |
| `gallery.json` | 🔲 TODO | ❌ | ❌ | Image gallery, filters | MEDIUM |
| `tutorial.json` | 🔲 TODO | ❌ | ❌ | How to play, rules | MEDIUM |
| `leistung.json` | ✅ DONE | ✅ | ✅ | Performance/Stats | - |
| `settings.json` | ✅ DONE | ✅ | ✅ | Settings menu | - |

### Phase 3: Secondary Features (Priority 3) ⭐
**Nice to have, can be done later**

| File | Status | DE | EN | Components | Priority |
|------|--------|----|----|------------|----------|
| `supportShop.json` | 🔲 TODO | ❌ | ❌ | Shop, purchases, products | LOW |
| `validation.json` | 🔲 TODO | ❌ | ❌ | Form validation messages | LOW |

---

## 📁 Detailed Component Mapping

### Start Screen (`start.json`)
**Components:**
- `Start.tsx`
- `BottomButtonContainer.tsx`

**Strings to translate:**
- Welcome messages
- Main buttons (Play, Continue, etc.)
- Tutorial prompts

---

### Game Screen (`game.json`)
**Components:**
- `Game.tsx`
- `GameControls.tsx`
- `GameStatusBar.tsx`
- `NumberPad.tsx`
- `PauseModal.tsx`
- `GameSettingsPanel.tsx`

**Sections:**
```json
{
  "controls": {
    "hint": "Hint",
    "undo": "Undo",
    "erase": "Erase",
    "notes": "Notes"
  },
  "pause": {
    "title": "Game Paused",
    "resume": "Resume",
    "quit": "Quit Game"
  },
  "status": {
    "errors": "Errors",
    "hints": "Hints",
    "time": "Time"
  }
}
```

---

### Alerts (`alerts.json`)
**Used in:**
- `AlertProvider.tsx`
- `AlertHelpers.ts` (if exists)
- All screens with confirmation dialogs

**Categories:**
```json
{
  "quit": {
    "title": "Quit Game?",
    "message": "Your progress will be lost.",
    "confirm": "Quit",
    "cancel": "Continue Playing"
  },
  "error": {
    "generic": "Something went wrong",
    "networkError": "No internet connection"
  }
}
```

---

### Game Completion (`gameCompletion.json`)
**Components:**
- `GameCompletion.tsx`
- `PlayerProgressionCard.tsx`
- `PerformanceCard.tsx`
- `StreakCard.tsx`
- `FeedbackCard.tsx`
- `GalleryProgressCard.tsx`

**Sections:**
- Victory messages
- Stats labels
- Level up notifications
- Achievement unlocks

---

### Duo Mode (`duo.json`)
**Components:**
- `Duo.tsx`
- `DuoGame.tsx`
- `DuoFeatures.tsx`
- `GameModeModal.tsx`
- `DuoGameCompletionModal.tsx`

**Sections:**
- Mode selection
- Multiplayer UI
- Player status
- Victory/defeat messages

---

### Gallery (`gallery.json`)
**Components:**
- `Gallery.tsx`
- `FilterModal.tsx`
- `ImageGrid.tsx`
- `ImageDetailModal.tsx`

**Sections:**
- Filter categories
- Image descriptions
- Progress indicators

---

### Tutorial (`tutorial.json`)
**Components:**
- `TutorialContainer.tsx`
- `BasicRulesPage.tsx`
- `GameplayPage.tsx`
- `NotesPage.tsx`

**Sections:**
- Rule explanations
- Step-by-step instructions
- Tips and tricks

---

### Support Shop (`supportShop.json`)
**Components:**
- `SupportShop.tsx`
- `ProductCard.tsx`
- `SubscriptionCard.tsx`
- `PurchaseOverlay.tsx`

**Sections:**
- Product descriptions
- Purchase flow
- Thank you messages

---

## 🔄 Translation Workflow

### For Each Translation File:

1. **Create Structure**
   - Add to `locales/de/[name].json`
   - Add to `locales/en/[name].json`
   - Export in `locales/de/index.ts`
   - Export in `locales/en/index.ts`

2. **Extract Strings**
   - Find all hardcoded strings in components
   - Group by logical sections
   - Create hierarchical JSON structure

3. **Implement in Components**
   - Import `useTranslation` hook
   - Replace hardcoded strings with `t('key')`
   - Test both languages

4. **Update This File**
   - Mark file as ✅ DONE
   - Update progress table
   - Note any issues or special cases

---

## 📊 Overall Progress

**Completed:** 3/11 files (27%)
**Remaining:** 8/11 files (73%)

### Progress by Priority:
- **Priority 1 (Core):** 1/4 (25%)
- **Priority 2 (Features):** 2/5 (40%)
- **Priority 3 (Secondary):** 0/2 (0%)

---

## 🎨 Special Considerations

### Dynamic Content
Use interpolation for variables:
```typescript
t('game.status.timeElapsed', { time: '05:23' })
// JSON: "timeElapsed": "Time: {{time}}"
```

### Pluralization
Use i18next plural forms:
```json
{
  "errors_one": "{{count}} error",
  "errors_other": "{{count}} errors"
}
```

### Long Text
For multi-line text (alerts, tutorials), use `\n`:
```json
{
  "message": "Line 1\n\nLine 2\n\nLine 3"
}
```

### Context-Specific Translations
Use nested keys for different contexts:
```json
{
  "button": {
    "start": {
      "newGame": "New Game",
      "continueGame": "Continue"
    }
  }
}
```

---

## 🚀 Next Steps

1. **Start with Phase 1** (Priority 1)
   - Create `start.json` structure
   - Create `game.json` structure
   - Create `alerts.json` structure

2. **Implement systematically**
   - One file at a time
   - Test after each implementation
   - Update progress tracker

3. **Track progress across sessions**
   - This file persists in git
   - Easy to see what's done/pending
   - Can resume from any point

---

Last Updated: 2025-10-05
