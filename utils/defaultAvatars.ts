// utils/defaultAvatars.ts
import { ImageSourcePropType } from 'react-native';

// Standard-Avatar für Fallbacks
export const DEFAULT_AVATAR = require('@/assets/images/avatars/default.webp');

export interface DefaultAvatar {
  id: string;
  source: ImageSourcePropType;
  name: string;
  category?: string; // Optional für Kategorisierung
  premium?: boolean; // Neue Eigenschaft: Kennzeichnet Premium-Avatare
}

// Vordefinierte Avatare (hier können einfach mehr hinzugefügt werden)
export const defaultAvatars: DefaultAvatar[] = [
  {
    id: 'default',
    source: DEFAULT_AVATAR,
    name: 'Standard',
    category: 'Basic'
  },
  {
    id: 'avatar1',
    source: require('@/assets/images/avatars/avatar1.webp'),
    name: 'Astronaut',
    category: 'Space'
  },
  {
    id: 'avatar2',
    source: require('@/assets/images/avatars/avatar2.webp'),
    name: 'Ninja',
    category: 'Heroes'
  },
  {
    id: 'avatar3',
    source: require('@/assets/images/avatars/avatar3.webp'),
    name: 'Rocket',
    category: 'Space'
  },
  {
    id: 'avatar4',
    source: require('@/assets/images/avatars/avatar4.webp'),
    name: 'Robot',
    category: 'Tech'
  },
  {
    id: 'avatar5',
    source: require('@/assets/images/avatars/avatar5.webp'),
    name: 'Explorer',
    category: 'Adventure'
  },
  {
    id: 'avatar6',
    source: require('@/assets/images/avatars/avatar6.webp'),
    name: 'Wizard',
    category: 'Fantasy'
  },
  {
    id: 'avatar7',
    source: require('@/assets/images/avatars/avatar7.webp'),
    name: 'Gamer',
    category: 'Tech'
  },
  {
    id: 'avatar8',
    source: require('@/assets/images/avatars/avatar8.webp'),
    name: 'Sports',
    category: 'Activity'
  },
  // Hier können weitere Avatare ergänzt werden
];

// Gruppiere Avatare nach Kategorien
export const getAvatarsByCategory = (): Record<string, DefaultAvatar[]> => {
  const categories: Record<string, DefaultAvatar[]> = {};
  
  defaultAvatars.forEach(avatar => {
    const category = avatar.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(avatar);
  });
  
  return categories;
};

// Avatar anhand der ID finden
export const getAvatarById = (id: string): DefaultAvatar | undefined => {
  return defaultAvatars.find(avatar => avatar.id === id);
};

// Funktionen zur Verwaltung der Pfade zu vordefinierten Avataren
export const isDefaultAvatarPath = (path: string | null | undefined): boolean => {
  return Boolean(path && path.startsWith('default://'));
};

export const getDefaultAvatarPath = (id: string): string => {
  return `default://${id}`;
};

export const getAvatarIdFromPath = (path: string | null | undefined): string | null => {
  if (isDefaultAvatarPath(path)) {
    return path!.replace('default://', '');
  }
  return null;
};

/**
 * Konvertiert einen Avatar-URI (egal ob Datei oder vordefinierter Avatar) in eine Image-Source
 */
export const getAvatarSourceFromUri = (
  uri: string | null | undefined,
  defaultSource: ImageSourcePropType
): ImageSourcePropType => {
  if (!uri) {
    return defaultSource;
  }
  
  // Prüfen ob es ein vordefinierter Avatar ist
  if (isDefaultAvatarPath(uri)) {
    const avatarId = getAvatarIdFromPath(uri);
    if (avatarId) {
      const defaultAvatar = getAvatarById(avatarId);
      if (defaultAvatar) {
        return defaultAvatar.source;
      }
    }
    return defaultSource;
  }
  
  // Normaler Datei-URI
  return { uri };
};