// screens/GameScreen/components/GameControls/GameControls.tsx
import React from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import NumberPad from "@/screens/GameScreen/components/NumberPad/NumberPad";
import "./GameControls.css";

interface GameControlsProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  onHintPress: () => void;
  noteModeActive: boolean;
  disabledNumbers: number[];
  hintsRemaining: number;
  isGameComplete?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNumberPress,
  onErasePress,
  onNoteToggle,
  onHintPress,
  noteModeActive,
  disabledNumbers,
  hintsRemaining,
  isGameComplete = false,
}) => {
  return (
    <View>
      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <NumberPad
          onNumberPress={onNumberPress}
          onErasePress={onErasePress}
          onNoteToggle={onNoteToggle}
          onHintPress={onHintPress}
          noteModeActive={noteModeActive}
          disabledNumbers={disabledNumbers}
          showHint={true}
          hintsRemaining={hintsRemaining}
        />
      </Animated.View>
    </View>
  );
};

export default GameControls;
