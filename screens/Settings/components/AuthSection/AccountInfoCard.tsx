// screens/Settings/components/AuthSection/AccountInfoCard.tsx
/**
 * AccountInfoCard - Premium Design
 *
 * Zeigt Account-Informationen wenn User eingeloggt ist:
 * - User Email/Name mit Google Profilbild (mit Glow-Effekt)
 * - Auto-Sync Info mit Cloud-Icon
 * - Manual Sync Button (dezent, da Sync automatisch passiert)
 *
 * Premium-Elemente:
 * - Gradient Border
 * - Decorative Glow Orb
 * - Enhanced Shadows
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { manualSync, getSyncStatus, subscribeSyncStatus, SyncStatus } from '@/utils/cloudSync/syncService';
import { syncSuccessAlert } from '@/components/CustomAlert/AlertHelpers';
import { triggerHaptic } from '@/utils/haptics';

interface AccountInfoCardProps {
  onSignOut?: () => void;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ onSignOut }) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const { colors, typography } = theme;
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
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      triggerHaptic("light");
      console.log('[AccountInfoCard] Manual sync requested');

      const result = await manualSync();

      if (result.success) {
        console.log('[AccountInfoCard] Manual sync successful');
        triggerHaptic("success");
        showAlert(syncSuccessAlert());
      } else {
        console.error('[AccountInfoCard] Manual sync failed:', result.errors);
        triggerHaptic("error");
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
      console.error('[AccountInfoCard] Manual sync error:', error);
      triggerHaptic("error");
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
      style={styles.outerContainer}
    >
      {/* Gradient Border */}
      <LinearGradient
        colors={[
          progressColor,
          `${progressColor}60`,
          `${progressColor}20`,
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              shadowColor: progressColor,
            },
          ]}
        >
          {/* Decorative Glow Orb */}
          <View
            style={[
              styles.glowOrb,
              { backgroundColor: progressColor },
            ]}
          />

          {/* User Info Header */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.header}
          >
            {/* Profile Photo with Glow */}
            <View
              style={[
                styles.avatarGlow,
                {
                  shadowColor: progressColor,
                },
              ]}
            >
              <View style={[styles.avatarContainer, { borderColor: progressColor }]}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: progressColor + '20' }]}>
                    <Feather name="user" size={36} color={progressColor} />
                  </View>
                )}
              </View>
            </View>

            {/* User Details */}
            <View style={styles.userInfo}>
              <Text style={[styles.displayName, { color: colors.textPrimary, fontSize: typography.size.lg }]} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={[styles.email, { color: colors.textSecondary, fontSize: typography.size.sm }]} numberOfLines={1}>
                {email}
              </Text>
            </View>
          </Animated.View>

          {/* Auto-Sync Info with Last Sync */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(400)}
            style={[styles.syncInfo, { backgroundColor: progressColor + '10' }]}
          >
            <Text style={[styles.syncInfoText, { color: colors.textPrimary, fontSize: typography.size.sm }]}>
              {t('authSection.autoSyncInfo')}
            </Text>
            <View style={styles.syncStatusRow}>
              <Feather
                name={syncStatus.lastError ? 'alert-circle' : 'check-circle'}
                size={14}
                color={syncStatus.lastError ? colors.error : progressColor}
              />
              <Text style={[styles.lastSyncText, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
                {t('authSection.lastSync')}: {formatLastSync(syncStatus.lastSync)}
              </Text>
            </View>
          </Animated.View>

          {/* Manual Sync Button - Dezent (da Sync automatisch passiert) */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <TouchableOpacity
              style={[
                styles.syncButton,
                {
                  backgroundColor: progressColor + '15',
                  borderColor: progressColor + '30',
                  opacity: isSyncing ? 0.7 : 1,
                },
              ]}
              onPress={handleManualSync}
              disabled={isSyncing}
              activeOpacity={0.7}
            >
              <Feather
                name="refresh-cw"
                size={16}
                color={progressColor}
                style={isSyncing ? { opacity: 0.5 } : undefined}
              />
              <Text style={[styles.syncButtonText, { color: progressColor, fontSize: typography.size.sm }]}>
                {isSyncing ? t('authSection.syncing') : t('authSection.syncNow')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: spacing.xxl,
  },

  gradientBorder: {
    borderRadius: radius.xl + 1.5,
    padding: 1.5,
  },

  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
    // Enhanced shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  // Decorative Glow Orb
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },

  avatarGlow: {
    // Glow effect around avatar
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
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
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  email: {
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
  },

  // Auto-Sync Info
  syncInfo: {
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },

  syncInfoText: {
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
  },

  // Sync Button - Dezent (optional, nicht prominent)
  syncButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  syncButtonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
});

export default AccountInfoCard;
