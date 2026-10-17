import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, Eyebrow, FloatingNav, go, IconCircle, Ring, Row, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, Rise, useCountUp } from '@/ui/motion';
import { SectionHead, StatRow } from '@/ui/parts';

export function GapBar({ name, demand, supply, delay }: { name: string; demand: number; supply: number; delay: number }) {
  const { t } = useTheme();
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Txt w={7} size={15}>{name}</Txt>
        <Txt size={13} color="dim">{demand}% demand · {supply}% verified</Txt>
      </View>
      <View style={{ marginTop: 8, gap: 5 }}>
        <GrowBar pct={demand} delay={delay * 1000} height={6} colors={[t.brand, t.brand]} />
        <GrowBar pct={supply} delay={delay * 1000 + 100} height={6} colors={['#10b981', '#10b981']} />
      </View>
    </View>
  );
}

export default function InstHome() {
  const { t } = useTheme();
  const n = useCountUp(58, 1500, 300);
  const b = useCountUp(1236, 1500, 400);
  const c = useCountUp(288, 1500, 500);
  const d = useCountUp(14, 1000, 600);
  return (
    <Screen nav={<FloatingNav kind="inst" active="home" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Badge kind="g3" letter="G" size={48} radius={16} fontSize={22} />
        <View style={{ flex: 1 }}>
          <Txt size={13} color="sub">Placement cell · Institution</Txt>
          <Disp size={20} lh={22} ls={-0.03}>Godavari Inst. of Technology</Disp>
        </View>
      </Rise>
      <Rise delay={100} style={{ marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <Ring size={148} stroke={14} value={n}>
          <Disp size={44} lh={44}>{n}<Disp size={20} color="good">%</Disp></Disp>
          <Txt w={7} size={12} color="sub">job ready</Txt>
        </Ring>
        <View style={{ flex: 1 }}>
          <Eyebrow>Placement readiness</Eyebrow>
          <Disp size={22} lh={25} ls={-0.03} style={{ marginTop: 4 }}>of 412 students</Disp>
          <Chip tone="g" icon="trend" style={{ marginTop: 10 }}>+4 this month</Chip>
        </View>
      </Rise>
      <Rise delay={200} style={{ marginTop: 22 }}>
        <StatRow items={[{ value: b, label: 'verified skills' }, { value: c, label: 'active this week' }, { value: d, label: 'hiring partners' }]} />
      </Rise>
      <Rise delay={280} style={{ marginTop: 26 }}><SectionHead title="Biggest skill gaps" link="Details" onLink={() => go('/inst-insights')} /></Rise>
      <Rise delay={320}>
        <GapBar name="React" demand={78} supply={24} delay={0.5} />
        <GapBar name="Node.js" demand={64} supply={18} delay={0.6} />
        <GapBar name="TypeScript" demand={55} supply={9} delay={0.7} />
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.brand }} /><Txt w={6} size={12} color="dim">Employer demand</Txt></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' }} /><Txt w={6} size={12} color="dim">Verified students</Txt></View>
        </View>
      </Rise>
      <Rise delay={400}><Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Needs attention</Disp></Rise>
      <Rise delay={440}>
        <Row onPress={() => go('/inst-students')} last>
          <IconCircle icon="users" bg={t.dangerbg} color={t.danger} size={44} iconSize={20} />
          <View style={{ flex: 1 }}><Txt w={7} size={16}>37 final-year students</Txt><Txt size={13} color="dim">No verified skills yet</Txt></View>
          <Icon name="right" size={20} color={t.dim} sw={2.4} />
        </Row>
      </Rise>
    </Screen>
  );
}
