import React from "react";
import { View } from "react-native";
import styles from "./GameStatusBar.styles";
import Timer from "@/components/Timer/Timer";
import ErrorIndicator from "@/components/ErrorIndicator/ErrorIndicator";
import Animated, { FadeInDown } from "react-native-reanimated";

interface GameStatusBarProps {
  isRunning: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  errorsRemaining: number;
  maxErrors: number;
}

const GameStatusBar: React.FC<GameStatusBarProps> = ({
  isRunning,
  initialTime = 0,
  onTimeUpdate,
  errorsRemaining,
  maxErrors,
}) => {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.delay(400).duration(500)}
    >
      <View style={styles.content}>
        <ErrorIndicator 
          errorsRemaining={errorsRemaining} 
          maxErrors={maxErrors} 
        />
        
        <Timer 
          isRunning={isRunning} 
          initialTime={initialTime}
          onTimeUpdate={onTimeUpdate}
        />
      </View>
    </Animated.View>
  );
};

export default GameStatusBar;