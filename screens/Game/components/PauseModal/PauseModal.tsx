import React, { useEffect } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import Button from "@/components/Button/Button";
import styles from "./PauseModal.styles";

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  gameTime: number;
  errorsRemaining: number;
  maxErrors: number;
  difficulty: Difficulty;
}

interface TipItem {
  icon: string;
  title: string;
  description: string;
}

const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  gameTime,
  errorsRemaining,
  maxErrors,
  difficulty,
}) => {
  const { t } = useTranslation(['game', 'start']);
  const theme = useTheme();
  const colors = theme.colors;
  const isDarkMode = theme.isDark;

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get difficulty label from translations
  const getDifficultyLabel = (diff: Difficulty): string => {
    return t(`start:difficultyModal.difficulties.${diff}`);
  };

  // Tips data - loaded from translations
  const gameSpecificTips: TipItem[] = [
    { icon: "image", title: t('game:pause.gameSpecificTips.gallery.title'), description: t('game:pause.gameSpecificTips.gallery.description') },
    { icon: "star", title: t('game:pause.gameSpecificTips.favorites.title'), description: t('game:pause.gameSpecificTips.favorites.description') },
    { icon: "award", title: t('game:pause.gameSpecificTips.titles.title'), description: t('game:pause.gameSpecificTips.titles.description') },
    { icon: "edit-3", title: t('game:pause.gameSpecificTips.notes.title'), description: t('game:pause.gameSpecificTips.notes.description') },
    { icon: "map", title: t('game:pause.gameSpecificTips.levelPath.title'), description: t('game:pause.gameSpecificTips.levelPath.description') },
    { icon: "trending-up", title: t('game:pause.gameSpecificTips.difficulty.title'), description: t('game:pause.gameSpecificTips.difficulty.description') },
    { icon: "zap", title: t('game:pause.gameSpecificTips.streak.title'), description: t('game:pause.gameSpecificTips.streak.description') },
  ];

  const sudokuTips: TipItem[] = [
    { icon: "search", title: t('game:pause.sudokuTips.nakedSingles.title'), description: t('game:pause.sudokuTips.nakedSingles.description') },
    { icon: "grid", title: t('game:pause.sudokuTips.hiddenSingles.title'), description: t('game:pause.sudokuTips.hiddenSingles.description') },
    { icon: "columns", title: t('game:pause.sudokuTips.boxLine.title'), description: t('game:pause.sudokuTips.boxLine.description') },
    { icon: "square", title: t('game:pause.sudokuTips.nakedPairs.title'), description: t('game:pause.sudokuTips.nakedPairs.description') },
    { icon: "eye", title: t('game:pause.sudokuTips.scanning.title'), description: t('game:pause.sudokuTips.scanning.description') },
    { icon: "maximize-2", title: t('game:pause.sudokuTips.xWing.title'), description: t('game:pause.sudokuTips.xWing.description') },
    { icon: "clock", title: t('game:pause.sudokuTips.breaks.title'), description: t('game:pause.sudokuTips.breaks.description') },
    { icon: "skip-forward", title: t('game:pause.sudokuTips.skip.title'), description: t('game:pause.sudokuTips.skip.description') },
  ];

  const brainTips: TipItem[] = [
    { icon: "target", title: t('game:pause.brainTips.focus.title'), description: t('game:pause.brainTips.focus.description') },
    { icon: "zap", title: t('game:pause.brainTips.mentalEndurance.title'), description: t('game:pause.brainTips.mentalEndurance.description') },
    { icon: "cpu", title: t('game:pause.brainTips.memory.title'), description: t('game:pause.brainTips.memory.description') },
    { icon: "activity", title: t('game:pause.brainTips.neuroplasticity.title'), description: t('game:pause.brainTips.neuroplasticity.description') },
    { icon: "trending-up", title: t('game:pause.brainTips.cognitiveReserve.title'), description: t('game:pause.brainTips.cognitiveReserve.description') },
    { icon: "smile", title: t('game:pause.brainTips.stress.title'), description: t('game:pause.brainTips.stress.description') },
    { icon: "award", title: t('game:pause.brainTips.achievement.title'), description: t('game:pause.brainTips.achievement.description') },
    { icon: "repeat", title: t('game:pause.brainTips.flexibility.title'), description: t('game:pause.brainTips.flexibility.description') },
  ];

  // Get random tip from all categories combined
  const getRandomTipFromAll = (): TipItem => {
    const allTips = [...gameSpecificTips, ...sudokuTips, ...brainTips];
    return allTips[Math.floor(Math.random() * allTips.length)];
  };

  // Select ONE random tip from all categories (recalculate when modal opens)
  const selectedTip = React.useMemo(() => getRandomTipFromAll(), [visible]);

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Animate in
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.back(1.2))
      });
    } else {
      // Reset values when closing
      opacity.value = 0;
      scale.value = 0.9;
    }
  }, [visible]);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Render heart icons
  const renderHearts = () => {
    return Array.from({ length: maxErrors }).map((_, index) => {
      const isFilled = index < errorsRemaining;
      return (
        <Feather
          key={`heart-${index}`}
          name="heart"
          size={18}
          color={isFilled ? colors.primary : colors.buttonDisabled}
          style={{
            marginHorizontal: 2,
            opacity: isFilled ? 1 : 0.4,
          }}
        />
      );
    });
  };

  // Render a single tip item - vertikal angeordnet
  const renderTipItem = (tip: TipItem, index: number) => (
    <View
      key={`tip-${index}`}
      style={[
        styles.tipItem,
        {
          backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }
      ]}
    >
      <View style={[
        styles.tipIconContainer,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
      ]}>
        <Feather name={tip.icon as any} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
        {tip.title}
      </Text>
      <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
        {tip.description}
      </Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onResume}
      statusBarTranslucent={true}
    >
      <View style={styles.fullScreen}>
        {/* Blur overlay - nur für iOS */}
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={80}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.blurView}
          />
        ) : null}

        {/* Dark overlay - klickbar zum Schließen */}
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableOpacity
            style={[
              styles.darkOverlay,
              {
                backgroundColor: Platform.OS === "ios"
                  ? (isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)")
                  : (isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.8)")
              }
            ]}
            activeOpacity={1}
            onPress={onResume}
          />

          {/* Modal content */}
          <Animated.View
            style={[
              styles.modalContainer,
              { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" },
              modalStyle,
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('game:pause.title')}
              </Text>
            </View>

            {/* Status section */}
            <View style={[
              styles.statusContainer,
              {
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }
            ]}>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Feather name="clock" size={20} color={colors.textSecondary} />
                  <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                    {formatTime(gameTime)}
                  </Text>
                </View>

                <View style={styles.statusDivider} />

                <View style={styles.statusItem}>
                  <View style={styles.heartsContainer}>
                    {renderHearts()}
                  </View>
                </View>

                <View style={styles.statusDivider} />

                <View style={styles.statusItem}>
                  <Feather name="trending-up" size={20} color={colors.textSecondary} />
                  <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                    {getDifficultyLabel(difficulty)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tips section - nur EIN zufälliger Tipp aus allen Kategorien */}
            <View style={styles.tipsContainer}>
              <View style={styles.tipsSection}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {t('pause.tipSection')}
                </Text>
                {renderTipItem(selectedTip, 0)}
              </View>
            </View>

            {/* Resume button */}
            <View style={styles.buttonContainer}>
              <Button
                title={t('pause.resumeButton')}
                onPress={onResume}
                variant="primary"
                icon={<Feather name="play" size={20} color="#FFFFFF" />}
                iconPosition="left"
                style={{ width: "100%" }}
              />
            </View>
        </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PauseModal;
