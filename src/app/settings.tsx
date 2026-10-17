import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, Disp, Eyebrow, go, Row, Screen, swap, Toggle, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise } from '@/ui/motion';
import { LinkRow } from '@/ui/parts';

const DEFS: [string, string][] = [['Job matches', 'New roles above 80% match'], ['Interview reminders', '1 hour before each round'], ['Product updates', 'New features and tips'], ['Weekly report', 'Your readiness every Monday']];

export default function Settings() {
  const { t } = useTheme();
  const [tg, setTg] = useState([true, true, false, true]);
  return (
    <Screen bottom={50} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><BackBtn to="/profile" /></Rise>
      <Rise delay={80}><Disp size={42} lh={42} style={{ marginTop: 20 }}>Settings.</Disp></Rise>
      <Rise delay={140}><Eyebrow style={{ marginTop: 26 }}>Notifications</Eyebrow></Rise>
      <Rise delay={300} style={{ marginTop: 4 }}>
        {DEFS.map(([title, sub], i) => (
          <Row key={title} last={i === 3}>
            <View style={{ flex: 1 }}><Txt w={7} size={16}>{title}</Txt><Txt size={13} color="dim">{sub}</Txt></View>
            <Toggle on={tg[i]} label={title} onChange={() => setTg(tg.map((v, k) => (k === i ? !v : v)))} />
          </Row>
        ))}
      </Rise>
      <Rise delay={340}><Eyebrow style={{ marginTop: 22 }}>Account</Eyebrow></Rise>
      <Rise delay={380}>
        <LinkRow icon="user" title="Edit profile" onPress={() => go('/profile')} />
        <LinkRow icon="lock" title="Change password" onPress={() => go('/forgot-password')} />
        <LinkRow icon="eye" title="Privacy" sub="Portfolio is public" onPress={() => go('/profile')} last />
      </Rise>
      <Rise delay={440} style={{ marginTop: 20 }}>
        <Press onPress={() => swap('/')} style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Icon name="logout" size={20} color={t.danger} />
          <Txt w={7} size={16} color="danger">Sign out</Txt>
        </Press>
      </Rise>
    </Screen>
  );
}
