// screens/Settings/components/GameSettingsModal.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import GameSettings from "./GameSettings/GameSettings";
import HelpSection from "./HelpSection/HelpSection";

interface GameSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
  isDuoMode?: boolean;
  onHowToPlay?: () => void;
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onSettingChange,
  isDuoMode = false,
  onHowToPlay,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark, typography } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.game")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['40%', '90%']}
      managesBottomNav={false}
    >
      <GameSettings
        settings={settings}
        onSettingChange={onSettingChange}
        isDuoMode={isDuoMode}
      />

      {/* Hilfe Section - nur wenn onHowToPlay vorhanden */}
      {onHowToPlay && (
        <View style={styles.helpSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: typography.size.xl }]}>
            {t("sections.help")}
          </Text>
          <HelpSection
            showGameFeatures={false}
            onAutoNotes={undefined}
            onHowToPlay={onHowToPlay}
          />
        </View>
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  helpSection: {
    marginTop: 24,
  },
  sectionTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default GameSettingsModal;
