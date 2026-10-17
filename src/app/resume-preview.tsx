import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Btn2, Chip, Screen, Tabs, Toast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, Zoom } from '@/ui/motion';
import { BODY, DISP } from '@/ui/fonts';

const ACCENTS = ['#c2410c', '#047857', '#1d4ed8'];
const ink = '#292524';

function Head({ c, children }: { c: string; children: string }) {
  return <Text style={{ marginTop: 14, fontFamily: BODY[8], fontSize: 11, letterSpacing: 1.3, color: c }}>{children}</Text>;
}
const B = ({ children }: { children: string }) => <Text style={{ fontFamily: BODY[7] }}>{children}</Text>;

export default function ResumePreview() {
  const { t } = useTheme();
  const [tpl, setTpl] = useState(0);
  const [toast, setToast] = useState('');
  const c = ACCENTS[tpl];
  const body = { fontFamily: BODY[4], fontSize: 12, lineHeight: 18, color: ink, marginTop: 4 } as const;
  return (
    <Screen bottom={150} glows={[]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackBtn to="/resume" />
        <Chip tone="g" icon="check">ATS 82</Chip>
      </Rise>
      <Rise delay={80} style={{ marginTop: 16 }}><Tabs items={['Classic', 'Modern', 'Compact']} value={tpl} onChange={setTpl} /></Rise>
      <Zoom delay={150} style={{ marginTop: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, paddingVertical: 24, paddingHorizontal: 22, borderTopWidth: 8, borderTopColor: c, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 20 }, elevation: 8 }}>
          <Text style={{ fontFamily: DISP, fontSize: 26, lineHeight: 28, letterSpacing: -0.8, color: '#111827' }}>Aarav Sharma</Text>
          <Text style={{ fontFamily: BODY[4], fontSize: 12, color: '#57534e', marginTop: 4 }}>Full Stack Developer · Nanded, India · aarav@college.edu</Text>
          <Head c={c}>SUMMARY</Head>
          <Text style={body}>Final-year CSE student building full stack web apps. Four skills verified on JEMS. Shipped three projects used by 200+ people.</Text>
          <Head c={c}>VERIFIED SKILLS</Head>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {['JavaScript 87', 'HTML & CSS 92', 'Git 81', 'SQL 76'].map((s) => (
              <View key={s} style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10, backgroundColor: '#ecfdf5' }}><Text style={{ fontFamily: BODY[7], fontSize: 11, color: '#047857' }}>{s}</Text></View>
            ))}
          </View>
          <Head c={c}>PROJECTS</Head>
          <Text style={body}><B>JEMS Clone</B> — Next.js, MongoDB. Auth, roles and skill tests for 3 user types.{'\n'}<B>Weather Pulse</B> — JavaScript. Live forecasts with offline cache, 200+ users.</Text>
          <Head c={c}>EDUCATION</Head>
          <Text style={body}><B>B.Tech, Computer Science</B> — Godavari Institute of Technology, 2027</Text>
        </View>
      </Zoom>
      <Toast text={toast} bottom={104} />
      <BottomCta>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Btn label="Download PDF" lead="download" height={60} onPress={() => setToast('Saved to downloads')} /></View>
          <Press accessibilityLabel="Share resume" style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="share" size={22} color={t.fg} /></Press>
        </View>
      </BottomCta>
    </Screen>
  );
}
