import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BackBtn, BottomCta, Btn, Chip, Disp, Screen, swap, TextLink, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Pop, Press, Rise } from '@/ui/motion';
import { useTheme } from '@/theme/ThemeProvider';

export default function VerifyOtp() {
  const { t } = useTheme();
  const { width } = useWindowDimensions();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(30);
  useEffect(() => {
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const ok = code.length === 6;
  const press = (d: string) => {
    if (d === 'back') setCode((c) => c.slice(0, -1));
    else setCode((c) => (c.length < 6 ? c + d : c));
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];
  const keyW = (Math.min(width, 430) - 48 - 16) / 3;
  return (
    <Screen scroll={false} glows={[{ top: -70, left: -150, size: 420 }]}>
      <View style={{ paddingHorizontal: 24, marginTop: 22 }}>
        <Rise><BackBtn to="/sign-up" /></Rise>
        <Rise delay={80}><Disp size={42} lh={42} style={{ marginTop: 22 }}>Check your{'\n'}email.</Disp></Rise>
        <Rise delay={140}>
          <Txt size={15} lh={22} color="sub" style={{ marginTop: 10 }}>We sent a 6-digit code to <Txt w={7} size={15}>aarav@college.edu</Txt></Txt>
        </Rise>
        <Rise delay={200} style={{ flexDirection: "row", gap: 10, marginTop: 26 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const ch = code[i] ?? '';
            const active = i === code.length;
            return (
              <View key={i} style={{ flex: 1, height: 64, borderRadius: 18, backgroundColor: ch ? t.brandbg : t.surf, borderWidth: 1.5, borderColor: active ? '#ea580c' : ch ? t.brand : 'transparent', alignItems: 'center', justifyContent: 'center', transform: [{ scale: ch ? 1.04 : 1 }] }}>
                <Disp size={30} ls={0}>{ch}</Disp>
              </View>
            );
          })}
        </Rise>
        <View style={{ height: 40, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {ok ? (
            <Pop><Chip tone="g" icon="check" h={30}>Email verified</Chip></Pop>
          ) : (
            <>
              <Txt size={14} color="dim">{left > 0 ? `Resend in 0:${left < 10 ? '0' : ''}${left}` : 'Didn’t get it? Resend'}</Txt>
              <TextLink label="Paste code" color="brand" size={14} onPress={() => setCode('482913')} />
            </>
          )}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 392, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {keys.map((k, i) => (
          <Press key={i} onPress={() => press(k)} disabled={k === ''} accessibilityLabel={k === 'back' ? 'Delete' : k === '' ? 'Empty' : `Digit ${k}`} style={{ width: keyW, height: 56, borderRadius: 28, backgroundColor: k === 'back' || k === '' ? 'transparent' : t.surf, alignItems: 'center', justifyContent: 'center', opacity: k === '' ? 0 : 1 }}>
            {k === 'back' ? <Icon name="left" size={24} color={t.fg} /> : <Disp size={26} ls={0} lh={28}>{k}</Disp>}
          </Press>
        ))}
      </View>
      <BottomCta>
        {ok ? (
          <Pop><Btn label="Continue" icon="arrow" height={60} onPress={() => swap('/home')} /></Pop>
        ) : (
          <View style={{ height: 60, borderRadius: 30, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
            <Txt w={7} size={17} color="dim">Verify</Txt>
          </View>
        )}
      </BottomCta>
    </Screen>
  );
}
