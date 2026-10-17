import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Disp, Fld, Grad, ON_G, ON_G_SUB, Screen, Tabs, swap, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, useChase } from '@/ui/motion';

const NAMES = ['JavaScript', 'React', 'HTML & CSS', 'Git', 'SQL', 'Node.js', 'TypeScript', 'Python'];

function Label({ children }: { children: string }) {
  return <Txt w={7} size={12} color="dim" style={{ letterSpacing: 0.7, marginBottom: 8 }}>{children}</Txt>;
}

export default function CoPostJob() {
  const { t } = useTheme();
  const [type, setType] = useState(0);
  const [mode, setMode] = useState(1);
  const [sk, setSk] = useState([true, true, false, true, false, false, false, false]);
  const [title, setTitle] = useState('Frontend Intern');
  const [pay, setPay] = useState('₹30,000 / month');
  const n = sk.filter(Boolean).length;
  const target = Math.max(2, Math.round(210 * Math.pow(0.6, n)));
  const shown = useChase(target, 0);
  return (
    <Screen bottom={150} glows={[{ top: -80, right: -160, size: 440 }]}>
      <Rise><BackBtn to="/co-openings" /></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 20 }}>Post an{'\n'}opening.</Disp></Rise>
      <Rise delay={140} style={{ marginTop: 18 }}>
        <Grad kind="g2" border style={{ borderRadius: 24, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Disp size={52} lh={50} ls={-0.05} color={ON_G} style={{ minWidth: 84 }}>{shown}</Disp>
          <Txt size={14} lh={19} color={ON_G_SUB}>verified candidates{'\n'}match right now</Txt>
        </Grad>
      </Rise>
      <Rise delay={200} style={{ marginTop: 22, gap: 18 }}>
        <Fld label="ROLE TITLE" value={title} onChangeText={setTitle} />
        <View><Label>TYPE</Label><Tabs items={['Internship', 'Full time', 'Apprentice']} value={type} onChange={setType} /></View>
        <View>
          <Label>REQUIRED VERIFIED SKILLS</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {NAMES.map((l, i) => {
              const on = sk[i];
              return (
                <Press key={l} onPress={() => setSk(sk.map((v, k) => (k === i ? !v : v)))} accessibilityState={{ selected: on }} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: on ? t.goodbg : 'transparent', borderWidth: 1.5, borderColor: on ? t.good : t.line }}>
                  {on ? <Icon name="check" size={14} color={t.good} sw={3} /> : null}
                  <Txt w={7} size={14} color={on ? 'good' : 'sub'}>{l}</Txt>
                </Press>
              );
            })}
          </View>
        </View>
        <Fld label="STIPEND OR SALARY" value={pay} onChangeText={setPay} />
        <View><Label>WORK MODE</Label><Tabs items={['On-site', 'Hybrid', 'Remote']} value={mode} onChange={setMode} /></View>
      </Rise>
      <Txt size={13} lh={19} color="dim" style={{ marginTop: 16 }}>Only students who passed these skill tests (70%+) can apply.</Txt>
      <BottomCta><Btn label="Publish opening" lead="send" height={60} onPress={() => swap('/co-openings')} /></BottomCta>
    </Screen>
  );
}
