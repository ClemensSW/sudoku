/**
 * OnlineGameBoard Screen (Placeholder for Phase 2.3)
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';

export default function OnlineGameBoard() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Online Game</Text>
      <Text style={styles.subtitle}>Coming in Phase 2.3</Text>
    </SafeAreaView>
  );
}
