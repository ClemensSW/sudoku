import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  Easing,
  FadeIn 
} from 'react-native-reanimated';
import { getRandomBannerMessage } from '../utils/supportMessages';
import styles from './Banner.styles';

// Versuche zunächst den LinearGradient zu importieren
let LinearGradient: any;
try {
  // Dynamischer Import
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  // Wenn der Import fehlschlägt, verwende das Fallback
  console.log('LinearGradient nicht verfügbar, verwende Fallback');
  LinearGradient = require('./GradientFallback').default;
}

interface BannerProps {
  primaryColor: string;
  secondaryColor: string;
}

const Banner: React.FC<BannerProps> = ({ primaryColor, secondaryColor }) => {
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  
  // Get random message and emoji
  const { title, subtitle } = getRandomBannerMessage();
  const emojis = ['☕', '🎮', '🧩', '🚀', '✨'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  // Start animation
  useEffect(() => {
    // Subtle pulsing animation for the emoji
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Subtle rotation for the emoji
    rotate.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);
  
  // Animated styles
  const emojiAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}rad` }
      ]
    };
  });
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(800)}
    >
      {/* Background with gradient */}
      <View style={styles.background}>
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        {/* Pattern overlay for texture */}
        <View style={styles.pattern} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {/* Animated emoji */}
      <Animated.Text style={[styles.emoji, emojiAnimatedStyle]}>
        {randomEmoji}
      </Animated.Text>
    </Animated.View>
  );
};

export default Banner;