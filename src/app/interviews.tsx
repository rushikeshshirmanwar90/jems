import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Disp, Eyebrow, FloatingNav, go, ON_G, Row, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Press, Rise, useCountUp, useEnter } from '@/ui/motion';
import { HeroCard, PulseButton, SectionHead } from '@/ui/parts';

const ROUNDS: [string, number, string, IconName][] = [
  ['Behavioral', 20, 'Stories, teamwork, conflict', 'users'],
  ['Technical', 45, 'JavaScript, React, problem solving', 'code'],
  ['System design', 40, 'Architecture and trade-offs', 'layers'],
  ['Role-specific', 30, 'Questions for your target role', 'target'],
];
const SCORES: [number, string][] = [[61, 'Sep 21'], [68, 'Sep 28'], [72, 'Oct 5'], [78, 'Oct 11']];

function Bar({ v, i }: { v: number; i: number }) {
  const { t } = useTheme();
  const p = useEnter(300 + i * 100, 800);
  const a = useAnimatedStyle(() => ({ transform: [{ scaleY: p.value }], opacity: p.value }));
  const last = i === 3;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
      <Txt w={last ? 8 : 7} size={12} color={last ? 'good' : 'dim'}>{v}</Txt>
      <Animated.View style={[{ width: '100%', height: `${v * 0.8}%`, borderRadius: 10, overflow: 'hidden', backgroundColor: i === 2 ? t.brandbg : t.surf2 }, a]}>
        {last ? <LinearGradient colors={['#f97316', '#c2410c']} style={{ flex: 1 }} /> : null}
      </Animated.View>
    </View>
  );
}

export default function Interviews() {
  const { t } = useTheme();
  const gain = useCountUp(17, 1200, 400);
  return (
    <Screen nav={<FloatingNav kind="student" active="profile" />} glows={[{ top: -80, right: -150, size: 440 }]}>
      <Rise><Eyebrow>Mock interviews</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 6 }}>Practice until{'\n'}it feels easy.</Disp></Rise>
      <Rise delay={160} style={{ marginTop: 22 }}>
        <Press onPress={() => go('/interview-session')} scale={0.97}>
          <HeroCard kind="g2" shadow={false} sheenTone="rgba(255,255,255,0.14)">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={11} color="#fcd34d" style={{ letterSpacing: 1.5 }}>SUGGESTED FOR FULL STACK</Txt>
                <Disp size={28} lh={28} ls={-0.03} color={ON_G} style={{ marginTop: 6 }}>Technical interview</Disp>
                <Txt size={13} color="#e7e5e4" style={{ marginTop: 6 }}>45 min · AI interviewer · scored report</Txt>
              </View>
              <PulseButton size={60} bg="#c2410c"><Icon name="mic" size={26} color="#fff" /></PulseButton>
            </View>
          </HeroCard>
        </Press>
      </Rise>
      <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Choose a round</Disp>
      <View style={{ marginTop: 4 }}>
        {ROUNDS.map(([title, mins, desc, icon], i) => (
          <Rise key={title} delay={250 + i * 70}>
            <Row onPress={() => go('/interview-session')} last={i === 3}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: t.brandbg, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={24} color={t.brand} /></View>
              <View style={{ flex: 1 }}><Txt w={7} size={17}>{title}</Txt><Txt size={13} color="dim">{desc}</Txt></View>
              <Chip>{`${mins} min`}</Chip>
            </Row>
          </Rise>
        ))}
      </View>
      <View style={{ marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Disp size={22} ls={-0.03}>Your scores</Disp>
        <Chip tone="g" icon="trend">{`+${gain} pts`}</Chip>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 120, marginTop: 14 }}>
        {SCORES.map(([v], i) => <Bar key={v} v={v} i={i} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        {SCORES.map(([, d]) => <Txt key={d} w={6} size={11} color="dim" align="center" style={{ flex: 1 }}>{d}</Txt>)}
      </View>
    </Screen>
  );
}
