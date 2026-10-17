import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Disp, Eyebrow, go, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise, Zoom } from '@/ui/motion';

const DATA: [string, number, string, number][] = [
  ['Full Stack Developer', 91, '₹8–15 LPA', 26], ['Frontend Developer', 88, '₹6–12 LPA', 20], ['Backend Developer', 79, '₹7–14 LPA', 24],
  ['Mobile App Developer', 72, '₹7–13 LPA', 22], ['Data Analyst', 66, '₹5–10 LPA', 18], ['UI/UX Designer', 61, '₹5–11 LPA', 18],
  ['QA Engineer', 58, '₹4–8 LPA', 14], ['DevOps Engineer', 52, '₹9–16 LPA', 28], ['Cloud Engineer', 49, '₹9–17 LPA', 26],
  ['Data Scientist', 45, '₹8–18 LPA', 32], ['ML Engineer', 41, '₹10–20 LPA', 36], ['Cybersecurity Analyst', 38, '₹7–14 LPA', 30],
  ['Product Manager', 34, '₹10–22 LPA', 24], ['Game Developer', 30, '₹5–12 LPA', 30],
];

export default function Goals() {
  const { t } = useTheme();
  const [sel, setSel] = useState(0);
  return (
    <Screen bottom={150} glows={[{ top: -80, right: -160, size: 440 }]}>
      <Rise><BackBtn to="/career-analysis" /></Rise>
      <Rise delay={50} style={{ marginTop: 22 }}><Eyebrow>Pick your goal</Eyebrow></Rise>
      <Rise delay={100}><Disp size={40} lh={40} style={{ marginTop: 6 }}>Where do you{'\n'}want to land?</Disp></Rise>
      <Rise delay={150}><Txt size={15} lh={22} color="sub" style={{ marginTop: 10 }}>Sorted by how well your verified skills fit today.</Txt></Rise>
      <Animated.View layout={LinearTransition.duration(250)} style={{ marginTop: 14 }}>
        {DATA.map((d, i) => {
          const on = sel === i;
          const mc = d[1] >= 80 ? t.good : d[1] >= 60 ? t.gold : t.dim;
          return (
            <Animated.View key={d[0]} layout={LinearTransition.duration(250)}>
              <Press onPress={() => setSel(i)} accessibilityState={{ selected: on }} haptic scale={0.98} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, minHeight: 44, borderBottomWidth: 1, borderBottomColor: t.line }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: on ? '#ea580c' : t.line, backgroundColor: on ? '#ea580c' : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  {on ? <Icon name="check" size={15} color="#fff" sw={3.2} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Txt w={7} size={on ? 21 : 17}>{d[0]}</Txt>
                  {on ? (
                    <Zoom style={{ flexDirection: 'row', gap: 14, marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Icon name="trend" size={14} color={t.sub} sw={2.4} /><Txt size={13} color="sub">{d[2]}</Txt></View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Icon name="clock" size={14} color={t.sub} sw={2.4} /><Txt size={13} color="sub">~{d[3]} weeks</Txt></View>
                    </Zoom>
                  ) : null}
                </View>
                <Disp size={22} color={mc}>{d[1]}<Disp size={12} color={mc}>%</Disp></Disp>
              </Press>
            </Animated.View>
          );
        })}
      </Animated.View>
      <BottomCta>
        <Btn label={`Build my ${DATA[sel][0]} roadmap`} icon="arrow" height={60} onPress={() => go('/roadmap')} />
      </BottomCta>
    </Screen>
  );
}
