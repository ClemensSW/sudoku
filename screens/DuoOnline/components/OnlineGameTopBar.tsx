/**
 * OnlineGameTopBar Component
 *
 * Top navigation bar for online multiplayer matches
 * Layout: Back button (left) | Settings button (right)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useRouter } from 'expo-router';

interface OnlineGameTopBarProps {
  onSettingsPress?: () => void;
}

const OnlineGameTopBar: React.FC<OnlineGameTopBarProps> = ({
  onSettingsPress,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider + '40',
    },
    button: {
      padding: theme.spacing.sm,
      borderRadius: 8,
    },
    spacer: {
      width: 40, // Same width as button to balance layout
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleBack}>
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.spacer} />

      {onSettingsPress && (
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Feather name="settings" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OnlineGameTopBar;
