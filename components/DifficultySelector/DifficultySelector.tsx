import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Difficulty } from '@/utils/sudoku';
import styles from './DifficultySelector.styles';
import { useTheme } from '@/utils/theme';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Übersetzungen für die Schwierigkeitsgrade
  const difficultyLabels: Record<Difficulty, string> = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    expert: 'Experte',
  };

  const renderDifficultyButton = (difficulty: Difficulty) => {
    const isSelected = currentDifficulty === difficulty;
    
    return (
      <TouchableOpacity
        style={[
          styles.button,
          isSelected && styles.selectedButton,
          { 
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => onSelectDifficulty(difficulty)}
        disabled={disabled || isSelected}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            isSelected && styles.selectedButtonText,
            { color: isSelected ? colors.buttonText : colors.textPrimary },
          ]}
        >
          {difficultyLabels[difficulty]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderDifficultyButton('easy')}
      {renderDifficultyButton('medium')}
      {renderDifficultyButton('hard')}
      {renderDifficultyButton('expert')}
    </View>
  );
};

export default DifficultySelector;