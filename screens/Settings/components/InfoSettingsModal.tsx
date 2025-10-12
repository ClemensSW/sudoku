// screens/Settings/components/InfoSettingsModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import InfoSection from "./InfoSection/InfoSection";

interface InfoSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onAboutPress: () => void;
  onLegalPress: () => void;
}

const InfoSettingsModal: React.FC<InfoSettingsModalProps> = ({
  visible,
  onClose,
  onAboutPress,
  onLegalPress,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.info")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['75%', '90%']}
    >
      <InfoSection
        onAboutPress={onAboutPress}
        onLegalPress={onLegalPress}
      />
    </BottomSheetModal>
  );
};

export default InfoSettingsModal;
