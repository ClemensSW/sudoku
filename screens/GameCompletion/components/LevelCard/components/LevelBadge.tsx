// components/GameCompletionModal/components/LevelProgress/components/LevelBadge.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LevelInfo } from '../../PlayerProgressionCard/utils/types';
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  size?: number;
  showAnimation?: boolean;
  animationDelay?: number;
  style?: any;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  levelInfo,
  size = 64, // Larger default size for better visibility
  showAnimation = false,
  animationDelay = 0,
  style,
}) => {
  // Use theme for consistent visual design
  const theme = useTheme();

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0);
  const shimmer = useSharedValue(0);

  // Get custom path color (reaktiv)
  const pathColor = useProgressColor();

  // Level number (1-based for display)
  const levelNumber = levelInfo.currentLevel + 1;

  // Start animations
  useEffect(() => {
    if (showAnimation) {
      // Delayed sequence for better visual effect
      scale.value = withDelay(
        animationDelay,
        withSequence(
          // Slightly shrink
          withTiming(0.8, {
            duration: 100,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
          }),
          // Grow larger than normal with bouncy effect
          withTiming(1.4, {
            duration: 600,
            easing: Easing.bezier(0.25, 1.5, 0.5, 1)
          }),
          // Return to normal size
          withTiming(1, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
          })
        )
      );

      // Small rotation for additional effect
      rotation.value = withDelay(
        animationDelay + 100,
        withSequence(
          withTiming(-0.1, { duration: 200 }),
          withTiming(0.1, { duration: 400 }),
          withTiming(0, { duration: 300 })
        )
      );

      // Glow effect
      glow.value = withDelay(
        animationDelay + 300,
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 1000 })
        )
      );

      // Shimmer effect for excitement
      shimmer.value = withDelay(
        animationDelay + 200,
        withRepeat(
          withTiming(1, { duration: 1500, easing: Easing.linear }),
          3, // Repeat 3 times
          false // Don't reverse
        )
      );
    } else {
      // Always show gentle pulsation - slightly stronger
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1, // Infinite repeat
        true // Reverse animation
      );

      // Continuous glow effect - more prominent
      glow.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1, // Infinite repeat
        true // Reverse animation
      );
    }
  }, [showAnimation]);
  
  // Animated styles
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}rad` }
    ],
  }));
  
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  
  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: shimmer.value * 0.7,
      transform: [
        { 
          translateX: shimmer.value * size * 2 - size 
        }
      ]
    };
  });
  
  // Calculate text size based on badge size
  const fontSize = Math.max(size * 0.45, 16);
  
  // Styles for the badge
  const badgeStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: pathColor,
  };
  
  // Styles for the glow effect
  const glowStyles = {
    width: size * 1.3,  // Larger for more dramatic effect
    height: size * 1.3,
    borderRadius: size * 0.65,
    backgroundColor: pathColor,
    position: 'absolute' as 'absolute',
    top: -size * 0.15,
    left: -size * 0.15,
  };
  
  // Shimmer effect styles
  const shimmerStyles = {
    position: 'absolute' as 'absolute',
    top: 0,
    bottom: 0,
    width: size / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    left: 0,
    transform: [{ skewX: '-30deg' }],
  };

  return (
    <View style={[styles.container, style]}>
      {/* Glow effect (behind the badge) */}
      <Animated.View style={[glowStyles, glowAnimatedStyle]} />
      
      {/* Main badge */}
      <Animated.View style={[styles.badge, badgeStyles, badgeAnimatedStyle]}>
        {/* Shimmer effect for visual excitement */}
        {showAnimation && (
          <Animated.View style={[shimmerStyles, shimmerAnimatedStyle]} />
        )}
        
        {/* Level number */}
        <Text style={[styles.levelNumber, { fontSize }]}>
          {levelNumber}
        </Text>
      </Animated.View>
      
      {/* Border decoration for added definition */}
      <View style={[
        styles.badgeBorder,
        { 
          width: size + 4,
          height: size + 4,
          borderRadius: (size + 4) / 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          top: -2,
          left: -2,
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // For glow effect positioning
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',  // Contain shimmer effect
  },
  badgeBorder: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: -1,  // Position behind the main badge
  },
  levelNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default LevelBadge;