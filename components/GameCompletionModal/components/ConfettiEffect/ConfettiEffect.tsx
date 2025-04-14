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
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ConfettiEffect.styles";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  density?: number; // 1-10, Anzahl der Konfettistücke
}

// Bildschirmbreite und -höhe für die Berechnung der Konfetti-Position
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Konfetti-Farben
const CONFETTI_COLORS = [
  "#FFC700", // Gold
  "#FF4081", // Pink
  "#00E676", // Grün
  "#2979FF", // Blau
  "#AA00FF", // Lila
  "#FF3D00", // Orange
];

// Konfetti-Formen
const CONFETTI_SHAPES = ["square", "rectangle", "circle", "triangle"] as const;

// Typ für ein einzelnes Konfettistück
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
  
  // Berechne die Anzahl der Konfettistücke basierend auf der Dichte
  const pieceCount = Math.min(Math.max(density, 1), 5) * 20;
  
  // Erzeuge Konfettistücke mit zufälligen Eigenschaften
  const generateConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        x: Math.random() * screenWidth,
        delay: Math.random() * 2000, // Zufällige Verzögerung bis zu 2 Sekunden
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5, // Zufällige Größe zwischen 0.5 und 2
      });
    }
    
    return pieces;
  };
  
  // Starte die Konfetti-Animation, wenn isActive ändert
  useEffect(() => {
    if (isActive) {
      // Erzeuge Konfettistücke und starte Animation
      setConfetti(generateConfetti());
      setIsVisible(true);
      
      // Beende die Animation nach der angegebenen Dauer
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, duration]);
  
  // Wenn keine Konfettistücke vorhanden sind oder nicht sichtbar, zeige nichts an
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

// Einzelnes Konfettistück mit Animation
interface ConfettiPieceProps {
  piece: ConfettiPiece;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ piece }) => {
  // Animation values
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  // Starte die Animation, wenn die Komponente gemountet wird
  useEffect(() => {
    // Anfangsverzögerung
    const startAnimation = () => {
      // Fade in
      opacity.value = withTiming(1, { duration: 300 });
      
      // Fall-Animation mit leichter seitlicher Bewegung
      translateY.value = withTiming(screenHeight + 100, { 
        duration: 3000 + Math.random() * 3000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Zufällige seitliche Bewegung (Schwanken)
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
        -1, // Unendlich wiederholen
        false
      );
      
      // Rotation
      rotate.value = withRepeat(
        withTiming(360, { 
          duration: 1000 + Math.random() * 2000,
          easing: Easing.linear,
        }),
        -1, // Unendlich wiederholen
        false
      );
    };
    
    // Verzögere den Start je nach Konfettistück
    const timeout = setTimeout(startAnimation, piece.delay);
    
    // Cleanup beim Unmount
    return () => {
      clearTimeout(timeout);
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, []);
  
  // Animated style für Bewegung und Rotation
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
  
  // Wähle den richtigen Style basierend auf der Form
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