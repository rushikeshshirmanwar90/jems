import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Disp, Eyebrow, FloatingNav, GradKind, Row, Screen, Txt } from '@/ui/kit';
import { Press, Rise, Slide, useCountUp } from '@/ui/motion';

const ALL: [string, string, GradKind, string][] = [
  ['Nexa Labs', 'N', 'g1', '6 openings · 12 hires'], ['Kriya Systems', 'K', 'g2', '3 openings · 5 hires'], ['Orbit Tech', 'O', 'g3', 'Sent you a proposal'],
  ['Pixel & Co', 'P', 'g4', '4 openings · 7 hires'], ['Veda Cloud', 'V', 'g1', 'Not connected yet'],
];

export default function InstCollab() {
  const { t } = useTheme();
  const n = useCountUp(14, 900, 300);
  const [st, setSt] = useState([2, 2, 1, 2, 0]);
  const act = (i: number) => setSt(st.map((v, k) => (k === i && v < 2 ? (v === 1 ? 2 : 1) : v)));
  return (
    <Screen nav={<FloatingNav kind="inst" active="collab" />} glows={[{ top: -90, right: -160, size: 440 }]}>
      <Rise><Eyebrow>Partnerships</Eyebrow></Rise>
      <Rise delay={80} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 6 }}>
        <Disp size={84} lh={80} ls={-0.06}>{n}</Disp>
        <Txt size={16} lh={20} color="sub" style={{ paddingBottom: 6 }}>industry partners{'\n'}<Txt w={8} size={16} color="good">31 open roles for you</Txt></Txt>
      </Rise>
      <View style={{ marginTop: 18 }}>
        {ALL.map(([name, ini, g, meta], i) => {
          const s = st[i];
          const grad = s === 1;
          return (
            <Slide key={name} delay={i * 60}>
              <Row last={i === ALL.length - 1}>
                <Badge kind={g} letter={ini} size={50} radius={16} fontSize={20} />
                <View style={{ flex: 1 }}><Txt w={7} size={17}>{name}</Txt><Txt size={13} color="dim">{meta}</Txt></View>
                <Press onPress={() => act(i)} style={{ height: 44, paddingHorizontal: 16, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', backgroundColor: s === 2 ? t.goodbg : s === 1 ? '#c2410c' : t.inv }}>
                  {grad ? <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} /> : null}
                  <Txt w={8} size={13} color={s === 2 ? 'good' : s === 1 ? '#fff' : t.invfg}>{s === 2 ? 'Active' : s === 1 ? 'Accept' : 'Invite'}</Txt>
                </Press>
              </Row>
            </Slide>
          );
        })}
      </View>
    </Screen>
  );
}
