// screens/GameScreen/hooks/useGameSettings.ts
import { useState, useEffect, useCallback } from "react";
import { loadSettings, saveSettings, GameSettings } from "@/utils/storage";
import { setVibrationEnabledCache } from "@/utils/haptics";

export const useGameSettings = () => {
  // Settings state
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [highlightRelatedCells, setHighlightRelatedCells] = useState(true);
  const [highlightSameValues, setHighlightSameValues] = useState(true);
  const [showMistakes, setShowMistakes] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadGameSettings = async () => {
      try {
        const loadedSettings = await loadSettings();
        if (loadedSettings) {
          setSettings(loadedSettings);
          setHighlightRelatedCells(loadedSettings.highlightRelatedCells);
          setHighlightSameValues(loadedSettings.highlightSameValues);
          setShowMistakes(loadedSettings.showMistakes);
          setVibrationEnabled(loadedSettings.vibration);
          // Update vibration cache
          setVibrationEnabledCache(loadedSettings.vibration);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        setIsLoading(false);
      }
    };

    loadGameSettings();
  }, []);

  // Update a setting
  const updateSetting = useCallback(
    async (key: keyof GameSettings, value: boolean | string) => {
      if (!settings) return;

      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      // isAutomatic = false → diese Änderung kommt vom User, also Tracking aktualisieren
      await saveSettings(updatedSettings, false);

      // Update local state based on key
      switch (key) {
        case "highlightRelatedCells":
          setHighlightRelatedCells(value as boolean);
          break;
        case "highlightSameValues":
          setHighlightSameValues(value as boolean);
          break;
        case "showMistakes":
          setShowMistakes(value as boolean);
          break;
        case "vibration":
          setVibrationEnabled(value as boolean);
          setVibrationEnabledCache(value as boolean);
          break;
      }
    },
    [settings]
  );

  return {
    settings,
    highlightRelatedCells,
    highlightSameValues,
    showMistakes,
    vibrationEnabled,
    isLoading: isLoading,
    updateSetting,
  };
};