/**
 * Central Navigation Configuration
 * Single source of truth for all route-related constants
 */

/**
 * App Routes - Type-safe route constants
 */
export const ROUTES = {
  HOME: '/',
  INDEX: '/index',
  GAME: '/game',
  GAME_GROUP: '/(game)',
  DUO: '/duo',
  DUO_GAME: '/duo-game',
  LEISTUNG: '/leistung',
  GALLERY: '/gallery',
  SETTINGS: '/settings',
} as const;

/**
 * Route Type - Union of all route values
 */
export type Route = typeof ROUTES[keyof typeof ROUTES];

/**
 * Navigation Visibility Rules
 * Defines which routes should show/hide the bottom navigation
 */
export const NAVIGATION_RULES = {
  /**
   * Routes where bottom navigation is always visible
   */
  VISIBLE_ROUTES: [
    ROUTES.HOME,
    ROUTES.INDEX,
    ROUTES.DUO,
    ROUTES.LEISTUNG,
  ] as const,

  /**
   * Routes where bottom navigation is always hidden
   */
  HIDDEN_ROUTES: [
    ROUTES.GAME,
    ROUTES.GAME_GROUP,
    ROUTES.DUO_GAME,
    ROUTES.GALLERY,
    ROUTES.SETTINGS,
  ] as const,
} as const;

/**
 * Utility: Check if route should show navigation
 */
export function shouldShowNavigation(pathname: string | null): boolean {
  if (!pathname) {
    return true;
  }

  // Normalize pathname (remove trailing slash)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  // List of routes where navigation should be VISIBLE
  const visibleRoutes = ['/', '/index', '/duo', '/leistung'];

  // Check if it's a visible route (show navigation)
  for (const route of visibleRoutes) {
    if (normalizedPath === route) {
      return true;
    }
  }

  // List of keywords that indicate navigation should be HIDDEN
  // If the path contains ANY of these, hide navigation
  const hideKeywords = [
    'game',      // Matches: /game, /(game), /duo-game, etc.
    'gallery',
    'settings',
  ];

  for (const keyword of hideKeywords) {
    if (normalizedPath.includes(keyword)) {
      return false;
    }
  }

  // Default: show navigation (for any unknown routes)
  return true;
}
