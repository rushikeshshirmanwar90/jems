import React, { useState } from 'react';
import { View } from 'react-native';
import { BackBtn, Btn, Disp, Eyebrow, Fld, go, Screen, swap, Txt, TextLink } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Press, Rise } from '@/ui/motion';
import { useTheme } from '@/theme/ThemeProvider';

const DEMOS: { name: string; email: string; to: string; icon: IconName }[] = [
  { name: 'Student', email: 'demo@jems.dev', to: '/home', icon: 'cap' },
  { name: 'Industry', email: 'company@jems.dev', to: '/co-home', icon: 'building' },
  { name: 'Institution', email: 'institution@jems.dev', to: '/inst-home', icon: 'chart' },
  { name: 'Faculty', email: 'faculty@jems.dev', to: '/fac-board', icon: 'users' },
];

export default function SignIn() {
  const { t } = useTheme();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('demo@jems.dev');
  const [pw, setPw] = useState('Demo@1234');
  return (
    <Screen glows={[{ top: -80, left: -150, size: 420 }]} bottom={50}>
      <Rise><BackBtn to="/choose-role" /></Rise>
      <Rise delay={80} style={{ marginTop: 22 }}>
        <Disp size={44} lh={42}>Welcome{'\n'}back.</Disp>
      </Rise>
      <Rise delay={140}><Txt size={16} color="sub" style={{ marginTop: 10 }}>Pick up where you left off.</Txt></Rise>
      <Rise delay={200} style={{ marginTop: 28, gap: 18 }}>
        <Fld label="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <View>
          <Fld label="PASSWORD" value={pw} onChangeText={setPw} secureTextEntry={!show} autoCapitalize="none" autoComplete="current-password" />
          <Press onPress={() => setShow(!show)} accessibilityLabel={show ? 'Hide password' : 'Show password'} haptic={false} style={{ position: 'absolute', right: -6, bottom: 0, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="eye" size={22} color={show ? t.brand : t.sub} />
          </Press>
        </View>
        <View style={{ alignItems: 'flex-end', marginTop: -6 }}>
          <TextLink label="Forgot password?" color="brand" size={14} onPress={() => go('/forgot-password')} />
        </View>
      </Rise>
      <Rise delay={300} style={{ marginTop: 2 }}>
        <Btn label="Sign in" icon="arrow" height={60} onPress={() => swap('/home')} />
      </Rise>
      <Rise delay={400} style={{ marginTop: 30 }}>
        <Eyebrow color="dim">Try a demo portal</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          {DEMOS.map((d) => (
            <Press key={d.name} onPress={() => swap(d.to)} accessibilityLabel={`Open ${d.name} demo`} style={{ width: '48.5%', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 18, backgroundColor: t.surf, minHeight: 44 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: t.brandbg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={d.icon} size={18} color={t.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={14} lh={18}>{d.name}</Txt>
                <Txt size={11} lh={14} color="dim" numberOfLines={1}>{d.email}</Txt>
              </View>
            </Press>
          ))}
        </View>
      </Rise>
      <Rise delay={500} style={{ alignItems: 'center', marginTop: 14 }}>
        <TextLink label="New to JEMS? Create account" onPress={() => go('/sign-up')} />
      </Rise>
    </Screen>
  );
}
