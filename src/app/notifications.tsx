import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, Disp, Eyebrow, go, IconCircle, Screen, Tabs, Txt } from '@/ui/kit';
import { IconName } from '@/ui/iconData';
import { Press, Rise, Slide } from '@/ui/motion';

const ALL: { k: 1 | 2 | 3 | 4; t: string; when: string; u: boolean; to: string }[] = [
  { k: 1, t: 'New 92% match: Frontend Intern at Nexa Labs', when: '5 min ago', u: true, to: '/job-detail' },
  { k: 1, t: 'You are one skill away from Kriya Systems: Junior Web Developer', when: '1 hour ago', u: true, to: '/skills' },
  { k: 3, t: 'Interview scheduled: Technical round, Oct 16 at 11:00', when: '3 hours ago', u: true, to: '/applications' },
  { k: 2, t: 'JavaScript verified at 87%. +120 XP', when: 'Yesterday', u: false, to: '/test-result' },
  { k: 4, t: 'Keep it going: you are on a 5 day streak', when: 'Yesterday', u: false, to: '/home' },
  { k: 1, t: 'Pixel & Co sent you an offer for UI Developer Intern', when: '2 days ago', u: false, to: '/applications' },
  { k: 2, t: 'Roadmap updated: React Fundamentals is unlocked', when: '3 days ago', u: false, to: '/roadmap' },
];
const ICON: Record<number, IconName> = { 1: 'briefcase', 2: 'shield', 3: 'calendar', 4: 'flame' };

function Dot({ on }: { on: boolean }) {
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => { p.value = withTiming(on ? 1 : 0, { duration: 400 }); }, [on, p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value }));
  return <Animated.View style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ea580c', marginTop: 6 }, a]} />;
}

export default function Notifications() {
  const { t } = useTheme();
  const [f, setF] = useState(0);
  const [read, setRead] = useState(false);
  const list = ALL.filter((x) => f === 0 || (f === 1 && x.k === 1) || (f === 2 && x.k === 2) || (f === 3 && x.k === 3));
  const unread = read ? 0 : 3;
  const tone = (k: number) => (k === 1 ? { bg: t.brandbg, fg: t.brand } : k === 2 ? { bg: t.goodbg, fg: t.good } : k === 3 ? { bg: t.goldbg, fg: t.gold } : { bg: t.surf2, fg: t.fg });
  return (
    <Screen bottom={40} glows={[{ top: -90, right: -160, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackBtn to="/home" />
        <Press onPress={() => setRead(true)} haptic={false} style={{ minHeight: 44, paddingHorizontal: 14, justifyContent: 'center' }}><Txt w={7} size={14} color="brand">Mark all read</Txt></Press>
      </Rise>
      <Rise delay={50} style={{ marginTop: 20 }}><Eyebrow>Notifications</Eyebrow></Rise>
      <Rise delay={100}><Disp size={40} lh={40} style={{ marginTop: 6 }}>{unread > 0 ? `${unread} new for you.` : 'All caught up.'}</Disp></Rise>
      <Rise delay={160} style={{ marginTop: 18 }}><Tabs items={['All', 'Jobs', 'Skills', 'Interviews']} value={f} onChange={setF} /></Rise>
      <View key={f} style={{ marginTop: 8 }}>
        {list.map((n, i) => {
          const un = n.u && !read;
          const c = tone(n.k);
          return (
            <Slide key={n.t} delay={i * 50}>
              <Press onPress={() => go(n.to)} haptic={false} scale={0.98} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.line }}>
                <IconCircle icon={ICON[n.k]} bg={c.bg} color={c.fg} size={44} iconSize={20} />
                <View style={{ flex: 1 }}>
                  <Txt w={un ? 7 : 5} size={15} lh={21}>{n.t}</Txt>
                  <Txt size={12} color="dim" style={{ marginTop: 3 }}>{n.when}</Txt>
                </View>
                <Dot on={un} />
              </Press>
            </Slide>
          );
        })}
      </View>
    </Screen>
  );
}
