// index.ts
// Hauptkomponente exportieren
export { default as ReviewManager } from './ReviewManager';

// Typen exportieren für einfache Verwendung
export * from './types';

// Optional: Hilfsfunktionen exportieren, falls extern benötigt
export { openPlayStoreForRating, sendFeedbackViaEmail } from './utils';