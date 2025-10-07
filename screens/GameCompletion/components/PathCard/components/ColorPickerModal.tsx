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
                {/* Color Square Container - verhindert Border-Overflow */}
                <View style={styles.colorSquareContainer}>
                  {/* Color Square - Modern Design */}
                  <View
                    style={[
                      styles.colorSquare,
                      {
                        backgroundColor: displayColor,
                        borderWidth: isSelected ? 3 : 1.5,
                        borderColor: isSelected
                          ? (isDark ? "#ffffff" : "#000000")
                          : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                      },
                      !isUnlocked && styles.lockedSquare,
                    ]}
                  >
                  {/* Gradient Overlay für Tiefe */}
                  {isUnlocked && (
                    <View style={[styles.gradientOverlay, { backgroundColor: `${displayColor}20` }]} />
                  )}

                  {/* Lock Icon für gesperrte Farben */}
                  {!isUnlocked && (
                    <View
                      style={[
                        styles.lockOverlay,
                        {
                          backgroundColor: isDark
                            ? "rgba(0,0,0,0.75)"
                            : "rgba(255,255,255,0.75)",
                        },
                      ]}
                    >
                      <Feather
                        name="lock"
                        size={28}
                        color={isDark ? "#ffffff" : "#000000"}
                        style={{ opacity: 0.9 }}
                      />
                    </View>
                  )}

                  {/* Check Icon für ausgewählte Farbe - Moderner Badge-Style */}
                  {isSelected && isUnlocked && (
                    <View
                      style={[
                        styles.checkBadge,
                        {
                          backgroundColor: isDark ? "#ffffff" : "#000000",
                        }
                      ]}
                    >
                      <Feather
                        name="check"
                        size={16}
                        color={displayColor}
                        strokeWidth={3}
                      />
                    </View>
                  )}
                  </View>
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
    opacity: 0.8,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  colorItemWrapper: {
    width: "48%", // Prozentual für 2 Spalten
    minWidth: 150,
    maxWidth: 168,
  },
  colorItem: {
    width: "100%",
    alignItems: "center",
  },
  colorSquareContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 12,
    padding: 4, // Platz für Border & Scale-Animation
  },
  colorSquare: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // Modern shadow without elevation (no transparency issues)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android: Soft elevation
    elevation: 6,
  },
  lockedSquare: {
    opacity: 0.4,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // Backdrop blur effect simulation
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    // Modern drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorInfo: {
    width: "100%",
    alignItems: "center",
    gap: 6,
  },
  colorName: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  unlockInfo: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.6,
    marginTop: 2,
  },
});

export default ColorPickerModal;
