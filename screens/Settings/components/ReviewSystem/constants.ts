// screens/SettingsScreen/components/ReviewSystem/constants.ts
import i18next from 'i18next';
import { FeedbackCategory } from './types';
import { FeatherIconName } from './feather-icons';

// Texts for the different steps of the rating process
export const TEXTS = {
  // Rating Modal
  RATING_TITLE: i18next.t('feedback:rating.title'),
  RATING_SUBTITLE: i18next.t('feedback:rating.subtitle'),
  RATING_BUTTON: i18next.t('feedback:rating.button'),

  // Positive Feedback (5 stars)
  POSITIVE_TITLE: i18next.t('feedback:positive.title'),
  POSITIVE_SUBTITLE: i18next.t('feedback:positive.subtitle'),
  POSITIVE_BUTTON_PLAY_STORE: i18next.t('feedback:positive.buttonPlayStore'),

  // Negative Feedback (1-4 stars)
  NEGATIVE_TITLE: i18next.t('feedback:negative.title'),
  NEGATIVE_SUBTITLE: i18next.t('feedback:negative.subtitle'),

  // Feedback Category Selection
  FEEDBACK_CATEGORY_TITLE: i18next.t('feedback:category.title'),
  FEEDBACK_CATEGORY_BUTTON: i18next.t('feedback:category.button'),

  // Feedback Detail
  FEEDBACK_DETAIL_TITLE: i18next.t('feedback:detail.title'),
  FEEDBACK_DETAIL_PLACEHOLDER: i18next.t('feedback:detail.placeholderExperience'),
  FEEDBACK_DETAIL_EMAIL_PLACEHOLDER: i18next.t('feedback:detail.emailPlaceholder'),
  FEEDBACK_DETAIL_BUTTON: i18next.t('feedback:detail.button'),

  // After sending
  FEEDBACK_SENT_TITLE: i18next.t('feedback:sent.title'),
  FEEDBACK_SENT_SUBTITLE: i18next.t('feedback:sent.subtitle'),
  FEEDBACK_SENT_BUTTON: i18next.t('feedback:sent.button')
};

// Categories for feedback
export const FEEDBACK_CATEGORIES: Array<{id: FeedbackCategory, label: string}> = [
  { id: 'problem', label: i18next.t('feedback:category.options.problem') },
  { id: 'idea', label: i18next.t('feedback:category.options.idea') },
  { id: 'missing', label: i18next.t('feedback:category.options.missing') },
  { id: 'complicated', label: i18next.t('feedback:category.options.complicated') },
  { id: 'other', label: i18next.t('feedback:category.options.other') }
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
  SUBJECT_PREFIX: i18next.t('feedback:email.subjectPrefix'),
  BODY_TEMPLATE: (data: string) => `Feedback-Details:\n\n${data}`
};