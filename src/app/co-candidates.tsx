import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Disp, Eyebrow, FloatingNav, go, GradKind, Row, Screen, Tabs, Txt } from '@/ui/kit';
import { GrowBar, Rise, Slide } from '@/ui/motion';

const ALL: { name: string; college: string; initial: string; g: GradKind; pct: number; sk: string[] }[] = [
  { name: 'Aarav Sharma', college: 'Godavari Inst. of Technology', initial: 'A', g: 'g1', pct: 92, sk: ['JavaScript', 'HTML & CSS', 'Git', 'SQL'] },
  { name: 'Sneha Patil', college: 'Nanded Engineering College', initial: 'S', g: 'g4', pct: 88, sk: ['JavaScript', 'React', 'SQL'] },
  { name: 'Rohan Deshmukh', college: 'Maharashtra Polytechnic', initial: 'R', g: 'g3', pct: 84, sk: ['HTML & CSS', 'JavaScript'] },
  { name: 'Ananya Kulkarni', college: 'Godavari Inst. of Technology', initial: 'A', g: 'g2', pct: 79, sk: ['JavaScript', 'React', 'Git'] },
  { name: 'Kabir Shaikh', college: 'City Institute of Science', initial: 'K', g: 'g1', pct: 74, sk: ['HTML & CSS', 'Git'] },
];
const LABELS = ['All', 'JavaScript', 'React', 'SQL', 'Git'];

export default function CoCandidates() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const list = ALL.filter((x) => f === 0 || x.sk.includes(LABELS[f]));
  return (
    <Screen nav={<FloatingNav kind="co" active="cands" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><Eyebrow>Frontend Intern</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 4 }}>Ranked by{'\n'}proof, not CVs.</Disp></Rise>
      <Rise delay={140}><Txt size={15} lh={22} color="sub" style={{ marginTop: 10 }}>Only students who passed the required skill tests appear here.</Txt></Rise>
      <Rise delay={200} style={{ marginTop: 18 }}><Tabs items={LABELS} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 6 }}>
        {list.map((c, i) => (
          <Slide key={c.name} delay={i * 60}>
            <Row onPress={() => go('/co-candidate')} last={i === list.length - 1}>
              <Disp size={20} color="dim" align="center" style={{ width: 24 }}>{i + 1}</Disp>
              <Badge kind={c.g} letter={c.initial} size={48} radius={24} fontSize={19} />
              <View style={{ flex: 1 }}>
                <Txt w={7} size={17}>{c.name}</Txt>
                <Txt size={13} color="dim">{c.college}</Txt>
                <View style={{ marginTop: 8 }}><GrowBar pct={c.pct} delay={300} height={5} /></View>
              </View>
              <Disp size={28} color="good">{c.pct}<Disp size={13} color="good">%</Disp></Disp>
            </Row>
          </Slide>
        ))}
      </View>
    </Screen>
  );
}
