// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, Platform } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInUp,
  runOnJS
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Premium-Größe für maximale Wirkung
const VISUALIZER_SIZE = 280;
const ENERGY_RING_SIZE = VISUALIZER_SIZE * 1.4;

interface DuoBoardVisualizerProps {
  noAnimation?: boolean;
}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = ({
  noAnimation = false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Haupt-Animationswerte
  const scale = useSharedValue(1);
  
  // Energie-Ring Animationen
  const energyRingRotation = useSharedValue(0);
  const energyRingScale = useSharedValue(0.8);
  const energyRingOpacity = useSharedValue(0);
  
  // Glow und Aura Effekte
  const glowPulse = useSharedValue(0.2);
  const auraExpand = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  
  // Schatten-Dynamik
  const shadowScale = useSharedValue(0.9);
  const shadowOpacity = useSharedValue(0.2);
  
  // Eingangs-Animation
  const entranceScale = useSharedValue(0);
  const entranceOpacity = useSharedValue(0);
  
  // Start-Animationen beim Mount
  useEffect(() => {
    // Eingangs-Animation (nur beim ersten Mount)
    entranceScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Bounce-Effekt
    });
    
    entranceOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    if (!noAnimation) {
      // Verzögerte Start der Loop-Animationen
      setTimeout(() => {
        // === NUR PULSIERUNGS-ANIMATION (Größer/Kleiner) ===
        scale.value = withRepeat(
          withSequence(
            withTiming(1.08, { 
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withTiming(1, { 
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            })
          ),
          -1,
          false
        );
        
        // === ENERGIE-RING ROTATION (Kontinuierlich) ===
        energyRingRotation.value = withRepeat(
          withTiming(360, {
            duration: 8000,
            easing: Easing.linear
          }),
          -1,
          false
        );
        
        // === ENERGIE-RING PULSIERUNG ===
        energyRingScale.value = withRepeat(
          withSequence(
            withTiming(1.15, {
              duration: 2000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withTiming(1, {
              duration: 2000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            })
          ),
          -1,
          false
        );
        
        // === ENERGIE-RING OPACITY ===
        energyRingOpacity.value = withRepeat(
          withSequence(
            withTiming(0.9, {
              duration: 1500,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withTiming(0.3, {
              duration: 1500,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            })
          ),
          -1,
          false
        );
        
        // === GLOW PULS-EFFEKT ===
        glowPulse.value = withRepeat(
          withSequence(
            withTiming(1, {
              duration: 1200,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withDelay(300,
              withTiming(0.3, {
                duration: 1200,
                easing: Easing.bezier(0.42, 0, 0.58, 1)
              })
            )
          ),
          -1,
          false
        );
        
        // === AURA EXPANSION ===
        auraExpand.value = withRepeat(
          withSequence(
            withTiming(1, {
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 1, 1)
            }),
            withTiming(0, {
              duration: 100,
              easing: Easing.linear
            })
          ),
          -1,
          false
        );
        
        // === SPARKLE EFFEKT ===
        sparkleOpacity.value = withRepeat(
          withSequence(
            withDelay(2000,
              withTiming(1, {
                duration: 300,
                easing: Easing.bezier(0, 0, 0.58, 1)
              })
            ),
            withTiming(0, {
              duration: 500,
              easing: Easing.bezier(0.42, 0, 1, 1)
            }),
            withDelay(1200, withTiming(0, { duration: 0 }))
          ),
          -1,
          false
        );
        
        
        
        // === SCHATTEN ANIMATION (pulsiert mit dem Logo) ===
        shadowScale.value = withRepeat(
          withSequence(
            withTiming(1.1, {
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withTiming(0.9, {
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            })
          ),
          -1,
          false
        );
        
        shadowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.3, {
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            }),
            withTiming(0.2, {
              duration: 3000,
              easing: Easing.bezier(0.42, 0, 0.58, 1)
            })
          ),
          -1,
          false
        );
        
      }, 300); // Kleine Verzögerung nach der Eingangsanimation
    }
  }, [noAnimation]);
  
  // === ANIMIERTE STYLES ===
  
  // Logo-Container Animation
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: entranceScale.value * scale.value },
        { perspective: 1200 }
      ],
      opacity: entranceOpacity.value,
    };
  });
  
  // Energie-Ring Animation
  const energyRingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${energyRingRotation.value}deg` },
        { scale: energyRingScale.value }
      ],
      opacity: energyRingOpacity.value * entranceOpacity.value,
    };
  });
  
  // Haupt-Glow Effekt
  const mainGlowStyle = useAnimatedStyle(() => {
    const glowScale = interpolate(
      glowPulse.value,
      [0.3, 1],
      [1.2, 1.5],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: glowPulse.value * entranceOpacity.value * 0.8,
      transform: [{ scale: glowScale }],
    };
  });
  
  // Aura Expansion Effekt
  const auraStyle = useAnimatedStyle(() => {
    const auraScale = interpolate(
      auraExpand.value,
      [0, 1],
      [0.8, 2],
      Extrapolation.CLAMP
    );
    
    const auraOpacity = interpolate(
      auraExpand.value,
      [0, 0.5, 1],
      [0.8, 0.4, 0],
      Extrapolation.CLAMP
    );
    
    return {
      transform: [{ scale: auraScale }],
      opacity: auraOpacity * entranceOpacity.value,
    };
  });
  
  // Sparkle/Glitzer Effekt
  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: sparkleOpacity.value * entranceOpacity.value,
      transform: [
        { scale: interpolate(sparkleOpacity.value, [0, 1], [0.8, 1.2]) }
      ],
    };
  });
  
  // Dynamischer Schatten
  const shadowStyle = useAnimatedStyle(() => {
    return {
      opacity: shadowOpacity.value * entranceOpacity.value,
      transform: [
        { scaleX: shadowScale.value },
        { scaleY: shadowScale.value * 0.4 }
      ],
    };
  });
  
  // Innerer Glow für Tiefe
  const innerGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        glowPulse.value,
        [0.3, 1],
        [0.5, 0.9],
        Extrapolation.CLAMP
      ) * entranceOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Dynamischer Schatten */}
      <Animated.View style={[styles.shadow, shadowStyle]}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
          style={styles.shadowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
      
      {/* Aura Expansion Effekt */}
      <Animated.View style={[styles.auraContainer, auraStyle]} pointerEvents="none">
        <LinearGradient
          colors={[
            'rgba(74, 125, 120, 0)',
            'rgba(74, 125, 120, 0.15)',
            'rgba(74, 125, 120, 0)'
          ]}
          style={styles.aura}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      {/* Energie-Ring */}
      <Animated.View style={[styles.energyRing, energyRingStyle]} pointerEvents="none">
        <LinearGradient
          colors={[
            'transparent',
            'rgba(74, 125, 120, 0.2)',
            'rgba(74, 125, 120, 0.4)',
            'rgba(74, 125, 120, 0.2)',
            'transparent'
          ]}
          style={styles.energyRingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Energie-Partikel */}
        <View style={styles.energyParticleContainer}>
          <EnergyParticle delay={0} />
          <EnergyParticle delay={500} />
          <EnergyParticle delay={1000} />
          <EnergyParticle delay={1500} />
        </View>
      </Animated.View>
      
      {/* Haupt-Glow Effekt */}
      <Animated.View style={[styles.mainGlow, mainGlowStyle]} pointerEvents="none">
        <LinearGradient
          colors={[
            'rgba(74, 125, 120, 0.6)',
            'rgba(74, 125, 120, 0.3)',
            'rgba(74, 125, 120, 0.1)',
            'rgba(74, 125, 120, 0)'
          ]}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      {/* Innerer Glow */}
      <Animated.View style={[styles.innerGlow, innerGlowStyle]} pointerEvents="none">
        <View style={styles.innerGlowCore} />
      </Animated.View>
      
      {/* Sparkle/Glitzer Effekt */}
      <Animated.View style={[styles.sparkleContainer, sparkleStyle]} pointerEvents="none">
        <View style={styles.sparkle} />
        <View style={[styles.sparkle, styles.sparkle2]} />
        <View style={[styles.sparkle, styles.sparkle3]} />
        <View style={[styles.sparkle, styles.sparkle4]} />
      </Animated.View>
      
      {/* Logo mit allen Effekten */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        {/* Das App-Logo */}
        <Image
          source={require("@/assets/images/app-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Motivierender Text */}
      {!noAnimation && (
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)} 
          style={styles.motivationTextContainer}
        >
          <Text style={styles.motivationText}>GRÜN VS GELB</Text>
        </Animated.View>
      )}
    </View>
  );
};

// Energie-Partikel Komponente
const EnergyParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: 3000,
          easing: Easing.linear
        }),
        -1,
        false
      )
    );
    
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.energyParticle, animatedStyle]}>
      <View style={styles.energyDot} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE + 100, // Extra Raum für Effekte und Text
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  // Logo Styles
  logoContainer: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 20,
  },
  logoImage: {
    width: "80%",
    height: "80%",
    zIndex: 2,
  },
  
  // Energie-Ring
  energyRing: {
    position: 'absolute',
    width: ENERGY_RING_SIZE,
    height: ENERGY_RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  energyRingGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: ENERGY_RING_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(74, 125, 120, 0.3)',
  },
  energyParticleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  energyParticle: {
    position: 'absolute',
    width: ENERGY_RING_SIZE * 0.9,
    height: ENERGY_RING_SIZE * 0.9,
    left: '5%',
    top: '5%',
  },
  energyDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A7D78',
    shadowColor: '#4A7D78',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  
  // Glow Effekte
  mainGlow: {
    position: 'absolute',
    width: VISUALIZER_SIZE * 1.8,
    height: VISUALIZER_SIZE * 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: VISUALIZER_SIZE * 0.9,
  },
  innerGlow: {
    position: 'absolute',
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  innerGlowCore: {
    width: '70%',
    height: '70%',
    borderRadius: VISUALIZER_SIZE * 0.35,
    backgroundColor: 'rgba(74, 125, 120, 0.15)',
    shadowColor: '#4A7D78',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  
  // Aura Effekt
  auraContainer: {
    position: 'absolute',
    width: VISUALIZER_SIZE * 2,
    height: VISUALIZER_SIZE * 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  aura: {
    width: '100%',
    height: '100%',
    borderRadius: VISUALIZER_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(74, 125, 120, 0.2)',
  },
  
  // Sparkle Effekte
  sparkleContainer: {
    position: 'absolute',
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    zIndex: 25,
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    top: '20%',
    left: '25%',
  },
  sparkle2: {
    top: '30%',
    left: '70%',
    width: 3,
    height: 3,
  },
  sparkle3: {
    top: '65%',
    left: '20%',
    width: 5,
    height: 5,
  },
  sparkle4: {
    top: '70%',
    left: '75%',
    width: 3,
    height: 3,
  },
  
  // Highlight und Glanz
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40%',
    borderTopLeftRadius: VISUALIZER_SIZE * 0.1,
    borderTopRightRadius: VISUALIZER_SIZE * 0.1,
    zIndex: 3,
  },
  shineEffect: {
    position: 'absolute',
    top: '10%',
    left: '30%',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    transform: [{ scaleX: 0.5 }],
    zIndex: 4,
  },
  
  // Schatten
  shadow: {
    position: 'absolute',
    bottom: 20,
    width: VISUALIZER_SIZE * 0.6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  shadowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: VISUALIZER_SIZE * 0.3,
  },
  
  // Motivationstext
  motivationTextContainer: {
    position: 'absolute',
    bottom: -10,
    alignItems: 'center',
    zIndex: 30,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A7D78',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default DuoBoardVisualizer;