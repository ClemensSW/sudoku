// screens/SettingsScreen/components/GameSettings/GameSettings.tsx
import React from "react";
import { View, Text, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import VibrationIcon from "@/assets/svg/vibration.svg";
import SelectionIcon from "@/assets/svg/selection.svg";
import styles from "./GameSettings.styles";

interface GameSettingsProps {
  settings: GameSettingsType | null;
  onSettingChange: (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => void;
  isDuoMode?: boolean; // New prop to indicate Duo mode
}

const GameSettings: React.FC<GameSettingsProps> = ({
  settings,
  onSettingChange,
  isDuoMode = false, // Default to false
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  if (!settings) return null;

  return (
    <View
      style={[
        styles.settingsGroup,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Only show these settings in single player mode */}
      {!isDuoMode && (
        <>
          {/* Highlight related cells */}
          <View
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingTextContainer}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                {t("gameSettings.highlightRelated")}
              </Text>
            </View>
            <Switch
              value={settings.highlightRelatedCells}
              onValueChange={(value) =>
                onSettingChange("highlightRelatedCells", value)
              }
              trackColor={{
                false: colors.buttonDisabled,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Highlight same values */}
          <View
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingTextContainer}>
              <Text
                style={[styles.settingTitle, { color: colors.textPrimary }]}
              >
                {t("gameSettings.highlightSameValues")}
              </Text>
            </View>
            <Switch
              value={settings.highlightSameValues}
              onValueChange={(value) =>
                onSettingChange("highlightSameValues", value)
              }
              trackColor={{
                false: colors.buttonDisabled,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </>
      )}

      {/* Show Errors - Keep in both modes */}
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingIcon}>
          <SelectionIcon width={48} height={48} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            {t("gameSettings.showMistakes")}
          </Text>
        </View>
        <Switch
          value={settings.showMistakes}
          onValueChange={(value) => onSettingChange("showMistakes", value)}
          trackColor={{
            false: colors.buttonDisabled,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Vibration - Keep in both modes */}
      <View
        style={[
          styles.settingRow,
          { borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.settingIcon}>
          <VibrationIcon width={48} height={48} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            {t("gameSettings.vibration")}
          </Text>
        </View>
        <Switch
          value={settings.vibration}
          onValueChange={(value) => onSettingChange("vibration", value)}
          trackColor={{
            false: colors.buttonDisabled,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

export default GameSettings;
