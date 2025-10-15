// screens/Settings/components/AuthSection/AccountInfoCard.tsx
/**
 * AccountInfoCard
 *
 * Zeigt Account-Informationen wenn User eingeloggt ist:
 * - User Email/Name mit Google Profilbild
 * - Auto-Sync Information
 * - Letzter Sync-Zeitpunkt
 * - Manual Sync Button
 * - Sign Out Button
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { manualSync, getSyncStatus, SyncStatus } from '@/utils/cloudSync/syncService';

interface AccountInfoCardProps {
  onSignOut?: () => void;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ onSignOut }) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;
  const { user, signOut, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  // Poll sync status every second while syncing
  useEffect(() => {
    if (isSyncing) {
      const interval = setInterval(() => {
        const status = getSyncStatus();
        setSyncStatus(status);

        if (!status.isSyncing) {
          setIsSyncing(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSyncing]);

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

  // Handle sign out
  const handleSignOut = async () => {
    try {
      showAlert({
        title: t('authSection.signOutConfirmTitle'),
        message: t('authSection.signOutConfirmMessage'),
        type: 'warning',
        buttons: [
          {
            text: t('authSection.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t('authSection.signOut'),
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                if (onSignOut) onSignOut();
                showAlert({
                  title: t('authSection.signOutSuccess'),
                  message: t('authSection.signOutSuccessMessage'),
                  type: 'success',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              } catch (error: any) {
                console.error('[AccountInfoCard] Sign out error:', error);
                showAlert({
                  title: t('authSection.signOutError'),
                  message: error.message || t('authSection.signOutErrorMessage'),
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
            },
          },
        ],
      });
    } catch (error) {
      console.error('[AccountInfoCard] Sign out alert error:', error);
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
        <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="user" size={32} color={colors.primary} />
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

      {/* Auto-Sync Info Banner */}
      <View style={[styles.autoSyncBanner, { backgroundColor: colors.primary + '15' }]}>
        <View style={styles.autoSyncIconContainer}>
          <Feather name="check-circle" size={18} color={colors.primary} />
        </View>
        <View style={styles.autoSyncTextContainer}>
          <Text style={[styles.autoSyncTitle, { color: colors.primary }]}>
            {t('authSection.autoSyncInfo')}
          </Text>
          <Text style={[styles.autoSyncSubtitle, { color: colors.textSecondary }]}>
            {t('authSection.autoSyncDetails')}
          </Text>
        </View>
      </View>

      {/* Last Sync Status */}
      <View style={[styles.syncStatusContainer, { backgroundColor: colors.background }]}>
        <View style={styles.syncStatusRow}>
          <Feather
            name={syncStatus.lastError ? 'alert-circle' : 'cloud'}
            size={16}
            color={syncStatus.lastError ? colors.error : colors.textSecondary}
          />
          <Text style={[styles.syncStatusLabel, { color: colors.textSecondary }]}>
            {t('authSection.lastSync')}:
          </Text>
          <Text
            style={[
              styles.syncStatusValue,
              { color: syncStatus.lastError ? colors.error : colors.textPrimary },
            ]}
          >
            {formatLastSync(syncStatus.lastSync)}
          </Text>
        </View>
        {syncStatus.lastError && (
          <Text style={[styles.errorText, { color: colors.error }]} numberOfLines={2}>
            {syncStatus.lastError}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Sync Button - Gradient Style */}
        <TouchableOpacity
          onPress={handleManualSync}
          disabled={isSyncing}
          activeOpacity={0.8}
          style={styles.syncButtonContainer}
        >
          <LinearGradient
            colors={
              theme.isDark
                ? [colors.primary, colors.primary]
                : [colors.primary, '#3A7BD5']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.syncButton, { opacity: isSyncing ? 0.6 : 1 }]}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="refresh-cw" size={18} color="#fff" />
            )}
            <Text style={styles.syncButtonText}>
              {isSyncing ? t('authSection.syncing') : t('authSection.syncNow')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign Out Button - Outline Style */}
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: colors.textSecondary, opacity: authLoading ? 0.6 : 1 }]}
          onPress={handleSignOut}
          disabled={authLoading}
          activeOpacity={0.7}
        >
          {authLoading ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Feather name="log-out" size={18} color={colors.textSecondary} />
          )}
          <Text style={[styles.signOutButtonText, { color: colors.textSecondary }]}>
            {t('authSection.signOut')}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
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
    gap: spacing.md,
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
    gap: spacing.xs,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Auto-Sync Banner
  autoSyncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  autoSyncIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoSyncTextContainer: {
    flex: 1,
    gap: 2,
  },
  autoSyncTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  autoSyncSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Sync Status
  syncStatusContainer: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  syncStatusLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  syncStatusValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.xs,
    lineHeight: 16,
  },

  // Actions
  actions: {
    gap: spacing.sm,
  },
  syncButtonContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default AccountInfoCard;
