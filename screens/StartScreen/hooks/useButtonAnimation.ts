import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export const useButtonAnimation = () => {
  const buttonScale = useSharedValue(1);

  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.97, { duration: 120 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 220 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return {
    buttonAnimatedStyle,
    handleButtonPressIn,
    handleButtonPressOut,
  };
};
