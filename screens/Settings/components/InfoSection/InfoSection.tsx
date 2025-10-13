// InfoSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import InfoIcon from "@/assets/svg/info.svg";
import { spacing } from "@/utils/theme";

const customStyles = StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.xxl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
});

interface InfoSectionProps {
  onAboutPress: () => void;
  onLegalPress: () => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  onAboutPress,
  onLegalPress,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  const handleAboutPress = () => {
    triggerHaptic("light");
    onAboutPress();
  };

  const handleLegalPress = () => {
    triggerHaptic("light");
    onLegalPress();
  };

  return (
    <View
      style={[
        customStyles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* About button */}
      <TouchableOpacity
        style={customStyles.actionButton}
        onPress={handleAboutPress}
      >
        <View style={customStyles.actionIcon}>
          <InfoIcon
            width={48}
            height={48}
            color={theme.isDark ? "#8A78B4" : "#6E5AA0"}
          />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            {t("info.about")}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Legal button */}
      <TouchableOpacity
        style={[
          customStyles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={handleLegalPress}
      >
        <View style={customStyles.actionIcon}>
          <Feather
            name="file-text"
            size={48}
            color={theme.isDark ? "#8A78B4" : "#6E5AA0"}
          />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            {t("info.legal")}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default InfoSection;
