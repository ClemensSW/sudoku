// screens/SettingsScreen/components/GameSettings/GameSettings.tsx
import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import VibrationIcon from "@/assets/svg/vibration.svg";
import RadioIcon from "@/assets/svg/radio.svg";
import SelectionIcon from "@/assets/svg/selection.svg";
import LinkIcon from "@/assets/svg/link.svg";
import NumbersIcon from "@/assets/svg/numbers.svg";
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

  // iOS-style monochrome switch colors with opacity difference for better visibility
  const switchTrackColorActive = theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  const switchTrackColorInactive = theme.isDark ? "rgba(255,255,255,0.16)" : "rgba(120,120,128,0.16)";
  const switchThumbColorActive = "#FFFFFF";
  const switchThumbColorInactive = theme.isDark ? "#666666" : "rgba(255,255,255,0.7)";

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
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() =>
              onSettingChange("highlightRelatedCells", !settings.highlightRelatedCells)
            }
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <LinkIcon width={48} height={48} />
            </View>
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
              trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
              thumbColor={settings.highlightRelatedCells ? switchThumbColorActive : switchThumbColorInactive}
              ios_backgroundColor={switchTrackColorInactive}
            />
          </TouchableOpacity>

          {/* Highlight same values */}
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() =>
              onSettingChange("highlightSameValues", !settings.highlightSameValues)
            }
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <NumbersIcon width={48} height={48} />
            </View>
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
              trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
              thumbColor={settings.highlightSameValues ? switchThumbColorActive : switchThumbColorInactive}
              ios_backgroundColor={switchTrackColorInactive}
            />
          </TouchableOpacity>
        </>
      )}

      {/* Show Errors - Keep in both modes */}
      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: colors.border }]}
        onPress={() => onSettingChange("showMistakes", !settings.showMistakes)}
        activeOpacity={0.7}
      >
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
          trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
          thumbColor={settings.showMistakes ? switchThumbColorActive : switchThumbColorInactive}
          ios_backgroundColor={switchTrackColorInactive}
        />
      </TouchableOpacity>

      {/* Background Music - Keep in both modes */}
      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: colors.border }]}
        onPress={() => onSettingChange("backgroundMusic", !settings.backgroundMusic)}
        activeOpacity={0.7}
      >
        <View style={styles.settingIcon}>
          <RadioIcon width={48} height={48} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            {t("gameSettings.backgroundMusic")}
          </Text>
        </View>
        <Switch
          value={settings.backgroundMusic}
          onValueChange={(value) => onSettingChange("backgroundMusic", value)}
          trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
          thumbColor={settings.backgroundMusic ? switchThumbColorActive : switchThumbColorInactive}
          ios_backgroundColor={switchTrackColorInactive}
        />
      </TouchableOpacity>

      {/* Vibration - Keep in both modes (last item - override borderBottom) */}
      <TouchableOpacity
        style={[styles.settingRow, { borderBottomWidth: 0 }]}
        onPress={() => onSettingChange("vibration", !settings.vibration)}
        activeOpacity={0.7}
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
          trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
          thumbColor={settings.vibration ? switchThumbColorActive : switchThumbColorInactive}
          ios_backgroundColor={switchTrackColorInactive}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GameSettings;
