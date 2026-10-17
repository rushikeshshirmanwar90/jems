// Building blocks for the JEMS skill flow, following Apple's Human Interface Guidelines on top of the
// JEMS look: a standard navigation bar, inset grouped lists, segmented controls, native alerts and
// page sheets, 44pt touch targets, VoiceOver labels and haptics that match the action.

import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Platform, RefreshControl, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { IconName } from './iconData';
import { back, BottomCta, Disp, Eyebrow, Toast, Tone, toneColors, Txt } from './kit';
import { Glow, Pop, Press, Rise } from './motion';

/* ------------------------------ Haptics ---------------------------- */

type Buzz = 'light' | 'medium' | 'success' | 'warning' | 'error';
export function buzz(kind: Buzz) {
  if (Platform.OS === 'web') return;
  const run =
    kind === 'light' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    : kind === 'medium' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    : Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : kind === 'warning' ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Error);
  run.catch(() => {});
}

/* ------------------------------ Feedback --------------------------- */

/** Native alert with Cancel / confirm buttons. Resolves true when confirmed. */
export function confirm({ title, message, confirmLabel = 'OK', cancelLabel = 'Cancel', destructive }: { title: string; message?: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean }) {
  return new Promise<boolean>((resolve) => {
    if (Platform.OS === 'web') {
      resolve(window.confirm(message ? `${title}\n\n${message}` : title));
      return;
    }
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
    ], { cancelable: true, onDismiss: () => resolve(false) });
  });
}

/** A toast that can be shown again with the same text. Render `node` once near the screen root. */
export function useToast() {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState({ text: '', n: 0 });
  const show = useCallback((text: string) => setState((s) => ({ text, n: s.n + 1 })), []);
  const node = state.n ? <Toast key={state.n} text={state.text} top={insets.top + 64} /> : null;
  return { show, node };
}

export async function openLink(url: string, onError?: (message: string) => void) {
  try {
    await Linking.openURL(url);
  } catch {
    onError?.("Couldn't open the link.");
  }
}

/** Horizontal shake for "you can't do that yet". */
export function useShake() {
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const shake = useCallback(() => {
    buzz('warning');
    x.set(withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 70 }), withTiming(-5, { duration: 60 }), withTiming(0, { duration: 50 })));
  }, [x]);
  return { style, shake };
}

/* ------------------------------ Screen chrome ---------------------- */

/** Standard navigation bar: back chevron on the left, centered title, optional trailing item. */
export function NavBar({ title, onBack, fallback = '/home', right, backIcon = 'left', backLabel = 'Back' }: { title?: string; onBack?: () => void; fallback?: string; right?: React.ReactNode; backIcon?: IconName; backLabel?: string }) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: t.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line, zIndex: 10 }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <View style={{ minWidth: 96, alignItems: 'flex-start' }}>
          <Press onPress={onBack ?? (() => back(fallback))} accessibilityLabel={backLabel} hitSlop={6} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={backIcon} size={22} color={t.fg} sw={2.4} />
          </Press>
        </View>
        <Txt w={7} size={17} align="center" numberOfLines={1} accessibilityRole="header" style={{ flex: 1 }}>{title ?? ''}</Txt>
        <View style={{ minWidth: 96, alignItems: 'flex-end' }}>{right}</View>
      </View>
    </View>
  );
}

/** A pushed screen: nav bar, scrolling content with pull-to-refresh, and an optional pinned footer. */
export function FlowScreen({ title, nav, footer, children, onRefresh, scrollRef, overlay, fallback }: {
  title?: string;
  nav?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onRefresh?: () => Promise<unknown>;
  scrollRef?: React.RefObject<ScrollView | null>;
  overlay?: React.ReactNode;
  fallback?: string;
}) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = onRefresh ? async () => { setRefreshing(true); try { await onRefresh(); } finally { setRefreshing(false); } } : undefined;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none"><Glow size={420} style={{ top: -60, right: -170 }} /></View>
      {nav ?? <NavBar title={title} fallback={fallback} />}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: (footer ? 150 : 40) + insets.bottom, gap: 22 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        refreshControl={refresh ? <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={t.brand} colors={[t.brand]} /> : undefined}
      >
        {children}
      </ScrollView>
      {footer ? <BottomCta>{footer}</BottomCta> : null}
      {overlay}
    </View>
  );
}

/** Large title block under the nav bar. */
export function TitleBlock({ eyebrow, title, sub, delay = 0 }: { eyebrow?: string; title: string; sub?: string; delay?: number }) {
  return (
    <Rise delay={delay}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Disp size={32} lh={35} ls={-0.035} style={{ marginTop: eyebrow ? 6 : 0 }} accessibilityRole="header">{title}</Disp>
      {sub ? <Txt size={15} lh={22} color="sub" style={{ marginTop: 8 }}>{sub}</Txt> : null}
    </Rise>
  );
}

/** "Step 2 of 3" with a three-part bar. */
export function StepProgress({ step, total = 3 }: { step: number; total?: number }) {
  const { t } = useTheme();
  return (
    <View accessible accessibilityLabel={`Step ${step} of ${total}`} style={{ gap: 8 }}>
      <Txt w={7} size={12} color="dim" style={{ letterSpacing: 0.8 }}>{`STEP ${step} OF ${total}`}</Txt>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i < step ? '#ea580c' : t.surf2 }} />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------ Grouped lists ---------------------- */

/** Inset grouped section: small header, rounded white body, optional footnote. */
export function Group({ title, action, note, children, style, tone }: { title?: string; action?: React.ReactNode; note?: string; children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: Tone }) {
  const { t } = useTheme();
  const tint = tone ? toneColors(t, tone) : null;
  return (
    <View style={style}>
      {title || action ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8, minHeight: 20 }}>
          {title ? <Txt w={7} size={13} color={tint?.fg ?? 'sub'} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }} accessibilityRole="header">{title}</Txt> : <View />}
          {action}
        </View>
      ) : null}
      <View style={{ borderRadius: 22, backgroundColor: t.card, borderWidth: StyleSheet.hairlineWidth, borderColor: tint?.fg ?? t.line, overflow: 'hidden', shadowColor: '#111827', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
        {children}
      </View>
      {note ? <Txt size={13} lh={18} color="dim" style={{ paddingHorizontal: 4, marginTop: 8 }}>{note}</Txt> : null}
    </View>
  );
}

/** One row of a Group. Rows after the first get a hairline separator inset from the leading edge. */
export function GroupRow({ children, first, onPress, style, disabled, inset = 16, ...a11y }: {
  children: React.ReactNode;
  first?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  inset?: number;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio';
  accessibilityState?: { checked?: boolean; selected?: boolean; disabled?: boolean };
}) {
  const { t } = useTheme();
  const body: ViewStyle = { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 13, minHeight: 52 };
  return (
    <View>
      {!first ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.line, marginLeft: inset }} /> : null}
      {onPress ? (
        <Press onPress={onPress} disabled={disabled} scale={0.985} haptic={false} {...a11y} style={[body, style]}>{children}</Press>
      ) : (
        <View style={[body, style]} {...a11y}>{children}</View>
      )}
    </View>
  );
}

/* ------------------------------ Controls --------------------------- */

/** iOS-style segmented control. Tapping the selected segment again clears it (when `clearable`). */
export function Segmented<T extends string>({ options, value, onChange, label, clearable }: { options: { value: T; label: string }[]; value: T | null; onChange: (v: T | null) => void; label: string; clearable?: boolean }) {
  const { t } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: t.surf2 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Press key={o.value} scale={0.97} onPress={() => { buzz('light'); onChange(on && clearable ? null : o.value); }}
            accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={`${label}: ${o.label}`}
            style={[{ flex: 1, minHeight: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }, on ? { backgroundColor: t.card, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 } : null]}>
            <Txt w={on ? 7 : 6} size={13} color={on ? 'fg' : 'sub'} numberOfLines={1}>{o.label}</Txt>
          </Press>
        );
      })}
    </View>
  );
}

/** Round checkbox (iOS reminders style). */
export function CheckCircle({ on, size = 26, color = '#10b981' }: { on: boolean; size?: number; color?: string }) {
  const { t } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: on ? 0 : 2, borderColor: t.line, backgroundColor: on ? color : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {on ? <Pop duration={260}><Icon name="check" size={Math.round(size * 0.6)} color="#fff" sw={3.2} /></Pop> : null}
    </View>
  );
}

/** Selectable tile with a radio mark, used for single choices like the target role. */
export function ChoiceTile({ label, selected, onPress, style }: { label: string; selected: boolean; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <Press onPress={onPress} scale={0.97} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={label}
      style={[{ minHeight: 60, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: selected ? t.brandbg : t.card, borderWidth: 1.5, borderColor: selected ? '#ea580c' : t.line }, style]}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? '#ea580c' : t.line, backgroundColor: selected ? '#ea580c' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {selected ? <Icon name="check" size={13} color="#fff" sw={3.4} /> : null}
      </View>
      <Txt w={selected ? 7 : 6} size={15} lh={19} color={selected ? 'brand' : 'fg'} style={{ flex: 1 }}>{label}</Txt>
    </Press>
  );
}

/* ------------------------------ States ----------------------------- */

export function Spinner({ size = 'small' }: { size?: 'small' | 'large' }) {
  const { t } = useTheme();
  return <ActivityIndicator size={size} color={t.brand} />;
}

export function Loading() {
  return <View style={{ paddingVertical: 60, alignItems: 'center' }} accessibilityLabel="Loading"><Spinner size="large" /></View>;
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: React.ReactNode }) {
  const { t } = useTheme();
  return (
    <Rise style={{ alignItems: 'center', paddingVertical: 28, paddingHorizontal: 12, gap: 10 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: t.brandbg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={32} color={t.brand} />
      </View>
      <Disp size={24} ls={-0.03} align="center" style={{ marginTop: 6 }}>{title}</Disp>
      <Txt size={15} lh={22} color="sub" align="center" style={{ maxWidth: 300 }}>{text}</Txt>
      {action ? <View style={{ alignSelf: 'stretch', marginTop: 12 }}>{action}</View> : null}
    </Rise>
  );
}

/** Tinted inline message. */
export function Notice({ tone = 'r', icon = 'alert', children }: { tone?: Tone; icon?: IconName; children: React.ReactNode }) {
  const { t } = useTheme();
  const c = toneColors(t, tone);
  return (
    <View accessibilityRole="alert" style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 18, backgroundColor: c.bg }}>
      <Icon name={icon} size={20} color={c.fg} sw={2.2} />
      <Txt w={6} size={14} lh={20} color={c.fg} style={{ flex: 1 }}>{children}</Txt>
    </View>
  );
}

/* ------------------------------ Sheet ------------------------------ */

/** Native page sheet (iOS) / full-screen modal (Android) with a title and a Done button. */
export function Sheet({ open, onClose, title, sub, children, footer }: { open: boolean; onClose: () => void; title: string; sub?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={open} onRequestClose={onClose} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: Platform.OS === 'ios' ? 0 : insets.top }}>
        <View style={{ alignItems: 'center', paddingTop: 8 }}><View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: t.surf2 }} /></View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Disp size={24} ls={-0.03} accessibilityRole="header">{title}</Disp>
            {sub ? <Txt size={14} color="sub" style={{ marginTop: 2 }}>{sub}</Txt> : null}
          </View>
          <Press onPress={onClose} accessibilityLabel="Done" style={{ minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' }}>
            <Txt w={7} size={17} color="brand">Done</Txt>
          </Press>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>{children}</ScrollView>
        {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 + insets.bottom }}>{footer}</View> : null}
      </View>
    </Modal>
  );
}

/* ------------------------------ Working overlay -------------------- */

/**
 * Full-screen "we're on it" overlay. Ticks through `steps` while `task` runs, then calls `onDone`.
 * The steps never finish before the task does, and the task never looks done before the steps have shown.
 */
export function WorkingOverlay({ eyebrow, title, steps, task, onDone, onError }: { eyebrow: string; title: string; steps: string[]; task: () => Promise<unknown>; onDone: () => void; onError: (message: string) => void }) {
  const { t } = useTheme();
  const [step, setStep] = useState(0);
  const done = useRef({ onDone, onError });
  useEffect(() => { done.current = { onDone, onError }; });
  useEffect(() => {
    let alive = true;
    const ticker = setInterval(() => setStep((s) => Math.min(steps.length - 1, s + 1)), 750);
    const minimum = new Promise((r) => setTimeout(r, steps.length * 750));
    Promise.all([task(), minimum])
      .then(() => { if (!alive) return; clearInterval(ticker); setStep(steps.length); buzz('success'); setTimeout(() => alive && done.current.onDone(), 450); })
      .catch((err) => { if (!alive) return; clearInterval(ticker); buzz('error'); done.current.onError(err instanceof Error ? err.message : 'Something went wrong.'); });
    return () => { alive = false; clearInterval(ticker); };
    // Runs once per overlay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.bg, zIndex: 50, justifyContent: 'center', paddingHorizontal: 28 }]} accessibilityViewIsModal accessibilityLiveRegion="polite">
      <View style={StyleSheet.absoluteFill} pointerEvents="none"><Glow size={460} style={{ top: -80, left: -160 }} /></View>
      <Rise><Eyebrow>{eyebrow}</Eyebrow></Rise>
      <Rise delay={80}><Disp size={34} lh={36} style={{ marginTop: 8 }}>{title}</Disp></Rise>
      <View style={{ marginTop: 24 }}>
        {steps.map((s, i) => {
          const isDone = i < step;
          const run = i === step;
          return (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: i < steps.length - 1 ? StyleSheet.hairlineWidth : 0, borderBottomColor: t.line }}>
              <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                {isDone ? (
                  <Pop duration={300}><View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={16} color="#052e22" sw={3.2} /></View></Pop>
                ) : run ? <Spinner /> : <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.surf2 }} />}
              </View>
              <Txt w={isDone || run ? 7 : 5} size={16} color={isDone || run ? 'fg' : 'dim'} style={{ flex: 1 }}>{s}</Txt>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ------------------------------ Marks ------------------------------ */

/** GitHub's mark. */
export function GithubMark({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" accessibilityLabel="GitHub">
      <Path fill={color} d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </Svg>
  );
}
