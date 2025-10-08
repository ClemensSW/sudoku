# 📋 Support Shop Refactoring - Master Plan
**Version**: 1.1 | **Created**: 2025-01-08 | **Status**: Phase 1 ✅ Complete

---

## 🎯 Projektziele

### **Hauptziele**
1. ✅ Subscription-Service mit Entitlements (Phase 1)
2. ⏳ Shop UI modernisieren & entrümpeln (Phase 2)
3. ⏳ Gallery Integration mit Image-Unlock (Phase 3)
4. ⏳ Banner-Upgrade (Phase 4 - Optional)
5. ⏳ Launch-Ready mit Setup-Guides (Phase 5)

### **Business-Logik**
- **Einmalkauf** (coffee → feast): Nutzer wird **Supporter** = 2x EP + 1 Bild/Monat
- **Abo** (monthly/yearly): Nutzer wird **Premium Subscriber** = 2x EP + 1 Bild/Monat
- **Wichtig**: JEDER Kauf (egal ob 1,99€ oder 19,99€) gibt die gleichen Benefits!

### **Design-Prinzipien**
- ✅ Persönlich & humorvoll bleiben
- ✅ Shop entrümpeln (aktuell zu voll)
- ✅ SVG-Icons statt Emojis
- ✅ Conversion-optimiert (z.B. Unlock-Option im Fullscreen)
- ✅ Nicht aufdringlich

---

## 📐 Phasen-Übersicht

### **Phase 1: Subscription Foundation** ✅ COMPLETED
**Status**: ✅ Done (Session 1 - 2025-01-08)
**Dauer**: 3 Stunden

**Deliverables**:
- ✅ SubscriptionService (Singleton + Events)
- ✅ Entitlements & EP-Multiplikator
- ✅ Image-Unlock-Logic
- ✅ React Hooks (useSupporter, useImageUnlock)
- ✅ EP-Integration in storage.ts

**Details**: Siehe PROGRESS.md

---

### **Phase 2: Shop UI Cleanup** 🔄 NEXT
**Status**: ⏳ Pending (Session 2)
**Dauer**: 2-3 Tage
**PR**: #2

#### **Ziele**
✅ Shop entrümpelt & fokussierter
✅ SVG-Icons integriert
✅ Benefits kommuniziert (kompakt!)
✅ Humor bleibt erhalten

#### **Tasks**
1. **BenefitsCard.tsx** (NEU)
   - Kompakt: Max 3 Zeilen
   - "🎁 Unterstütze mich und erhalte:"
   - "🚀 2× EP  |  🖼️ 1 Bild/Monat"
   - Nicht überladen!

2. **ProductCard.tsx** (REFACTOR)
   - SVG-Icons statt Emojis:
     - Coffee: `latte-art.svg`
     - Breakfast: `croissant.svg`
     - Lunch: `fried-rice.svg`
     - Feast: `crown.svg`
   - 1 Zeile humorvoller Text (rotierend)
   - Beispiele:
     - "Kaffee für neue Rätsel-Ideen"
     - "Gehirnnahrung für bessere Features"
     - "Power für die grauen Zellen"
     - "Königliche Unterstützung!"

3. **SubscriptionCard.tsx** (REFACTOR)
   - Benefits-Badges subtil zeigen
   - "🚀 2× EP + 🖼️ Bild"
   - Nicht zu aufdringlich

4. **ThankYouModal.tsx** (NEU)
   - Post-Purchase Modal
   - Kurz, persönlich, dankbar
   - CTA: "Galerie erkunden" (bei Supporter)
   - Beispiel:
     ```
     🎉 Vielen Dank!
     Deine Unterstützung bedeutet mir sehr viel!

     [Galerie erkunden →] [Schließen]
     ```

5. **SupportShop.tsx** (REFACTOR)
   - Banner entfernen oder stark vereinfachen
   - Weniger Elemente
   - Besserer Fokus

#### **Wireframe (vereinfacht)**
```
┌─────────────────────────────┐
│  [X]  Unterstützung         │
├─────────────────────────────┤
│ 🎁 Unterstütze mich:        │ <- Kompakt!
│ 🚀 2× EP | 🖼️ 1 Bild/Monat │
├─────────────────────────────┤
│ Einmalige Unterstützung     │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│ │ ☕ │ │ 🥐 │ │ 🍱 │ │ 👑 ││ <- SVG!
│ │1,99│ │4,99│ │9,99│ │19€ ││
│ └────┘ └────┘ └────┘ └────┘│
│ "Kaffee für neue Ideen"     │ <- 1 Zeile
├─────────────────────────────┤
│ Regelmäßige Unterstützung   │
│ ┌─────────────────────────┐ │
│ │ 📅 Monatlich  €2,99/Mo  │ │
│ │ 🚀 2× EP + 🖼️ Bild     │ │
│ │ [Abonnieren →]          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🎯 Jährlich  €29,99/Jahr│ │
│ │ Spare 17% ⭐            │ │
│ │ [Abonnieren →]          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

#### **Microcopy**
```typescript
// BenefitsCard (kompakt!)
"🎁 Unterstütze mich und erhalte:
🚀 2× EP  |  🖼️ 1 Bild pro Monat"

// ProductCard Subtexte (1 Zeile, rotierend)
coffee: [
  "Kaffee für neue Rätsel-Ideen",
  "Espresso = mehr kreative Energie",
  "Koffein für besseren Code"
]

breakfast: [
  "Gehirnnahrung für bessere Features",
  "Kein Hunger = weniger Bugs",
  "Gutes Frühstück, guter Code!"
]

lunch: [
  "Power für die grauen Zellen",
  "Mittagspause = neue Ideen",
  "Eine Mahlzeit für neue Features"
]

feast: [
  "Königliche Unterstützung!",
  "Großzügigkeit = viele Updates",
  "Ein Fest für die ganze Familie"
]

// ThankYouModal
"🎉 Vielen Dank!
Deine Unterstützung bedeutet mir sehr viel!"

[Galerie erkunden →] [Schließen]
```

#### **Neue Komponenten**
```
screens/SupportShop/components/
├── BenefitsCard.tsx         # NEU - Kompakte Vorteile
├── ThankYouModal.tsx        # NEU - Post-Purchase
├── ProductCard.tsx          # REFACTOR - SVG-Icons
└── SubscriptionCard.tsx     # REFACTOR - Benefits-Badges
```

#### **Success Criteria**
- ✅ Shop hat SVG-Icons
- ✅ Benefits sichtbar, aber nicht überladen
- ✅ ThankYouModal funktioniert
- ✅ Shop wirkt aufgeräumter
- ✅ Humor bleibt erhalten

---

### **Phase 3: Gallery Integration** ⏳ PENDING
**Status**: ⏳ Waiting for Phase 2
**Dauer**: 2-3 Tage
**PR**: #3

#### **Ziele**
✅ Supporter können Bilder freischalten
✅ Fullscreen-Modal zeigt Unlock-Option (Conversion!)
✅ Nahtloser Flow (1-2 Taps)

#### **UI-Erweiterungen**

1. **ImageDetailModal** (ERWEITERN)
   - Button: "Mit Support freischalten"
   - Nur sichtbar wenn:
     - Nutzer ist Supporter
     - Bild ist noch nicht freigeschaltet
     - Quota verfügbar (remainingUnlocks > 0)
   - Zeigt: "Noch X verfügbar diesen Monat"
   - Tap → Confirmation Dialog

2. **Fullscreen-Image-View** (NEU - WICHTIG für Conversion!)
   - Floating-Badge unten: "🎁 Freischalten"
   - Nur wenn:
     - Bild locked
     - User ist Supporter
     - Quota verfügbar
   - Tap → Confirmation Dialog
   - **Warum**: Nutzer im "Wow"-Moment abholen!

3. **Unlock-Confirmation-Dialog** (NEU)
   ```
   ┌─────────────────────────────┐
   │ "Nebel im Tal" freischalten?│
   │                             │
   │ Du kannst noch 1 Bild       │
   │ diesen Monat freischalten.  │
   │                             │
   │ [Abbrechen] [Freischalten ✓]│
   └─────────────────────────────┘
   ```

4. **Gallery-List** (ERWEITERN)
   - Badge "Premium" für Supporter (subtil)
   - Zeigt 2x EP Multiplier (z.B. in Stats)

#### **Logic-Integration**
```typescript
// In ImageDetailModal.tsx
import { useImageUnlock } from '@/modules/subscriptions/hooks/useImageUnlock';
import { unlockImageAsSupporter } from '@/modules/gallery/supporterUnlocks';

const { canUnlock, remainingUnlocks } = useImageUnlock();

const handleUnlock = async () => {
  const result = await unlockImageAsSupporter(imageId);
  if (result.success) {
    // Reload collection, show success
  } else {
    // Show error
  }
};
```

#### **Neue Komponenten**
```
screens/Gallery/components/
├── UnlockConfirmationDialog.tsx  # NEU
├── SupporterBadge.tsx            # NEU
├── ImageDetailModal.tsx          # ERWEITERT
└── ImageFullscreenView.tsx       # ERWEITERT (Floating-Badge)
```

#### **Success Criteria**
- ✅ Supporter können Bilder freischalten
- ✅ Fullscreen-View zeigt Unlock-Option
- ✅ Quota-Tracking funktioniert (1/Monat)
- ✅ Error-Handling (Limit erreicht, etc.)
- ✅ Smooth UX (max 2 Taps bis Unlock)

---

### **Phase 4: Banner Upgrade** ⏳ OPTIONAL
**Status**: ⏳ Optional (kann übersprungen werden)
**Dauer**: 1-2 Tage
**PR**: #4

#### **Ziele**
✅ Banner zeigt Benefits, nicht nur Text
✅ Nicht aufdringlich

#### **Umsetzung**
- Icon + Text Rotation (wie vorher)
- Varianten:
  ```typescript
  const bannerVariants = [
    { icon: <RocketIcon />, title: "2× EP Boost", subtitle: "Mit Support" },
    { icon: <ImageIcon />, title: "Bilder freischalten", subtitle: "1 pro Monat" },
    { icon: <HeartIcon />, title: "Unterstütze mich", subtitle: "Werbefrei bleiben" },
  ];
  ```
- Smooth Transitions
- Purchase-Status-basiert (Supporter sehen "Danke!")

**Kann auch übersprungen werden!** Nicht kritisch für Launch.

---

### **Phase 5: Testing & Launch-Prep** ⏳ PENDING
**Status**: ⏳ Waiting for Phase 3
**Dauer**: 2-3 Tage
**PR**: #5

#### **Ziele**
✅ Bug-frei
✅ Alle Edge Cases getestet
✅ Setup-Guides für RevenueCat + Play Console

#### **Tasks**

1. **End-to-End Tests**
   - Purchase-Flow (Einmalkauf + Abo)
   - EP-Bonus beim Spielen
   - Image-Unlock-Flow
   - Quota-Reset (monatlich)
   - Restore-Purchases

2. **Edge Cases**
   - Expired Subscription → Benefits weg
   - Grace Period → Benefits bleiben
   - Offline-Purchase → Sync beim nächsten Start
   - Monatswechsel → Quota-Reset

3. **UI/UX-Checks**
   - Dark Mode (alle neuen Screens)
   - Accessibility:
     - Screen Reader Labels
     - Kontraste (WCAG AA)
     - Touch Targets ≥ 44dp
   - Animationen (kein Jank)
   - Image-Loading (Lazy-Loading?)

4. **Performance**
   - EP-Berechnung (async, aber schnell?)
   - Quota-Checks (cached?)
   - Gallery-Rendering

5. **Internationalisierung**
   - Alle neuen Texte in DE/EN/HI
   - Preise/Währungen (RevenueCat automatisch)

6. **Setup-Guides erstellen**

   **6.1. REVENUECAT-SETUP.md**
   ```markdown
   # RevenueCat Dashboard Setup

   ## 1. Entitlements erstellen
   - [ ] "supporter" Entitlement anlegen
   - [ ] Alle 6 Products attachieren:
     - coffee, breakfast, lunch, feast
     - monthly_support, yearly_support

   ## 2. Offerings konfigurieren
   - [ ] "default" Offering erstellen
   - [ ] Packages hinzufügen:
     - $rc_monthly → monthly_support
     - $rc_annual → yearly_support

   ## 3. API Keys prüfen
   - [ ] Android Key in config.ts: goog_qNBqCJdmLfwCXpjoccatTQOJZSd
   - [ ] iOS Key (später)

   ## 4. Test-Purchase
   - [ ] Sandbox-Account anlegen
   - [ ] Purchase testen
   - [ ] Entitlement-Check
   ```

   **6.2. GOOGLE-PLAY-SETUP.md**
   ```markdown
   # Google Play Console Setup

   ## 1. In-App-Produkte erstellen
   Produkttyp: **Verwaltet (Managed)**

   | Produkt-ID | Name | Preis |
   |------------|------|-------|
   | de.playfusiongate.sudokuduo.coffee | Kaffee | 1,99 € |
   | de.playfusiongate.sudokuduo.breakfast | Frühstück | 4,99 € |
   | de.playfusiongate.sudokuduo.lunch | Mittagessen | 9,99 € |
   | de.playfusiongate.sudokuduo.feast | Festmahl | 19,99 € |

   ## 2. Abonnements erstellen
   | Abo-ID | Base Plan | Preis | Typ |
   |--------|-----------|-------|-----|
   | de.playfusiongate.sudokuduo.monthly | monthly | 2,99 €/Monat | Auto-Renewable |
   | de.playfusiongate.sudokuduo.yearly | yearly | 29,99 €/Jahr | Auto-Renewable |

   ## 3. Länder freischalten
   - [x] Deutschland
   - [x] Österreich
   - [x] Schweiz
   - [ ] Später: EU-weit

   ## 4. Test-Tracks
   - [ ] Closed Testing einrichten
   - [ ] Test-Lizenzen erstellen
   ```

#### **Success Criteria**
- ✅ Keine kritischen Bugs
- ✅ Alle Edge Cases behandelt
- ✅ Setup-Guides vorhanden
- ✅ App ist launch-ready

---

## 🏗️ Technische Architektur

### **Module-Struktur (Final)**
```
modules/
├── subscriptions/
│   ├── SubscriptionService.ts    ✅ Singleton, RevenueCat Integration
│   ├── entitlements.ts            ✅ Core Logic
│   ├── types.ts                   ✅ Interfaces
│   └── hooks/
│       ├── useSupporter.ts        ✅ React Hook
│       └── useImageUnlock.ts      ✅ Quota Hook
├── game/
│   └── epCalculator.ts            ✅ EP mit Bonus
└── gallery/
    └── supporterUnlocks.ts        ✅ Image-Unlock

screens/SupportShop/
├── SupportShop.tsx                🔄 Refactoring (Phase 2)
├── components/
│   ├── BenefitsCard.tsx           📝 NEU (Phase 2)
│   ├── ThankYouModal.tsx          📝 NEU (Phase 2)
│   ├── ProductCard.tsx            🔄 Refactor (Phase 2)
│   └── SubscriptionCard.tsx       🔄 Refactor (Phase 2)

screens/Gallery/
├── Gallery.tsx                    🔄 Erweitern (Phase 3)
└── components/
    ├── UnlockConfirmationDialog.tsx 📝 NEU (Phase 3)
    ├── SupporterBadge.tsx           📝 NEU (Phase 3)
    ├── ImageDetailModal.tsx         🔄 Erweitern (Phase 3)
    └── ImageFullscreenView.tsx      🔄 Erweitern (Phase 3)
```

### **Key Interfaces**
```typescript
// modules/subscriptions/types.ts
interface SupporterStatus {
  isSupporter: boolean;          // Einmalkauf ODER Abo
  isPremiumSubscriber: boolean;  // Nur aktives Abo
  expiresAt: Date | null;
  productId: string | null;
  isInGracePeriod: boolean;
  supportType: 'none' | 'one-time' | 'subscription';
}

interface ImageUnlockQuota {
  monthlyLimit: 1;
  usedThisMonth: number;
  lastUnlockDate: string | null;
  canUnlock: boolean;
  remainingUnlocks: number;
  nextResetDate: Date;
}
```

---

## 📝 Wichtige Entscheidungen

### **Supporter-Logik**
- **Einmalkauf = Supporter**: Egal ob 1,99€ oder 19,99€ → volle Benefits
- **Abo = Premium Subscriber**: Nur aktive Abos
- **Benefits für ALLE Supporter**: 2x EP + 1 Bild/Monat
- **Rationale**: Jeder Unterstützer verdient Wertschätzung, egal wie viel

### **Image-Unlock**
- **Limit**: 1 Bild pro Monat (fix)
- **Reset**: Automatisch am 1. jeden Monats
- **Tracking**: AsyncStorage (`@sudoku/image_unlock_quota`)
- **Rationale**: Balance zwischen Wertschätzung und Anreiz für Abos

### **EP-Multiplikator**
- **Supporter**: 2x EP (immer)
- **Non-Supporter**: 1x EP
- **Integration**: Automatisch in `updateStatsAfterGame()`
- **Rationale**: Spürbarer Bonus, aber nicht Pay-to-Win

### **Shop-Design**
- **Weniger ist mehr**: Banner weg, nur essentials
- **SVG-Icons**: Professioneller als Emojis
- **Humor bleibt**: Aber kürzer (1 Zeile statt 3)
- **Rationale**: Fokus auf Conversion, weniger Ablenkung

---

## ⏱️ Zeitplan

| Phase | Dauer | Status | PR |
|-------|-------|--------|-----|
| **Phase 1** | 3h | ✅ Done | #1 ✅ |
| **Phase 2** | 2-3d | 🔄 Next | #2 |
| **Phase 3** | 2-3d | ⏳ Pending | #3 |
| **Phase 4** | 1-2d | ⏳ Optional | #4 |
| **Phase 5** | 2-3d | ⏳ Pending | #5 |
| **TOTAL** | 9-14d | 1/5 | - |

---

## 🎯 Success Metrics (Post-Launch)

### **Technisch**
- ✅ EP-Bonus funktioniert (2x für Supporter)
- ✅ Image-Unlock funktioniert (1/Monat)
- ✅ Quota-Reset funktioniert (monatlich)
- ✅ RevenueCat-Sync funktioniert

### **Business** (nach 4 Wochen)
- Conversion-Rate: ?% (baseline messen)
- Abo-Rate vs. Einmalkauf: ?%
- Image-Unlocks pro Monat: ? (Nutzung messen)

---

## 📞 Offene Fragen & Antworten

**Q: Foto/Avatar im Shop?**
A: Optional, erstmal nicht. Kann später hinzugefügt werden.

**Q: Intro-Preise für Abos?**
A: Nein, Preise bleiben fix.

**Q: Analytics?**
A: Erstmal keine zusätzlichen. Später optional.

**Q: Server-Backend für Subscription-Validierung?**
A: Später, nicht für MVP. RevenueCat-Webhooks reichen initial.

**Q: SVG-Icons vorhanden?**
A: ✅ Ja! latte-art, croissant, fried-rice, crown in `assets/svg/`

---

## 🔗 Verwandte Dokumente
- `PROGRESS.md` - Aktueller Fortschritt & Session-Log
- `REVENUECAT-SETUP.md` - Setup-Guide (nach Phase 5)
- `GOOGLE-PLAY-SETUP.md` - Setup-Guide (nach Phase 5)

---

**Last Updated**: 2025-01-08 | **Version**: 1.1 | **Status**: Phase 1 ✅ Complete
