import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import styles from './NumberPad.styles';

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  onHintPress?: () => void;
  noteModeActive: boolean;
  disabledNumbers?: number[];
  showHint?: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onErasePress,
  onNoteToggle,
  onHintPress,
  noteModeActive,
  disabledNumbers = [],
  showHint = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Generiere die Nummern-Buttons
  const renderNumberButtons = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
      const isDisabled = disabledNumbers.includes(num);
      
      return (
        <TouchableOpacity
          key={`num-${num}`}
          style={[
            styles.button,
            isDisabled && styles.disabledButton,
            {
              backgroundColor: isDisabled 
                ? colors.buttonDisabled 
                : colors.numberPadButton,
            }
          ]}
          onPress={() => !isDisabled && onNumberPress(num)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.buttonText,
              isDisabled && styles.disabledButtonText,
              {
                color: isDisabled 
                  ? colors.buttonTextDisabled 
                  : colors.numberPadButtonText,
              }
            ]}
          >
            {num}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            noteModeActive && styles.activeActionButton,
            {
              backgroundColor: noteModeActive 
                ? colors.primary 
                : colors.numberPadButton,
            }
          ]}
          onPress={onNoteToggle}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={noteModeActive ? colors.buttonText : colors.numberPadButtonText}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.numberPadButton,
            }
          ]}
          onPress={onErasePress}
          activeOpacity={0.7}
        >
          <Feather name="delete" size={24} color={colors.numberPadButtonText} />
        </TouchableOpacity>
        
        {showHint && onHintPress && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.numberPadButton,
              }
            ]}
            onPress={onHintPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={24}
              color={colors.numberPadButtonText}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.numbersContainer}>
        {renderNumberButtons()}
      </View>
    </View>
  );
};

export default NumberPad;