// screens/Settings/components/HelpSettingsModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import HelpSection from "./HelpSection/HelpSection";

interface HelpSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onHowToPlay: () => void;
}

const HelpSettingsModal: React.FC<HelpSettingsModalProps> = ({
  visible,
  onClose,
  onHowToPlay,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.help")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['75%', '90%']}
      managesBottomNav={false}
    >
      <HelpSection
        showGameFeatures={false}
        onAutoNotes={undefined}
        onHowToPlay={onHowToPlay}
      />
    </BottomSheetModal>
  );
};

export default HelpSettingsModal;
