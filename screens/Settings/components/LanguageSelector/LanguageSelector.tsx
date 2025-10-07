// screens/Settings/components/LanguageSelector/LanguageSelector.tsx
import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import LanguageIcon from "@/assets/svg/language.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { getSortedLanguages, getLanguageLabel } from "@/locales/languages";
import BaseModal from "@/components/BaseModal/BaseModal";

interface LanguageSelectorProps {
  onLanguageChange: (language: "de" | "en" | "hi") => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { i18n, t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const [showModal, setShowModal] = useState(false);

  const currentLanguage = i18n.language;

  // Gerätesprache ermitteln
  const deviceLanguageCode = Localization.getLocales()[0]?.languageCode;

  // Sprachen intelligent sortieren
  const sortedLanguages = useMemo(
    () => getSortedLanguages(deviceLanguageCode),
    [deviceLanguageCode]
  );

  const handleLanguageSelect = async (language: string) => {
    if (language === currentLanguage) {
      setShowModal(false);
      return;
    }

    triggerHaptic("light");

    // Change language in i18next
    await i18n.changeLanguage(language);

    // Notify parent component (type assertion since we know it's "de" | "en" | "hi")
    onLanguageChange(language as "de" | "en" | "hi");

    // Close modal
    setShowModal(false);
  };

  const cardBg = theme.isDark ? "rgba(255,255,255,0.06)" : colors.surface;
  const cardBorder = theme.isDark ? "rgba(255,255,255,0.10)" : colors.border;
  const selectedBg = theme.isDark ? "rgba(138, 180, 248, 0.15)" : "rgba(66, 133, 244, 0.08)";
  const selectedBorder = theme.isDark ? "rgba(138, 180, 248, 0.4)" : "rgba(66, 133, 244, 0.3)";

  return (
    <>
      {/* Language Button - same design as other settings buttons */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => {
          triggerHaptic("light");
          setShowModal(true);
        }}
      >
        <View style={styles.actionIcon}>
          <LanguageIcon width={48} height={48} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
            {t("appearance.language")}
          </Text>
          <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
            {getLanguageLabel(currentLanguage)}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <BaseModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={t("languageModal.title")}
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        surfaceColor={colors.surface}
        borderColor={cardBorder}
        scrollable={true}
        maxHeightRatio={0.6}
      >
        {/* Language Options */}
        <View style={styles.languageOptions}>
          {sortedLanguages.map((language) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleLanguageSelect(language.code)}
              style={[
                styles.languageOption,
                {
                  backgroundColor: currentLanguage === language.code ? selectedBg : cardBg,
                  borderColor: currentLanguage === language.code ? selectedBorder : cardBorder,
                },
              ]}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flagEmoji}>{language.flag}</Text>
                <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                  {language.name}
                </Text>
              </View>
              {currentLanguage === language.code && (
                <Feather name="check" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  // Button styles matching HelpSection/ActionsSection design
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },

  // Language Options
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageName: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default LanguageSelector;
