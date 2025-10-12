// screens/Settings/components/GameSettingsModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import GameSettings from "./GameSettings/GameSettings";

interface GameSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
  isDuoMode?: boolean;
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onSettingChange,
  isDuoMode = false,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.game")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['75%', '90%']}
    >
      <GameSettings
        settings={settings}
        onSettingChange={onSettingChange}
        isDuoMode={isDuoMode}
      />
    </BottomSheetModal>
  );
};

export default GameSettingsModal;
