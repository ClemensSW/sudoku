// screens/SettingsScreen/components/HelpSection/HelpSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import RequestIcon from "@/assets/svg/request.svg";
import InkIcon from "@/assets/svg/ink.svg";
import styles from "./HelpSection.styles";

interface HelpSectionProps {
  showGameFeatures: boolean;
  onAutoNotes?: () => void;
  onHowToPlay: () => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({
  showGameFeatures,
  onAutoNotes,
  onHowToPlay,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Auto Notes - Only show when in a game context */}
      {showGameFeatures && onAutoNotes && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAutoNotes}
        >
          <View style={styles.actionIcon}>
            <InkIcon width={48} height={48} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text
              style={[styles.actionTitle, { color: colors.textPrimary }]}
            >
              Automatische Notizen
            </Text>
            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Mögliche Zahlen als Notizen eintragen
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}

      {/* How to Play */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          showGameFeatures && {
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
        ]}
        onPress={onHowToPlay}
      >
        <View style={styles.actionIcon}>
          <RequestIcon width={48} height={48} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Wie spielt man?
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

export default HelpSection;