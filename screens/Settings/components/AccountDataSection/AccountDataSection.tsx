// screens/Settings/components/AccountDataSection/AccountDataSection.tsx
/**
 * AccountDataSection - Premium Design
 *
 * Konto & Daten Bereich mit:
 * - Synchronisierung (Auto-Sync Info + manueller Sync)
 * - Kontoverwaltung (Abmelden, Konto löschen)
 *
 * Premium-Elemente:
 * - Gradient Border
 * - Decorative Glow Orb
 * - Enhanced Shadows
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { triggerHaptic } from "@/utils/haptics";
import { spacing, radius } from "@/utils/theme";
import { manualSync, getSyncStatus, subscribeSyncStatus, SyncStatus } from "@/utils/cloudSync/syncService";
import { syncSuccessAlert } from "@/components/CustomAlert/AlertHelpers";

interface AccountDataSectionProps {
  onSignOut: () => void;
  onDeleteAccount: () => void;
  showAlert: (config: any) => void;
}

const AccountDataSection: React.FC<AccountDataSectionProps> = ({
  onSignOut,
  onDeleteAccount,
  showAlert,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
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
      console.log('[AccountDataSection] Manual sync requested');

      const result = await manualSync();

      if (result.success) {
        console.log('[AccountDataSection] Manual sync successful');
        triggerHaptic("success");
        showAlert(syncSuccessAlert());
      } else {
        console.error('[AccountDataSection] Manual sync failed:', result.errors);
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
      console.error('[AccountDataSection] Manual sync error:', error);
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

  const handleSignOut = () => {
    triggerHaptic("light");
    onSignOut();
  };

  const handleDeleteAccount = () => {
    triggerHaptic("light");
    onDeleteAccount();
  };

  return (
    <View style={styles.container}>
      {/* Sync Section - Premium Design */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t("accountData.syncSection")}
        </Text>

        {/* Premium Gradient Border Container */}
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
              styles.premiumContainer,
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

            {/* Auto-Sync Info */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              style={[styles.syncInfoContainer, { backgroundColor: progressColor + '10' }]}
            >
              <Text style={[styles.syncInfoTitle, { color: colors.textPrimary }]}>
                {t('authSection.autoSyncInfo')}
              </Text>
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
            </Animated.View>

            {/* Manual Sync Button - Dezent */}
            <Animated.View entering={FadeInDown.delay(250).duration(400)}>
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
                <Text style={[styles.syncButtonText, { color: progressColor }]}>
                  {isSyncing ? t('authSection.syncing') : t('authSection.syncNow')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Account Management Section */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t("accountData.accountSection")}
        </Text>

        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Sign Out Button */}
          <TouchableOpacity
            style={[styles.actionButton, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color={colors.textPrimary} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>
              {t('authSection.signOut')}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>
              {t('accountData.deleteAccount')}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xs,
  },

  // Premium Container
  gradientBorder: {
    borderRadius: radius.xl + 1.5,
    padding: 1.5,
  },
  premiumContainer: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    // Enhanced shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
  },

  // Sync Info
  syncInfoContainer: {
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  syncInfoTitle: {
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

  // Sync Button - Dezent
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
    fontSize: 15,
    fontWeight: '600',
  },

  // Account Management Section
  settingsGroup: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountDataSection;
