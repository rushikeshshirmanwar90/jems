import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Disp, Eyebrow, go, Screen, TextLink, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Press, Rise, Slide } from '@/ui/motion';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { OVERSHOOT } from '@/ui/motion';

const ROLES: { name: string; desc: string; icon: IconName }[] = [
  { name: 'Student', desc: 'Verify skills, follow a roadmap, get hired.', icon: 'cap' },
  { name: 'Industry', desc: 'Hire verified talent and sponsor programs.', icon: 'building' },
  { name: 'Institution', desc: 'Track placement readiness and skill gaps.', icon: 'chart' },
  { name: 'Faculty', desc: 'Mentor students and answer industry asks.', icon: 'users' },
];

function TickBadge({ on }: { on: boolean }) {
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(on ? 1 : 0, { duration: 300, easing: OVERSHOOT });
  }, [on, p]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: p.value }] }));
  return (
    <Animated.View style={[{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#ea580c', alignItems: 'center', justifyContent: 'center' }, a]}>
      <Icon name="check" size={15} color="#fff" sw={3.2} />
    </Animated.View>
  );
}

export default function ChooseRole() {
  const { t } = useTheme();
  const [role, setRole] = useState(0);
  return (
    <Screen bottom={170} glows={[{ top: -60, right: -160, size: 420 }]}>
      <Rise><BackBtn to="/onboarding" /></Rise>
      <Rise delay={50} style={{ marginTop: 22 }}><Eyebrow>Step 1 of 2</Eyebrow></Rise>
      <Rise delay={100}>
        <Disp size={40} lh={40} style={{ marginTop: 6 }}>I'm joining{'\n'}as a...</Disp>
      </Rise>
      <View style={{ marginTop: 22, gap: 12 }}>
        {ROLES.map((r, i) => {
          const sel = role === i;
          return (
            <Slide key={r.name} delay={150 + i * 100}>
              <Press onPress={() => setRole(i)} accessibilityState={{ selected: sel }} accessibilityLabel={`${r.name}. ${r.desc}`} scale={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 26, backgroundColor: sel ? t.brandbg : t.surf, borderWidth: 1.5, borderColor: sel ? '#ea580c' : 'transparent' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: sel ? '#c2410c' : t.surf2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={r.icon} size={26} color={sel ? '#fff' : t.fg} sw={2.1} />
                </View>
                <View style={{ flex: 1 }}>
                  <Disp size={22} lh={26} ls={-0.03}>{r.name}</Disp>
                  <Txt size={14} lh={20} color="sub" style={{ marginTop: 2 }}>{r.desc}</Txt>
                </View>
                <TickBadge on={sel} />
              </Press>
            </Slide>
          );
        })}
      </View>
      <BottomCta>
        <Btn label={`Continue as ${ROLES[role].name}`} icon="arrow" height={60} onPress={() => go('/sign-up')} />
        <View style={{ alignItems: 'center' }}>
          <TextLink label="Already registered? Sign in" onPress={() => go('/sign-in')} />
        </View>
      </BottomCta>
    </Screen>
  );
}
