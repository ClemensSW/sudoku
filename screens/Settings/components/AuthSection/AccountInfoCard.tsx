// screens/Settings/components/AuthSection/AccountInfoCard.tsx
/**
 * AccountInfoCard
 *
 * Zeigt Account-Informationen wenn User eingeloggt ist:
 * - User Email/Name mit Google Profilbild
 * - Auto-Sync Info mit Last Sync Zeitstempel
 * - Manual Sync Button
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { manualSync, getSyncStatus, subscribeSyncStatus, SyncStatus } from '@/utils/cloudSync/syncService';
import Button from '@/components/Button/Button';
import CloudsIcon from '@/assets/svg/clouds.svg';

interface AccountInfoCardProps {
  onSignOut?: () => void;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ onSignOut }) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const progressColor = useProgressColor();

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  // Subscribe to sync status updates (event-based, no polling!)
  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatus(status);
      setIsSyncing(status.isSyncing);
    });

    return unsubscribe;
  }, []);

  // Format last sync time
  const formatLastSync = (timestamp: number | null): string => {
    if (!timestamp) return t('authSection.neverSynced');

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('authSection.justNow');
    if (minutes < 60) return t('authSection.minutesAgo', { count: minutes });
    if (hours < 24) return t('authSection.hoursAgo', { count: hours });
    return t('authSection.daysAgo', { count: days });
  };

  // Handle manual sync
  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      console.log('[AccountInfoCard] Manual sync requested');

      const result = await manualSync();

      if (result.success) {
        console.log('[AccountInfoCard] ✅ Manual sync successful');
        showAlert({
          title: t('authSection.syncSuccess'),
          message: t('authSection.syncSuccessMessage', {
            conflicts: result.conflictsResolved,
          }),
          type: 'success',
          buttons: [
            {
              text: 'OK',
              style: 'primary',
              onPress: () => {},
            },
          ],
        });
      } else {
        console.error('[AccountInfoCard] ⚠️ Manual sync failed:', result.errors);
        showAlert({
          title: t('authSection.syncError'),
          message: result.errors?.[0] || t('authSection.syncErrorMessage'),
          type: 'error',
          buttons: [
            {
              text: 'OK',
              style: 'primary',
              onPress: () => {},
            },
          ],
        });
      }

      // Update sync status
      setSyncStatus(getSyncStatus());
    } catch (error: any) {
      console.error('[AccountInfoCard] ❌ Manual sync error:', error);
      showAlert({
        title: t('authSection.syncError'),
        message: error.message || t('authSection.syncErrorMessage'),
        type: 'error',
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: () => {},
          },
        ],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!user) return null;

  const email = user.email || t('authSection.noEmail');
  const displayName = user.displayName || email.split('@')[0];
  const photoURL = user.photoURL;

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: theme.isDark ? '#000' : '#000',
        },
      ]}
    >
      {/* User Info Header */}
      <View style={styles.header}>
        {/* Profile Photo */}
        <View style={[styles.avatarContainer, { borderColor: progressColor }]}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: progressColor + '20' }]}>
              <Feather name="user" size={36} color={progressColor} />
            </View>
          )}
        </View>

        {/* User Details */}
        <View style={styles.userInfo}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      {/* Auto-Sync Info with Last Sync */}
      <View style={[styles.syncInfo, { backgroundColor: progressColor + '10' }]}>
        <View style={styles.syncInfoHeader}>
          <CloudsIcon width={64} height={64} />
          <Text style={[styles.syncInfoText, { color: colors.textPrimary }]}>
            {t('authSection.autoSyncInfo')}
          </Text>
        </View>
        <View style={styles.syncStatusRow}>
          <Feather
            name={syncStatus.lastError ? 'alert-circle' : 'check-circle'}
            size={14}
            color={syncStatus.lastError ? colors.error : progressColor}
          />
          <Text style={[styles.lastSyncText, { color: colors.textSecondary }]}>
            {t('authSection.lastSync')}: {formatLastSync(syncStatus.lastSync)}
          </Text>
        </View>
      </View>

      {/* Manual Sync Button */}
      <Button
        title={isSyncing ? t('authSection.syncing') : t('authSection.syncNow')}
        onPress={handleManualSync}
        disabled={isSyncing}
        loading={isSyncing}
        variant="primary"
        customColor={progressColor}
        icon={!isSyncing ? <Feather name="refresh-cw" size={18} color={colors.buttonText} /> : undefined}
        iconPosition="left"
        style={styles.syncButton}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.xxl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  displayName: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Auto-Sync Info
  syncInfo: {
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  syncInfoHeader: {
    alignItems: 'center',
    gap: spacing.md,
  },
  syncInfoText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  lastSyncText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Manual Sync Button
  syncButton: {
    width: "100%",
    // Button component übernimmt: backgroundColor, padding, borderRadius, text styling
  },
});

export default AccountInfoCard;
