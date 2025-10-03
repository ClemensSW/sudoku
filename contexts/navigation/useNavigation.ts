import { useContext } from 'react';
import { NavigationContext } from './NavigationContext';
import type { NavigationContextValue } from './types';

/**
 * Hook to access Navigation Context
 *
 * @throws Error if used outside NavigationProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hideBottomNav, showBottomNav } = useNavigation();
 *
 *   return (
 *     <Button onPress={hideBottomNav}>
 *       Hide Navigation
 *     </Button>
 *   );
 * }
 * ```
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error(
      'useNavigation must be used within a NavigationProvider. ' +
      'Make sure your component is wrapped in <NavigationProvider>.'
    );
  }

  return context;
}
