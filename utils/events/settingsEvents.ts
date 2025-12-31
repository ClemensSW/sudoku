// utils/events/settingsEvents.ts
/**
 * Settings Event System
 *
 * Provides cross-context event communication for visual settings changes.
 * Used when Theme, Color, or Music settings need to refresh after login/logout.
 *
 * Why needed:
 * - AuthProvider is below ThemeProvider/ColorProvider in the hierarchy
 * - After logout: resetAllLocalData() clears storage, but contexts keep cached state
 * - After login: cloud settings are saved, but contexts aren't notified
 * - This event system allows AuthProvider to notify all visual providers to refresh
 */

type SettingsEventCallback = () => void;

class SettingsEventEmitter {
  private listeners: Map<string, Set<SettingsEventCallback>> = new Map();

  /**
   * Subscribe to settings refresh events
   * @returns Unsubscribe function
   */
  subscribe(event: 'visualSettingsRefresh', callback: SettingsEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emit event to all listeners
   */
  emit(event: 'visualSettingsRefresh'): void {
    console.log(`[SettingsEvents] Emitting ${event}`);
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`[SettingsEvents] Error in listener:`, error);
      }
    });
  }
}

// Singleton instance
export const settingsEvents = new SettingsEventEmitter();

// Convenience functions
export const emitVisualSettingsRefresh = () => settingsEvents.emit('visualSettingsRefresh');
export const onVisualSettingsRefresh = (callback: SettingsEventCallback) =>
  settingsEvents.subscribe('visualSettingsRefresh', callback);
