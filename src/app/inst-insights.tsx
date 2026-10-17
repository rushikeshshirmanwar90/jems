import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Disp, Eyebrow, FloatingNav, go, Grad, ON_G, ON_G_SUB, Row, Screen, Tabs, Tone, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, Press, Rise, Slide } from '@/ui/motion';

const ALL = ([['React', 78, 24], ['Node.js', 64, 18], ['TypeScript', 55, 9], ['Python', 60, 38], ['SQL', 70, 52], ['JavaScript', 90, 71]] as [string, number, number][]).map(([name, demand, supply]) => ({ name, demand, supply, gap: demand - supply }));

export default function InstInsights() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const sorted = ALL.slice().sort((x, y) => (f === 0 ? y.gap - x.gap : y.demand - x.demand));
  return (
    <Screen nav={<FloatingNav kind="inst" active="ins" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><Eyebrow>Insights</Eyebrow></Rise>
      <Rise delay={80}><Disp size={40} lh={40} style={{ marginTop: 4 }}>What employers{'\n'}want, what you{'\n'}have.</Disp></Rise>
      <Rise delay={160} style={{ marginTop: 20 }}>
        <Grad kind="g2" border style={{ borderRadius: 28, padding: 20 }}>
          <Txt w={7} size={11} color="#fcd34d" style={{ letterSpacing: 1.5 }}>TOP INSIGHT</Txt>
          <Disp size={26} lh={28} ls={-0.03} color={ON_G} style={{ marginTop: 6 }}>React demand is up 34% this quarter.</Disp>
          <Txt size={14} lh={20} color={ON_G_SUB} style={{ marginTop: 8 }}>Only 24% of your students are verified. A workshop could close this gap fast.</Txt>
          <Press onPress={() => go('/inst-collab')} style={{ marginTop: 14, alignSelf: 'flex-start', height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#fffbf0', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Txt w={8} size={14} color="#111827">Ask a partner to teach</Txt>
            <Icon name="arrow" size={16} color="#111827" sw={2.6} />
          </Press>
        </Grad>
      </Rise>
      <Rise delay={220} style={{ marginTop: 22 }}><Tabs items={['Biggest gaps', 'Most in demand']} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 6 }}>
        {sorted.map((r, i) => {
          const tone: Tone = r.gap >= 40 ? 'r' : r.gap >= 25 ? 'o' : 'g';
          return (
            <Slide key={r.name} delay={i * 50}>
              <View style={{ paddingVertical: 14, gap: 8, borderBottomWidth: i < sorted.length - 1 ? 1 : 0, borderBottomColor: t.line }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Txt w={7} size={17}>{r.name}</Txt>
                  <Chip tone={tone}>{`Gap ${r.gap} pts`}</Chip>
                </View>
                {([['Demand', r.demand, [t.brand, t.brand]], ['Verified', r.supply, ['#10b981', '#10b981']]] as [string, number, [string, string]][]).map(([l, v, c]) => (
                  <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Txt w={6} size={12} color="dim" style={{ width: 64 }}>{l}</Txt>
                    <View style={{ flex: 1 }}><GrowBar pct={v} delay={300} height={7} colors={c} /></View>
                    <Txt w={7} size={13} align="right" style={{ width: 38 }}>{v}%</Txt>
                  </View>
                ))}
              </View>
            </Slide>
          );
        })}
      </View>
    </Screen>
  );
}
