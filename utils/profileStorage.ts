// utils/profileStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const NEW_KEY = "user_profile_v1";
const OLD_KEY = "@sudoku/user_profile"; // Migration von alt -> neu

export type UserProfile = {
  name: string;
  avatarUri?: string | null;
  title?: string | null;          // ⬅️ NEU
};

const DEFAULT_PROFILE: UserProfile = {
  name: "User",
  avatarUri: null,
  title: null,
};

/**
 * Interner Helper zum Speichern
 */
async function saveProfile(profile: UserProfile): Promise<UserProfile> {
  await AsyncStorage.setItem(NEW_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Lädt das Nutzerprofil.
 * - Nutzt NEW_KEY
 * - Migriert automatisch vom OLD_KEY, falls NEW_KEY leer ist, OLD_KEY aber existiert.
 * - Merged mit DEFAULT_PROFILE, um fehlende Felder (z.B. title) robust zu setzen.
 */
export async function loadUserProfile(): Promise<UserProfile> {
  try {
    // 1) Versuche neuen Key
    const rawNew = await AsyncStorage.getItem(NEW_KEY);
    if (rawNew) {
      const parsed = JSON.parse(rawNew) as UserProfile;
      return { ...DEFAULT_PROFILE, ...parsed };
    }

    // 2) Fallback: alter Key vorhanden? -> migrieren
    const rawOld = await AsyncStorage.getItem(OLD_KEY);
    if (rawOld) {
      const parsedOld = JSON.parse(rawOld) as Partial<UserProfile>;
      const migrated = { ...DEFAULT_PROFILE, ...parsedOld };
      await saveProfile(migrated);
      // Optional: alten Key aufräumen (nicht zwingend)
      await AsyncStorage.removeItem(OLD_KEY);
      return migrated;
    }

    // 3) Nichts vorhanden -> Default
    return DEFAULT_PROFILE;
  } catch (err) {
    console.error("Fehler beim Laden des Nutzerprofils:", err);
    return DEFAULT_PROFILE;
  }
}

/**
 * Öffentliche API – Name aktualisieren
 */
export async function updateUserName(name: string): Promise<UserProfile> {
  const profile = await loadUserProfile();
  profile.name = name;
  return saveProfile(profile);
}

/**
 * Öffentliche API – Avatar aktualisieren/entfernen
 */
export async function updateUserAvatar(uri: string | null): Promise<UserProfile> {
  const profile = await loadUserProfile();
  profile.avatarUri = uri;
  return saveProfile(profile);
}

/**
 * ⬅️ NEU: Titel setzen/entfernen
 */
export async function updateUserTitle(title: string | null): Promise<UserProfile> {
  const profile = await loadUserProfile();
  profile.title = title;
  return saveProfile(profile);
}

/**
 * Kompatibilität: alter Export-Name erhalten
 * (falls irgendwo noch saveUserProfile importiert wird)
 */
export const saveUserProfile = saveProfile;
