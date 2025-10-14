// hooks/useAuth.ts
/**
 * useAuth Hook
 *
 * Provides easy access to Authentication Context
 * Usage:
 *   const { user, isLoggedIn, signOut } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthProvider';

/**
 * Hook to access Authentication Context
 *
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isLoggedIn, signOut } = useAuth();
 *
 *   if (isLoggedIn) {
 *     return <Text>Welcome {user?.email}</Text>;
 *   }
 *
 *   return <Text>Please sign in</Text>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure to wrap your app with <AuthProvider>.'
    );
  }

  return context;
}

export default useAuth;
