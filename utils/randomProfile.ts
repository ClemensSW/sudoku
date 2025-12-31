// utils/randomProfile.ts
/**
 * Random Profile Utilities
 *
 * Generates random starter names and avatars for new users.
 * Names are localized (DE/EN/HI) and avatars are from the cartoon collection.
 */

import i18n from '@/locales/i18n';

// All available cartoon avatar IDs (avatar17 - avatar161)
const CARTOON_AVATAR_IDS: string[] = [];
for (let i = 17; i <= 161; i++) {
  CARTOON_AVATAR_IDS.push(`avatar${i}`);
}

/**
 * Get a random starter name from the localized list
 * Falls back to a default name if localization fails
 *
 * @returns Random name string
 */
export function getRandomStarterName(): string {
  try {
    const names = i18n.t('common:starterNames', { returnObjects: true });

    if (Array.isArray(names) && names.length > 0) {
      const randomIndex = Math.floor(Math.random() * names.length);
      return names[randomIndex];
    }

    // Fallback if translation fails
    return getDefaultRandomName();
  } catch (error) {
    console.warn('[RandomProfile] Error getting random name:', error);
    return getDefaultRandomName();
  }
}

/**
 * Fallback names if localization is not available
 */
function getDefaultRandomName(): string {
  const fallbackNames = [
    'Sudo', 'Neunix', 'Logix', 'Ziff', 'Numbro', 'Cellix', 'Zello',
    'Zahlenfuchs', 'Gridninja', 'Denkpanda', 'Sudoheld', 'Logikbär',
  ];
  const randomIndex = Math.floor(Math.random() * fallbackNames.length);
  return fallbackNames[randomIndex];
}

/**
 * Get a random cartoon avatar URI
 *
 * @returns Avatar URI string in format "default://avatarXX"
 */
export function getRandomStarterAvatar(): string {
  const randomIndex = Math.floor(Math.random() * CARTOON_AVATAR_IDS.length);
  const avatarId = CARTOON_AVATAR_IDS[randomIndex];
  return `default://${avatarId}`;
}

/**
 * Generate a complete random starter profile
 *
 * @returns Object with random name and avatar URI
 */
export function generateRandomProfile(): { name: string; avatarUri: string } {
  return {
    name: getRandomStarterName(),
    avatarUri: getRandomStarterAvatar(),
  };
}

// Export avatar IDs for testing/debugging
export { CARTOON_AVATAR_IDS };
