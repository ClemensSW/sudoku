# Support Shop Refactoring - Progress Tracker

## 📊 Overview
**Project**: Support Shop & Gallery Integration Refactoring
**Start Date**: 2025-01-08
**Current Session**: 1
**Current Phase**: Phase 1 - Subscription Foundation
**Status**: 🟡 IN PROGRESS

---

## 🎯 Project Goals
1. ✅ Subscription-Service mit Entitlements
2. ✅ EP-Multiplikator für Supporter (2x EP)
3. ✅ Image-Unlock mit monatlichem Limit
4. ✅ Shop UI Cleanup (SVG-Icons, kompakter)
5. ✅ Gallery Integration (Unlock-Buttons)
6. ✅ Launch-Ready Code + Setup-Guides

---

## 📈 Progress by Phase

### **PHASE 1: Subscription Foundation** ✅ COMPLETED
**Goal**: Zentrale Subscription-Logic, EP-Bonus, Image-Unlock-API

**Tasks**:
- [x] `modules/subscriptions/SubscriptionService.ts` erstellen ✅
- [x] `modules/subscriptions/entitlements.ts` implementieren ✅
- [x] `modules/subscriptions/types.ts` definieren ✅
- [x] `modules/subscriptions/hooks/useSupporter.ts` erstellen ✅
- [x] `modules/subscriptions/hooks/useImageUnlock.ts` erstellen ✅
- [x] `modules/game/epCalculator.ts` erstellen ✅
- [x] `modules/gallery/supporterUnlocks.ts` erstellen ✅
- [x] EP-Multiplikator in `utils/storage.ts` integrieren ✅
- [ ] Unit-Tests für Entitlements (optional, später)

**Blockers**: None
**Next Steps**: Code committen, dann Phase 2 starten

**Session Notes**:
- SVG-Icons bereits vorhanden ✅
- Einmalkauf = Supporter-Status (wie Abo)
- Humor in Shop-Texten beibehalten
- Shop entrümpeln (nicht zu voll)

**Completed**: 2025-01-08 Session 1

---

### **PHASE 2: Shop UI Cleanup** ⚪ PENDING
**Goal**: SVG-Icons, kompakter, Benefits kommunizieren

**Tasks**:
- [ ] BenefitsCard.tsx (kompakt, 3 Zeilen)
- [ ] ProductCard.tsx mit SVG-Icons
- [ ] SubscriptionCard.tsx mit Benefits-Badges
- [ ] ThankYouModal.tsx Post-Purchase
- [ ] SupportShop.tsx Refactoring (entrümpeln)

**Blockers**: Waiting for Phase 1 completion
**Next Steps**: Nach Phase 1 PR merge

---

### **PHASE 3: Gallery Integration** ⚪ PENDING
**Goal**: Supporter können Bilder freischalten

**Tasks**:
- [ ] ImageDetailModal mit Unlock-Button
- [ ] Fullscreen-View mit Floating-Badge
- [ ] Unlock-Confirmation-Dialog
- [ ] Quota-Tracking Integration
- [ ] SupporterBadge Component

**Blockers**: Waiting for Phase 1 + 2
**Next Steps**: Nach Phase 2 PR merge

---

### **PHASE 4: Banner Upgrade** ⚪ OPTIONAL
**Goal**: Banner zeigt Benefits visuell

**Tasks**:
- [ ] Icon + Text Rotation
- [ ] Benefits erwähnen
- [ ] Purchase-Status-basiert

**Status**: Optional, kann übersprungen werden

---

### **PHASE 5: Testing & Launch-Prep** ⚪ PENDING
**Goal**: Production-Ready + Setup-Guides

**Tasks**:
- [ ] End-to-End-Tests
- [ ] Edge Cases testen
- [ ] Dark Mode Check
- [ ] Accessibility Check
- [ ] Performance-Optimierung
- [ ] SETUP-GUIDE.md für RevenueCat
- [ ] SETUP-GUIDE.md für Google Play Console

**Blockers**: Waiting for Phase 3
**Next Steps**: Nach Phase 3 PR merge

---

## 🏗️ Architecture Overview

### **New Modules**
```
modules/
├── subscriptions/
│   ├── SubscriptionService.ts    ✅ Singleton, RevenueCat Integration
│   ├── entitlements.ts            ✅ isSupporter(), canUnlockImage(), getEpMultiplier()
│   ├── types.ts                   ✅ SupporterStatus, ImageUnlockQuota
│   └── hooks/
│       ├── useSupporter.ts        ✅ React Hook für Status
│       └── useImageUnlock.ts      ✅ React Hook für Image-Unlock
├── game/
│   └── epCalculator.ts            ✅ EP-Multiplier Logic
└── gallery/
    └── supporterUnlocks.ts        ✅ Unlock-Logic für Gallery
```

### **Modified Files**
```
utils/storage.ts                   🔄 EP-Calculation mit Multiplier
screens/SupportShop/SupportShop.tsx 🔄 Refactoring
screens/Gallery/Gallery.tsx         🔄 Unlock-Integration
```

---

## 📝 Key Decisions

### **Supporter-Logic**
- **Einmalkauf = Supporter**: Jeder Kauf (coffee bis feast) gibt Supporter-Status
- **Abo = Premium Subscriber**: Nur aktive Abos
- **Benefits für ALLE Supporter**: 2x EP + 1 Bild/Monat

### **Image-Unlock**
- **Limit**: 1 Bild pro Monat
- **Reset**: Am 1. jeden Monats
- **Tracking**: AsyncStorage (`@sudoku/image_unlock_quota`)

### **EP-Multiplikator**
- **Supporter**: 2x EP
- **Non-Supporter**: 1x EP
- **Integration**: In `updateStats()` bei jedem Sudoku-Complete

---

## 🐛 Known Issues
*None yet*

---

## ✅ Completed Milestones
- ✅ **Phase 1: Subscription Foundation** (2025-01-08 Session 1)
  - Subscription-Service mit Event-System
  - Entitlements & EP-Multiplikator
  - Image-Unlock-Logic
  - React Hooks (useSupporter, useImageUnlock)

---

## 📅 Session Log

### **Session 1 - 2025-01-08** ✅ COMPLETED
**Duration**: ~3 hours
**Phase**: Phase 1 - Subscription Foundation

**Completed**:
- ✅ Created PROGRESS.md
- ✅ Audited codebase (15+ Bilder, RevenueCat Setup, i18n)
- ✅ Defined architecture (modules structure)
- ✅ Implemented SubscriptionService.ts (Singleton + Events)
- ✅ Implemented entitlements.ts (isSupporter, Quota, Validation)
- ✅ Implemented types.ts (SupporterStatus, ImageUnlockQuota)
- ✅ Implemented useSupporter Hook (Auto-refresh auf Events)
- ✅ Implemented useImageUnlock Hook (Quota-Management)
- ✅ Implemented epCalculator.ts (EP mit Bonus)
- ✅ Implemented supporterUnlocks.ts (Gallery-Integration)
- ✅ Integrated EP-Multiplier in storage.ts

**Files Created**:
- `modules/subscriptions/SubscriptionService.ts`
- `modules/subscriptions/entitlements.ts`
- `modules/subscriptions/types.ts`
- `modules/subscriptions/hooks/useSupporter.ts`
- `modules/subscriptions/hooks/useImageUnlock.ts`
- `modules/game/epCalculator.ts`
- `modules/gallery/supporterUnlocks.ts`

**Files Modified**:
- `utils/storage.ts` (EP-Multiplikator Integration)

**Next Session**: Phase 2 - Shop UI Cleanup

---

## 🎯 Current Focus
**Phase**: Phase 2 - Shop UI Cleanup (Next Session)
**Tasks**: SVG-Icons, BenefitsCard, ThankYouModal
**Time Estimate**: 2-3 days

---

## 📞 Open Questions
- [ ] RevenueCat Dashboard Setup (post-code, Phase 5)
- [ ] Google Play Console Setup (post-code, Phase 5)

---

**Last Updated**: 2025-01-08 | **Session**: 1 | **Phase**: 1 ✅ COMPLETED
