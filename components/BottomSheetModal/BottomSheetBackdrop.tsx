// components/BottomSheetModal/BottomSheetBackdrop.tsx
import React, { useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BottomSheetBackdrop as GorhomBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface CustomBackdropProps extends BottomSheetBackdropProps {
  isDark: boolean;
}

const BottomSheetBackdrop: React.FC<CustomBackdropProps> = (props) => {
  const { animatedIndex, style, isDark } = props;

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
    <>
      {/* Render the base backdrop for touch handling */}
      <GorhomBackdrop {...props} />
      {/* Render blur overlay on top */}
      <Animated.View style={containerStyle} pointerEvents="none">
        <BlurView
          intensity={80}
          style={StyleSheet.absoluteFill}
          tint={isDark ? 'dark' : 'light'}
        />
      </Animated.View>
    </>
  );
};

export default BottomSheetBackdrop;
