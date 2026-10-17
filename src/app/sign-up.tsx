import React, { useState } from 'react';
import { View } from 'react-native';
import { BackBtn, Btn, Chip, Disp, Eyebrow, Fld, go, Screen, Txt } from '@/ui/kit';
import { Rise, Zoom } from '@/ui/motion';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

function Seg({ i }: { i: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(500 + i * 150, withTiming(1, { duration: 500 }));
  }, [i, p]);
  const a = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(120,120,120,0.2)', overflow: 'hidden' }}>
      <Animated.View style={[{ height: 5, backgroundColor: '#10b981' }, a]} />
    </View>
  );
}

export default function SignUp() {
  const { t } = useTheme();
  const [name, setName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav@college.edu');
  const [college, setCollege] = useState('Godavari Institute of Technology');
  const [pw, setPw] = useState('Learn@2026x');
  return (
    <Screen glows={[{ top: -60, right: -160, size: 420 }]} bottom={50}>
      <Rise><BackBtn to="/choose-role" /></Rise>
      <Rise delay={50} style={{ marginTop: 20 }}><Eyebrow>Step 2 of 2</Eyebrow></Rise>
      <Rise delay={100}><Disp size={42} lh={42} style={{ marginTop: 6 }}>Create your{'\n'}account.</Disp></Rise>
      <Rise delay={150} style={{ marginTop: 12 }}><Chip tone="b" icon="cap">Signing up as Student</Chip></Rise>
      <Rise delay={220} style={{ marginTop: 22, gap: 16 }}>
        <Fld label="FULL NAME" value={name} onChangeText={setName} autoComplete="name" />
        <Fld label="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Fld label="COLLEGE" value={college} onChangeText={setCollege} />
        <View>
          <Fld label="PASSWORD" value={pw} onChangeText={setPw} secureTextEntry autoCapitalize="none" autoComplete="new-password" />
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
            {[0, 1, 2, 3].map((i) => <Seg key={i} i={i} />)}
          </View>
          <Txt w={7} size={12} color="good" style={{ marginTop: 6 }}>Strong password</Txt>
        </View>
      </Rise>
      <Rise delay={320} style={{ marginTop: 22 }}>
        <Btn label="Create account" icon="arrow" height={60} onPress={() => go('/verify-otp')} />
      </Rise>
      <Rise delay={380}><Txt size={12} lh={18} color="dim" align="center" style={{ marginTop: 14 }}>By continuing you agree to the Terms and Privacy Policy.</Txt></Rise>
    </Screen>
  );
}
