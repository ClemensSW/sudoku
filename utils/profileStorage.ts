// utils/profileStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "@sudoku/user_profile";

export interface UserProfile {
  name: string;
  avatarId?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Jerome",
  avatarId: "default",
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

export const loadUserProfile = async (): Promise<UserProfile> => {
  try {
    const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
    if (storedProfile) {
      return JSON.parse(storedProfile) as UserProfile;
    }
    // No stored profile, use default
    await saveUserProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return DEFAULT_PROFILE;
  }
};

export const updateUserName = async (name: string): Promise<UserProfile> => {
  try {
    const profile = await loadUserProfile();
    const updatedProfile = { ...profile, name };
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user name:", error);
    return { name, avatarId: "default" };
  }
};

export const updateUserAvatar = async (avatarId: string): Promise<UserProfile> => {
  try {
    const profile = await loadUserProfile();
    const updatedProfile = { ...profile, avatarId };
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return { name: "User", avatarId };
  }
};