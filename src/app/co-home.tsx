import React from 'react';
import { View } from 'react-native';
import { Badge, Btn2, Chip, Disp, FloatingNav, go, GradKind, ON_G, Row, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, useCountUp } from '@/ui/motion';
import { HeroCard, SectionHead, StatRow } from '@/ui/parts';

const PEOPLE: [string, string, GradKind, string, string[], number][] = [
  ['A', 'Aarav Sharma', 'g1', 'Godavari Inst. of Technology', ['JavaScript 87', 'HTML & CSS 92', 'Git 81'], 92],
  ['S', 'Sneha Patil', 'g4', 'Nanded Engineering College', ['JavaScript 90', 'React 84', 'SQL 79'], 88],
  ['R', 'Rohan Deshmukh', 'g3', 'Maharashtra Polytechnic', ['HTML & CSS 88', 'JavaScript 82'], 84],
];

export function PersonRow({ initial, name, sub, g, chips, pct, delay, onPress }: { initial: string; name: string; sub: string; g: GradKind; chips: string[]; pct: number; delay: number; onPress: () => void }) {
  return (
    <Rise delay={delay}>
      <Row onPress={onPress} align="flex-start" last>
        <Badge kind={g} letter={initial} size={48} radius={16} fontSize={19} />
        <View style={{ flex: 1 }}>
          <Txt w={7} size={17}>{name}</Txt>
          <Txt size={13} color="dim">{sub}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{chips.map((c) => <Chip key={c} tone="g" h={24} size={11}>{c}</Chip>)}</View>
        </View>
        <Disp size={30} color="good">{pct}<Disp size={14} color="good">%</Disp></Disp>
      </Row>
    </Rise>
  );
}

export default function CoHome() {
  const a = useCountUp(24, 1200, 300);
  const b = useCountUp(6, 900, 400);
  const c = useCountUp(5, 900, 500);
  const d = useCountUp(2, 900, 600);
  return (
    <Screen nav={<FloatingNav kind="co" active="home" />} glows={[{ top: -80, right: -150, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Badge kind="g2" letter="N" size={48} radius={16} fontSize={22} />
        <View style={{ flex: 1 }}>
          <Txt size={13} color="sub">Nexa Labs · Industry</Txt>
          <Disp size={24} lh={26} ls={-0.03}>Hi, Priya</Disp>
        </View>
      </Rise>
      <Rise delay={100} style={{ marginTop: 20 }}>
        <Press onPress={() => go('/co-candidates')} scale={0.97}>
          <HeroCard kind="g2" shadow={false} sheenTone="rgba(255,255,255,0.14)">
            <Txt w={7} size={11} color="#fcd34d" style={{ letterSpacing: 1.5 }}>THIS WEEK</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 6 }}>
              <Disp size={78} lh={74} ls={-0.06} color={ON_G}>{a}</Disp>
              <Txt size={16} lh={20} color="#e7e5e4" style={{ paddingBottom: 4 }}>new verified{'\n'}matches</Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
              <Txt w={7} size={14} color={ON_G}>Review ranked candidates</Txt>
              <Icon name="arrow" size={18} color={ON_G} sw={2.6} />
            </View>
          </HeroCard>
        </Press>
      </Rise>
      <Rise delay={200} style={{ marginTop: 22 }}>
        <StatRow items={[{ value: b, label: 'open roles' }, { value: c, label: 'interviews' }, { value: d, label: 'offers out' }]} />
      </Rise>
      <Rise delay={280} style={{ marginTop: 26 }}><SectionHead title="Top candidates" link="See all" onLink={() => go('/co-candidates')} /></Rise>
      {PEOPLE.map(([ini, name, g, sub, chips, pct], i) => (
        <PersonRow key={name} initial={ini} name={name} g={g} sub={sub} chips={chips} pct={pct} delay={340 + i * 80} onPress={() => go('/co-candidate')} />
      ))}
      <Rise delay={600} style={{ marginTop: 18 }}><Btn2 label="Post an opening" lead="plus" onPress={() => go('/co-post-job')} /></Rise>
    </Screen>
  );
}
