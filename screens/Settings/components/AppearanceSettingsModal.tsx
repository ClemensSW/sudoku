// screens/Settings/components/AppearanceSettingsModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import DesignGroup from "./DesignGroup";

interface AppearanceSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  themeValue: "light" | "dark";
  onThemeChange: (value: "light" | "dark") => void;
  onLanguageChange: (language: "de" | "en" | "hi") => void;
  isChangingTheme: boolean;
}

const AppearanceSettingsModal: React.FC<AppearanceSettingsModalProps> = ({
  visible,
  onClose,
  themeValue,
  onThemeChange,
  onLanguageChange,
  isChangingTheme,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("categories.design")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['40%', '90%']}
      managesBottomNav={false}
    >
      <DesignGroup
        themeValue={themeValue}
        onThemeChange={onThemeChange}
        onLanguageChange={onLanguageChange}
        isChanging={isChangingTheme}
      />
    </BottomSheetModal>
  );
};

export default AppearanceSettingsModal;
