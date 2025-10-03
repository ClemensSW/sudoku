// components/GameCompletionModal/components/ConfettiEffect/ConfettiEffect.tsx
import React, { useEffect, useMemo, useState, memo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

type Shape = "square" | "rectangle" | "circle" | "triangle";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;   // Gesamtdauer (ms)
  density?: number;    // 1–10
  intensity?: "subtle" | "normal" | "party";
  burst?: boolean;
  palette?: string[];
}

// Cache window dimensions outside component to avoid re-calculation
const WINDOW_DIMENSIONS = Dimensions.get("window");
const { width: W, height: H } = WINDOW_DIMENSIONS;

const DEFAULT_COLORS = ["#FFB703","#FB5607","#8338EC","#3A86FF","#FF006E","#2EC4B6"];
const SHAPES: Shape[] = ["square","rectangle","circle","triangle"];

// ---------- Utils ----------
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

type RangeTuple = [number, number];

interface PresetCfg {
  swayAmp: RangeTuple;
  spin: RangeTuple;
  size: RangeTuple;
}

function intensityPreset(kind: NonNullable<ConfettiProps["intensity"]>): PresetCfg {
  switch (kind) {
    case "subtle":
      return { swayAmp: [6, 14],  spin: [120, 280], size: [5, 10] };
    case "party":
      return { swayAmp: [14, 32], spin: [360, 900], size: [8, 16] };
    case "normal":
    default:
      return { swayAmp: [10, 24], spin: [220, 520], size: [6, 12] };
  }
}

interface Particle {
  id: number;
  x0: number;
  y0: number;
  size: number;
  shape: Shape;
  color: string;

  offset: number;    // Startversatz [0..1)
  swayAmp: number;   // px
  swayFreq: number;  // Zyklen pro Dauer
  swayPhase: number;

  fallPower: number; // 0.7–1.1
  spin: number;      // Grad über Lebenszeit
  depth: number;     // 0.85–1.25 (Skalierung/Alpha)
}

const BASE_TRIANGLE = {
  width: 0,
  height: 0,
  borderLeftWidth: 5,
  borderRightWidth: 5,
  borderBottomWidth: 10,
};

const ConfettiEffect: React.FC<ConfettiProps> = ({
  isActive,
  duration = 4000,
  density = 3,
  intensity = "normal",
  burst = true,
  palette,
}) => {
  // Stabilize colors array to prevent useMemo re-calculation
  const colors = useMemo(() =>
    palette && palette.length ? palette : DEFAULT_COLORS,
    [palette]
  );

  const count = Math.min(Math.max(density, 1), 10) * 25; // 25–250
  const burstCount = burst ? Math.round(count * 0.35) : 0;

  const [visible, setVisible] = useState(false);
  const progress = useSharedValue(0);

  const particles = useMemo<Particle[]>(() => {
    const preset = intensityPreset(intensity);

    const make = (i: number, isBurst = false): Particle => {
      const depth = rnd(0.85, 1.25);
      const size = rnd(...preset.size) * depth;
      const x0 = isBurst ? W * 0.5 + rnd(-W * 0.15, W * 0.15) : rnd(0, W);
      const y0 = rnd(-80, -20);

      return {
        id: i,
        x0,
        y0,
        size,
        shape: pick(SHAPES),
        color: pick(colors),
        offset: isBurst ? rnd(0, 0.15) : rnd(0, 0.9),
        swayAmp: rnd(...preset.swayAmp) * depth,
        swayFreq: rnd(0.7, 1.4),
        swayPhase: rnd(0, Math.PI * 2),
        fallPower: rnd(0.7, 1.05),
        spin: rnd(...preset.spin) * (Math.random() < 0.5 ? -1 : 1),
        depth,
      };
    };

    const list: Particle[] = [];
    for (let i = 0; i < burstCount; i++) list.push(make(i, true));
    for (let i = burstCount; i < count; i++) list.push(make(i, false));
    return list;
  }, [count, intensity, burst, burstCount, colors]);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      progress.value = 0;
      progress.value = withTiming(1, { duration, easing: Easing.linear });
      const t = setTimeout(() => setVisible(false), duration + 150);
      return () => {
        clearTimeout(t);
        cancelAnimation(progress);
      };
    } else {
      setVisible(false);
      cancelAnimation(progress);
    }
  }, [isActive, duration, progress]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiPiece key={p.id} p={p} progress={progress} />
      ))}
    </View>
  );
};

const ConfettiPiece: React.FC<{ p: Particle; progress: SharedValue<number> }> = memo(({
  p,
  progress,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // --- clamp01 inline als Worklet-fähige Logik ---
    let lp = progress.value - p.offset;
    lp = lp / (1 - p.offset + 1e-6);
    if (lp < 0) lp = 0;
    else if (lp > 1) lp = 1;

    const y = p.y0 + Math.pow(lp, p.fallPower) * (H + 160);
    const x = p.x0 + Math.sin((lp * Math.PI * 2 * p.swayFreq) + p.swayPhase) * p.swayAmp;
    const rot = p.spin * lp;
    const scale = p.depth;
    const baseAlpha = 0.9 * (1 - Math.pow(lp, 1.2));
    const alpha = baseAlpha < 0 ? 0 : baseAlpha > 1 ? 1 : baseAlpha;

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${rot}deg` },
        { scale },
      ],
      opacity: alpha,
    };
  }, [p]);

  const shapeStyle = useMemo(() => {
    const s = Math.max(6, p.size);
    switch (p.shape) {
      case "square":
        return { width: s, height: s, borderRadius: 2, backgroundColor: p.color };
      case "rectangle":
        return { width: s * 1.6, height: s * 0.8, borderRadius: 2, backgroundColor: p.color };
      case "circle":
        return { width: s, height: s, borderRadius: s / 2, backgroundColor: p.color };
      case "triangle":
        return {
          ...BASE_TRIANGLE,
          borderLeftWidth: s * 0.6,
          borderRightWidth: s * 0.6,
          borderBottomWidth: s * 1.2,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: p.color,
          backgroundColor: "transparent",
        };
      default:
        return { width: s, height: s, borderRadius: 2, backgroundColor: p.color };
    }
  }, [p.shape, p.size, p.color]);

  return <Animated.View pointerEvents="none" style={[styles.piece, animatedStyle, shapeStyle]} />;
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 50,
    overflow: "hidden",
  },
  piece: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});

export default ConfettiEffect;
