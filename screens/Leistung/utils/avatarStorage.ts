// utils/avatarStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isDefaultAvatarPath, getDefaultAvatarPath } from './defaultAvatars';

// Konstanten
const AVATAR_PATH_KEY = '@sudoku/avatar_path';

/**
 * Speichert einen vordefinierten Avatar
 * @param avatarId ID des vordefinierten Avatars
 * @returns Der Pfad zum gespeicherten Avatar
 */
export const saveDefaultAvatar = async (avatarId: string): Promise<string> => {
  const avatarPath = getDefaultAvatarPath(avatarId);
  await AsyncStorage.setItem(AVATAR_PATH_KEY, avatarPath);
  return avatarPath;
};

/**
 * Lädt den gespeicherten Avatar-Pfad
 * @returns Das URI des gespeicherten Avatars oder null, wenn keiner gefunden wurde
 */
export const getAvatarUri = async (): Promise<string | null> => {
  try {
    const avatarUri = await AsyncStorage.getItem(AVATAR_PATH_KEY);

    if (!avatarUri) {
      return null;
    }

    // Gib den Avatar-Pfad zurück (nur Default-Avatars werden unterstützt)
    if (isDefaultAvatarPath(avatarUri)) {
      return avatarUri;
    }

    // Legacy-Pfade (Custom-Avatars) werden ignoriert
    console.log('Legacy custom avatar path detected, removing:', avatarUri);
    await AsyncStorage.removeItem(AVATAR_PATH_KEY);
    return null;
  } catch (error) {
    console.error('Fehler beim Laden des Avatars:', error);
    return null;
  }
};

/**
 * Löscht den aktuellen Avatar (nur AsyncStorage, da Default-Avatars in der App enthalten sind)
 */
export const deleteAvatar = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AVATAR_PATH_KEY);
    console.log('Avatar gelöscht');
  } catch (error) {
    console.error('Fehler beim Löschen des Avatars:', error);
    throw error;
  }
};