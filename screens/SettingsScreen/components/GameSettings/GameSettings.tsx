// screens/SettingsScreen/components/GameSettings/GameSettings.tsx
import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import styles from "./GameSettings.styles";

interface GameSettingsProps {
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!settings) return null;

  return (
    <View
      style={[
        styles.settingsGroup, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }
      ]}
    >
      {/* Highlight related cells */}
      <View
        style={[
          styles.settingRow,
          { borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.settingTextContainer}>
          <Text
            style={[styles.settingTitle, { color: colors.textPrimary }]}
          >
            Zellen hervorheben
          </Text>
          <Text
            style={[
              styles.settingDescription,
              { color: colors.textSecondary },
            ]}
          >
            Zeile, Spalte und Box hervorheben
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
        style={[
          styles.settingRow,
          { borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.settingTextContainer}>
          <Text
            style={[styles.settingTitle, { color: colors.textPrimary }]}
          >
            Gleiche Zahlen hervorheben
          </Text>
          <Text
            style={[
              styles.settingDescription,
              { color: colors.textSecondary },
            ]}
          >
            Alle Zellen mit gleichen Werten markieren
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

      {/* Show Errors */}
      <View
        style={[
          styles.settingRow,
          { borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.settingTextContainer}>
          <Text
            style={[styles.settingTitle, { color: colors.textPrimary }]}
          >
            Fehler anzeigen
          </Text>
          <Text
            style={[
              styles.settingDescription,
              { color: colors.textSecondary },
            ]}
          >
            Falsche Zahlen hervorheben
          </Text>
        </View>
        <Switch
          value={settings.showMistakes}
          onValueChange={(value) =>
            onSettingChange("showMistakes", value)
          }
          trackColor={{
            false: colors.buttonDisabled,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Vibration */}
      <View style={styles.settingRow}>
        <View style={styles.settingTextContainer}>
          <Text
            style={[styles.settingTitle, { color: colors.textPrimary }]}
          >
            Vibration
          </Text>
          <Text
            style={[
              styles.settingDescription,
              { color: colors.textSecondary },
            ]}
          >
            Haptisches Feedback beim Tippen
          </Text>
        </View>
        <Switch
          value={settings.vibration}
          onValueChange={(value) =>
            onSettingChange("vibration", value)
          }
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