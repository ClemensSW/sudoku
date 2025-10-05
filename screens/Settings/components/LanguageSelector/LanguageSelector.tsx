// screens/Settings/components/LanguageSelector/LanguageSelector.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import LanguageIcon from "@/assets/svg/language.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";

interface LanguageSelectorProps {
  onLanguageChange: (language: "de" | "en") => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { i18n, t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const [showModal, setShowModal] = useState(false);

  const currentLanguage = i18n.language as "de" | "en";

  const handleLanguageSelect = async (language: "de" | "en") => {
    if (language === currentLanguage) {
      setShowModal(false);
      return;
    }

    triggerHaptic("light");

    // Change language in i18next
    await i18n.changeLanguage(language);

    // Notify parent component
    onLanguageChange(language);

    // Close modal
    setShowModal(false);
  };

  const getLanguageLabel = () => {
    return currentLanguage === "de" ? "Deutsch" : "English";
  };

  const cardBg = theme.isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF";
  const cardBorder = theme.isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const modalBg = theme.isDark ? "#1C1C1E" : "#FFFFFF";
  const selectedBg = theme.isDark ? "rgba(76, 175, 80, 0.15)" : "rgba(76, 175, 80, 0.10)";
  const selectedBorder = theme.isDark ? "rgba(76, 175, 80, 0.4)" : "rgba(76, 175, 80, 0.3)";

  return (
    <>
      <Pressable
        onPress={() => {
          triggerHaptic("light");
          setShowModal(true);
        }}
        style={({ pressed }) => [
          styles.settingCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, { backgroundColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" }]}>
            <LanguageIcon width={22} height={22} />
          </View>
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            {t("appearance.language")}
          </Text>
        </View>

        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {getLanguageLabel()}
          </Text>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
      </Pressable>

      {/* Language Selection Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <BlurView intensity={80} style={StyleSheet.absoluteFill} tint={theme.isDark ? "dark" : "light"} />
        </Pressable>

        <View style={styles.modalContainer}>
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
              <Pressable
                onPress={() => {
                  triggerHaptic("light");
                  setShowModal(false);
                }}
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Feather name="x" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            {/* Language Options */}
            <View style={styles.languageOptions}>
              {/* German */}
              <Pressable
                onPress={() => handleLanguageSelect("de")}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor: currentLanguage === "de" ? selectedBg : cardBg,
                    borderColor: currentLanguage === "de" ? selectedBorder : cardBorder,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flagEmoji}>🇩🇪</Text>
                  <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                    {t("languageModal.german")}
                  </Text>
                </View>
                {currentLanguage === "de" && (
                  <Feather name="check" size={22} color={colors.primary} />
                )}
              </Pressable>

              {/* English */}
              <Pressable
                onPress={() => handleLanguageSelect("en")}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor: currentLanguage === "en" ? selectedBg : cardBg,
                    borderColor: currentLanguage === "en" ? selectedBorder : cardBorder,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flagEmoji}>🇬🇧</Text>
                  <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                    {t("languageModal.english")}
                  </Text>
                </View>
                {currentLanguage === "en" && (
                  <Feather name="check" size={22} color={colors.primary} />
                )}
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Setting Card Styles
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: "500",
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
