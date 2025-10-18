// screens/GameCompletion/shared/ActionButtons/ActionButtons.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { useTranslation } from 'react-i18next';
import styles from './ActionButtons.styles';

interface ActionButtonsProps {
  onNewGame: () => void;
  onContinue: () => void;
  customColor?: string; // Optional custom color (overrides path color)
}

/**
 * Finale Action Buttons für GameCompletion Flow
 *
 * Zeigt "Neues Spiel" (primary) und "Zum Menü" (outline) Buttons
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNewGame,
  onContinue,
  customColor,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const pathColor = useProgressColor();

  // Use custom color if provided, otherwise use path color
  const buttonColor = customColor || pathColor;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark
            ? `${theme.colors.background}F2` // 95% opacity for glass effect
            : `${theme.colors.card}F2`,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.isDark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(0,0,0,0.08)',
        },
      ]}
    >
      <Button
        title={t('buttons.nextGame')}
        onPress={onNewGame}
        variant="primary"
        customColor={buttonColor}
        style={styles.primaryButton}
        icon={<Feather name="play" size={22} color={theme.colors.buttonText} />}
        iconPosition="left"
      />

      <Button
        title={t('buttons.backToMenu')}
        onPress={onContinue}
        variant="outline"
        customColor={buttonColor}
        style={styles.secondaryButton}
      />
    </View>
  );
};

export default ActionButtons;
