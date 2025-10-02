// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
// Overlay Visualizer — "Sudoku Duo: Mountain Storm"
// PERFORMANCE FIX: Animationen nur einmal starten, besseres Cleanup, optimierte Dependencies

import React, { useMemo, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
  Text,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

// ---------- Helpers (worklets) ----------
const clamp = (v: number, lo: number, hi: number) => {
  "worklet";
  return Math.max(lo, Math.min(hi, v));
};
const lerp = (a: number, b: number, t: number) => {
  "worklet";
  return a + (b - a) * t;
};

// ---------- Palette ----------
const PAL = {
  dark: {
    teal: "#4A7D78",
    digit: "#F1F4FB",
    ringSoft: "rgba(74,125,120,0.20)",
    ringMid: "rgba(74,125,120,0.40)",
    auraTint: "rgba(74,125,120,0.15)",
  },
  light: {
    warm: "#F3EFE3", // Glow/Aura-Tint
    digit: "#5B5D6E", // Ziffern
    ringSoft: "rgba(91,93,110,0.14)",
    ringMid: "rgba(91,93,110,0.28)",
    auraTint: "rgba(243,239,227,0.18)", // Warmes InnerGlow
  },
};

// ---------- Assets ----------
const APP_LOGO: ImageSourcePropType = require("@/assets/images/icon.png");

// ---------- Types ----------
type VortexSeed = {
  digit: number;
  r0: number;
  angle0: number;
  zIndex: number;
  wobble: number;
  lifeOffset: number;
  size: number;
  opacity: number;
};

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Props ----------
interface DuoBoardVisualizerProps {
  size?: number;
  stageWidth?: number;
  stageHeight?: number;
  noAnimation?: boolean;
  interactive?: boolean;
  renderTopVignette?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  onLogoPress?: () => void;
  performance?: "low" | "balanced" | "high";
}

// Animated.Text spart einen View pro Ziffer
const AT = Animated.createAnimatedComponent(Text);

// Memoized digit component (keine React-Re-renders)
const VortexDigit = React.memo(function VortexDigitComp({
  seed,
  vortexClock,
  entrance,
  W,
  H,
  S,
  isDark,
}: {
  seed: VortexSeed;
  vortexClock: SharedValue<number>;
  entrance: SharedValue<number>;
  W: number;
  H: number;
  S: number;
  isDark: boolean;
}) {
  const scaleUnit = S / 300;
  const VORTEX_TURB = 0.18;
  const VORTEX_MIN_RADIUS = S * 0.25;
  const VORTEX_MAX_RADIUS = Math.min(W, H) * 0.48;

  const styleA = useAnimatedStyle(() => {
    const t = (vortexClock.value + seed.lifeOffset) % 1;
    const wobble =
      Math.sin(t * Math.PI * 2 * (1.2 + seed.wobble)) *
      VORTEX_TURB *
      12 *
      scaleUnit;
    const r = clamp(
      seed.r0 + wobble,
      VORTEX_MIN_RADIUS * 0.9,
      VORTEX_MAX_RADIUS * 1.03
    );
    const angle = seed.angle0 + t * 360; // fixer Speed
    const rad = (angle * Math.PI) / 180;

    const cx = W / 2;
    const cy = H / 2 - 10 * scaleUnit;
    const x = cx + Math.cos(rad) * r;
    const y = cy + Math.sin(rad) * r * 0.8;

    const depth = (y - H * 0.2) / (H * 0.7);
    const sc = lerp(0.7, 1.18, clamp(depth, 0, 1));
    const op = clamp(seed.opacity * (0.7 + depth * 0.5) * entrance.value, 0, 1);

    return {
      transform: [
        { translateX: x - 10 * scaleUnit },
        { translateY: y - 10 * scaleUnit },
        { scale: sc },
      ],
      opacity: op,
      zIndex: seed.zIndex,
    };
  });

  const digitColor = isDark ? PAL.dark.digit : PAL.light.digit;
  const textShadowColor = isDark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.22)";

  return (
    <AT
      style={[
        styleA,
        {
          position: "absolute",
          fontSize: seed.size,
          fontWeight: "700",
          color: digitColor,
          textShadowRadius: 2,
          textShadowOffset: { width: 0, height: 0 },
          textShadowColor,
          includeFontPadding: false,
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    >
      {seed.digit}
    </AT>
  );
});

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = ({
  size = 300,
  stageWidth,
  stageHeight,
  noAnimation = false,
  interactive = true,
  renderTopVignette = false,
  isDark = true,
  style,
  onLogoPress,
  performance = "low", // CHANGED: Default auf "low" für bessere Performance
}) => {
  // --- Maße ---
  const S = size;
  const W = stageWidth ?? S;
  const H = stageHeight ?? S + 140;
  const scaleUnit = S / 300;

  // --- Performance profile & density ---
  // REDUCED: Weniger Digits für bessere Performance
  const baseCount =
    performance === "low" ? 18 : performance === "high" ? 36 : 24;
  const density = clamp(Math.sqrt((W * H) / (300 * 440)), 0.85, 1.25);
  const VORTEX_COUNT = Math.min(48, Math.round(baseCount * density)); // Max 48 statt 64

  // --- Animation running state ---
  const isAnimationRunning = useRef(false);

  // --- Shared clocks ---
  const entrance = useSharedValue(0);
  const breath = useSharedValue(0);
  const vortexClock = useSharedValue(0);
  const auraClock = useSharedValue(0);
  const boostPulse = useSharedValue(0);

  // --- Seeds (weniger Dependencies für stabiles Memoization) ---
  const vortexSeeds: VortexSeed[] = useMemo(() => {
    const seeds: VortexSeed[] = [];
    const VORTEX_MIN_RADIUS = S * 0.25;
    const VORTEX_MAX_RADIUS = Math.min(W, H) * 0.48;
    for (let i = 0; i < VORTEX_COUNT; i++) {
      const rnd = mulberry32(0x1000 + i);
      const digit = 1 + Math.floor(rnd() * 9);
      const r0 = lerp(VORTEX_MIN_RADIUS, VORTEX_MAX_RADIUS, rnd());
      const angle0 = rnd() * 360;
      const zIndex = Math.round(lerp(5, 15, rnd()));
      const wobble = lerp(0.5, 1.2, rnd());
      const lifeOffset = rnd();
      const sizePx = lerp(14 * scaleUnit, 24 * scaleUnit, rnd());
      const opacity = lerp(isDark ? 0.65 : 0.75, isDark ? 1.0 : 0.95, rnd());
      seeds.push({
        digit,
        r0,
        angle0,
        zIndex,
        wobble,
        lifeOffset,
        size: sizePx,
        opacity,
      });
    }
    return seeds;
  }, [VORTEX_COUNT, S]); // REMOVED: W, H, isDark als Dependencies (weniger Re-Renders)

  // --- Stop all animations mit vollständigem Reset ---
  const stopAll = useCallback(() => {
    // Alle Animationen canceln
    cancelAnimation(entrance);
    cancelAnimation(breath);
    cancelAnimation(vortexClock);
    cancelAnimation(auraClock);
    cancelAnimation(boostPulse);

    // Werte zurücksetzen
    entrance.value = 0;
    breath.value = 0;
    vortexClock.value = 0;
    auraClock.value = 0;
    boostPulse.value = 0;

    // Animation als gestoppt markieren
    isAnimationRunning.current = false;
  }, []); // Keine Dependencies - stabile Funktion

  // --- Start animations nur wenn nicht bereits laufend ---
  const startAll = useCallback(() => {
    // Prüfen ob Animation bereits läuft
    if (isAnimationRunning.current) return;

    isAnimationRunning.current = true;

    entrance.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    if (!noAnimation) {
      breath.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.cubic) })
        ),
        -1,
        false
      );

      // SLOWER: Langsamere Rotationen für bessere Performance
      vortexClock.value = withRepeat(
        withTiming(1, { duration: 18000, easing: Easing.linear }), // 18s statt 14s
        -1,
        false
      );

      auraClock.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.cubic) }), // Etwas langsamer
          withTiming(0, { duration: 3600, easing: Easing.inOut(Easing.cubic) })
        ),
        -1,
        false
      );
    }
  }, [noAnimation]); // Nur noAnimation als Dependency

  // --- Lifecycle mit Focus Effect ---
  useFocusEffect(
    useCallback(() => {
      // Start nur wenn nicht bereits laufend
      startAll();

      // Cleanup beim Verlassen
      return () => {
        stopAll();
      };
    }, []) // WICHTIG: Leere Dependencies für stabile Callbacks
  );

  // --- Interaction (logo only) ---
  const onPressIn = useCallback(() => {
    if (!interactive) return;
    boostPulse.value = 0;
    boostPulse.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) })
    );
  }, [interactive]);

  const onPressLogo = useCallback(() => {
    if (!interactive) return;
    onLogoPress?.();
  }, [interactive, onLogoPress]);

  // --- Animated styles ---
  const auraStyle = useAnimatedStyle(() => {
    const sc = lerp(0.9, 1.9, auraClock.value);
    const base = isDark ? 0.18 : 0.08;
    const peak = isDark ? 0.32 : 0.16;
    const o =
      lerp(base, peak, breath.value) + boostPulse.value * (isDark ? 0.1 : 0.06);
    return {
      transform: [{ scale: sc }],
      opacity: clamp(o, 0, isDark ? 0.5 : 0.25) * entrance.value,
    };
  });

  const energyRingStyle = useAnimatedStyle(() => {
    const rot = interpolate(vortexClock.value, [0, 1], [0, 360]);
    const scalePulse =
      lerp(1.0, 1.08, auraClock.value) *
      lerp(0.985, 1.015, breath.value) *
      lerp(1.0, 1.03, boostPulse.value);
    const base = isDark ? 0.22 : 0.12;
    const peak = isDark ? 0.46 : 0.22;
    const op = lerp(base, peak, auraClock.value);
    return {
      transform: [{ rotate: `${rot}deg` }, { scale: scalePulse }],
      opacity: op * entrance.value,
    };
  });

  const innerGlowStyle = useAnimatedStyle(() => {
    const base = isDark ? 0.22 : 0.1;
    const peak = isDark ? 0.4 : 0.18;
    const o = lerp(base, peak, breath.value);
    const sc = lerp(1.06, 1.28, auraClock.value);
    return {
      opacity: o * entrance.value,
      transform: [{ scale: sc }],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const base = lerp(1, 1.04, breath.value);
    const boost = lerp(1, 1.05, boostPulse.value);
    const finalScale = base * boost;
    // KEINE Rotation mehr:
    return {
      transform: [{ scale: finalScale }, { perspective: 1200 }],
      opacity: entrance.value,
    };
  });

  // --- Styles ---
  const styles = useMemo(
    () => makeStyles({ S, W, H, isDark }),
    [S, W, H, isDark]
  );

  // --- Rasterization nur nativ (verhindert TS-Fehler auf Web) ---
  const rasterizeStyle: any = Platform.select({
    ios: { shouldRasterizeIOS: true },
    android: { renderToHardwareTextureAndroid: true },
    default: {},
  });

  // --- Render ---
  const ringSoft = isDark ? PAL.dark.ringSoft : PAL.light.ringSoft;
  const ringMid = isDark ? PAL.dark.ringMid : PAL.light.ringMid;
  const auraTint = isDark ? PAL.dark.auraTint : PAL.light.auraTint;

  return (
    <View
      style={[{ width: W, height: H }, styles.root, style]}
      pointerEvents="box-none"
    >
      {/* optionale Top-Vignette */}
      {renderTopVignette && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 2,
              backgroundColor: isDark
                ? "rgba(0,0,0,0)" // Dark-Mode Overlay
                : "rgba(0,0,0,0)", // Light-Mode Overlay (transparent)
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Vortex (Full Stage) */}
      <View
        style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        pointerEvents="none"
      >
        {vortexSeeds.map((seed, i) => (
          <VortexDigit
            key={`vx-${i}`}
            seed={seed}
            vortexClock={vortexClock}
            entrance={entrance}
            W={W}
            H={H}
            S={S}
            isDark={isDark}
          />
        ))}
      </View>

      {/* Aura (zentriert) – Rasterize nur nativ */}
      <Animated.View
        style={[
          styles.centerLayer,
          {
            width: S * 2.2,
            height: S * 2.2,
            zIndex: 12,
            left: W / 2 - (S * 2.2) / 2,
            top: H / 2 - (S * 2.2) / 2,
          },
          rasterizeStyle,
          auraStyle,
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[auraTint, "transparent"]}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: S * 1.1,
              borderWidth: 2,
              borderColor: isDark ? PAL.dark.teal : "rgba(91,93,110,0.18)",
            },
          ]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Energiering (ohne Marker) – Rasterize nur nativ */}
      <Animated.View
        style={[
          styles.centerLayer,
          {
            width: S * 1.45,
            height: S * 1.45,
            zIndex: 15,
            left: W / 2 - (S * 1.45) / 2,
            top: H / 2 - (S * 1.45) / 2,
          },
          rasterizeStyle,
          energyRingStyle,
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={["transparent", ringSoft, ringMid, ringSoft, "transparent"]}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: (S * 1.45) / 2,
              borderWidth: 3,
              borderColor: ringSoft,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Innerer Glow – Rasterize nur nativ */}
      <Animated.View
        style={[
          styles.centerLayer,
          {
            width: S * 1.5,
            height: S * 1.5,
            zIndex: 16,
            left: W / 2 - (S * 1.5) / 2,
            top: H / 2 - (S * 1.5) / 2,
          },
          rasterizeStyle,
          innerGlowStyle,
        ]}
        pointerEvents="none"
      >
        <View
          style={{
            width: "70%",
            height: "70%",
            borderRadius: (S * 1.5 * 0.7) / 2,
            backgroundColor: isDark
              ? "rgba(74,125,120,0.18)"
              : "rgba(243,239,227,0.20)",
          }}
        />
      </Animated.View>

      {/* Logo + Interaktion */}
      <Animated.View
        style={[
          styles.centerLayer,
          {
            width: S,
            height: S,
            zIndex: 20,
            left: W / 2 - S / 2,
            top: H / 2 - S / 2,
          },
          logoStyle,
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          onPressIn={onPressIn}
          onPress={onPressLogo}
          android_disableSound
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={APP_LOGO}
            style={{ width: "70%", height: "70%" }}
            resizeMode="contain"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

// ---------- Style helpers ----------
function makeStyles(cfg: { S: number; W: number; H: number; isDark: boolean }) {
  return StyleSheet.create({
    root: {
      position: "relative",
      overflow: "hidden",
    },
    centerLayer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
  });
}

export default DuoBoardVisualizer;
