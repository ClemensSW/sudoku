// components/PathCard/components/ColorPickerModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { triggerHaptic } from "@/utils/haptics";
import BaseModal from "@/components/BaseModal/BaseModal";
import { getColorFromHex } from "@/utils/pathColors";

interface ColorOption {
  color: string;
  pathId: string;
  unlockLevel: number;
}

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedColor: string;
  unlockedColors: string[];
  onSelectColor: (color: string) => void;
  currentLevel: number;
  isDark: boolean;
  textPrimaryColor: string;
  textSecondaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

// Definiere alle verfügbaren Farben mit ihren Unlock-Levels
// Verwendet aktualisierte Light Mode Varianten
const COLOR_OPTIONS: ColorOption[] = [
  { color: "#4285F4", pathId: "fundamentals", unlockLevel: 0 },
  { color: "#34A853", pathId: "insight", unlockLevel: 5 },
  { color: "#F9AB00", pathId: "mastery", unlockLevel: 10 },
  { color: "#EA4335", pathId: "wisdom", unlockLevel: 15 },
  { color: "#7C4DFF", pathId: "transcendence", unlockLevel: 20 },
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  selectedColor,
  unlockedColors,
  onSelectColor,
  currentLevel,
  isDark,
  textPrimaryColor,
  textSecondaryColor,
  surfaceColor,
  borderColor,
}) => {
  const { t } = useTranslation("gameCompletion");

  const handleColorSelect = (color: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      triggerHaptic("error");
      return;
    }

    triggerHaptic("success");
    onSelectColor(color);
    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={t("path.colorPicker.title")}
      isDark={isDark}
      textPrimaryColor={textPrimaryColor}
      surfaceColor={surfaceColor}
      borderColor={borderColor}
      scrollable={true}
      maxHeightRatio={0.6}
    >
      <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
        {t("path.colorPicker.subtitle")}
      </Text>

      {/* Color Grid - 2 Spalten Layout mit fester Breite */}
      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map((option) => {
          const isUnlocked = unlockedColors.includes(option.color);
          const isSelected = selectedColor === option.color;
          const pathName = t(`levels:paths.${option.pathId}.name`);

          // Theme-aware Farbe: Zeigt Light oder Dark Variante je nach Theme
          const displayColor = getColorFromHex(option.color, isDark);

          return (
            <View key={option.color} style={styles.colorItemWrapper}>
              <TouchableOpacity
                style={styles.colorItem}
                onPress={() => handleColorSelect(option.color, isUnlocked)}
                activeOpacity={isUnlocked ? 0.7 : 1}
                disabled={!isUnlocked}
              >
                {/* Color Square */}
                <View
                  style={[
                    styles.colorSquare,
                    {
                      backgroundColor: displayColor, // Theme-aware Farbe
                      opacity: isUnlocked ? 1 : 0.3,
                      borderWidth: isSelected ? 4 : 0,
                      borderColor: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  {/* Lock Icon für gesperrte Farben */}
                  {!isUnlocked && (
                    <View
                      style={[
                        styles.lockOverlay,
                        {
                          backgroundColor: isDark
                            ? "rgba(0,0,0,0.6)"
                            : "rgba(255,255,255,0.6)",
                        },
                      ]}
                    >
                      <Feather
                        name="lock"
                        size={32}
                        color={isDark ? "#ffffff" : "#000000"}
                      />
                    </View>
                  )}

                  {/* Check Icon für ausgewählte Farbe */}
                  {isSelected && isUnlocked && (
                    <View style={styles.checkOverlay}>
                      <Feather
                        name="check"
                        size={36}
                        color={isDark ? "#ffffff" : "#000000"}
                      />
                    </View>
                  )}
                </View>

                {/* Color Info unterhalb des Quadrats */}
                <View style={styles.colorInfo}>
                  <Text
                    style={[
                      styles.colorName,
                      {
                        color: isUnlocked
                          ? textPrimaryColor
                          : textSecondaryColor,
                        opacity: isUnlocked ? 1 : 0.6,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {pathName}
                  </Text>

                  {/* Unlock Level Info */}
                  {!isUnlocked && (
                    <Text style={[styles.unlockInfo, { color: textSecondaryColor }]}>
                      {t("path.colorPicker.unlockAt", { level: option.unlockLevel })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  colorItemWrapper: {
    // Feste Breite für 2 Spalten: (100% - gap) / 2
    // Bei maxWidth 400px und padding 24px: (400 - 48 - 16) / 2 = 168px
    width: 168,
    maxWidth: "47%", // Fallback für kleinere Bildschirme
  },
  colorItem: {
    width: "100%",
    alignItems: "center",
  },
  colorSquare: {
    width: "100%",
    maxWidth: 168, // Maximale Breite begrenzen
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 12,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  colorInfo: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  colorName: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },
  unlockInfo: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
});

export default ColorPickerModal;
