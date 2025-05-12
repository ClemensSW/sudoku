// utils/avatarStorage.ts
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isDefaultAvatarPath, getAvatarIdFromPath, getDefaultAvatarPath } from './defaultAvatars';

// Konstanten
const AVATAR_DIRECTORY = `${FileSystem.documentDirectory}avatars/`;
const AVATAR_FILENAME = 'profile-avatar.jpg';
const AVATAR_PATH_KEY = '@sudoku/avatar_path';

/**
 * Stellt sicher, dass das Verzeichnis für Avatare existiert
 */
export const ensureAvatarDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(AVATAR_DIRECTORY);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AVATAR_DIRECTORY, { intermediates: true });
    console.log('Avatar-Verzeichnis erstellt');
  }
};

/**
 * Speichert ein Bild als Avatar
 * @param uri URI des Bildes (kann eine lokale Datei oder eine temporäre Datei sein)
 * @returns Das URI des gespeicherten Avatars
 */
export const saveAvatar = async (uri: string): Promise<string> => {
  try {
    // Wenn es sich um einen Default-Avatar handelt, speichere den Pfad direkt
    if (isDefaultAvatarPath(uri)) {
      await AsyncStorage.setItem(AVATAR_PATH_KEY, uri);
      return uri;
    }
    
    // Stelle sicher, dass das Verzeichnis existiert
    await ensureAvatarDirectoryExists();
    
    // Generiere einen eindeutigen Dateinamen mit einem Zeitstempel
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${AVATAR_FILENAME}`;
    const destinationUri = `${AVATAR_DIRECTORY}${fileName}`;
    
    // Kopiere die Datei
    await FileSystem.copyAsync({
      from: uri,
      to: destinationUri
    });
    
    // Speichere den Pfad in AsyncStorage
    await AsyncStorage.setItem(AVATAR_PATH_KEY, destinationUri);
    
    console.log('Avatar gespeichert unter:', destinationUri);
    return destinationUri;
  } catch (error) {
    console.error('Fehler beim Speichern des Avatars:', error);
    throw error;
  }
};

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
    
    // Wenn es sich um einen Default-Avatar handelt, gib den Pfad direkt zurück
    if (isDefaultAvatarPath(avatarUri)) {
      return avatarUri;
    }
    
    // Überprüfe, ob die Datei existiert
    const fileInfo = await FileSystem.getInfoAsync(avatarUri);
    if (!fileInfo.exists) {
      console.log('Avatar-Datei existiert nicht mehr:', avatarUri);
      await AsyncStorage.removeItem(AVATAR_PATH_KEY);
      return null;
    }
    
    return avatarUri;
  } catch (error) {
    console.error('Fehler beim Laden des Avatars:', error);
    return null;
  }
};

/**
 * Löscht den aktuellen Avatar
 */
export const deleteAvatar = async (): Promise<void> => {
  try {
    const avatarUri = await AsyncStorage.getItem(AVATAR_PATH_KEY);
    
    if (avatarUri) {
      // Wenn es kein Default-Avatar ist, lösche die Datei
      if (!isDefaultAvatarPath(avatarUri)) {
        const fileInfo = await FileSystem.getInfoAsync(avatarUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(avatarUri);
        }
      }
      
      await AsyncStorage.removeItem(AVATAR_PATH_KEY);
      console.log('Avatar gelöscht');
    }
  } catch (error) {
    console.error('Fehler beim Löschen des Avatars:', error);
    throw error;
  }
};