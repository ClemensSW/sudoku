/**
 * useDeepLink Hook
 *
 * Handles deep link parsing and navigation for private match invites
 */

import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { useRouter, useSegments } from 'expo-router';

interface DeepLinkData {
  type: 'join' | null;
  inviteCode: string | null;
}

/**
 * Hook to handle deep links for private match invites
 *
 * Supported formats:
 * - sudokuduo://join/ABC123
 * - https://sudokuduo.com/join/ABC123
 */
export function useDeepLink() {
  const router = useRouter();
  const segments = useSegments();
  const [deepLinkData, setDeepLinkData] = useState<DeepLinkData>({
    type: null,
    inviteCode: null,
  });

  /**
   * Parse URL and extract deep link data
   */
  const parseDeepLink = (url: string | null): DeepLinkData | null => {
    if (!url) return null;

    try {
      // Parse URL using expo-linking
      const { hostname, path, queryParams } = Linking.parse(url);

      console.log('[useDeepLink] Parsed URL:', { hostname, path, queryParams });

      // Handle custom scheme: sudokuduo://join/ABC123
      if (hostname === 'join' && path) {
        const inviteCode = path.replace(/^\//, ''); // Remove leading slash
        console.log('[useDeepLink] Invite code from custom scheme:', inviteCode);
        return {
          type: 'join',
          inviteCode,
        };
      }

      // Handle https: https://sudokuduo.com/join/ABC123
      if (hostname === 'sudokuduo.com' && path) {
        const match = path.match(/^\/join\/([A-Z0-9]{6})$/i);
        if (match) {
          const inviteCode = match[1];
          console.log('[useDeepLink] Invite code from https:', inviteCode);
          return {
            type: 'join',
            inviteCode,
          };
        }
      }

      console.warn('[useDeepLink] Unknown deep link format:', url);
      return null;
    } catch (error) {
      console.error('[useDeepLink] Failed to parse deep link:', error);
      return null;
    }
  };

  /**
   * Handle deep link navigation
   */
  const handleDeepLink = (url: string | null) => {
    const data = parseDeepLink(url);

    if (data && data.type === 'join' && data.inviteCode) {
      setDeepLinkData(data);

      // Navigate to private match join screen
      console.log('[useDeepLink] Navigating to join screen with code:', data.inviteCode);
      router.push({
        pathname: '/duo-online/private-join',
        params: { inviteCode: data.inviteCode },
      });
    }
  };

  useEffect(() => {
    // Handle initial URL (app opened from deep link when closed)
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('[useDeepLink] Initial URL:', initialUrl);

      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    getInitialURL();

    // Handle URL changes (app opened from deep link when in background)
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('[useDeepLink] URL event:', event.url);
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    deepLinkData,
    parseDeepLink,
  };
}
