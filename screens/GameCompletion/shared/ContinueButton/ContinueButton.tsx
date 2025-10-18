// screens/GameCompletion/shared/ContinueButton/ContinueButton.tsx
import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { useTranslation } from 'react-i18next';
import styles from './ContinueButton.styles';

interface ContinueButtonProps {
  onPress: () => void;
  label?: string;
}

/**
 * Wiederverwendbarer "Weiter" Button für GameCompletion Flow
 *
 * Verwendet Path-Color und zeigt Pfeil-Icon
 */
const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  label,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const pathColor = useProgressColor();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Button
        title={label || t('buttons.continue')}
        onPress={onPress}
        variant="primary"
        customColor={pathColor}
        style={styles.button}
        icon={<Feather name="arrow-right" size={22} color={theme.colors.buttonText} />}
        iconPosition="right"
      />
    </View>
  );
};

export default ContinueButton;
