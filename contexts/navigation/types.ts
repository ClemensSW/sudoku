/**
 * Navigation Context Type Definitions
 */

export interface NavigationState {
  /**
   * Whether the bottom navigation should be visible
   */
  isBottomNavVisible: boolean;

  /**
   * Current route pathname
   */
  currentRoute: string | null;
}

export interface NavigationActions {
  /**
   * Show the bottom navigation
   */
  showBottomNav: () => void;

  /**
   * Hide the bottom navigation
   */
  hideBottomNav: () => void;

  /**
   * Set bottom navigation visibility
   * @param visible - true to show, false to hide
   */
  setBottomNavVisible: (visible: boolean) => void;

  /**
   * Toggle bottom navigation visibility
   */
  toggleBottomNav: () => void;

  /**
   * Reset manual override and use automatic route-based logic
   */
  resetBottomNav: () => void;
}

export interface NavigationContextValue extends NavigationState, NavigationActions {}
