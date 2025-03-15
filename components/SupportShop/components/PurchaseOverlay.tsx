import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { getRandomFunFact } from '../utils/supportMessages';
import styles from './PurchaseOverlay.styles';

interface PurchaseOverlayProps {
  visible: boolean;
  isSuccess?: boolean;
  title?: string;
  message?: string;
  primaryColor: string;
}

const PurchaseOverlay: React.FC<PurchaseOverlayProps> = ({
  visible,
  isSuccess = false,
  title = "Verarbeite Kauf...",
  message = "Bitte warte einen Moment",
  primaryColor,
}) => {
  const [funFact, setFunFact] = useState<string>("");
  const [showFunFact, setShowFunFact] = useState<boolean>(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // Set random fun fact after delay
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setFunFact(getRandomFunFact());
        setShowFunFact(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Animations for success
  useEffect(() => {
    if (isSuccess) {
      // Happy bounce animation
      scale.value = withSequence(
        withTiming(0.8, { duration: 150 }),
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 200 })
      );
      
      // Wiggle animation
      rotate.value = withSequence(
        withTiming(-0.05, { duration: 100 }),
        withTiming(0.05, { duration: 100 }),
        withTiming(-0.05, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isSuccess]);

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}rad` }
      ]
    };
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      {/* Backdrop with blur effect */}
      <BlurView
        intensity={40}
        tint="dark"
        style={styles.backdropBlur}
      />

      {/* Content */}
      <Animated.View 
        style={[styles.contentContainer, contentAnimatedStyle]}
      >
        {isSuccess ? (
          // Success state
          <>
            <Animated.View 
              style={styles.icon}
              entering={FadeIn.duration(400)}
            >
              <Feather name="check-circle" size={60} color={primaryColor} />
            </Animated.View>
            
            <Text style={[styles.title, { color: primaryColor }]}>
              {title}
            </Text>
            
            <Text style={styles.message}>
              {message}
            </Text>
          </>
        ) : (
          // Loading state
          <>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
              <Text style={[styles.purchasingText, { color: '#333' }]}>
                {title}
              </Text>
            </View>
            
            {showFunFact && (
              <Animated.View 
                style={styles.funFactContainer}
                entering={FadeIn.duration(500)}
              >
                <Text style={styles.funFactText}>
                  {funFact}
                </Text>
              </Animated.View>
            )}
          </>
        )}
      </Animated.View>

      {/* Success animations (would contain confetti or other celebration effects) */}
      {isSuccess && (
        <View style={styles.successAnimationContainer}>
          {/* Confetti or celebration animations would go here */}
        </View>
      )}
    </Animated.View>
  );
};

export default PurchaseOverlay;