import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, Eyebrow, FloatingNav, go, GradKind, Screen, Tabs, Tone, Txt } from '@/ui/kit';
import { Press, Rise, Slide, useCountUp } from '@/ui/motion';

const ALL: { role: string; co: string; initial: string; g: GradKind; st: number; status: string; tone: Tone; note: string; k: 'offer' | 'active' | 'closed' }[] = [
  { role: 'UI Developer Intern', co: 'Pixel & Co', initial: 'P', g: 'g4', st: 3, status: 'Offer', tone: 'g', note: 'Offer expires Oct 20', k: 'offer' },
  { role: 'Frontend Intern', co: 'Nexa Labs', initial: 'N', g: 'g1', st: 2, status: 'Interview', tone: 'o', note: 'Technical round · Oct 16, 11:00', k: 'active' },
  { role: 'Junior Web Developer', co: 'Kriya Systems', initial: 'K', g: 'g2', st: 1, status: 'Shortlisted', tone: 'b', note: 'Recruiter viewed your portfolio', k: 'active' },
  { role: 'QA Associate', co: 'Orbit Tech', initial: 'O', g: 'g3', st: 0, status: 'Applied', tone: '', note: 'Applied 2 days ago', k: 'active' },
  { role: 'Backend Apprentice', co: 'Veda Cloud', initial: 'V', g: 'g4', st: -1, status: 'Closed', tone: 'r', note: 'Role filled. Similar roles are on Jobs', k: 'closed' },
];

function Track({ st }: { st: number }) {
  const { t } = useTheme();
  const col = (on: boolean) => (on ? '#10b981' : t.surf2);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 4 }}>
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          {i > 0 ? <View style={{ flex: 1, height: 3, marginHorizontal: 4, backgroundColor: col(st >= i) }} /> : null}
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: col(st >= i) }} />
        </React.Fragment>
      ))}
    </View>
  );
}

export default function Applications() {
  const { t } = useTheme();
  const n = useCountUp(4, 900, 300);
  const [f, setF] = useState(0);
  const list = ALL.filter((x) => f === 0 || (f === 1 && x.k === 'active') || (f === 2 && x.k === 'offer') || (f === 3 && x.k === 'closed'));
  return (
    <Screen nav={<FloatingNav kind="student" active="jobs" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><Eyebrow>My applications</Eyebrow></Rise>
      <Rise delay={80} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 6 }}>
        <Disp size={84} lh={80} ls={-0.06}>{n}</Disp>
        <Txt size={16} lh={20} color="sub" style={{ paddingBottom: 6 }}>applications{'\n'}in progress</Txt>
      </Rise>
      <Rise delay={140} style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}><Chip tone="g">1 offer</Chip><Chip tone="o">1 interview</Chip><Chip tone="b">1 shortlisted</Chip></Rise>
      <Rise delay={200} style={{ marginTop: 20 }}><Tabs items={['All', 'Active', 'Offers', 'Closed']} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 8 }}>
        {list.map((a, i) => (
          <Slide key={a.role} delay={i * 60}>
            <Press onPress={() => go('/job-detail')} haptic={false} scale={0.98} style={{ gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Badge kind={a.g} letter={a.initial} size={46} radius={15} fontSize={19} />
                <View style={{ flex: 1 }}><Txt w={7} size={17}>{a.role}</Txt><Txt size={13} color="sub">{a.co}</Txt></View>
                <Chip tone={a.tone}>{a.status}</Chip>
              </View>
              <Track st={a.st} />
              <Txt w={6} size={12} color="dim">{a.note}</Txt>
            </Press>
          </Slide>
        ))}
      </View>
    </Screen>
  );
}
