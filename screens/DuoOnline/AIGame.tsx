/**
 * AIGame Screen (Placeholder for Phase 4)
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';

export default function AIGame() {
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
      <Text style={styles.title}>Play vs AI</Text>
      <Text style={styles.subtitle}>Coming in Phase 4</Text>
    </SafeAreaView>
  );
}
