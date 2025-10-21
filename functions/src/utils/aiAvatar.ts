/**
 * AI Avatar Utilities (Backend)
 *
 * Provides random avatar selection for AI opponents
 * Note: This is a duplicate of utils/ai/aiAvatar.ts for Cloud Functions
 */

// All available avatar IDs from the app
export const AVAILABLE_AVATAR_IDS = [
  // Cartoon
  'avatar17', 'avatar18', 'avatar19', 'avatar20', 'avatar21', 'avatar22',
  'avatar23', 'avatar24', 'avatar25', 'avatar26', 'avatar27', 'avatar28',
  'avatar29', 'avatar30', 'avatar31', 'avatar32', 'avatar33', 'avatar34',
  'avatar35', 'avatar36', 'avatar37',
];

/**
 * Get a random avatar URI for an AI opponent
 * @returns Avatar URI string in format "default://avatarXX"
 */
export function getRandomAIAvatar(): string {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_AVATAR_IDS.length);
  const avatarId = AVAILABLE_AVATAR_IDS[randomIndex];
  return `default://${avatarId}`;
}
