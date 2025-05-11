// utils/profileStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Der Storage-Key für das Nutzerprofil
const USER_PROFILE_KEY = '@sudoku/user_profile';

// Schnittstelle für das Nutzerprofil
export interface UserProfile {
  name: string;
  avatarUri?: string | null;
  // Hier können in Zukunft weitere Profilfelder hinzugefügt werden
}

/**
 * Lädt das Nutzerprofil aus dem AsyncStorage
 * @returns Das gespeicherte Nutzerprofil oder ein Standardprofil, wenn keines gefunden wurde
 */
export const loadUserProfile = async (): Promise<UserProfile> => {
  try {
    const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);
    
    if (profileData) {
      return JSON.parse(profileData) as UserProfile;
    }
    
    // Standardprofil, wenn keines gefunden wurde
    return { name: 'User' };
  } catch (error) {
    console.error('Fehler beim Laden des Nutzerprofils:', error);
    
    // Standardprofil im Fehlerfall
    return { name: 'User' };
  }
};

/**
 * Speichert das Nutzerprofil im AsyncStorage
 * @param profile Das zu speichernde Nutzerprofil
 * @returns Das gespeicherte Nutzerprofil
 */
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Fehler beim Speichern des Nutzerprofils:', error);
    throw error;
  }
};

/**
 * Aktualisiert den Nutzernamen im Profil
 * @param name Der neue Nutzername
 * @returns Das aktualisierte Nutzerprofil
 */
export const updateUserName = async (name: string): Promise<UserProfile> => {
  try {
    const currentProfile = await loadUserProfile();
    
    const updatedProfile = {
      ...currentProfile,
      name
    };
    
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Nutzernamens:', error);
    throw error;
  }
};

/**
 * Aktualisiert den Avatar-URI im Profil
 * @param avatarUri Der URI des neuen Avatars oder null, um ihn zu entfernen
 * @returns Das aktualisierte Nutzerprofil
 */
export const updateUserAvatar = async (avatarUri: string | null): Promise<UserProfile> => {
  try {
    const currentProfile = await loadUserProfile();
    
    const updatedProfile = {
      ...currentProfile,
      avatarUri
    };
    
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Avatars:', error);
    throw error;
  }
};