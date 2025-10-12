// screens/Settings/components/CommunitySettingsModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import CommunitySection from "./CommunitySection/CommunitySection";

interface CommunitySettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onShareApp: () => void;
  onSupportPress: () => void;
}

const CommunitySettingsModal: React.FC<CommunitySettingsModalProps> = ({
  visible,
  onClose,
  onShareApp,
  onSupportPress,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.community")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['70%', '90%']}
    >
      <CommunitySection
        onShareApp={onShareApp}
        onSupportPress={onSupportPress}
      />
    </BottomSheetModal>
  );
};

export default CommunitySettingsModal;
