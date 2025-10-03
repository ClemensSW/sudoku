import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { usePathname } from 'expo-router';
import { shouldShowNavigation } from '@/config/navigation';
import type { NavigationContextValue } from './types';

/**
 * Navigation Context
 * Manages bottom navigation visibility across the app
 */
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

/**
 * Navigation Provider Props
 */
interface NavigationProviderProps {
  children: ReactNode;
  /**
   * Initial visibility state (useful for testing)
   */
  initialVisible?: boolean;
}

/**
 * Navigation Provider
 * Provides navigation state and actions to the entire app
 */
export function NavigationProvider({
  children,
  initialVisible = true
}: NavigationProviderProps) {
  const pathname = usePathname();
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  /**
   * Calculate visibility based on route and manual override
   * Manual override takes precedence, but is reset on route change
   */
  const isBottomNavVisible = useMemo(() => {
    // If there's a manual override, use it
    if (manualOverride !== null) {
      return manualOverride;
    }
    // Otherwise, use route-based logic
    return shouldShowNavigation(pathname);
  }, [pathname, manualOverride]);

  /**
   * Reset manual override when route changes
   */
  useEffect(() => {
    setManualOverride(null);
  }, [pathname]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const value = useMemo<NavigationContextValue>(() => ({
    // State
    isBottomNavVisible,
    currentRoute: pathname,

    // Actions - these set manual overrides
    showBottomNav: () => setManualOverride(true),
    hideBottomNav: () => setManualOverride(false),
    setBottomNavVisible: (visible: boolean) => setManualOverride(visible),
    toggleBottomNav: () => setManualOverride(prev => prev === null ? !isBottomNavVisible : !prev),
    resetBottomNav: () => setManualOverride(null), // Reset to use route-based logic
  }), [isBottomNavVisible, pathname]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationContext };
