// components/GameCompletion/components/ConfettiEffect/ConfettiEffect.tsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

const ConfettiEffect: React.FC<ConfettiProps> = ({
  isActive,
  duration = 4000,
}) => {
  const animationRef = useRef<LottieView>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);

      // Delay slightly to ensure LottieView is mounted
      const playTimer = setTimeout(() => {
        if (animationRef.current) {
          animationRef.current.reset();
          animationRef.current.play();
        }
      }, 50);

      // Hide animation after duration to free up pointer events
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, duration + 200);

      return () => {
        clearTimeout(playTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setVisible(false);
    }
  }, [isActive, duration]);

  // Completely unmount when not visible
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <LottieView
        ref={animationRef}
        source={require("@/assets/animations/confetti.json")}
        style={styles.animation}
        autoPlay={true}
        loop={false}
        speed={1}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  animation: {
    flex: 1,
  },
});

export default React.memo(ConfettiEffect);
