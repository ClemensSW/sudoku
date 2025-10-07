// components/BottomSheetModal/BottomSheetBackdrop.tsx
import React, { useMemo } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';

interface CustomBackdropProps extends BottomSheetBackdropProps {
  isDark: boolean;
}

const BottomSheetBackdrop: React.FC<CustomBackdropProps> = ({
  animatedIndex,
  style,
  isDark,
}) => {
  // Animated opacity based on bottom sheet position
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  // Combine styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        intensity={80}
        style={StyleSheet.absoluteFill}
        tint={isDark ? 'dark' : 'light'}
      />
    </Animated.View>
  );
};

export default BottomSheetBackdrop;
