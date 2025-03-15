import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Konstante für den Speicherschlüssel
const VIBRATION_ENABLED_KEY = "@sudoku/settings";

// Cache für die Vibrations-Einstellung
let vibrationEnabledCache: boolean | null = null;

/**
 * Liest die aktuelle Vibrations-Einstellung aus dem AsyncStorage
 * In der Zwischenzeit wird der Cache-Wert verwendet, um nicht auf AsyncStorage zu warten
 */
const getVibrationEnabled = async (): Promise<boolean> => {
  // Wenn wir einen Cache-Wert haben, verwende diesen
  if (vibrationEnabledCache !== null) {
    return vibrationEnabledCache;
  }

  try {
    const settingsJson = await AsyncStorage.getItem(VIBRATION_ENABLED_KEY);
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);
      vibrationEnabledCache = settings.vibration !== false; // Default zu true wenn nicht explizit false
      return vibrationEnabledCache;
    }
  } catch (error) {
    console.warn("Fehler beim Lesen der Vibrations-Einstellung:", error);
  }

  // Standardwert, falls nichts gespeichert ist
  return true;
};

/**
 * Setzt die Vibrations-Einstellung im Cache
 * Dies ermöglicht schnelle Aktualisierungen ohne AsyncStorage zu lesen
 */
export const setVibrationEnabledCache = (enabled: boolean): void => {
  vibrationEnabledCache = enabled;
};

/**
 * Trigger für Haptic-Feedback, das die Einstellung berücksichtigt
 */
export const triggerHaptic = async (
  type: "light" | "medium" | "heavy" | "success" | "error" | "warning",
  forceEnable?: boolean
): Promise<void> => {
  // Wenn forceEnable gesetzt ist, ignoriere die Einstellung
  const vibrationEnabled = forceEnable || (await getVibrationEnabled());

  if (!vibrationEnabled) return;

  try {
    switch (type) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;
    }
  } catch (error) {
    // Ignoriere Fehler bei Haptic-Feedback
    console.warn("Fehler beim Haptic-Feedback:", error);
  }
};

export default {
  triggerHaptic,
  setVibrationEnabledCache,
};
