// contexts/BackgroundMusicProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { backgroundMusicManager } from '@/utils/backgroundMusic';
import { loadSettings, DEFAULT_SETTINGS } from '@/utils/storage';
import { onVisualSettingsRefresh } from '@/utils/events/settingsEvents';

interface BackgroundMusicContextType {
  isPlaying: boolean;
  toggleMusic: (enabled: boolean) => Promise<void>;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType>({
  isPlaying: false,
  toggleMusic: async () => {},
});

export const useBackgroundMusic = () => useContext(BackgroundMusicContext);

interface BackgroundMusicProviderProps {
  children: React.ReactNode;
}

export const BackgroundMusicProvider: React.FC<BackgroundMusicProviderProps> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialisiere Musik beim Start
  useEffect(() => {
    const initMusic = async () => {
      await backgroundMusicManager.initialize();
      await syncMusicWithSettings();
    };

    initMusic();

    // Cleanup beim Unmount
    return () => {
      backgroundMusicManager.stop();
    };
  }, []);

  // Subscribe to visual settings refresh events (login/logout)
  useEffect(() => {
    const unsubscribe = onVisualSettingsRefresh(() => {
      console.log('[BackgroundMusicProvider] Refreshing from storage...');
      syncMusicWithSettings();
    });
    return () => unsubscribe();
  }, []);

  // Synchronisiere Musik mit Settings
  const syncMusicWithSettings = async () => {
    const settings = await loadSettings();
    await toggleMusic(settings?.backgroundMusic ?? DEFAULT_SETTINGS.backgroundMusic);
  };

  // Toggle Musik ein/aus
  const toggleMusic = async (enabled: boolean) => {
    if (enabled) {
      await backgroundMusicManager.play();
    } else {
      await backgroundMusicManager.pause();
    }
    setIsPlaying(enabled);
  };

  // Handle App State Changes (Hintergrund/Vordergrund)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        const settings = await loadSettings();

        if (!(settings?.backgroundMusic ?? DEFAULT_SETTINGS.backgroundMusic)) return;

        // Wenn App in den Vordergrund kommt und Musik aktiviert ist
        if (nextAppState === 'active') {
          await backgroundMusicManager.play();
          setIsPlaying(true);
        }
        // Wenn App in den Hintergrund geht - Musik pausieren
        else if (nextAppState.match(/inactive|background/)) {
          await backgroundMusicManager.pause();
          setIsPlaying(false);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <BackgroundMusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};
