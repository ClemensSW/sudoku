// screens/SettingsScreen/components/ReviewSystem/constants.ts
import { FeedbackCategory } from './types';
import { FeatherIconName } from './feather-icons';

// Texts for the different steps of the rating process
export const TEXTS = {
  // Rating Modal
  RATING_TITLE: 'Bewerte meine App',
  RATING_SUBTITLE: 'Dein Feedback hilft mir, die App zu verbessern',
  RATING_BUTTON: 'Bewerten',
  
  // Positive Feedback (5 stars)
  POSITIVE_TITLE: 'Ich mag dich auch!',
  POSITIVE_SUBTITLE: 'Danke für deine Unterstützung',
  POSITIVE_BUTTON_PLAY_STORE: 'Im Play Store bewerten',
  
  // Negative Feedback (1-4 stars)
  NEGATIVE_TITLE: 'Danke für deine Ehrlichkeit!',
  NEGATIVE_SUBTITLE: 'Hilf mir, die App zu verbessern und beschreibe dein Feedback',
  
  // Feedback Category Selection
  FEEDBACK_CATEGORY_TITLE: 'Wie kann ich dir helfen?',
  FEEDBACK_CATEGORY_BUTTON: 'Weiter',
  
  // Feedback Detail
  FEEDBACK_DETAIL_TITLE: 'Dein Feedback',
  FEEDBACK_DETAIL_PLACEHOLDER: 'Erzähl mir mehr über deine Erfahrung...',
  FEEDBACK_DETAIL_EMAIL_PLACEHOLDER: 'Deine E-Mail (optional)',
  FEEDBACK_DETAIL_BUTTON: 'Senden',
  
  // After sending
  FEEDBACK_SENT_TITLE: 'Vielen Dank!',
  FEEDBACK_SENT_SUBTITLE: 'Dein Feedback hilft mir sehr, die App zu verbessern.',
  FEEDBACK_SENT_BUTTON: 'Schließen'
};

// Categories for feedback
export const FEEDBACK_CATEGORIES: Array<{id: FeedbackCategory, label: string}> = [
  { id: 'problem', label: 'Es ist ein Problem aufgetreten' },
  { id: 'idea', label: 'Ich habe eine Idee für die App' },
  { id: 'missing', label: 'Funktionen, die ich brauche, fehlen' },
  { id: 'complicated', label: 'Kompliziert zu bedienen' },
  { id: 'other', label: 'Sonstiges' }
];

// Emoji types based on ratings
export const RATING_EMOJIS: Record<string, FeatherIconName> = {
  FIVE_STARS: 'heart', // Heart icon for 5 stars
  FOUR_STARS: 'smile',  // Smile icon for 4 stars
  THREE_STARS: 'meh',   // Neutral icon for 3 stars
  TWO_STARS: 'frown',   // Sad icon for 2 stars
  ONE_STAR: 'alert-circle',  // Alert icon for 1 star
};

// Icons for category selection
export const CATEGORY_ICONS: Record<FeedbackCategory, FeatherIconName> = {
  'problem': 'alert-circle',
  'missing': 'package',
  'idea': 'zap',
  'complicated': 'help-circle',
  'other': 'more-horizontal'
};

// Configuration for the feedback sender
export const EMAIL_CONFIG = {
  SUBJECT_PREFIX: 'Sudoku Duo Feedback: ',
  BODY_TEMPLATE: (data: string) => `Feedback-Details:\n\n${data}`
};