import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Disp, Eyebrow, FloatingNav, go, Grad, ON_G, Row, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, Sheen } from '@/ui/motion';
import { DrawRing } from '@/ui/kit';

const PROGS: [string, string, number, number, string][] = [
  ['#10b981', 'Nexa Frontend Bootcamp', 48, 62, ''],
  ['#f97316', 'React Cohort 2', 31, 41, ''],
  ['#f59e0b', 'SQL Sprint', 64, 88, ''],
];

export default function CoPrograms() {
  const { t } = useTheme();
  return (
    <Screen nav={<FloatingNav kind="co" active="prog" />} glows={[{ top: -80, right: -150, size: 440 }]}>
      <Rise><Eyebrow>Learning programs</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 4 }}>Grow your{'\n'}own talent.</Disp></Rise>
      <Rise delay={140}><Txt size={15} lh={22} color="sub" style={{ marginTop: 10 }}>Sponsor a roadmap. Students learn your stack, you see who finishes.</Txt></Rise>
      <Rise delay={200} style={{ marginTop: 20 }}>
        <Press onPress={() => go('/co-post-job')} scale={0.97}>
          <Grad kind="g4" border style={{ borderRadius: 30, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Sheen tone="rgba(255,255,255,0.16)" />
            <View style={{ flex: 1 }}>
              <Txt w={7} size={11} color="#a7f3d0" style={{ letterSpacing: 1.5 }}>NEW</Txt>
              <Disp size={26} lh={27} ls={-0.03} color={ON_G} style={{ marginTop: 6 }}>Create a program</Disp>
            </View>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#fffbf0', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={26} color="#065f46" sw={2.6} /></View>
          </Grad>
        </Press>
      </Rise>
      <View style={{ marginTop: 16 }}>
        {PROGS.map(([col, title, n, pct], i) => (
          <Rise key={title} delay={300 + i * 100}>
            <Row onPress={() => go('/co-programs')} last={i === 2}>
              <DrawRing size={60} stroke={7} to={pct} delay={300 + i * 100} duration={1400} colors={[col, col]}>
                <Disp size={15}>{pct}%</Disp>
              </DrawRing>
              <View style={{ flex: 1 }}><Txt w={7} size={17}>{title}</Txt><Txt size={13} color="dim">{n} enrolled · avg progress</Txt></View>
              <Icon name="right" size={20} color={t.dim} sw={2.4} />
            </Row>
          </Rise>
        ))}
      </View>
    </Screen>
  );
}
