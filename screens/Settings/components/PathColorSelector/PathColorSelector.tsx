// screens/Settings/components/PathColorSelector/PathColorSelector.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import PinselIcon from "@/assets/svg/pinsel.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { useProgressColor, useUpdateProgressColor } from "@/hooks/useProgressColor";
import { loadColorUnlock, syncUnlockedColors, ColorUnlockData, loadStats } from "@/utils/storage";
import { getLevelThresholds } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import ColorPickerModal from "@/screens/GameCompletion/components/PathCard/components/ColorPickerModal";

interface PathColorSelectorProps {}

const PathColorSelector: React.FC<PathColorSelectorProps> = () => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();
  const updateColor = useUpdateProgressColor();
  const [showModal, setShowModal] = useState(false);
  const [colorUnlockData, setColorUnlockData] = useState<ColorUnlockData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  // Load color data and level on mount
  useEffect(() => {
    const loadData = async () => {
      const stats = await loadStats();
      const currentXp = stats?.totalXP || 0;

      // Calculate level directly without using hook
      const thresholds = getLevelThresholds();
      let level = 0;
      for (let i = 0; i < thresholds.length; i++) {
        if (currentXp >= thresholds[i].xp) {
          level = thresholds[i].level;
        } else {
          break;
        }
      }
      setCurrentLevel(level);

      // Sync unlocked colors based on level
      await syncUnlockedColors(level);

      // Load current color unlock data
      const data = await loadColorUnlock();
      setColorUnlockData(data);
    };
    loadData();
  }, []);

  const handleColorSelect = async (color: string) => {
    await updateColor(color);
    const updatedData = await loadColorUnlock();
    setColorUnlockData(updatedData);
    triggerHaptic("success");
  };

  // Get color name for display
  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      "#4285F4": t("pathColor.colors.blue"),
      "#34A853": t("pathColor.colors.green"),
      "#F9AB00": t("pathColor.colors.yellow"),
      "#FBBC05": t("pathColor.colors.yellow"), // Old yellow
      "#EA4335": t("pathColor.colors.red"),
      "#7C4DFF": t("pathColor.colors.purple"),
      "#673AB7": t("pathColor.colors.purple"), // Old purple
    };
    return colorMap[hex] || t("pathColor.colors.blue");
  };

  if (!colorUnlockData) return null;

  return (
    <>
      {/* Path Color Button - same design as LanguageSelector */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => {
          triggerHaptic("light");
          setShowModal(true);
        }}
      >
        <View style={styles.actionIcon}>
          <PinselIcon width={48} height={48} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
            {t("appearance.pathColor")}
          </Text>
          <View style={styles.colorPreview}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: progressColor }
              ]}
            />
            <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
              {getColorName(colorUnlockData.selectedColor)}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Color Picker Modal */}
      {showModal && (
        <ColorPickerModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          selectedColor={colorUnlockData.selectedColor}
          unlockedColors={colorUnlockData.unlockedColors}
          onSelectColor={handleColorSelect}
          currentLevel={currentLevel}
          isDark={theme.isDark}
          textPrimaryColor={colors.textPrimary}
          textSecondaryColor={colors.textSecondary}
          surfaceColor={colors.surface}
          borderColor={colors.border}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Button styles matching LanguageSelector design
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
  colorPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default PathColorSelector;
