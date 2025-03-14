// components/Background/Background.tsx
import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BackgroundProps {
  variant?: 'blue' | 'purple' | 'default';
}

const Background: React.FC<BackgroundProps> = ({ variant = 'default' }) => {
  // Select the appropriate background based on variant
  const getBackgroundSource = () => {
    switch (variant) {
      case 'blue':
        return require('@/assets/images/background/mountains_blue.png');
      case 'purple':
        return require('@/assets/images/background/mountains_purple.png');
      default:
        return require('@/assets/images/background/mountains_blue.png');
    }
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      <Image
        source={getBackgroundSource()}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
});

export default Background;