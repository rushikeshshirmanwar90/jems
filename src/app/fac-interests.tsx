import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Btn, Chip, Disp, Eyebrow, FloatingNav, go, GradKind, Screen, Tone, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, Slide, Zoom } from '@/ui/motion';

const ALL: [string, string, string, Tone, GradKind, string][] = [
  ['Guest lecture: React in production', 'Nexa Labs', 'Pending', 'o', 'g1', 'N'],
  ['Judge the campus hackathon', 'Pixel & Co', 'Accepted', 'g', 'g4', 'P'],
  ['Review the backend curriculum', 'Veda Cloud', 'Pending', 'o', 'g2', 'V'],
];

export default function FacInterests() {
  const { t } = useTheme();
  const [gone, setGone] = useState([false, false, false]);
  const rows = ALL.map((a, i) => ({ a, i })).filter((r) => !gone[r.i]);
  return (
    <Screen nav={<FloatingNav kind="fac" active="int" />} glows={[{ top: -90, right: -160, size: 440 }]}>
      <Rise><Eyebrow>My interests</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 4 }}>{rows.length === 0 ? 'All clear.' : `${rows.length} open.`}</Disp></Rise>
      <View style={{ marginTop: 14 }}>
        {rows.map(({ a, i }, k) => (
          <Slide key={a[0]} delay={k * 70}>
            <View style={{ paddingVertical: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Badge kind={a[4]} letter={a[5]} size={48} radius={15} fontSize={18} />
                <View style={{ flex: 1 }}><Txt w={7} size={16} lh={21}>{a[0]}</Txt><Txt size={13} color="dim">{a[1]}</Txt></View>
                <Chip tone={a[3]}>{a[2]}</Chip>
              </View>
              <Press onPress={() => setGone(gone.map((v, j) => (j === i ? true : v)))} haptic style={{ minHeight: 44, paddingHorizontal: 4, justifyContent: 'center', alignSelf: 'flex-start' }}>
                <Txt w={7} size={14} color="danger">Withdraw interest</Txt>
              </Press>
            </View>
          </Slide>
        ))}
      </View>
      {rows.length === 0 ? (
        <Zoom style={{ alignItems: 'center', marginTop: 40 }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="star" size={38} color={t.dim} sw={1.8} /></View>
          <Txt size={16} color="sub" style={{ marginTop: 16 }}>Nothing here yet.</Txt>
          <View style={{ marginTop: 18, alignSelf: 'stretch', paddingHorizontal: 40 }}><Btn label="Browse the board" height={52} sheen={false} onPress={() => go('/fac-board')} /></View>
        </Zoom>
      ) : null}
    </Screen>
  );
}
