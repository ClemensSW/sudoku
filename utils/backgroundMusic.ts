// utils/backgroundMusic.ts
import { Audio } from 'expo-av';
import { loadSettings } from './storage';

class BackgroundMusicManager {
  private sound: Audio.Sound | null = null;
  private isLoaded: boolean = false;
  private isPlaying: boolean = false;

  /**
   * Initialisiert den Audio-Player und konfiguriert die Audio-Session
   */
  async initialize(): Promise<void> {
    try {
      // Konfiguriere Audio-Modus für Hintergrundmusik
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Spielt auch im Silent Mode
        staysActiveInBackground: true, // Bleibt im Hintergrund aktiv
        shouldDuckAndroid: true, // Reduziert Lautstärke bei anderen Sounds
      });

      // Lade die Audio-Datei
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/audio/chill-lofi-background-music-331434.mp3'),
        {
          shouldPlay: false,
          isLooping: true, // Dauerschleife
          volume: 0.3, // 30% Lautstärke (nicht zu dominant)
        }
      );

      this.sound = sound;
      this.isLoaded = true;

      console.log('Background music initialized');
    } catch (error) {
      console.error('Error initializing background music:', error);
    }
  }

  /**
   * Startet die Musik-Wiedergabe
   */
  async play(): Promise<void> {
    if (!this.isLoaded || !this.sound) {
      await this.initialize();
    }

    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
        console.log('Background music started');
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  /**
   * Pausiert die Musik-Wiedergabe
   */
  async pause(): Promise<void> {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
        console.log('Background music paused');
      }
    } catch (error) {
      console.error('Error pausing background music:', error);
    }
  }

  /**
   * Stoppt die Musik und entlädt sie aus dem Speicher
   */
  async stop(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.isLoaded = false;
        this.isPlaying = false;
        console.log('Background music stopped and unloaded');
      }
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  }

  /**
   * Synchronisiert die Musik mit den aktuellen Settings
   */
  async syncWithSettings(): Promise<void> {
    const settings = await loadSettings();

    if (settings.backgroundMusic) {
      await this.play();
    } else {
      await this.pause();
    }
  }

  /**
   * Gibt den aktuellen Wiedergabestatus zurück
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Singleton-Instanz
export const backgroundMusicManager = new BackgroundMusicManager();
