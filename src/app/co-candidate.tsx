import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, BottomCta, Chip, Disp, Grad, ON_G, ON_G_SUB, Ring, Row, Screen, Txt, back } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Glow, GrowBar, Press, Rise, Sheen, useCountUp } from '@/ui/motion';

const GLASS = 'rgba(255,251,240,0.16)';
const SKILLS: [string, number][] = [['JavaScript', 87], ['HTML & CSS', 92], ['Git', 81], ['SQL', 76]];

export default function CoCandidate() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const n = useCountUp(92, 1400, 300);
  const [sl, setSl] = useState(false);
  const [inv, setInv] = useState(false);
  return (
    <Screen scroll={false} glows={[]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}>
        <Grad kind="g1" style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 26, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <Glow size={320} style={{ position: 'absolute', right: -100, top: -60 }} />
          <Press onPress={() => back('/co-candidates')} accessibilityLabel="Back to candidates" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center' }}><Icon name="left" size={24} color={ON_G} /></Press>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <Txt w={7} size={12} color="#fdba74" style={{ letterSpacing: 1.4 }}>CANDIDATE</Txt>
              <Disp size={40} lh={40} color={ON_G} style={{ marginTop: 6 }}>Aarav{'\n'}Sharma</Disp>
              <Txt size={13} color={ON_G_SUB} style={{ marginTop: 8 }}>B.Tech CSE · Godavari Inst. of Technology</Txt>
            </View>
            <Ring size={96} stroke={9} value={n} colors={['#fcd34d', '#fcd34d']} track="rgba(255,251,240,0.2)">
              <Disp size={30} lh={30} color={ON_G}>{n}<Disp size={13} color={ON_G}>%</Disp></Disp>
              <Txt w={7} size={10} color={ON_G_SUB} style={{ letterSpacing: 0.8 }}>MATCH</Txt>
            </Ring>
          </View>
        </Grad>
        <View style={{ padding: 24 }}>
          <Disp size={22} ls={-0.03}>Verified skills</Disp>
          {SKILLS.map(([s, v], i) => (
            <Rise key={s} delay={100 + i * 70} style={{ marginTop: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="check" size={16} color={t.good} sw={3} /><Txt w={7} size={15}>{s}</Txt></View>
                <Disp size={18}>{v}</Disp>
              </View>
              <View style={{ marginTop: 8 }}><GrowBar pct={v} delay={400 + i * 100} height={6} /></View>
            </Rise>
          ))}
          <Disp size={22} ls={-0.03} style={{ marginTop: 28 }}>Projects</Disp>
          <Row><Badge kind="g1" letter="J" size={48} radius={15} fontSize={17} /><View style={{ flex: 1 }}><Txt w={7} size={16}>JEMS Clone</Txt><Txt size={13} color="dim">Next.js · MongoDB · live</Txt></View></Row>
          <Row last><Badge kind="g2" letter="W" size={48} radius={15} fontSize={17} /><View style={{ flex: 1 }}><Txt w={7} size={16}>Weather Pulse</Txt><Txt size={13} color="dim">JavaScript · 200+ users</Txt></View></Row>
          <View style={{ marginTop: 14, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}><Chip>Level 4</Chip><Chip tone="o">5 day streak</Chip><Chip>3 mock interviews</Chip></View>
        </View>
      </ScrollView>
      <BottomCta>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Press onPress={() => setSl(!sl)} accessibilityLabel={sl ? 'Remove from shortlist' : 'Shortlist'} accessibilityState={{ selected: sl }} style={{ width: 64, height: 60, borderRadius: 30, backgroundColor: sl ? '#f59e0b' : t.surf2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="star" size={24} color={sl ? '#111827' : t.fg} sw={2.2} fill={sl ? '#111827' : 'none'} />
          </Press>
          <Press onPress={() => setInv(true)} style={{ flex: 1, height: 60, borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: inv ? '#10b981' : '#c2410c' }}>
            {!inv ? <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} /> : null}
            {!inv ? <Sheen /> : null}
            <Txt w={8} size={17} color={inv ? '#052e22' : '#fff'}>{inv ? 'Invite sent' : 'Invite to interview'}</Txt>
          </Press>
        </View>
      </BottomCta>
    </Screen>
  );
}
