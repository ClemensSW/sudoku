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
   * Reset manual override only when navigating to visible routes
   * This keeps the manual override persistent during Settings/Game navigation
   */
  useEffect(() => {
    // Only reset to null when navigating to a "visible" route (Home, Duo, Leistung)
    const visibleRoutes = ['/', '/index', '/duo', '/leistung'];
    const normalizedPath = pathname?.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

    const isVisibleRoute = visibleRoutes.some(route => normalizedPath === route);

    if (isVisibleRoute) {
      setManualOverride(null);  // Reset only for visible routes
    }
    // Otherwise: Manual override persists during hidden route navigation
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
