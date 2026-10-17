import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { Btn, Disp, Ring, Screen, swap, Txt, TextLink, go } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Confetti, Drift, GrowBar, Pop, Press, Rise, Sheen, useCountUp, useEnter } from '@/ui/motion';
import { BottomCta } from '@/ui/kit';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

function XpChip() {
  const p = useEnter(2500, 1000);
  const a = useAnimatedStyle(() => ({ opacity: p.value < 0.05 ? 0 : 1 - Math.max(0, p.value - 0.8) * 0, transform: [{ translateY: (1 - p.value) * 24 }] }));
  return (
    <Animated.View style={[{ height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(245,158,11,0.2)', justifyContent: 'center' }, a]}>
      <Txt w={8} size={14} color="#f59e0b">+120 XP</Txt>
    </Animated.View>
  );
}

export default function TestResult() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const n = useCountUp(87, 1700, 300);
  return (
    <Screen scroll={false} glows={[]} overlay={<Confetti count={26} start={1700} height={880} />}>
      <Drift style={{ position: 'absolute', left: 35, top: 20 + insets.top, width: 320, height: 320 }}>
        <Svg width={320} height={320}>
          <Defs>
            <RadialGradient id="trg" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#10b981" stopOpacity={0.34} />
              <Stop offset="0.45" stopColor="#f59e0b" stopOpacity={0.16} />
              <Stop offset="0.7" stopColor="#10b981" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width={320} height={320} fill="url(#trg)" />
        </Svg>
      </Drift>
      <Press onPress={() => swap('/skills')} accessibilityLabel="Close" style={{ position: 'absolute', left: 14, top: insets.top + 14, width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
        <Icon name="x" size={20} color={t.fg} sw={2.2} />
      </Press>
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Rise><Txt w={7} size={12} color="good" style={{ letterSpacing: 2 }}>SKILL TEST COMPLETE</Txt></Rise>
        <View style={{ marginTop: 14 }}>
          <Ring size={224} stroke={16} value={n} colors={['#10b981', '#f59e0b']}>
            <Disp size={76} lh={76} ls={-0.05}>{n}<Disp size={32} color="good">%</Disp></Disp>
            <Txt size={14} color="sub" style={{ marginTop: 6 }}>7 of 8 correct</Txt>
          </Ring>
        </View>
        <View style={{ alignItems: 'center', gap: 14, marginTop: 22 }}>
          <Pop delay={1900}>
            <View style={{ overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingLeft: 12, paddingRight: 16, borderRadius: 20, backgroundColor: '#10b981' }}>
              <Sheen delay={2600} />
              <Icon name="shield" size={20} color="#052e22" sw={2.6} />
              <Txt w={8} size={15} color="#052e22">JavaScript verified</Txt>
            </View>
          </Pop>
          <Rise delay={2100}><Disp size={46} lh={44} align="center">You passed.</Disp></Rise>
          <Rise delay={2250}><Txt size={15} lh={22} color="sub" align="center" style={{ maxWidth: 300 }}>This skill now counts on your resume, portfolio and job matching.</Txt></Rise>
        </View>
        <View style={{ alignSelf: 'stretch', paddingHorizontal: 24, marginTop: 26 }}>
          <Rise delay={2500} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <XpChip />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt w={6} size={12} color="sub">Level 4</Txt>
                <Txt w={6} size={12} color="sub">640 / 800 XP</Txt>
              </View>
              <View style={{ marginTop: 6 }}><GrowBar pct={80} delay={2700} colors={['#f97316', '#f59e0b']} /></View>
            </View>
          </Rise>
          <Rise delay={2800} style={{ marginTop: 26, flexDirection: 'row', alignItems: 'center' }}>
            {[['06:14', 'time taken'], ['Level 2', 'intermediate'], ['70%', 'pass mark']].map(([a, b], i) => (
              <React.Fragment key={a}>
                {i > 0 ? <View style={{ width: 1, height: 36, backgroundColor: t.line }} /> : null}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Disp size={26} ls={-0.03}>{a}</Disp>
                  <Txt size={12} color="sub">{b}</Txt>
                </View>
              </React.Fragment>
            ))}
          </Rise>
        </View>
      </View>
      <BottomCta gap={4}>
        <Rise delay={3000}><Btn label="Run my AI career analysis" icon="arrow" height={60} onPress={() => go('/career-analysis')} /></Rise>
        <Rise delay={3100} style={{ alignItems: 'center' }}><TextLink label="Back to my skills" color="sub" onPress={() => swap('/skills')} /></Rise>
      </BottomCta>
    </Screen>
  );
}
