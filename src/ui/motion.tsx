import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  EasingFunction,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

export const EASE = Easing.bezier(0.2, 0.8, 0.2, 1).factory();
export const OVERSHOOT = Easing.bezier(0.3, 1.4, 0.5, 1).factory();

/* ------------------------------------------------------------------ */
/* Entrance animations (mirror the design's rise / pop / slidein / zoom) */
/* ------------------------------------------------------------------ */

interface EnterProps {
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** re-run the animation when this value changes */
  trigger?: unknown;
}

export function useEnter(delay: number, duration: number, easing: EasingFunction = EASE, trigger?: unknown) {
  const p = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      p.value = 1;
      return;
    }
    p.value = 0;
    p.value = withDelay(delay, withTiming(1, { duration, easing }));
    return () => cancelAnimation(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return p;
}

export function Rise({ delay = 0, duration = 600, style, children, trigger }: EnterProps) {
  const p = useEnter(delay, duration, EASE, trigger);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * 20 }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Pop({ delay = 0, duration = 550, style, children, trigger }: EnterProps) {
  const p = useEnter(delay, duration, OVERSHOOT, trigger);
  const a = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 2.2),
    transform: [{ scale: 0.3 + 0.7 * p.value }],
  }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Slide({ delay = 0, duration = 500, style, children, trigger }: EnterProps) {
  const p = useEnter(delay, duration, EASE, trigger);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateX: (1 - p.value) * 40 }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Zoom({ delay = 0, duration = 500, style, children, trigger }: EnterProps) {
  const p = useEnter(delay, duration, Easing.out(Easing.quad), trigger);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ scale: 0.9 + 0.1 * p.value }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** Fade only. */
export function Fade({ delay = 0, duration = 500, style, children, trigger }: EnterProps) {
  const p = useEnter(delay, duration, Easing.out(Easing.quad), trigger);
  const a = useAnimatedStyle(() => ({ opacity: p.value }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/* ------------------------------------------------------------------ */
/* Loops                                                                */
/* ------------------------------------------------------------------ */

export function useLoop(duration: number, opts: { alternate?: boolean; delay?: number; easing?: EasingFunction; run?: boolean } = {}) {
  const { alternate = false, delay = 0, easing = Easing.linear, run = true } = opts;
  const v = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !run) {
      cancelAnimation(v);
      v.value = 0;
      return;
    }
    v.value = 0;
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing }), -1, alternate));
    return () => cancelAnimation(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, duration]);
  return v;
}

export function Drift({ style, children }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(10000, { alternate: true, easing: Easing.inOut(Easing.ease) });
  const a = useAnimatedStyle(() => ({
    transform: [{ translateX: v.value * 40 }, { translateY: v.value * 50 }, { scale: 1 + v.value * 0.2 }],
  }));
  return <Animated.View pointerEvents="none" style={[style, a]}>{children}</Animated.View>;
}

/** Soft orange radial blob that slowly drifts (the design's `.glow`). */
export function Glow({ size = 420, style, alt }: { size?: number; style?: StyleProp<ViewStyle>; alt?: boolean }) {
  const { t } = useTheme();
  const id = useMemo(() => 'g' + Math.random().toString(36).slice(2, 8), []);
  return (
    <Drift style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#ea580c" stopOpacity={t.glow} />
            <Stop offset="0.66" stopColor="#ea580c" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={size} height={size} fill={`url(#${id})`} />
      </Svg>
    </Drift>
  );
}

export function Bob({ amp = 6, duration = 1200, style, children }: { amp?: number; duration?: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(duration, { alternate: true, easing: Easing.inOut(Easing.ease) });
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: -v.value * amp }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function HintX({ amp = 6, style, children }: { amp?: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(1200, { alternate: true, easing: Easing.inOut(Easing.ease) });
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: v.value * amp }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Spin({ duration = 16000, style, children }: { duration?: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(duration);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${v.value * 360}deg` }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Wiggle({ style, children }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(1200, { alternate: true, easing: Easing.inOut(Easing.ease) });
  const a = useAnimatedStyle(() => ({ transform: [{ scale: 1 + v.value * 0.15 }, { rotate: `${-3 + v.value * 6}deg` }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

export function Blink({ style, children }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const v = useLoop(1000);
  const a = useAnimatedStyle(() => ({ opacity: v.value > 0.5 ? 0 : 1 }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** Expanding halo behind round buttons (the design's `pulse`). */
export function PulseRing({ size, color = 'rgba(249,115,22,0.65)', reach = 22, delay = 0 }: { size: number; color?: string; reach?: number; delay?: number }) {
  const v = useLoop(1800, { delay, easing: Easing.out(Easing.ease) });
  const a = useAnimatedStyle(() => ({
    opacity: 0.65 * (1 - v.value),
    transform: [{ scale: 1 + (v.value * (2 * reach)) / size }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, a]}
    />
  );
}

/** Expanding outlined rings (the design's `orb`). */
export function OrbRings({ size, color, count = 2, duration = 2600 }: { size: number; color: string; count?: number; duration?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <OrbRing key={i} size={size} color={color} duration={duration} delay={(duration / count) * i} />
      ))}
    </>
  );
}
function OrbRing({ size, color, duration, delay }: { size: number; color: string; duration: number; delay: number }) {
  const v = useLoop(duration, { delay, easing: Easing.out(Easing.ease) });
  const a = useAnimatedStyle(() => ({ opacity: 0.7 * (1 - v.value), transform: [{ scale: 0.7 + v.value }] }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: color }, a]} />;
}

/** Diagonal highlight that sweeps across a button (the design's `sheen`). Parent needs overflow hidden. */
export function Sheen({ delay = 1500, tone = 'rgba(255,255,255,0.45)' }: { delay?: number; tone?: string }) {
  const [w, setW] = useState(0);
  const p = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    p.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), withDelay(1900, withTiming(0, { duration: 0 }))), -1)
    );
    return () => cancelAnimation(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(p.value, [0, 1], [-0.5 * w, 1.3 * w]) }, { skewX: '-18deg' }] }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, width: Math.max(40, w * 0.3) }, a]}>
        <LinearGradient colors={['transparent', tone, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

/** One audio-style bar. */
export function WaveBar({ run, height = 34, width = 5, color, delay = 0 }: { run: boolean; height?: number; width?: number; color: string; delay?: number }) {
  const v = useLoop(800, { alternate: true, delay, easing: Easing.inOut(Easing.ease), run });
  const a = useAnimatedStyle(() => ({ transform: [{ scaleY: 0.25 + 0.75 * v.value }] }));
  return <Animated.View style={[{ width, height, borderRadius: width / 2, backgroundColor: color }, a]} />;
}

export function Wave({ run, count = 14, height = 34, width = 5, gap = 4, color }: { run: boolean; count?: number; height?: number; width?: number; gap?: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap, height }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (
        <WaveBar key={i} run={run} height={height} width={width} color={color} delay={(i * 90) % 800} />
      ))}
    </View>
  );
}

export function Marquee({ children, duration = 24000, gap = 10 }: { children: React.ReactNode; duration?: number; gap?: number }) {
  const [w, setW] = useState(0);
  const v = useLoop(duration);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: -v.value * w }] }));
  return (
    <View style={{ overflow: 'hidden' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[{ flexDirection: 'row', alignSelf: 'flex-start' }, a]}>
        <View style={{ flexDirection: 'row', gap, paddingRight: gap }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
          {children}
        </View>
        <View style={{ flexDirection: 'row', gap, paddingRight: gap }}>{children}</View>
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Confetti                                                             */
/* ------------------------------------------------------------------ */

const CONFETTI = ['#f97316', '#f59e0b', '#34d399', '#fb923c', '#10b981', '#ea580c'];

function Piece({ i, start, height }: { i: number; start: number; height: number }) {
  const v = useSharedValue(0);
  const reduce = useReducedMotion();
  const dur = 2600 + ((i * 211) % 1700);
  const delay = start + ((i * 97) % 1200);
  useEffect(() => {
    if (reduce) return;
    v.value = withDelay(delay, withTiming(1, { duration: dur, easing: Easing.linear }));
    return () => cancelAnimation(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const a = useAnimatedStyle(() => ({
    opacity: v.value === 0 ? 0 : v.value > 0.85 ? interpolate(v.value, [0.85, 1], [1, 0]) : 1,
    transform: [{ translateY: -30 + v.value * (height + 30) }, { rotate: `${v.value * 720}deg` }],
  }));
  const w = 6 + (i % 3) * 3;
  const h = 10 + (i % 4) * 3;
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 0, left: (i * 53 + 17) % 372, width: w, height: h, backgroundColor: CONFETTI[i % CONFETTI.length], borderRadius: i % 3 === 0 ? 6 : 2 }, a]}
    />
  );
}

export function Confetti({ count = 26, start = 1700, height = 880 }: { count?: number; start?: number; height?: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} i={i} start={start} height={height} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Press feedback + count-up                                            */
/* ------------------------------------------------------------------ */

const APressable = Animated.createAnimatedComponent(Pressable);

interface PressProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scale?: number;
  haptic?: boolean;
}

export function Press({ style, scale = 0.95, haptic = true, onPress, children, ...rest }: PressProps) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <APressable
      accessibilityRole="button"
      {...rest}
      onPressIn={() => {
        s.value = withTiming(scale, { duration: 110 });
      }}
      onPressOut={() => {
        s.value = withTiming(1, { duration: 150 });
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={[style, a]}
    >
      {children}
    </APressable>
  );
}

export function useCountUp(to: number, dur = 1500, delay = 300) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setN(to);
      return;
    }
    const t0 = Date.now() + delay;
    const id = setInterval(() => {
      const p = Math.min(1, Math.max(0, (Date.now() - t0) / dur));
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [to, dur, delay, reduce]);
  return n;
}

/** Number that eases toward a moving target (live counters). */
export function useChase(target: number, startAt = 0) {
  const [n, setN] = useState(startAt);
  useEffect(() => {
    const id = setInterval(() => {
      setN((cur) => {
        const d = target - cur;
        if (d === 0) return cur;
        return cur + Math.sign(d) * Math.max(1, Math.ceil(Math.abs(d) / 6));
      });
    }, 24);
    return () => clearInterval(id);
  }, [target]);
  return n;
}

/** Bar that grows from 0 to `pct`% (the design's `grow`). */
export function GrowBar({ pct, delay = 500, height = 8, colors = ['#10b981', '#f97316'], track }: { pct: number; delay?: number; height?: number; colors?: [string, string]; track?: string }) {
  const { t } = useTheme();
  const p = useEnter(delay, 1200, EASE);
  const a = useAnimatedStyle(() => ({ width: `${p.value * pct}%` }));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track ?? t.surf2, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, overflow: 'hidden' }, a]}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

/** Progress fill 0 -> 100% over `duration` ms (story segments). */
export function FillBar({ duration, color, height = 4, active, full }: { duration: number; color: string; height?: number; active: boolean; full: boolean }) {
  const p = useSharedValue(full ? 1 : 0);
  useEffect(() => {
    cancelAnimation(p);
    if (full) p.value = 1;
    else if (active) {
      p.value = 0;
      p.value = withTiming(1, { duration, easing: Easing.linear });
    } else p.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, full, duration]);
  const a = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return <Animated.View style={[{ height, borderRadius: height / 2, backgroundColor: color }, a]} />;
}

/* ------------------------------------------------------------------ */
/* SVG path drawing                                                     */
/* ------------------------------------------------------------------ */

import { Path } from 'react-native-svg';
import Animated2 from 'react-native-reanimated';
import { useAnimatedProps } from 'react-native-reanimated';

/** Approximate length of an `M ... C ...` cubic path by sampling. */
export function cubicPathLength(d: string): number {
  const nums = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  let i = 0;
  let x = nums[i++];
  let y = nums[i++];
  let len = 0;
  while (i + 5 < nums.length + 0) {
    const [x1, y1, x2, y2, x3, y3] = nums.slice(i, i + 6);
    i += 6;
    let px = x;
    let py = y;
    for (let s = 1; s <= 40; s++) {
      const k = s / 40;
      const m = 1 - k;
      const cx = m * m * m * x + 3 * m * m * k * x1 + 3 * m * k * k * x2 + k * k * k * x3;
      const cy = m * m * m * y + 3 * m * m * k * y1 + 3 * m * k * k * y2 + k * k * k * y3;
      len += Math.hypot(cx - px, cy - py);
      px = cx;
      py = cy;
    }
    x = x3;
    y = y3;
  }
  return len;
}

const APath = Animated2.createAnimatedComponent(Path);

/** Stroke that draws itself. `frac` is how much of the path ends up visible (0..1). */
export function DrawPath({ d, stroke, width, delay = 0, duration = 1800, frac = 1, cap = 'round' }: { d: string; stroke: string; width: number; delay?: number; duration?: number; frac?: number; cap?: 'round' | 'butt' }) {
  const len = useMemo(() => cubicPathLength(d), [d]);
  const vis = len * frac;
  const p = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      p.value = 1;
      return;
    }
    p.value = withDelay(delay, withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }));
  }, [delay, duration, p, reduce]);
  const ap = useAnimatedProps(() => ({ strokeDashoffset: vis * (1 - p.value) }));
  return <APath d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap={cap} strokeDasharray={[vis, len + 10]} animatedProps={ap} />;
}
