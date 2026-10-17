import React from 'react';
import { View } from 'react-native';
import { BackBtn, Disp, Eyebrow, FloatingNav, go, Screen, swap, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Press, Rise } from '@/ui/motion';
import { LinkRow } from '@/ui/parts';
import { useTheme } from '@/theme/ThemeProvider';

export default function More() {
  const { t } = useTheme();
  return (
    <Screen nav={<FloatingNav kind="student" active="profile" />} glows={[{ top: -80, right: -150, size: 440 }]}>
      <Rise><BackBtn to="/profile" /></Rise>
      <Rise delay={80}><Disp size={42} lh={42} style={{ marginTop: 20 }}>Everything{'\n'}else.</Disp></Rise>
      <Rise delay={140}><Eyebrow style={{ marginTop: 26 }}>Learn</Eyebrow></Rise>
      <Rise delay={180}>
        <LinkRow icon="book" title="Learning paths" sub="14 careers" onPress={() => go('/learning')} />
        <LinkRow icon="target" title="My roadmap" sub="2 of 8 modules" onPress={() => go('/roadmap')} />
        <LinkRow icon="mic" title="Mock interviews" sub="4 rounds" onPress={() => go('/interviews')} last />
      </Rise>
      <Rise delay={220}><Eyebrow style={{ marginTop: 22 }}>Career</Eyebrow></Rise>
      <Rise delay={260}>
        <LinkRow icon="briefcase" title="Applications" sub="4 in progress" onPress={() => go('/applications')} />
        <LinkRow icon="file" title="Resume builder" sub="ATS 82" onPress={() => go('/resume')} />
        <LinkRow icon="bell" title="Notifications" sub="3 new" chip="3" onPress={() => go('/notifications')} last />
      </Rise>
      <Rise delay={300}><Eyebrow style={{ marginTop: 22 }}>App</Eyebrow></Rise>
      <Rise delay={340}>
        <LinkRow icon="sliders" title="Settings" sub="Theme, alerts, account" onPress={() => go('/settings')} />
        <LinkRow icon="help" title="Help and feedback" onPress={() => go('/settings')} last />
      </Rise>
      <Rise delay={400} style={{ marginTop: 20 }}>
        <Press onPress={() => swap('/')} style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Icon name="logout" size={20} color={t.danger} />
          <Txt w={7} size={16} color="danger">Sign out</Txt>
        </Press>
      </Rise>
    </Screen>
  );
}
