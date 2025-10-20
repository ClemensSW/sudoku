/**
 * app/duo-online/private-join.tsx
 *
 * Deep Link Entry Point for Private Match Invites
 * This screen is accessed via deep links: sudokuduo://join/ABC123
 */

import React from 'react';
import PrivateJoin from '@/screens/DuoOnline/PrivateJoin';

export default function PrivateJoinRoute() {
  return <PrivateJoin />;
}
