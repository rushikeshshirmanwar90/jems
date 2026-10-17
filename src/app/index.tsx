import React from 'react';
import { Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Btn, Chip, go, GradText, Screen, TextLink, Txt, Disp } from '@/ui/kit';
import { Marquee, Pop, Rise, Spin } from '@/ui/motion';
import Svg, { Circle } from 'react-native-svg';

const SKILLS = ['JavaScript', 'React', 'Python', 'SQL', 'Node.js', 'Git', 'TypeScript', 'Docker', 'Figma', 'Java'];

export default function Splash() {
  const { t } = useTheme();
  return (
    <Screen
      scroll={false}
      glows={[
        { top: -100, left: -120, size: 420 },
        { bottom: 40, right: -170, size: 420 },
      ]}
      contentStyle={{ paddingHorizontal: 28 }}
    >
      <Rise style={{ alignItems: 'center', marginTop: 56 }}>
        <View style={{ width: 136, height: 136, alignItems: 'center', justifyContent: 'center' }}>
          <Spin duration={16000} style={{ position: 'absolute' }}>
            <Svg width={136} height={136}>
              <Circle cx={68} cy={68} r={64} fill="none" stroke={t.brand} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
            </Svg>
          </Spin>
          <View style={{ width: 84, height: 84, borderRadius: 26, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 14 } }}>
            <LinearGradient colors={['#1f2937', '#0b1220']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            <Image source={require('../../assets/logo.png')} accessibilityLabel="JEMS logo" style={{ width: 66, height: 59 }} resizeMode="contain" />
          </View>
        </View>
      </Rise>

      <View style={{ marginTop: 30 }}>
        <Rise delay={300}>
          <Disp size={62} lh={58} ls={-0.05}>Learn.</Disp>
        </Rise>
        <Rise delay={500}>
          <GradText text="Prove it." from={'#c2410c'} to={'#b45309'} size={62} lh={58} />
        </Rise>
        <Rise delay={700}>
          <Disp size={62} lh={58} ls={-0.05}>Get hired.</Disp>
        </Rise>
        <Rise delay={950}>
          <Txt size={17} lh={25} color="sub" style={{ marginTop: 18, maxWidth: 310 }}>
            JEMS verifies what you can actually do, then matches you with employers who care.
          </Txt>
        </Rise>
      </View>

      <Rise delay={1100} style={{ marginTop: 36, marginHorizontal: -28 }}>
        <Marquee>
          {SKILLS.map((s) => (
            <Chip key={s} tone="g" icon="check">
              {s}
            </Chip>
          ))}
        </Marquee>
      </Rise>

      <View style={{ flex: 1 }} />
      <Rise delay={1200}>
        <Btn label="Get started" icon="arrow" height={60} onPress={() => go('/onboarding')} />
      </Rise>
      <Rise delay={1300} style={{ alignItems: 'center', marginBottom: 18 }}>
        <TextLink label="I already have an account" onPress={() => go('/sign-in')} />
      </Rise>
    </Screen>
  );
}
