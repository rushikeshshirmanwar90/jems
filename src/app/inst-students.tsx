import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, Eyebrow, FloatingNav, GradKind, Row, Screen, Tabs, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, Rise, Slide } from '@/ui/motion';
import { BODY } from '@/ui/fonts';

const ALL: [string, string, number, GradKind][] = [
  ['Aarav Sharma', 'CSE · Final year', 92, 'g1'], ['Sneha Patil', 'CSE · Final year', 88, 'g4'], ['Rohan Deshmukh', 'IT · Final year', 71, 'g3'], ['Ananya Kulkarni', 'CSE · Third year', 66, 'g2'],
  ['Kabir Shaikh', 'ECE · Final year', 42, 'g1'], ['Pooja Jadhav', 'IT · Third year', 35, 'g4'], ['Vikram More', 'Mech · Final year', 18, 'g3'], ['Isha Bhosale', 'CSE · Second year', 12, 'g2'],
];

export default function InstStudents() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const [q, setQ] = useState('');
  const rows = ALL.filter((a) => (f === 0 || (f === 1 && a[2] >= 60) || (f === 2 && a[2] < 60)) && (q === '' || (a[0] + a[1]).toLowerCase().includes(q.toLowerCase())));
  return (
    <Screen nav={<FloatingNav kind="inst" active="stud" />} glows={[{ top: -90, right: -160, size: 440 }]}>
      <Rise><Eyebrow>Students</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 4 }}>412 learners,{'\n'}one view.</Disp></Rise>
      <Rise delay={140} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 16, borderRadius: 26, backgroundColor: t.surf }}>
        <Icon name="search" size={20} color={t.sub} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search by name or branch" placeholderTextColor={t.dim} accessibilityLabel="Search students" style={{ flex: 1, fontFamily: BODY[4], fontSize: 16, color: t.fg, outlineStyle: 'none' } as never} />
      </Rise>
      <Rise delay={200} style={{ marginTop: 14 }}><Tabs items={['All', 'On track', 'Needs help']} value={f} onChange={setF} /></Rise>
      <View key={`${f}${q}`} style={{ marginTop: 6 }}>
        {rows.map(([name, meta, pct, g], i) => {
          const ok = pct >= 60;
          return (
            <Slide key={name} delay={i * 50}>
              <Row last={i === rows.length - 1}>
                <Badge kind={g} letter={name[0]} size={46} radius={23} fontSize={18} />
                <View style={{ flex: 1 }}>
                  <Txt w={7} size={16}>{name}</Txt>
                  <Txt size={13} color="dim">{meta}</Txt>
                  <View style={{ marginTop: 7 }}><GrowBar pct={pct} delay={300} height={5} colors={ok ? ['#10b981', '#f97316'] : ['#ef4444', '#ef4444']} /></View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Disp size={22}>{pct}%</Disp>
                  <Chip tone={ok ? 'g' : 'r'} h={22} size={11}>{ok ? 'On track' : 'Needs help'}</Chip>
                </View>
              </Row>
            </Slide>
          );
        })}
      </View>
    </Screen>
  );
}
