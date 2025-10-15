// screens/Settings/components/AccountDataModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BottomSheetModal from "@/components/BottomSheetModal";
import AccountDataSection from "./AccountDataSection/AccountDataSection";

interface AccountDataModalProps {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

const AccountDataModal: React.FC<AccountDataModalProps> = ({
  visible,
  onClose,
  onSignOut,
  onDeleteAccount,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t("accountData.title")}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['60%', '80%']}
      managesBottomNav={false}
    >
      <AccountDataSection
        onSignOut={onSignOut}
        onDeleteAccount={onDeleteAccount}
      />
    </BottomSheetModal>
  );
};

export default AccountDataModal;
