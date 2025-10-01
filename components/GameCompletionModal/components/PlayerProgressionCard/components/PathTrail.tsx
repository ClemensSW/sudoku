// components/GameCompletionModal/components/PlayerProgressionCard/components/PathTrail.tsx
import React, { useState, useMemo, useEffect } from "react";
import { View, LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Path as SvgPath,
  Circle as SvgCircle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from "react-native-svg";

type PathTrailProps = {
  color: string;
  isDark: boolean;
  currentLevel: number;
  previousLevel: number;
  milestoneLevels: number[]; // [5, 10, 15, 20]
};

/**
 * Mappt den Level auf "Trail-Einheiten":
 * 0  -> Start
 * 5  -> 1. Milestone
 * 10 -> 2. Milestone
 * 15 -> 3. Milestone
 * 20 -> 4. Milestone
 * Dazwischen linear interpoliert (z.B. Level 12 => 2 + 0.4 = 2.4)
 */
function levelToUnits(level: number, ms: number[]) {
  const sorted = [...ms].sort((a, b) => a - b);
  if (level <= 0) return 0;
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    if (level < m) {
      const start = i === 0 ? 0 : sorted[i - 1];
      const t = (level - start) / (m - start);
      return i + Math.max(0, Math.min(1, t));
    }
  }
  return sorted.length; // >= letzter Milestone
}

function hexToRGBA(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) || 0;
  const g = parseInt(m.substring(2, 4), 16) || 0;
  const b = parseInt(m.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Punkt auf kubischer Kurve
const cubicPoint = (p0: any, c1: any, c2: any, p1: any, t: number) => {
  const mt = 1 - t;
  const x =
    mt * mt * mt * p0.x +
    3 * mt * mt * t * c1.x +
    3 * mt * t * t * c2.x +
    t * t * t * p1.x;
  const y =
    mt * mt * mt * p0.y +
    3 * mt * mt * t * c1.y +
    3 * mt * t * t * c2.y +
    t * t * t * p1.y;
  return { x, y };
};

const PathTrail: React.FC<PathTrailProps> = ({
  color,
  isDark,
  currentLevel,
  previousLevel,
  milestoneLevels,
}) => {
  const [w, setW] = useState(0);
  const h = 120;
  const padX = 16;
  const baseY = 70;
  const amp = 24;

  const onLayout = (e: LayoutChangeEvent) => {
    setW(e.nativeEvent.layout.width);
  };

  const TOTAL_NODES = milestoneLevels.length + 1; // Start + Milestones

  // animierter Wegfortschritt (in Node-Einheiten)
  const prevUnits = useMemo(
    () => levelToUnits(previousLevel, milestoneLevels),
    [previousLevel, milestoneLevels]
  );
  const curUnits = useMemo(
    () => levelToUnits(currentLevel, milestoneLevels),
    [currentLevel, milestoneLevels]
  );

  const sv = useSharedValue(prevUnits);
  const [p, setP] = useState(prevUnits);

  useEffect(() => {
    sv.value = withTiming(curUnits, {
      duration: 1200,
      easing: Easing.bezierFn(0.22, 1, 0.36, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curUnits]);

  useAnimatedReaction(
    () => sv.value,
    (v) => {
      runOnJS(setP)(v);
    },
    [sv]
  );

  // Wegpunkte (Nodes) generieren
  const nodes = useMemo(() => {
    if (w === 0) return [];
    const usable = Math.max(80, w - padX * 2);
    const step = usable / (TOTAL_NODES - 1);
    return Array.from({ length: TOTAL_NODES }, (_, i) => {
      const x = padX + i * step;
      const y =
        i % 2 === 0
          ? baseY + (i === 0 ? 0 : amp * 0.22)
          : baseY - (i === TOTAL_NODES - 2 ? amp * 0.45 : amp);
      return { x, y };
    });
  }, [w, TOTAL_NODES]);

  // Geschwungener Pfad (kubisch)
  const trailPath = useMemo(() => {
    if (nodes.length === 0) return "";
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 0; i < nodes.length - 1; i++) {
      const p0 = nodes[i];
      const p1 = nodes[i + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };
      d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p1.x} ${p1.y}`;
    }
    return d;
  }, [nodes]);

  // ---- Füllpfad exakt bis tEnd (fein gesampelt) ----
  const filledPath = useMemo(() => {
    if (nodes.length === 0) return "";

    const clamp = (x: number, a: number, b: number) =>
      Math.max(a, Math.min(b, x));
    const prog = clamp(p, 0, TOTAL_NODES - 1);
    const segIndex = Math.floor(prog);
    const tEnd = prog - segIndex; // Anteil im aktuellen Segment [0..1]

    const points: { x: number; y: number }[] = [];
    points.push(nodes[0]);

    const SAMPLES_FULL = 24; // feinere Auflösung
    // Vollständige Segmente bis segIndex-1
    for (let i = 0; i < segIndex; i++) {
      const p0 = nodes[i];
      const p1 = nodes[i + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };
      for (let s = 1; s <= SAMPLES_FULL; s++) {
        const t = s / SAMPLES_FULL;
        points.push(cubicPoint(p0, c1, c2, p1, t));
      }
    }

    // Teilsegment bis tEnd
    if (segIndex < TOTAL_NODES - 1) {
      const p0 = nodes[segIndex];
      const p1 = nodes[segIndex + 1];
      const dx = p1.x - p0.x;
      const c1 = { x: p0.x + dx * 0.35, y: p0.y };
      const c2 = { x: p1.x - dx * 0.35, y: p1.y };

      if (tEnd > 0) {
        const endSteps = Math.max(1, Math.ceil(SAMPLES_FULL * tEnd));
        for (let s = 1; s <= endSteps; s++) {
          const t = (s / endSteps) * tEnd; // letzter t exakt = tEnd
          points.push(cubicPoint(p0, c1, c2, p1, t));
        }
      }
    }

    if (points.length <= 1) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }, [nodes, p, TOTAL_NODES]);

  // Marker-Position
  const marker = useMemo(() => {
    if (nodes.length === 0) return { x: 0, y: 0 };
    const clamp = (x: number, a: number, b: number) =>
      Math.max(a, Math.min(b, x));
    const prog = clamp(p, 0, TOTAL_NODES - 1);
    const i = Math.floor(prog);
    const tEnd = prog - i;

    if (i >= TOTAL_NODES - 1) return nodes[TOTAL_NODES - 1];

    const p0 = nodes[i];
    const p1 = nodes[i + 1];
    const dx = p1.x - p0.x;
    const c1 = { x: p0.x + dx * 0.35, y: p0.y };
    const c2 = { x: p1.x - dx * 0.35, y: p1.y };
    return cubicPoint(p0, c1, c2, p1, tEnd);
  }, [nodes, p, TOTAL_NODES]);

  const trailBg = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.10)";
  const fillGlow = hexToRGBA(color, 0.18);

  const markerPulse = useSharedValue(1);
  useEffect(() => {
    markerPulse.value = withSequence(
      withTiming(1.12, { duration: 700, easing: Easing.out(Easing.quad) }),
      withTiming(1.0, { duration: 700, easing: Easing.inOut(Easing.quad) })
    );
  }, [markerPulse, curUnits]);

  const markerStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: marker.x - 7 },
        { translateY: marker.y - 7 },
        { scale: markerPulse.value },
      ],
    }),
    [marker]
  );

  return (
    <View style={styles.trailContainer} onLayout={onLayout}>
      {w > 0 && (
        <>
          <Svg width={"100%"} height={h}>
            <Defs>
              <SvgLinearGradient id="trailGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={hexToRGBA(color, 0.85)} />
                <Stop offset="1" stopColor={hexToRGBA(color, 0.65)} />
              </SvgLinearGradient>
            </Defs>

            {/* Hintergrund-Trail */}
            <SvgPath
              d={trailPath}
              stroke={trailBg}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Gefüllter Bereich bis Marker (mit Glow) */}
            {filledPath !== "" && (
              <>
                <SvgPath
                  d={filledPath}
                  stroke={fillGlow}
                  strokeWidth={11}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <SvgPath
                  d={filledPath}
                  stroke={"url(#trailGradient)"}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </>
            )}

            {/* Wegpunkte */}
            <G>
              {nodes.map((pt, idx) => {
                const done = p >= idx - 0.02;
                const outer = done ? color : trailBg;
                const inner = done
                  ? "#ffffff"
                  : isDark
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(0,0,0,0.45)";
                return (
                  <G key={`wp-${idx}`}>
                    <SvgCircle cx={pt.x} cy={pt.y} r={9.5} fill={outer} />
                    <SvgCircle cx={pt.x} cy={pt.y} r={5.5} fill={inner} />
                  </G>
                );
              })}
            </G>
          </Svg>

          {/* Beweglicher Marker */}
          <Animated.View
            style={[
              styles.trailMarker,
              { backgroundColor: "#fff", shadowColor: color },
              markerStyle,
            ]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trailContainer: {
    width: "100%",
    height: 120,
    marginTop: 2,
    marginBottom: 16,
  },
  trailMarker: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 3,
  },
});

export default PathTrail;
