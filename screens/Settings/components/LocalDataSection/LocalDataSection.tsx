// screens/Settings/components/LocalDataSection/LocalDataSection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { spacing, radius } from "@/utils/theme";
import { clearAllLocalData } from "@/utils/storage/clearAllData";

interface LocalDataSectionProps {
  showAlert: (config: any) => void;
  onClose: () => void;
}

const LocalDataSection: React.FC<LocalDataSectionProps> = ({
  showAlert,
  onClose,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteLocalData = () => {
    triggerHaptic("light");

    // Show confirmation alert
    showAlert({
      title: t('localData.deleteDataConfirmTitle'),
      message: t('localData.deleteDataConfirmMessage'),
      type: 'warning',
      buttons: [
        {
          text: t('localData.cancel'),
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: t('localData.deleteLocalData'),
          style: 'destructive',
          onPress: async () => {
            await performDataDeletion();
          },
        },
      ],
    });
  };

  const performDataDeletion = async () => {
    try {
      setIsDeleting(true);
      triggerHaptic("light");
      console.log('[LocalDataSection] Deleting all local data...');

      await clearAllLocalData();

      // If we reach here, the app didn't reload (development mode)
      console.log('[LocalDataSection] ✅ Local data deleted (dev mode)');
      triggerHaptic("success");

      showAlert({
        title: t('localData.deleteDataSuccess'),
        message: t('localData.deleteDataSuccessMessage'),
        type: 'success',
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: () => {
              onClose();
            },
          },
        ],
      });
    } catch (error: any) {
      console.error('[LocalDataSection] ❌ Failed to delete local data:', error);
      triggerHaptic("error");

      showAlert({
        title: t('localData.deleteDataError'),
        message: error.message || t('localData.deleteDataErrorMessage'),
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
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Local Data Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t("localData.dataSection")}
        </Text>

        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Info Container */}
          <View style={[styles.infoContainer, { backgroundColor: colors.error + '10' }]}>
            <View style={styles.warningHeader}>
              <Feather name="alert-triangle" size={32} color={colors.error} />
            </View>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {t('localData.deleteDataDescription')}
            </Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDeleteLocalData}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="trash-2" size={18} color="#fff" />
            )}
            <Text style={styles.deleteButtonText}>
              {t('localData.deleteLocalData')}
            </Text>
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

  // Info Container
  infoContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  warningHeader: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },

  // Delete Button
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    margin: spacing.md,
    borderRadius: radius.md,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default LocalDataSection;
