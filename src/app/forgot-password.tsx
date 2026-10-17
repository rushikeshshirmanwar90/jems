import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BackBtn, BottomCta, Btn, Disp, Fld, Screen, swap, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { OrbRings, Pop, Rise } from '@/ui/motion';
import { useTheme } from '@/theme/ThemeProvider';

export default function ForgotPassword() {
  const { t } = useTheme();
  const [sent, setSent] = useState(false);
  const [left, setLeft] = useState(30);
  const [email, setEmail] = useState('aarav@college.edu');
  useEffect(() => {
    if (!sent) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [sent]);
  return (
    <Screen glows={[{ top: -60, right: -160, size: 420 }]}>
      <Rise><BackBtn to="/sign-in" /></Rise>
      {!sent ? (
        <View key="form">
          <Rise delay={80}><Disp size={42} lh={42} style={{ marginTop: 22 }}>Forgot your{'\n'}password?</Disp></Rise>
          <Rise delay={140}><Txt size={16} lh={24} color="sub" style={{ marginTop: 10 }}>No stress. Enter your email and we will send a reset link.</Txt></Rise>
          <Rise delay={220} style={{ marginTop: 30 }}>
            <Fld label="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </Rise>
        </View>
      ) : (
        <View key="sent" style={{ alignItems: 'center' }}>
          <View style={{ width: 170, height: 170, marginTop: 48, alignItems: 'center', justifyContent: 'center' }}>
            <OrbRings size={170} color={t.brand} duration={2400} />
            <Pop style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#c2410c', alignItems: 'center', justifyContent: 'center', shadowColor: '#d4450a', shadowOpacity: 0.6, shadowRadius: 24, shadowOffset: { width: 0, height: 16 } }}>
              <Icon name="mail" size={44} color="#fff" sw={1.8} />
            </Pop>
          </View>
          <Rise delay={300}><Disp size={40} lh={40} align="center" style={{ marginTop: 32 }}>Check your inbox.</Disp></Rise>
          <Rise delay={400}>
            <Txt size={16} lh={24} color="sub" align="center" style={{ marginTop: 12 }}>We sent a reset link to <Txt w={7} size={16}>{email}</Txt>. It expires in 30 minutes.</Txt>
          </Rise>
          <Rise delay={500}><Txt size={14} color="dim" style={{ marginTop: 14 }}>{left > 0 ? `Resend available in 0:${left < 10 ? '0' : ''}${left}` : 'Didn’t get it? Resend link'}</Txt></Rise>
        </View>
      )}
      <BottomCta>
        {!sent ? <Btn label="Send reset link" lead="send" height={60} onPress={() => { setSent(true); setLeft(30); }} /> : <Btn label="Back to sign in" height={60} sheen={false} onPress={() => swap('/sign-in')} />}
      </BottomCta>
    </Screen>
  );
}
