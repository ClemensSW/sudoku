import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useShimmerAnimation } from './hooks/useShimmerAnimation';

interface SkeletonBoxProps {
  width?: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height,
  borderRadius = 8,
  style,
}) => {
  const theme = useTheme();
  const { shimmerStyle } = useShimmerAnimation();

  const backgroundColor = theme.isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(0, 0, 0, 0.06)';

  const shimmerColor = theme.isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.04)';

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          { backgroundColor: shimmerColor },
          shimmerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
});

export default SkeletonBox;
