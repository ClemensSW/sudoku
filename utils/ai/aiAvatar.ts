/**
 * AI Avatar Utilities
 *
 * Provides random avatar selection for AI opponents
 * to make them appear more human-like
 */

// All available avatar IDs from the app
// These match the IDs in screens/Leistung/utils/defaultAvatars.ts
export const AVAILABLE_AVATAR_IDS = [
  // Cartoon
  'avatar17', 'avatar18', 'avatar19', 'avatar20', 'avatar21', 'avatar22',
  'avatar23', 'avatar24', 'avatar25', 'avatar26', 'avatar27', 'avatar28',
  'avatar29', 'avatar30', 'avatar31', 'avatar32', 'avatar33', 'avatar34',
  'avatar35', 'avatar36', 'avatar37',
  // Note: 'default' avatar is excluded to make AI more unique
];

/**
 * Get a random avatar URI for an AI opponent
 * Returns a default:// URI that matches the app's avatar system
 *
 * @returns Avatar URI string in format "default://avatarXX"
 */
export function getRandomAIAvatar(): string {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_AVATAR_IDS.length);
  const avatarId = AVAILABLE_AVATAR_IDS[randomIndex];
  return `default://${avatarId}`;
}

/**
 * Get avatar ID from avatar URI
 *
 * @param avatarUri - Avatar URI (e.g., "default://avatar17")
 * @returns Avatar ID (e.g., "avatar17") or null
 */
export function getAvatarIdFromUri(avatarUri: string | undefined): string | null {
  if (!avatarUri || !avatarUri.startsWith('default://')) {
    return null;
  }
  return avatarUri.replace('default://', '');
}
