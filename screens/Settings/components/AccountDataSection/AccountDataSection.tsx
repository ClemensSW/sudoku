// screens/Settings/components/AccountDataSection/AccountDataSection.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { triggerHaptic } from "@/utils/haptics";
import { spacing, radius } from "@/utils/theme";
import { manualSync, getSyncStatus, subscribeSyncStatus, SyncStatus } from "@/utils/cloudSync/syncService";
import { syncSuccessAlert } from "@/components/CustomAlert/AlertHelpers";
import Button from "@/components/Button/Button";
import CloudsIcon from "@/assets/svg/clouds.svg";

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
    try {
      setIsSyncing(true);
      triggerHaptic("light");
      console.log('[AccountDataSection] Manual sync requested');

      const result = await manualSync();

      if (result.success) {
        console.log('[AccountDataSection] ✅ Manual sync successful');
        triggerHaptic("success");
        showAlert(syncSuccessAlert());
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
              <CloudsIcon width={64} height={64} />
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
          <View style={styles.syncButtonContainer}>
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
          </View>
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
    gap: spacing.md,
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  syncInfoHeader: {
    alignItems: 'center',
    gap: spacing.md,
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

  // Sync Button
  syncButtonContainer: {
    margin: spacing.md,
  },
  syncButton: {
    width: "100%",
    // Button component übernimmt: backgroundColor, padding, borderRadius, text styling
  },

  // Action Buttons
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
