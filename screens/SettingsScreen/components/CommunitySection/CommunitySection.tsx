// screens/SettingsScreen/components/CommunitySection/CommunitySection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./CommunitySection.styles";

interface CommunitySectionProps {
  onSupportPress: () => void;
  onSharePress: () => void;
  onAboutPress: () => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  onSupportPress,
  onSharePress,
  onAboutPress,
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
      {/* Support button - Keep exact text as specified */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onSupportPress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: "#FFDD00" },
          ]}
        >
          <Text style={{ fontSize: 24 }}>☕</Text>
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Kostenlos spielen
          </Text>
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Entwicklung freiwillig unterstützen
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Share button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onSharePress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.success}20` },
          ]}
        >
          <Feather name="share-2" size={20} color={colors.success} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Mit Freunden teilen
          </Text>
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Fordere sie zum Sudoku-Duell heraus
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* About button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onAboutPress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.info}20` },
          ]}
        >
          <Feather name="info" size={20} color={colors.info} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Über Sudoku Duo
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

export default CommunitySection;