// components/PathCard/components/ColorPickerModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import BottomSheetModal from "@/components/BottomSheetModal";
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
  /** Ob das Modal die Bottom Navigation verwalten soll. Default: true */
  managesBottomNav?: boolean;
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
  managesBottomNav = true,
}) => {
  const { t } = useTranslation("gameCompletion");
  const theme = useTheme();
  const { typography } = theme;

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
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("path.colorPicker.title")}
      isDark={isDark}
      textPrimaryColor={textPrimaryColor}
      surfaceColor={surfaceColor}
      borderColor={borderColor}
      snapPoints={['45%', '75%']}
      managesBottomNav={managesBottomNav}
    >
      <Text style={[styles.subtitle, { color: textSecondaryColor, fontSize: typography.size.sm }]}>
        {t("path.colorPicker.subtitle")}
      </Text>

      {/* Vertical Path Layout - Kreatives Pfad-Design */}
      <View style={styles.pathContainer}>
        {COLOR_OPTIONS.map((option, index) => {
          const isUnlocked = unlockedColors.includes(option.color);
          const isSelected = selectedColor === option.color;
          const pathName = t(`levels:paths.${option.pathId}.name`);
          const isLast = index === COLOR_OPTIONS.length - 1;

          // Theme-aware Farbe: Zeigt Light oder Dark Variante je nach Theme
          const displayColor = getColorFromHex(option.color, isDark);

          return (
            <View key={option.color} style={styles.pathNode}>
              {/* Path Connection Line - verbindet zum nächsten */}
              {!isLast && (
                <View
                  style={[
                    styles.pathLine,
                    {
                      backgroundColor: isUnlocked
                        ? (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")
                        : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
                    },
                  ]}
                />
              )}

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
                        fontSize: typography.size.md,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {pathName}
                  </Text>

                  {/* Unlock Level Info */}
                  {!isUnlocked && (
                    <Text style={[styles.unlockInfo, { color: textSecondaryColor, fontSize: typography.size.xs }]}>
                      {t("path.colorPicker.unlockAt", { level: option.unlockLevel })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    // fontSize set dynamically via theme.typography
    marginBottom: 32,
    lineHeight: 20,
    opacity: 0.8,
    textAlign: "center",
  },
  pathContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  pathNode: {
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  pathLine: {
    position: "absolute",
    bottom: -20,
    width: 3,
    height: 32,
    borderRadius: 1.5,
    zIndex: -1,
  },
  colorItem: {
    alignItems: "center",
    width: 200,
  },
  colorSquareContainer: {
    width: 140,
    height: 140,
    marginBottom: 12,
    padding: 4,
  },
  colorSquare: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
    marginBottom: 16,
  },
  colorName: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  unlockInfo: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.5,
    marginTop: 4,
  },
});

export default ColorPickerModal;
