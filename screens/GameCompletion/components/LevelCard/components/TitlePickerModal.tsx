// components/LevelCard/components/TitlePickerModal.tsx
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { triggerHaptic } from "@/utils/haptics";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";

interface TitleOption {
  name: string;
  level: number;
  isUnlocked: boolean;
}

interface TitlePickerModalProps {
  visible: boolean;
  onClose: () => void;
  titles: TitleOption[];
  selectedTitleIndex: number | null;
  onSelectTitle: (levelIndex: number | null) => void;
  isDark: boolean;
  textPrimaryColor: string;
  textSecondaryColor: string;
  surfaceColor: string;
  borderColor: string;
  progressColor: string;
  /** Ob das Modal die Bottom Navigation verwalten soll. Default: true */
  managesBottomNav?: boolean;
}

const TitlePickerModal: React.FC<TitlePickerModalProps> = ({
  visible,
  onClose,
  titles,
  selectedTitleIndex,
  onSelectTitle,
  isDark,
  textPrimaryColor,
  textSecondaryColor,
  surfaceColor,
  borderColor,
  progressColor,
  managesBottomNav = true,
}) => {
  const { t } = useTranslation("gameCompletion");
  const { typography } = useTheme();

  const handleTitleSelect = (levelIndex: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      triggerHaptic("error");
      return;
    }

    triggerHaptic("success");
    onSelectTitle(levelIndex);
    // Modal bleibt offen, damit User frei zwischen Titeln wechseln kann
  };

  const handleClearTitle = () => {
    triggerHaptic("light");
    onSelectTitle(null);
    // Modal bleibt offen
  };

  // Get level data for descriptions - memoized
  const allLevels = useMemo(() => getLevels(), []);

  // Get selected title data with description - memoized
  const selectedTitleData = useMemo(() => {
    return selectedTitleIndex !== null
      ? titles.find(t => t.level === selectedTitleIndex)
      : null;
  }, [selectedTitleIndex, titles]);

  const selectedTitle = selectedTitleData?.name || null;
  const selectedTitleDescription = selectedTitleData
    ? allLevels[selectedTitleData.level]?.message || ""
    : "";

  // Sortiere Titel: Freigeschaltete (neueste zuerst), dann gesperrte (aufsteigend) - memoized
  const { unlockedTitles, lockedTitles } = useMemo(() => {
    const unlocked = titles.filter(t => t.isUnlocked).reverse();
    const locked = titles.filter(t => !t.isUnlocked);
    return { unlockedTitles: unlocked, lockedTitles: locked };
  }, [titles]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("titlePicker.title")}
      isDark={isDark}
      textPrimaryColor={textPrimaryColor}
      surfaceColor={surfaceColor}
      borderColor={borderColor}
      snapPoints={['50%', '90%']}
      managesBottomNav={managesBottomNav}
    >
      <Text style={[styles.subtitle, { color: textSecondaryColor, fontSize: typography.size.sm }]}>
        {t("titlePicker.subtitle")}
      </Text>

      {/* Aktuell ausgewählter Titel mit Beschreibung */}
      {selectedTitle && selectedTitleData && (
        <View
          style={[
            styles.currentTitleCard,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
              borderColor: progressColor,
            },
          ]}
        >
          <View style={styles.currentTitleHeader}>
            <Feather name="award" size={18} color={progressColor} />
            <Text
              style={[
                styles.currentTitleLabel,
                { color: textSecondaryColor, fontSize: typography.size.xs },
              ]}
            >
              {t("level.currentTitle")}
            </Text>
          </View>
          <Text
            style={[
              styles.currentTitleName,
              { color: textPrimaryColor, fontSize: typography.size.xl },
            ]}
          >
            {selectedTitle}
          </Text>
          {selectedTitleDescription && (
            <ScrollView
              style={styles.descriptionScrollContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Text
                style={[
                  styles.currentTitleDescription,
                  { color: textSecondaryColor, fontSize: typography.size.sm },
                ]}
              >
                {selectedTitleDescription}
              </Text>
            </ScrollView>
          )}
        </View>
      )}

      {/* "Ohne Titel" Option */}
      <TouchableOpacity
        style={[
          styles.noTitleButton,
          {
            backgroundColor: selectedTitleIndex === null
              ? progressColor
              : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
            borderColor: selectedTitleIndex === null
              ? "transparent"
              : borderColor,
          },
        ]}
        onPress={handleClearTitle}
      >
        <Feather
          name="slash"
          size={20}
          color={selectedTitleIndex === null ? "#ffffff" : textSecondaryColor}
        />
        <Text
          style={[
            styles.noTitleText,
            {
              color: selectedTitleIndex === null ? "#ffffff" : textPrimaryColor,
              fontSize: typography.size.sm,
            },
          ]}
        >
          {t("level.noTitle")}
        </Text>
        {selectedTitleIndex === null && (
          <Feather name="check" size={18} color="#ffffff" />
        )}
      </TouchableOpacity>

      {/* Vertikales Pfad-Layout */}
      <View style={styles.pathContainer}>
        {/* Freigeschaltete Titel */}
        {unlockedTitles.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: progressColor, fontSize: typography.size.xs }]}>
              {t("titlePicker.unlocked")}
            </Text>
            {unlockedTitles.map((option, index) => {
              const isSelected = selectedTitleIndex === option.level;
              const isLast = index === unlockedTitles.length - 1;

              return (
                <View key={`unlocked-${option.level}`} style={styles.pathNode}>
                  {/* Path Connection Line */}
                  {!isLast && (
                    <View
                      style={[
                        styles.pathLine,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.15)",
                        },
                      ]}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.titleItem}
                    onPress={() => handleTitleSelect(option.level, true)}
                    activeOpacity={0.7}
                  >
                    {/* Title Card */}
                    <View
                      style={[
                        styles.titleCard,
                        {
                          backgroundColor: surfaceColor,
                          borderWidth: isSelected ? 3 : 1.5,
                          borderColor: isSelected
                            ? progressColor
                            : borderColor,
                          transform: [{ scale: isSelected ? 1.02 : 1 }],
                        },
                      ]}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <View
                          style={[
                            styles.checkBadge,
                            { backgroundColor: progressColor },
                          ]}
                        >
                          <Feather name="check" size={16} color="#ffffff" strokeWidth={3} />
                        </View>
                      )}

                      <View style={styles.titleContent}>
                        <Text
                          style={[
                            styles.titleName,
                            { color: textPrimaryColor, fontSize: typography.size.md },
                          ]}
                          numberOfLines={2}
                        >
                          {option.name}
                        </Text>
                        <Text
                          style={[
                            styles.levelInfo,
                            { color: textSecondaryColor, fontSize: typography.size.xs },
                          ]}
                        >
                          {t("level.title")} {option.level + 1}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}

        {/* Gesperrte Titel */}
        {lockedTitles.length > 0 && (
          <>
            {unlockedTitles.length > 0 && (
              <View
                style={[
                  styles.separator,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
              />
            )}
            <Text style={[styles.sectionTitle, { color: textSecondaryColor, opacity: 0.6, fontSize: typography.size.xs }]}>
              {t("titlePicker.locked")}
            </Text>
            {lockedTitles.map((option, index) => {
              const isLast = index === lockedTitles.length - 1;

              return (
                <View key={`locked-${option.level}`} style={styles.pathNode}>
                  {/* Path Connection Line */}
                  {!isLast && (
                    <View
                      style={[
                        styles.pathLine,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.titleItem}
                    onPress={() => handleTitleSelect(option.level, false)}
                    activeOpacity={1}
                    disabled={true}
                  >
                    {/* Title Card - Locked */}
                    <View
                      style={[
                        styles.titleCard,
                        styles.lockedCard,
                        {
                          backgroundColor: surfaceColor,
                          borderColor: borderColor,
                        },
                      ]}
                    >
                      {/* Lock Overlay */}
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
                          size={24}
                          color={isDark ? "#ffffff" : "#000000"}
                          style={{ opacity: 0.9 }}
                        />
                      </View>

                      <View style={styles.titleContent}>
                        <Text
                          style={[
                            styles.titleName,
                            { color: textSecondaryColor, opacity: 0.6, fontSize: typography.size.md },
                          ]}
                          numberOfLines={2}
                        >
                          {option.name}
                        </Text>
                        <Text
                          style={[
                            styles.unlockInfo,
                            { color: textSecondaryColor, fontSize: typography.size.xs },
                          ]}
                        >
                          {t("titlePicker.unlockAt", { level: option.level + 1 })}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    // fontSize set dynamically via theme.typography
    marginBottom: 20,
    lineHeight: 20,
    opacity: 0.8,
    textAlign: "center",
  },
  currentTitleCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
    gap: 8,
    minHeight: 160,
    maxHeight: 160,
  },
  currentTitleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  currentTitleLabel: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },
  currentTitleName: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  descriptionScrollContainer: {
    flex: 1,
    marginTop: 4,
  },
  currentTitleDescription: {
    // fontSize set dynamically via theme.typography
    lineHeight: 20,
    opacity: 0.8,
  },
  noTitleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  noTitleText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  pathContainer: {
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 40,
  },
  sectionTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  pathNode: {
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  pathLine: {
    position: "absolute",
    bottom: -16,
    width: 3,
    height: 24,
    borderRadius: 1.5,
    zIndex: -1,
  },
  titleItem: {
    alignItems: "center",
    width: 280,
  },
  titleCard: {
    width: "100%",
    minHeight: 80,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  lockedCard: {
    opacity: 0.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  titleContent: {
    alignItems: "center",
    gap: 4,
  },
  titleName: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  levelInfo: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    opacity: 0.7,
  },
  unlockInfo: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    opacity: 0.6,
    marginTop: 2,
  },
  separator: {
    width: 60,
    height: 2,
    borderRadius: 1,
    marginVertical: 20,
  },
});

export default TitlePickerModal;
