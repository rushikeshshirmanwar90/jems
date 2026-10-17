import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  useWindowDimensions,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { brand } from '@/theme/tokens';
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { BODY, DISP } from './fonts';
import { Icon } from './Icon';
import { IconName } from './iconData';
import { Glow, Press, Sheen, Wiggle, EASE } from './motion';

export const go = (path: string) => router.push(path as never);
export const swap = (path: string) => router.replace(path as never);
export const back = (fallback: string) => (router.canGoBack() ? router.back() : router.replace(fallback as never));

/* ------------------------------ Text ------------------------------- */

type ColorKey = 'fg' | 'sub' | 'dim' | 'brand' | 'good' | 'gold' | 'danger' | 'eyebrow' | 'invfg' | 'inv';
export function useColor(c?: string) {
  const { t } = useTheme();
  if (!c) return t.fg;
  if (c in t) return (t as unknown as Record<string, string>)[c];
  return c;
}

interface TxtProps extends TextProps {
  w?: 4 | 5 | 6 | 7 | 8;
  size?: number;
  lh?: number;
  color?: ColorKey | (string & {});
  align?: TextStyle['textAlign'];
}
export function Txt({ w = 4, size = 16, lh, color, align, style, ...rest }: TxtProps) {
  const c = useColor(color);
  return <Text {...rest} style={[{ fontFamily: BODY[w], fontSize: size, lineHeight: lh ?? Math.round(size * 1.4), color: c, textAlign: align }, style]} />;
}

interface DispProps extends TextProps {
  size?: number;
  lh?: number;
  color?: ColorKey | (string & {});
  ls?: number; // letter-spacing in em, default -0.04
  align?: TextStyle['textAlign'];
}
export function Disp({ size = 36, lh, color, ls = -0.04, align, style, ...rest }: DispProps) {
  const c = useColor(color);
  return <Text {...rest} style={[{ fontFamily: DISP, fontSize: size, lineHeight: lh ?? Math.round(size * 1.05), letterSpacing: size * ls, color: c, textAlign: align }, style]} />;
}

export function Eyebrow({ children, color, style }: { children: string; color?: string; style?: StyleProp<TextStyle> }) {
  const c = useColor(color ?? 'eyebrow');
  return <Text style={[{ fontFamily: BODY[7], fontSize: 12, letterSpacing: 1.9, color: c, textTransform: 'uppercase' }, style]}>{children}</Text>;
}

export function H1({ children, size = 40, color, style }: { children: React.ReactNode; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  return (
    <Disp size={size} lh={size} color={color} style={[{ marginTop: 6 }, style]}>
      {children}
    </Disp>
  );
}

export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <Disp size={22} lh={26} ls={-0.03} style={style}>
      {children}
    </Disp>
  );
}

/* ------------------------------ Chips ------------------------------ */

export type Tone = '' | 'g' | 'o' | 'b' | 'r';
export function toneColors(t: Tokens, tone: Tone) {
  switch (tone) {
    case 'g': return { bg: t.goodbg, fg: t.good };
    case 'o': return { bg: t.goldbg, fg: t.gold };
    case 'b': return { bg: t.brandbg, fg: t.brand };
    case 'r': return { bg: t.dangerbg, fg: t.danger };
    default: return { bg: t.surf2, fg: t.sub };
  }
}

interface ChipProps {
  tone?: Tone;
  icon?: IconName;
  children: React.ReactNode;
  h?: number;
  size?: number;
  bg?: string;
  fg?: string;
  style?: StyleProp<ViewStyle>;
}
export function Chip({ tone = '', icon, children, h = 28, size = 12, bg, fg, style }: ChipProps) {
  const { t } = useTheme();
  const c = toneColors(t, tone);
  const color = fg ?? c.fg;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6, height: h, paddingHorizontal: 12, borderRadius: h / 2, backgroundColor: bg ?? c.bg, alignSelf: 'flex-start' }, style]}>
      {icon ? <Icon name={icon} size={Math.round(size + 2)} color={color} sw={2.6} /> : null}
      <Txt w={7} size={size} color={color} lh={size + 4}>
        {children}
      </Txt>
    </View>
  );
}

/* ------------------------------ Buttons ---------------------------- */

interface BtnProps {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  lead?: IconName;
  height?: number;
  sheen?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  colors?: readonly [string, string];
  textColor?: string;
  size?: number;
}
export function Btn({ label, onPress, icon, lead, height = 58, sheen = true, style, disabled, colors = brand.cta, textColor = '#fff', size = 17 }: BtnProps) {
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[
        { height, borderRadius: height / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', shadowColor: '#d4450a', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
        style,
      ]}
    >
      <LinearGradient colors={[colors[0], colors[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {sheen && !disabled ? <Sheen /> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {lead ? <Icon name={lead} size={20} color={textColor} sw={2.4} /> : null}
        <Txt w={7} size={size} color={textColor}>
          {label}
        </Txt>
        {icon ? <Icon name={icon} size={20} color={textColor} sw={2.6} /> : null}
      </View>
    </Press>
  );
}

export function Btn2({ label, onPress, icon, lead, height = 54, style }: { label: string; onPress?: () => void; icon?: IconName; lead?: IconName; height?: number; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <Press
      onPress={onPress}
      accessibilityLabel={label}
      style={[{ height, borderRadius: height / 2, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }, style]}
    >
      {lead ? <Icon name={lead} size={20} color={t.fg} sw={2.4} /> : null}
      <Txt w={7} size={16}>
        {label}
      </Txt>
      {icon ? <Icon name={icon} size={20} color={t.fg} sw={2.4} /> : null}
    </Press>
  );
}

export function TextLink({ label, onPress, color, size = 15, style }: { label: string; onPress: () => void; color?: string; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Press onPress={onPress} scale={0.97} style={[{ minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }, style]}>
      <Txt w={6} size={size} color={color ?? 'sub'}>
        {label}
      </Txt>
    </Press>
  );
}

export function RoundBtn({ icon, label, onPress, size = 44, bg, color, sw = 2 }: { icon: IconName; label: string; onPress?: () => void; size?: number; bg?: string; color?: string; sw?: number }) {
  const { t } = useTheme();
  return (
    <Press onPress={onPress} accessibilityLabel={label} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg ?? t.surf2, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={Math.round(size * 0.5)} color={color ?? t.fg} sw={sw} />
    </Press>
  );
}

export function BackBtn({ to }: { to: string }) {
  return <RoundBtn icon="left" label="Back" onPress={() => back(to)} size={44} />;
}

/* ------------------------------ Gradients -------------------------- */

export type GradKind = 'g1' | 'g2' | 'g3' | 'g4';
const GRADS: Record<GradKind, { colors: [string, string, string]; loc: [number, number, number] }> = {
  g1: { colors: ['#c2410c', '#7c2d12', '#1f1410'], loc: [0, 0.55, 1] },
  g2: { colors: ['#1f2937', '#111a2b', '#0b1220'], loc: [0, 0.5, 1] },
  g3: { colors: ['#92400e', '#451a03', '#111827'], loc: [0, 0.6, 1] },
  g4: { colors: ['#065f46', '#064e3b', '#0b1220'], loc: [0, 0.45, 1] },
};
export const ON_G = '#fffbf0';
export const ON_G_SUB = '#e7e5e4';

/** Always-dark feature surface (the design's g1..g4). Text on it is cream. */
export function Grad({ kind = 'g1', style, children, border }: { kind?: GradKind; style?: StyleProp<ViewStyle>; children?: React.ReactNode; border?: boolean }) {
  const g = GRADS[kind];
  const id = useMemo(() => 'rg' + Math.random().toString(36).slice(2, 8), []);
  const [box, setBox] = useState({ w: 0, h: 0 });
  return (
    <View onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={[{ overflow: 'hidden' }, border ? { borderWidth: 1, borderColor: 'rgba(255,251,240,0.12)' } : null, style]}>
      <LinearGradient colors={g.colors} locations={g.loc} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={StyleSheet.absoluteFill} />
      {kind === 'g2' && box.w > 0 ? (
        <Svg width={box.w} height={box.h} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
          <Defs>
            <RadialGradient id={id} cx={box.w * 0.85} cy={0} r={Math.max(box.w, box.h) * 0.55} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#f59e0b" stopOpacity={0.5} />
              <Stop offset="1" stopColor="#f59e0b" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={box.w} height={box.h} fill={`url(#${id})`} />
        </Svg>
      ) : null}
      {children}
    </View>
  );
}

export function Badge({ kind = 'g1', letter, size = 48, radius, fontSize }: { kind?: GradKind; letter: string; size?: number; radius?: number; fontSize?: number }) {
  return (
    <Grad kind={kind} style={{ width: size, height: size, borderRadius: radius ?? size / 3, alignItems: 'center', justifyContent: 'center' }}>
      <Disp size={fontSize ?? Math.round(size * 0.4)} ls={0} color={ON_G}>
        {letter}
      </Disp>
    </Grad>
  );
}

/* ------------------------------ Rings ------------------------------ */

export function Ring({ size, stroke, value, colors = ['#10b981', '#f59e0b'], track, children }: { size: number; stroke: number; value: number; colors?: [string, string]; track?: string; children?: React.ReactNode }) {
  const { t } = useTheme();
  const id = useMemo(() => 'ring' + Math.random().toString(36).slice(2, 8), []);
  const r = (size - stroke) / 2;
  const c = size / 2;
  const C = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </SvgGradient>
        </Defs>
        <Circle cx={c} cy={c} r={r} fill="none" stroke={track ?? t.surf2} strokeWidth={stroke} />
        <Circle cx={c} cy={c} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${C}`} strokeDashoffset={C * (1 - Math.min(100, Math.max(0, value)) / 100)} rotation={-90} origin={`${c}, ${c}`} />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>{children}</View>
    </View>
  );
}

const ACircle = Animated.createAnimatedComponent(Circle);
/** Ring that draws itself to `to` percent once (used on onboarding). */
export function DrawRing({ size, stroke, to, delay = 300, duration = 1600, colors = ['#10b981', '#f59e0b'], children }: { size: number; stroke: number; to: number; delay?: number; duration?: number; colors?: [string, string]; children?: React.ReactNode }) {
  const { t } = useTheme();
  const id = useMemo(() => 'dr' + Math.random().toString(36).slice(2, 8), []);
  const r = (size - stroke) / 2;
  const c = size / 2;
  const C = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(to / 100, { duration, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  const ap = useAnimatedProps(() => ({ strokeDashoffset: C * (1 - p.value) }));
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </SvgGradient>
        </Defs>
        <Circle cx={c} cy={c} r={r} fill="none" stroke={t.surf2} strokeWidth={stroke} />
        <ACircle cx={c} cy={c} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${C}`} animatedProps={ap} rotation={-90} origin={`${c}, ${c}`} />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>{children}</View>
    </View>
  );
}

/* ------------------------------ Layout ----------------------------- */

export interface GlowSpec { top?: number; left?: number; right?: number; bottom?: number; size?: number }
const DEFAULT_GLOWS: GlowSpec[] = [{ top: -90, right: -150, size: 440 }];

interface ScreenProps {
  children?: React.ReactNode;
  nav?: React.ReactNode;
  glows?: GlowSpec[];
  scroll?: boolean;
  /** extra space under the content (default clears the floating nav) */
  bottom?: number;
  padX?: number;
  contentStyle?: StyleProp<ViewStyle>;
  overlay?: React.ReactNode;
}
export function Screen({ children, nav, glows = DEFAULT_GLOWS, scroll = true, bottom, padX = 24, contentStyle, overlay }: ScreenProps) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = bottom ?? (nav ? 120 + insets.bottom : 40 + insets.bottom);
  // A BottomCta must stay pinned to the screen, not to the scrolled content.
  const kids = React.Children.toArray(children);
  const pinned = kids.filter((c) => React.isValidElement(c) && c.type === BottomCta);
  const body = kids.filter((c) => !(React.isValidElement(c) && c.type === BottomCta));
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {glows.map((g, i) => (
          <Glow key={i} size={g.size ?? 420} style={{ top: g.top, left: g.left, right: g.right, bottom: g.bottom }} />
        ))}
      </View>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingTop: insets.top + 22, paddingHorizontal: padX, paddingBottom: bottomPad }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingTop: insets.top }, contentStyle]}>{body}</View>
      )}
      {pinned}
      {overlay}
      {nav}
    </View>
  );
}

/** Gradient fade + pinned CTA area at the bottom of a screen. */
export function BottomCta({ children, gap = 6 }: { children: React.ReactNode; gap?: number }) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <LinearGradient pointerEvents="none" colors={['transparent', t.bg, t.bg]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ paddingHorizontal: 24, paddingTop: 36, paddingBottom: 30 + Math.max(0, insets.bottom - 10), gap }}>{children}</View>
    </View>
  );
}

export function Row({ children, onPress, last, style, align = 'center', gap = 14, py = 14 }: { children?: React.ReactNode; onPress?: () => void; last?: boolean; style?: StyleProp<ViewStyle>; align?: 'center' | 'flex-start'; gap?: number; py?: number }) {
  const { t } = useTheme();
  const st: ViewStyle = { flexDirection: 'row', alignItems: align, gap, paddingVertical: py, minHeight: 44, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.line };
  if (onPress) {
    return (
      <Press onPress={onPress} scale={0.98} haptic={false} style={[st, style]}>
        {children}
      </Press>
    );
  }
  return <View style={[st, style]}>{children}</View>;
}

export function IconCircle({ icon, bg, color, size = 44, iconSize, sw = 2 }: { icon: IconName; bg: string; color: string; size?: number; iconSize?: number; sw?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.45)} color={color} sw={sw} />
    </View>
  );
}

export function Hint({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <Txt size={13} lh={19} color="dim" style={style}>
      {children}
    </Txt>
  );
}

/* ------------------------------ Form bits -------------------------- */

export function Fld({ label, ...rest }: TextInputProps & { label: string }) {
  const { t } = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ borderBottomWidth: 1.5, borderBottomColor: focus ? '#ea580c' : t.line, paddingTop: 6, paddingBottom: 8 }}>
      <Txt w={7} size={12} lh={16} color="dim" style={{ letterSpacing: 0.7 }}>
        {label}
      </Txt>
      <TextInput
        placeholderTextColor={t.dim}
        {...rest}
        onFocus={(e) => {
          setFocus(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          rest.onBlur?.(e);
        }}
        style={[{ fontFamily: BODY[5], fontSize: 18, color: t.fg, paddingTop: 6, paddingBottom: 2, paddingHorizontal: 0 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null]}
      />
    </View>
  );
}

export function Tabs({ items, value, onChange, style }: { items: string[]; value: number; onChange: (i: number) => void; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{ marginHorizontal: -24 }, style]} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }} accessibilityRole="tablist">
      {items.map((l, i) => {
        const on = value === i;
        return (
          <Press key={l} onPress={() => onChange(i)} scale={0.95} accessibilityState={{ selected: on }} style={{ height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: on ? t.inv : t.surf, alignItems: 'center', justifyContent: 'center' }}>
            <Txt w={7} size={14} color={on ? t.invfg : t.sub}>
              {l}
            </Txt>
          </Press>
        );
      })}
    </ScrollView>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(on ? 1 : 0, { duration: 250, easing: Easing.out(Easing.back(1.6)) });
  }, [on, p]);
  const { t } = useTheme();
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: p.value * 22 }] }));
  return (
    <Press onPress={() => onChange(!on)} haptic scale={0.94} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={label} style={{ width: 52, height: 30, borderRadius: 15, backgroundColor: on ? '#10b981' : t.surf2 }}>
      <Animated.View style={[{ position: 'absolute', top: 3, left: 3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } }, knob]} />
    </Press>
  );
}

export function Seg({ options, value, onChange }: { options: { label: string; icon?: IconName }[]; value: number; onChange: (i: number) => void }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', padding: 4, borderRadius: 22, backgroundColor: t.surf2 }} accessibilityRole="radiogroup">
      {options.map((o, i) => {
        const on = i === value;
        return (
          <Press key={o.label} onPress={() => onChange(i)} scale={0.97} accessibilityState={{ selected: on }} style={{ flex: 1, height: 40, borderRadius: 18, backgroundColor: on ? t.inv : 'transparent', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
            {o.icon ? <Icon name={o.icon} size={18} color={on ? t.invfg : t.sub} /> : null}
            <Txt w={7} size={14} color={on ? t.invfg : t.sub}>
              {o.label}
            </Txt>
          </Press>
        );
      })}
    </View>
  );
}

export function Toast({ text, bottom, top }: { text: string; bottom?: number; top?: number }) {
  const { t } = useTheme();
  const p = useSharedValue(0);
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (!text) return;
    setShown(text);
    p.value = 0;
    p.value = withSequence(withTiming(1, { duration: 250, easing: EASE }), withDelay(1200, withTiming(0, { duration: 300 })));
  }, [text, p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * -12 }, { scale: 0.9 + 0.1 * p.value }] }));
  if (!shown) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, bottom, alignItems: 'center', zIndex: 40 }}>
      <Animated.View accessibilityRole="alert" style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 38, paddingHorizontal: 16, borderRadius: 19, backgroundColor: t.inv, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 10 } }, a]}>
        <Txt w={7} size={13} color={t.invfg}>
          {shown}
        </Txt>
      </Animated.View>
    </View>
  );
}

/* ------------------------------ Code ------------------------------- */

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, Menlo, Consolas, monospace' });
export function CodeBlock({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ padding: 16, borderRadius: 18, backgroundColor: '#0b1220' }, style]}>
      <Text style={{ fontFamily: MONO, fontSize: 13, lineHeight: 20, color: '#e7e5e4' }}>{children}</Text>
    </View>
  );
}
export const K = ({ children }: { children: React.ReactNode }) => <Text style={{ color: '#fb923c' }}>{children}</Text>;
export const S = ({ children }: { children: React.ReactNode }) => <Text style={{ color: '#6ee7b7' }}>{children}</Text>;
export const F = ({ children }: { children: React.ReactNode }) => <Text style={{ color: '#fcd34d' }}>{children}</Text>;
export const mono = MONO;

/* ------------------------------ Nav -------------------------------- */

export type NavKind = 'student' | 'co' | 'inst' | 'fac';
const NAVS: Record<NavKind, { key: string; to: string; label: string; icon: IconName }[]> = {
  student: [
    { key: 'home', to: '/home', label: 'Home', icon: 'home' },
    { key: 'skills', to: '/skills', label: 'Skills', icon: 'shield' },
    { key: 'jobs', to: '/jobs', label: 'Jobs', icon: 'briefcase' },
    { key: 'learn', to: '/roadmap', label: 'Learn', icon: 'cap' },
    { key: 'profile', to: '/profile', label: 'Profile', icon: 'user' },
  ],
  co: [
    { key: 'home', to: '/co-home', label: 'Home', icon: 'home' },
    { key: 'open', to: '/co-openings', label: 'Openings', icon: 'briefcase' },
    { key: 'cands', to: '/co-candidates', label: 'Talent', icon: 'users' },
    { key: 'prog', to: '/co-programs', label: 'Programs', icon: 'cap' },
  ],
  inst: [
    { key: 'home', to: '/inst-home', label: 'Home', icon: 'home' },
    { key: 'stud', to: '/inst-students', label: 'Students', icon: 'users' },
    { key: 'ins', to: '/inst-insights', label: 'Insights', icon: 'chart' },
    { key: 'collab', to: '/inst-collab', label: 'Partners', icon: 'handshake' },
  ],
  fac: [
    { key: 'board', to: '/fac-board', label: 'Board', icon: 'briefcase' },
    { key: 'int', to: '/fac-interests', label: 'Interests', icon: 'star' },
    { key: 'set', to: '/settings', label: 'Settings', icon: 'sliders' },
  ],
};

/** The floating pill tab bar from the design. */
export function FloatingNav({ kind, active }: { kind: NavKind; active: string }) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: 'absolute', left: 16, right: 16, bottom: 20 + Math.max(0, insets.bottom - 14), height: 64, borderRadius: 32,
        backgroundColor: t.nav, borderWidth: 1, borderColor: t.line, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8,
        shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 14 }, elevation: 12, zIndex: 30,
      }}
    >
      {NAVS[kind].map((n) =>
        n.key === active ? (
          <View key={n.key} accessibilityRole="tab" accessibilityState={{ selected: true }} style={{ height: 48, paddingHorizontal: 16, borderRadius: 24, backgroundColor: '#c2410c', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name={n.icon} size={22} color="#fff" sw={2.2} />
            <Txt w={7} size={13} color="#fff">
              {n.label}
            </Txt>
          </View>
        ) : (
          <Press key={n.key} onPress={() => swap(n.to)} accessibilityLabel={n.label} accessibilityState={{ selected: false }} style={{ flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={n.icon} size={24} color={t.sub} />
          </Press>
        )
      )}
    </View>
  );
}

export { Wiggle };

/* --------------------------- Design stage --------------------------- */



/** Absolute-position canvas authored at 390px wide, scaled down on narrower phones. */
export function DesignStage({ height, children, style }: { height: number; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { width } = useWindowDimensions();
  const s = Math.min(1, width / 390);
  return (
    <View style={[{ width: Math.min(width, 390), height: height * s, alignSelf: 'center' }, style]}>
      <View style={{ width: 390, height, transformOrigin: 'top left', transform: [{ scale: s }] }}>{children}</View>
    </View>
  );
}

/* --------------------------- Gradient text -------------------------- */

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Per-letter colour ramp (works everywhere, no masking needed). */
export function GradText({ text, from, to, size, lh, ls = -0.05 }: { text: string; from: string; to: string; size: number; lh?: number; ls?: number }) {
  const a = hex(from);
  const b = hex(to);
  const chars = text.split('');
  return (
    <Text style={{ fontFamily: DISP, fontSize: size, lineHeight: lh ?? size, letterSpacing: size * ls }}>
      {chars.map((ch, i) => {
        const k = chars.length === 1 ? 0 : i / (chars.length - 1);
        const c = a.map((v, j) => Math.round(v + (b[j] - v) * k));
        return (
          <Text key={i} style={{ color: `rgb(${c[0]},${c[1]},${c[2]})` }}>
            {ch}
          </Text>
        );
      })}
    </Text>
  );
}
