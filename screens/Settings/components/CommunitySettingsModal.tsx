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
  showAlert?: (config: any) => void;
}

const CommunitySettingsModal: React.FC<CommunitySettingsModalProps> = ({
  visible,
  onClose,
  onShareApp,
  onSupportPress,
  showAlert,
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
      snapPoints={['75%', '90%']}
      managesBottomNav={false}
    >
      <CommunitySection
        onShareApp={onShareApp}
        onSupportPress={onSupportPress}
        showAlert={showAlert}
      />
    </BottomSheetModal>
  );
};

export default CommunitySettingsModal;
