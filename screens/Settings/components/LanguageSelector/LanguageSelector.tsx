// screens/Settings/components/LanguageSelector/LanguageSelector.tsx
import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Localization from "expo-localization";
import LanguageIcon from "@/assets/svg/language.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { getSortedLanguages, getLanguageLabel } from "@/locales/languages";

interface LanguageSelectorProps {
  onLanguageChange: (language: "de" | "en") => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { i18n, t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const { height } = useWindowDimensions();
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

    // Notify parent component (type assertion since we know it's "de" | "en")
    onLanguageChange(language as "de" | "en");

    // Close modal
    setShowModal(false);
  };

  const modalBg = theme.isDark ? "#1C1C1E" : "#FFFFFF";
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
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <BlurView intensity={80} style={StyleSheet.absoluteFill} tint={theme.isDark ? "dark" : "light"} />
        </TouchableOpacity>

        <View style={styles.modalContainer} pointerEvents="box-none">
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            style={[
              styles.modalContent,
              {
                backgroundColor: modalBg,
                borderColor: cardBorder,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {t("languageModal.title")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  setShowModal(false);
                }}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <Feather name="x" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Language Options - Scrollable */}
            <ScrollView
              style={[styles.languageOptionsScroll, { maxHeight: height * 0.6 }]}
              contentContainerStyle={styles.languageOptions}
              showsVerticalScrollIndicator={true}
            >
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
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Language Options
  languageOptionsScroll: {
    width: "100%",
  },
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
