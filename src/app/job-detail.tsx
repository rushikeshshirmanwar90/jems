import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { BottomCta, Btn, Chip, Disp, go, Grad, ON_G, ON_G_SUB, Ring, Row, Screen, Txt, back } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Glow, Pop, Press, Rise, Sheen, useCountUp } from '@/ui/motion';
import { SectionHead } from '@/ui/parts';

const GLASS = 'rgba(255,251,240,0.16)';

function Skill({ name, tag, tone, delay, ok = true, onPress }: { name: string; tag: string; tone: 'g' | 'b'; delay: number; ok?: boolean; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Rise delay={delay}>
      <Row onPress={onPress} last={!ok} py={12}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: ok ? t.goodbg : t.goldbg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ok ? 'check' : 'target'} size={18} color={ok ? t.good : t.gold} sw={ok ? 3 : 2.4} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt w={7} size={16}>{name}</Txt>
          {!ok ? <Txt size={12} color="dim">Nice to have · 12 min test</Txt> : null}
        </View>
        <Chip tone={tone}>{tag}</Chip>
      </Row>
    </Rise>
  );
}

export default function JobDetail() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const n = useCountUp(92, 1400, 300);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const facts = [['DURATION', '6 months'], ['START', 'Nov 3'], ['APPLICANTS', '23 so far'], ['CLOSES', 'Oct 28']];
  return (
    <Screen scroll={false} glows={[]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}>
        <Grad kind="g1" style={{ minHeight: 350 + insets.top, paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <Glow size={320} style={{ position: 'absolute', right: -100, top: -60 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Press onPress={() => back('/jobs')} accessibilityLabel="Back to jobs" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center' }}><Icon name="left" size={24} color={ON_G} /></Press>
            <Press onPress={() => setSaved(!saved)} accessibilityLabel={saved ? 'Remove from saved' : 'Save job'} accessibilityState={{ selected: saved }} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bookmark" size={22} color={ON_G} sw={2.2} fill={saved ? ON_G : 'none'} />
            </Press>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,251,240,0.18)', alignItems: 'center', justifyContent: 'center' }}><Disp size={17} ls={0} color={ON_G}>N</Disp></View>
                <Txt w={7} size={15} color={ON_G}>Nexa Labs</Txt>
              </View>
              <Disp size={40} lh={40} color={ON_G} style={{ marginTop: 12 }}>Frontend{'\n'}Intern</Disp>
            </View>
            <View style={{ width: 96, height: 96 }}>
              <Ring size={96} stroke={9} value={n} colors={['#fcd34d', '#fcd34d']} track="rgba(255,251,240,0.2)">
                <Disp size={30} lh={30} color={ON_G}>{n}<Disp size={13} color={ON_G}>%</Disp></Disp>
                <Txt w={7} size={10} color={ON_G_SUB} style={{ letterSpacing: 0.8 }}>MATCH</Txt>
              </Ring>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            <Chip bg={GLASS} fg={ON_G}>Internship</Chip>
            <Chip bg={GLASS} fg={ON_G} icon="pin">Pune · Hybrid</Chip>
            <Chip bg="rgba(252,211,77,0.22)" fg="#fcd34d">₹30k / month</Chip>
          </View>
        </Grad>

        <View style={{ paddingHorizontal: 24, paddingTop: 26 }}>
          <Rise><Disp size={22} ls={-0.03}>Why you match</Disp></Rise>
          <Skill name="JavaScript" tag="87 verified" tone="g" delay={50} />
          <Skill name="HTML & CSS" tag="92 verified" tone="g" delay={100} />
          <Skill name="Git" tag="81 verified" tone="g" delay={150} />
          <Skill name="React" tag="Verify" tone="b" delay={200} ok={false} onPress={() => go('/assessment')} />
          <Txt size={12} lh={18} color="dim" style={{ marginTop: 6 }}>Only verified skills count toward your match.</Txt>

          <Disp size={22} ls={-0.03} style={{ marginTop: 28 }}>About the role</Disp>
          <Txt size={16} lh={25} color="sub" style={{ marginTop: 10 }}>Join the product team at Nexa Labs for 6 months. You will build and ship interface features with senior engineers, review code weekly and present your work to the company.</Txt>
          <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>What you will do</Disp>
          <View style={{ marginTop: 8 }}>
            {['Build responsive screens from design specs', 'Write and fix JavaScript with code review', 'Ship a small feature end to end by month 3'].map((s) => (
              <View key={s} style={{ flexDirection: 'row', gap: 14, paddingVertical: 8, alignItems: 'flex-start' }}>
                <View style={{ marginTop: 2 }}><Icon name="arrow" size={18} color={t.brand} sw={2.6} /></View>
                <Txt size={15} lh={22} color="sub" style={{ flex: 1 }}>{s}</Txt>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', rowGap: 18 }}>
            {facts.map(([a, b]) => (
              <View key={a} style={{ width: '50%' }}>
                <Txt w={7} size={12} color="dim" style={{ letterSpacing: 1 }}>{a}</Txt>
                <Txt w={7} size={17} style={{ marginTop: 2 }}>{b}</Txt>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomCta>
        {!applied ? (
          <Btn label="Apply with my verified skills" lead="send" height={60} onPress={() => setApplied(true)} />
        ) : (
          <Pop>
            <Press onPress={() => go('/applications')} style={{ height: 60, borderRadius: 30, backgroundColor: '#10b981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Icon name="check" size={22} color="#052e22" sw={3} />
              <Txt w={8} size={17} color="#052e22">Applied. Track it</Txt>
              <Icon name="arrow" size={20} color="#052e22" sw={2.6} />
            </Press>
          </Pop>
        )}
      </BottomCta>
    </Screen>
  );
}
