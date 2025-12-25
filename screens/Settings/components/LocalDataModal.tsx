// screens/Settings/components/LocalDataModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import LocalDataSection from "./LocalDataSection/LocalDataSection";

interface LocalDataModalProps {
  visible: boolean;
  onClose: () => void;
  showAlert: (config: any) => void;
}

const LocalDataModal: React.FC<LocalDataModalProps> = ({
  visible,
  onClose,
  showAlert,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("localData.title")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['50%', '60%']}
      managesBottomNav={false}
    >
      <LocalDataSection
        showAlert={showAlert}
        onClose={onClose}
      />
    </BottomSheetModal>
  );
};

export default LocalDataModal;
