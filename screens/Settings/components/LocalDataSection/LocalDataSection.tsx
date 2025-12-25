// screens/Settings/components/LocalDataSection/LocalDataSection.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { spacing, radius } from "@/utils/theme";
import { clearAllLocalData } from "@/utils/storage/clearAllData";
import Button from "@/components/Button/Button";
import WarningIcon from "@/assets/svg/warning.svg";

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
          <View style={[styles.infoContainer, { backgroundColor: '#DD636E20' }]}>
            <View style={styles.warningHeader}>
              <WarningIcon width={64} height={64} />
            </View>
            <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
              {t('localData.deleteDataDescription')}
            </Text>
          </View>

          {/* Delete Button */}
          <View style={styles.deleteButtonContainer}>
            <Button
              title={t('localData.deleteLocalData')}
              onPress={handleDeleteLocalData}
              disabled={isDeleting}
              loading={isDeleting}
              variant="primary"
              customColor="#DA4A54" // Keep original red color
              icon={!isDeleting ? <Feather name="trash-2" size={18} color={colors.buttonText} /> : undefined}
              iconPosition="left"
              style={styles.deleteButton}
            />
          </View>
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
    marginBottom: spacing.xxl * 2,
  },

  // Info Container
  infoContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  warningHeader: {
    alignItems: 'center',
    gap: spacing.md,
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },

  // Delete Button
  deleteButtonContainer: {
    margin: spacing.md,
  },
  deleteButton: {
    width: "100%",
    // Button component übernimmt: backgroundColor (#DA4A54), padding, borderRadius, text styling
  },
});

export default LocalDataSection;
