import React, { useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ConfettiEffect.styles";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  density?: number; // 1-10, Anzahl der Konfettistücke
}

// Screen dimensions for positioning confetti
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Confetti colors
const CONFETTI_COLORS = [
  "#FFC700", // Gold
  "#FF4081", // Pink
  "#00E676", // Green
  "#2979FF", // Blue
  "#AA00FF", // Purple
  "#FF3D00", // Orange
];

// Confetti shapes
const CONFETTI_SHAPES = ["square", "rectangle", "circle", "triangle"] as const;

// Type for a single confetti piece
interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  shape: typeof CONFETTI_SHAPES[number];
  rotation: number;
  scale: number;
}

const ConfettiEffect: React.FC<ConfettiProps> = ({
  isActive,
  duration = 5000,
  density = 2,
}) => {
  const theme = useTheme();
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate number of confetti pieces based on density
  const pieceCount = Math.min(Math.max(density, 1), 5) * 20;
  
  // Generate confetti pieces with random properties
  const generateConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        x: Math.random() * screenWidth,
        delay: Math.random() * 2000, // Random delay up to 2 seconds
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5, // Random size between 0.5 and 2
      });
    }
    
    return pieces;
  };
  
  // Start the confetti animation when isActive changes
  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces and start animation
      setConfetti(generateConfetti());
      setIsVisible(true);
      
      // End the animation after the specified duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, duration]);
  
  // If no confetti pieces exist or not visible, show nothing
  if (!isVisible || confetti.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container} pointerEvents="none">
      {confetti.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </View>
  );
};

// Single confetti piece with animation
interface ConfettiPieceProps {
  piece: ConfettiPiece;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ piece }) => {
  // Animation values
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  // Start the animation when component mounts
  useEffect(() => {
    // Initial delay
    const startAnimation = () => {
      // Fade in
      opacity.value = withTiming(1, { duration: 300 });
      
      // Fall animation with slight sideways movement
      translateY.value = withTiming(screenHeight + 100, { 
        duration: 3000 + Math.random() * 3000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Random sideways movement (swaying)
      translateX.value = withRepeat(
        withSequence(
          withTiming(15 * (Math.random() < 0.5 ? -1 : 1), { 
            duration: 1000 + Math.random() * 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(-15 * (Math.random() < 0.5 ? -1 : 1), { 
            duration: 1000 + Math.random() * 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        -1, // Infinite repetition
        false
      );
      
      // Rotation
      rotate.value = withRepeat(
        withTiming(360, { 
          duration: 1000 + Math.random() * 2000,
          easing: Easing.linear,
        }),
        -1, // Infinite repetition
        false
      );
    };
    
    // Delay start based on the confetti piece
    const timeout = setTimeout(startAnimation, piece.delay);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, []);
  
  // Animated style for movement and rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: piece.x },
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
        { scale: piece.scale },
      ],
      opacity: opacity.value,
      backgroundColor: piece.shape !== "triangle" ? piece.color : "transparent",
      borderBottomColor: piece.shape === "triangle" ? piece.color : "transparent",
    };
  });
  
  // Choose the right style based on shape
  const getShapeStyle = () => {
    switch (piece.shape) {
      case "square":
        return styles.confettiSquare;
      case "rectangle":
        return styles.confettiRectangle;
      case "circle":
        return styles.confettiCircle;
      case "triangle":
        return styles.confettiTriangle;
      default:
        return styles.confettiSquare;
    }
  };
  
  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        getShapeStyle(),
        animatedStyle,
      ]}
    />
  );
};

export default ConfettiEffect;