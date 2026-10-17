import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, FloatingNav, go, GradKind, Row, Screen, Tabs, Tone, Txt } from '@/ui/kit';
import { Rise, Slide } from '@/ui/motion';

const ALL: { title: string; org: string; when: string; k: 1 | 2 | 3; g: GradKind }[] = [
  { title: 'Guest lecture: React in production', org: 'Nexa Labs', when: 'Oct 24', k: 1, g: 'g1' },
  { title: 'Mentor five interns for 6 months', org: 'Kriya Systems', when: 'Starts Nov 3', k: 3, g: 'g2' },
  { title: 'Industry project: inventory app', org: 'Orbit Tech', when: 'Due Dec 15', k: 2, g: 'g3' },
  { title: 'Judge the campus hackathon', org: 'Pixel & Co', when: 'Nov 9', k: 3, g: 'g4' },
  { title: 'Review the backend curriculum', org: 'Veda Cloud', when: 'Open', k: 2, g: 'g1' },
];
const TAG = ['', 'Lecture', 'Project', 'Mentoring'];
const CL: Tone[] = ['', 'b', 'o', 'g'];

export default function FacBoard() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const rows = ALL.filter((x) => f === 0 || x.k === f);
  return (
    <Screen nav={<FloatingNav kind="fac" active="board" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Badge kind="g4" letter="M" size={48} radius={24} fontSize={22} />
        <View style={{ flex: 1 }}><Txt size={13} color="sub">Faculty</Txt><Disp size={24} lh={26} ls={-0.03}>Dr. Meera Joshi</Disp></View>
      </Rise>
      <Rise delay={100}><Disp size={40} lh={40} style={{ marginTop: 20 }}>Industry is{'\n'}asking for you.</Disp></Rise>
      <Rise delay={160} style={{ marginTop: 18 }}><Tabs items={['All', 'Lectures', 'Projects', 'Mentoring']} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 6 }}>
        {rows.map((o, i) => (
          <Slide key={o.title} delay={i * 60}>
            <Row onPress={() => go('/fac-detail')} align="flex-start" last={i === rows.length - 1}>
              <Badge kind={o.g} letter={o.org[0]} size={48} radius={15} fontSize={18} />
              <View style={{ flex: 1 }}>
                <Txt w={7} size={16} lh={21}>{o.title}</Txt>
                <Txt size={13} color="dim" style={{ marginTop: 2 }}>{o.org} · {o.when}</Txt>
              </View>
              <Chip tone={CL[o.k]}>{TAG[o.k]}</Chip>
            </Row>
          </Slide>
        ))}
      </View>
    </Screen>
  );
}
