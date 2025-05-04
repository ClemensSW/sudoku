// constants.ts
import { FeedbackCategory } from './types';
import { FeatherIconName } from './feather-icons'; // Wir importieren den Typ aus der lokalen Datei

// Texte für die verschiedenen Schritte des Bewertungsprozesses
export const TEXTS = {
  // Rating Modal
  RATING_TITLE: 'Bewerten Sie uns',
  RATING_SUBTITLE: 'Damit wir noch bessere Apps entwickeln können!',
  RATING_BUTTON: 'Bewerten',
  
  // Positive Feedback (4-5 Sterne)
  POSITIVE_TITLE: 'Wir mögen dich auch!',
  POSITIVE_SUBTITLE: 'Danke für dein Feedback',
  POSITIVE_BUTTON_PLAY_STORE: 'Auf Google Play bewerten',
  
  // Negative Feedback (1-3 Sterne)
  NEGATIVE_TITLE: 'Oh nein!',
  NEGATIVE_SUBTITLE: 'Hilf mir, die App zu verbessern, und beschreibe dein Problem',
  
  // Feedback Kategorie Auswahl
  FEEDBACK_CATEGORY_TITLE: 'Wie können wir dir helfen?',
  FEEDBACK_CATEGORY_BUTTON: 'Weiter',
  
  // Feedback Detail
  FEEDBACK_DETAIL_TITLE: 'Dein Feedback',
  FEEDBACK_DETAIL_PLACEHOLDER: 'Erzähl mir mehr über deine Erfahrung...',
  FEEDBACK_DETAIL_EMAIL_PLACEHOLDER: 'Deine E-Mail (optional)',
  FEEDBACK_DETAIL_BUTTON: 'Senden',
  
  // Nach dem Senden
  FEEDBACK_SENT_TITLE: 'Vielen Dank!',
  FEEDBACK_SENT_SUBTITLE: 'Dein Feedback hilft mir sehr, die App zu verbessern.',
  FEEDBACK_SENT_BUTTON: 'Schließen'
};

// Kategorien für Feedback
export const FEEDBACK_CATEGORIES: Array<{id: FeedbackCategory, label: string}> = [
  { id: 'problem', label: 'Es ist ein Problem aufgetreten' },
  { id: 'missing', label: 'Funktionen, die ich brauche, fehlen' },
  { id: 'idea', label: 'Ich habe eine Idee für die App' },
  { id: 'complicated', label: 'Kompliziert zu bedienen' },
  { id: 'other', label: 'Sonstiges' }
];

// Emoji-Typen basierend auf Bewertungen
export const RATING_EMOJIS: Record<string, FeatherIconName> = {
  FIVE_STARS: 'heart', // Herz-Icon für 5 Sterne
  FOUR_STARS: 'smile',  // Lächeln-Icon für 4 Sterne
  THREE_STARS: 'meh',   // Neutrales Icon für 3 Sterne
  TWO_STARS: 'frown',   // Trauriges Icon für 2 Sterne
  ONE_STAR: 'alert-circle',  // Alarm für 1 Stern
};

// Icons für die Kategorie-Auswahl
export const CATEGORY_ICONS: Record<FeedbackCategory, FeatherIconName> = {
  'problem': 'alert-circle',
  'missing': 'package',
  'idea': 'zap', // Dies muss ein gültiges Feather-Icon sein
  'complicated': 'help-circle',
  'other': 'more-horizontal'
};

// Konfiguration für den Feedback-Sender
export const EMAIL_CONFIG = {
  SUBJECT_PREFIX: 'Sudoku Duo Feedback: ',
  BODY_TEMPLATE: (data: string) => `Feedback-Details:\n\n${data}`
};