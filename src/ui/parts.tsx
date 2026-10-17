import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Disp, Grad, GradKind, IconCircle, Row, Txt, TextLink } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { PulseRing, Sheen } from '@/ui/motion';

/** Section title with an optional right-hand link. */
export function SectionHead({ title, link, onLink, style }: { title: string; link?: string; onLink?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, style]}>
      <Disp size={22} ls={-0.03}>{title}</Disp>
      {link ? <TextLink label={link} color="brand" size={14} onPress={onLink ?? (() => {})} /> : null}
    </View>
  );
}

/** Always-dark gradient hero card with a sliding sheen. */
export function HeroCard({ kind = 'g1', children, style, shadow = true, sheenTone }: { kind?: GradKind; children: React.ReactNode; style?: StyleProp<ViewStyle>; shadow?: boolean; sheenTone?: string }) {
  return (
    <View style={[shadow ? { shadowColor: '#c2410c', shadowOpacity: 0.55, shadowRadius: 22, shadowOffset: { width: 0, height: 16 }, elevation: 10 } : null, style]}>
      <Grad kind={kind} border={kind === 'g2'} style={{ borderRadius: 30, padding: 20 }}>
        <Sheen tone={sheenTone} />
        {children}
      </Grad>
    </View>
  );
}

/** Round pulsing action button used inside hero cards. */
export function PulseButton({ size = 56, bg = '#fffbf0', children }: { size?: number; bg?: string; children: React.ReactNode }) {
  return (
    <View style={{ width: size, height: size }}>
      <PulseRing size={size} color="rgba(255,251,240,0.5)" reach={16} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>{children}</View>
    </View>
  );
}

export function Pill({ children, active, onPress }: { children: string; active?: boolean; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <View style={{ height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: active ? t.inv : t.surf, alignItems: 'center', justifyContent: 'center' }}>
      <Txt w={7} size={14} color={active ? t.invfg : t.sub}>{children}</Txt>
    </View>
  );
}

/** Tappable list row with icon, title, optional sub text and chevron / chip. */
export function LinkRow({ icon, title, sub, chip, onPress, last }: { icon: import('@/ui/iconData').IconName; title: string; sub?: string; chip?: string; onPress: () => void; last?: boolean }) {
  const { t } = useTheme();
  return (
    <Row onPress={onPress} last={last}>
      <IconCircle icon={icon} bg={t.surf2} color={t.fg} size={44} iconSize={20} />
      <View style={{ flex: 1 }}>
        <Txt w={7} size={16}>{title}</Txt>
        {sub ? <Txt size={13} color="dim">{sub}</Txt> : null}
      </View>
      {chip ? <Chip tone="b">{chip}</Chip> : <Icon name="right" size={20} color={t.dim} sw={2.4} />}
    </Row>
  );
}

/** Row of big counters separated by hairlines. */
export function StatRow({ items }: { items: { value: string | number; label: string; suffix?: string }[] }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {items.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 ? <View style={{ width: 1, height: 38, backgroundColor: t.line }} /> : null}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Disp size={38}>{s.value}{s.suffix ? <Disp size={16} color="good">{s.suffix}</Disp> : null}</Disp>
            <Txt size={12} color="sub">{s.label}</Txt>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

/** Two-column label/value grid used on detail screens. */
export function FactGrid({ items }: { items: [string, string][] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 }}>
      {items.map(([a, b]) => (
        <View key={a} style={{ width: '50%' }}>
          <Txt w={7} size={12} color="dim" style={{ letterSpacing: 1 }}>{a}</Txt>
          <Txt w={7} size={17} style={{ marginTop: 2 }}>{b}</Txt>
        </View>
      ))}
    </View>
  );
}

/** Arrow-bulleted list. */
export function ArrowList({ items }: { items: string[] }) {
  const { t } = useTheme();
  return (
    <View style={{ marginTop: 8 }}>
      {items.map((s) => (
        <View key={s} style={{ flexDirection: 'row', gap: 14, paddingVertical: 8, alignItems: 'flex-start' }}>
          <View style={{ marginTop: 2 }}><Icon name="arrow" size={18} color={t.brand} sw={2.6} /></View>
          <Txt size={15} lh={22} color="sub" style={{ flex: 1 }}>{s}</Txt>
        </View>
      ))}
    </View>
  );
}
