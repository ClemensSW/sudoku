// screens/DuoScreen/components/DuoHeader/DuoHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./DuoHeader.styles";

interface DuoHeaderProps {
  onSettingsPress: () => void;
  paddingTop?: number;
}

const DuoHeader: React.FC<DuoHeaderProps> = ({
  onSettingsPress,
  paddingTop = 0,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
          ZWEI SPIELER MODUS
        </Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Sudoku Duo
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.surface }]}
        onPress={onSettingsPress}
      >
        <Feather name="settings" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default DuoHeader;