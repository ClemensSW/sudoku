// screens/Settings/components/AccountDataSection/AccountDataSection.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { triggerHaptic } from "@/utils/haptics";
import { spacing, radius } from "@/utils/theme";
import { manualSync, getSyncStatus, SyncStatus } from "@/utils/cloudSync/syncService";

interface AccountDataSectionProps {
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

const AccountDataSection: React.FC<AccountDataSectionProps> = ({
  onSignOut,
  onDeleteAccount,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();
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
      triggerHaptic("light");
      console.log('[AccountDataSection] Manual sync requested');

      const result = await manualSync();

      if (result.success) {
        console.log('[AccountDataSection] ✅ Manual sync successful');
        triggerHaptic("success");
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
        console.error('[AccountDataSection] ⚠️ Manual sync failed:', result.errors);
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
      console.error('[AccountDataSection] ❌ Manual sync error:', error);
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
      {/* Sync & Backup Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t("accountData.syncSection")}
        </Text>

        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Auto-Sync Info */}
          <View style={[styles.syncInfoContainer, { backgroundColor: progressColor + '10' }]}>
            <View style={styles.syncInfoHeader}>
              <Feather name="cloud-lightning" size={16} color={progressColor} />
              <Text style={[styles.syncInfoTitle, { color: colors.textPrimary }]}>
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
          <TouchableOpacity
            style={[styles.syncButton, { backgroundColor: progressColor }]}
            onPress={handleManualSync}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="refresh-cw" size={18} color="#fff" />
            )}
            <Text style={styles.syncButtonText}>
              {isSyncing ? t('authSection.syncing') : t('authSection.syncNow')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Management Section */}
      <View style={styles.section}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xs,
  },
  settingsGroup: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Sync Info
  syncInfoContainer: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  syncInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  syncInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.md + 8,
  },
  lastSyncText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Sync Button
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    margin: spacing.md,
    borderRadius: radius.md,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Action Buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountDataSection;
