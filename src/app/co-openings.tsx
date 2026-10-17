import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Disp, Eyebrow, FloatingNav, go, Screen, Tabs, Tone, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, Slide } from '@/ui/motion';
import { LinearGradient } from 'expo-linear-gradient';

const ALL = [
  { role: 'Frontend Intern', meta: 'Pune · Hybrid · Internship', k: 0, apps: 23, sl: 6, iv: 2 },
  { role: 'Backend Apprentice', meta: 'Nagpur · Hybrid · Apprentice', k: 0, apps: 14, sl: 4, iv: 1 },
  { role: 'QA Associate', meta: 'Hyderabad · On-site · Full time', k: 0, apps: 9, sl: 2, iv: 0 },
  { role: 'Data Analyst Intern', meta: 'Remote · Internship', k: 1, apps: 0, sl: 0, iv: 0 },
  { role: 'UI Developer Intern', meta: 'Pune · Hybrid · Internship', k: 2, apps: 31, sl: 8, iv: 4 },
];

export default function CoOpenings() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const rows = ALL.filter((x) => x.k === f);
  const tone: Tone[] = ['g', 'o', ''];
  return (
    <Screen nav={<FloatingNav kind="co" active="open" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View><Eyebrow>Openings</Eyebrow><Disp size={40} lh={40} style={{ marginTop: 4 }}>Your roles.</Disp></View>
        <Press onPress={() => go('/co-post-job')} style={{ height: 48, paddingHorizontal: 18, borderRadius: 24, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
          <Icon name="plus" size={18} color="#fff" sw={2.8} />
          <Txt w={8} size={14} color="#fff">Post</Txt>
        </Press>
      </Rise>
      <Rise delay={100} style={{ marginTop: 18 }}><Tabs items={['Active', 'Draft', 'Closed']} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 8 }}>
        {rows.map((o, i) => {
          const rest = Math.max(1, o.apps - o.sl - o.iv);
          return (
            <Slide key={o.role} delay={i * 60}>
              <Press onPress={() => go('/co-candidates')} haptic={false} scale={0.98} style={{ gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}><Txt w={7} size={19}>{o.role}</Txt><Txt size={13} color="dim">{o.meta}</Txt></View>
                  <Chip tone={tone[o.k]}>{['Active', 'Draft', 'Closed'][o.k]}</Chip>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, height: 8 }}>
                  <View style={{ flex: rest, borderRadius: 4, backgroundColor: t.surf2 }} />
                  <View style={{ flex: o.sl || 0.001, borderRadius: 4, backgroundColor: '#f59e0b' }} />
                  <View style={{ flex: o.iv || 0.001, borderRadius: 4, backgroundColor: '#10b981' }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Txt w={6} size={12} color="sub">{o.apps} applicants</Txt>
                  <Txt w={6} size={12} color="sub">{o.sl} shortlisted · {o.iv} interviewing</Txt>
                </View>
              </Press>
            </Slide>
          );
        })}
      </View>
    </Screen>
  );
}
