import React, { useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { BRANCHES, ROLES, YEARS } from '@/lib/jems';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/ui/Icon';
import { useJems } from '@/lib/jems-store';
import { ChoiceTile, FlowScreen, Group, GroupRow, Segmented, StepProgress, TitleBlock, useShake } from '@/ui/hig';
import { Btn, Fld, go, Txt } from '@/ui/kit';
import { Rise } from '@/ui/motion';

const ROLE_ROWS = Array.from({ length: Math.ceil(ROLES.length / 2) }, (_, i) => ROLES.slice(i * 2, i * 2 + 2));

export default function SetupProfile() {
  const { t } = useTheme();
  const { draft, setProfile } = useJems();
  const { style: shakeStyle, shake } = useShake();
  const [tried, setTried] = useState(false);
  const profile = draft.profile;
  const nameMissing = !profile.fullName.trim();
  const roleMissing = !profile.roleId;

  function next() {
    if (nameMissing || roleMissing) { setTried(true); shake(); return; }
    go('/setup-skills');
  }

  return (
    <FlowScreen title="Your profile" fallback="/home" footer={
      <Animated.View style={shakeStyle}>
        <Btn label="Continue to skills" icon="arrow" height={58} onPress={next} />
      </Animated.View>
    }>
      <Rise><StepProgress step={1} /></Rise>
      <TitleBlock delay={60} title="Tell us about you" sub="Your target role decides which company skill sets we compare you against." />

      <Rise delay={120} style={{ gap: 18 }}>
        <View>
          <Fld label="FULL NAME" value={profile.fullName} onChangeText={(fullName) => setProfile({ fullName })} placeholder="Your full name"
            autoCapitalize="words" autoComplete="name" textContentType="name" returnKeyType="next" accessibilityLabel="Full name" />
          {tried && nameMissing ? <Txt size={13} color="danger" style={{ marginTop: 6 }}>Enter your full name.</Txt> : null}
        </View>
        <Fld label="COLLEGE" value={profile.college} onChangeText={(college) => setProfile({ college })} placeholder="Your college and city"
          autoCapitalize="words" returnKeyType="done" accessibilityLabel="College" />
      </Rise>

      <Rise delay={180}>
        <Group title="Branch">
          {BRANCHES.map((b, i) => {
            const on = profile.branch === b.value;
            return (
              <GroupRow key={b.value} first={i === 0} onPress={() => setProfile({ branch: b.value })} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={b.label}>
                <Txt w={on ? 7 : 5} size={16} style={{ flex: 1 }}>{b.label}</Txt>
                {on ? <Icon name="check" size={20} color={t.brand} sw={2.8} /> : null}
              </GroupRow>
            );
          })}
        </Group>
      </Rise>

      <Rise delay={220} style={{ gap: 8 }}>
        <Txt w={7} size={13} color="sub" style={{ letterSpacing: 0.6, paddingHorizontal: 4 }}>YEAR</Txt>
        <Segmented label="Year" options={YEARS} value={profile.year} onChange={(year) => year && setProfile({ year })} />
      </Rise>

      <Rise delay={260} style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          <Txt w={7} size={13} color="sub" style={{ letterSpacing: 0.6 }}>TARGET ROLE</Txt>
          <Txt size={13} color={tried && roleMissing ? 'danger' : 'dim'}>{tried && roleMissing ? 'Pick one to continue' : 'Pick one'}</Txt>
        </View>
        <View style={{ gap: 10 }} accessibilityRole="radiogroup" accessibilityLabel="Target role">
          {ROLE_ROWS.map((pair) => (
            <View key={pair[0].value} style={{ flexDirection: 'row', gap: 10 }}>
              {pair.map((role) => (
                <ChoiceTile key={role.value} label={role.label} selected={profile.roleId === role.value} onPress={() => setProfile({ roleId: role.value })} style={{ flex: 1 }} />
              ))}
            </View>
          ))}
        </View>
      </Rise>
    </FlowScreen>
  );
}
