import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { generateRoadmap, getGapAnalysis, getStatus, PRIORITY_META, type Gap } from '@/lib/jems';
import { useJemsData } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { buzz, FlowScreen, GroupRow, Loading, Notice, useToast, WorkingOverlay } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Btn, Chip, Disp, Eyebrow, Tone, toneColors, Txt } from '@/ui/kit';
import { GrowBar, Press, Rise, useCountUp } from '@/ui/motion';

/** Back to a tab with a clean stack (tabs replace each other in this app). */
const resetTo = (path: string) => {
  if (router.canDismiss()) router.dismissAll();
  router.replace(path as never);
};

export default function Gaps() {
  const toast = useToast();
  const { data: gaps, error, reload } = useJemsData(getGapAnalysis);
  const { data: status } = useJemsData(getStatus);
  const [working, setWorking] = useState(false);
  const match = useCountUp(gaps?.match ?? 0, 1200, 250);

  return (
    <FlowScreen title="Skill gaps" fallback="/skills" onRefresh={reload}
      overlay={<>
        {toast.node}
        {working ? (
          <WorkingOverlay eyebrow="Your roadmap" title="Building a plan around your gaps"
            steps={['Ranking gaps by priority', 'Picking lessons and resources', 'Scheduling your 8-week plan']}
            task={generateRoadmap}
            onDone={() => { setWorking(false); resetTo('/roadmap?fresh=1'); }}
            onError={(message) => { setWorking(false); toast.show(message); }} />
        ) : null}
      </>}
      footer={
        <View style={{ gap: 6 }}>
          {status?.roadmapReady
            ? <Btn label="Open my roadmap" icon="arrow" height={58} onPress={() => resetTo('/roadmap')} />
            : <Btn label="Generate my roadmap" lead="target" height={58} disabled={!gaps} onPress={() => setWorking(true)} />}
          <Txt size={12} color="dim" align="center">We order the gaps by priority and build a plan around them.</Txt>
        </View>
      }>
      {error ? <Notice>{error}</Notice> : gaps === undefined ? <Loading /> : gaps === null ? (
        <Notice tone="o" icon="shield">Take the skill assessment first to see your gaps.</Notice>
      ) : (
        <>
          <Rise>
            <Eyebrow>Target role</Eyebrow>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Disp size={28} lh={30} ls={-0.03}>{gaps.roleLabel}</Disp>
                <Txt size={14} color="sub" style={{ marginTop: 4 }}>Compared with MSME job requirements</Txt>
              </View>
              <View style={{ alignItems: 'flex-end' }} accessible accessibilityLabel={`${gaps.match} percent match`}>
                <Disp size={48} lh={48} color="brand">{match}<Disp size={22} color="brand">%</Disp></Disp>
                <Txt size={13} color="sub">match</Txt>
              </View>
            </View>
            <View style={{ marginTop: 14 }}><GrowBar pct={gaps.match} delay={300} height={8} /></View>
          </Rise>

          <Rise delay={100}>
            <GapGroup title="Missing" icon="x" tone="r" count={gaps.missing.length}>
              {gaps.missing.map((gap, i) => <GapRow key={gap.id} gap={gap} first={i === 0} />)}
            </GapGroup>
          </Rise>
          <Rise delay={160}>
            <GapGroup title="Weak" icon="alert" tone="o" count={gaps.weak.length}>
              {gaps.weak.map((gap, i) => <GapRow key={gap.id} gap={gap} first={i === 0} />)}
            </GapGroup>
          </Rise>
          <Rise delay={220}>
            <GapGroup title="Matched" icon="check" tone="g" count={gaps.matched.length}>
              {gaps.matched.map((m, i) => (
                <GroupRow key={m.skill} first={i === 0}>
                  <Txt w={6} size={16} style={{ flex: 1 }}>{m.skill}</Txt>
                  <Txt size={14} color="dim">{m.level}</Txt>
                </GroupRow>
              ))}
            </GapGroup>
          </Rise>
        </>
      )}
    </FlowScreen>
  );
}

/** A tinted, collapsible group of gaps (like an iOS disclosure section). */
function GapGroup({ title, icon, tone, count, children }: { title: string; icon: IconName; tone: Tone; count: number; children: React.ReactNode }) {
  const { t } = useTheme();
  const c = toneColors(t, tone);
  const [open, setOpen] = useState(true);
  const turn = useSharedValue(0);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));
  const toggle = () => {
    buzz('light');
    turn.value = withTiming(open ? -90 : 0, { duration: 200 });
    setOpen((v) => !v);
  };
  return (
    <View style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: t.card, borderWidth: 1, borderColor: c.bg }}>
      <Press onPress={toggle} haptic={false} scale={0.99} accessibilityState={{ expanded: open }} accessibilityLabel={`${title}, ${count} skills`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, minHeight: 54, backgroundColor: c.bg }}>
        <Icon name={icon} size={20} color={c.fg} sw={2.4} />
        <Txt w={7} size={17} color={c.fg} style={{ flex: 1 }}>{title}</Txt>
        <Txt w={7} size={14} color={c.fg}>{`${count} skills`}</Txt>
        <Animated.View style={chevron}><View style={{ transform: [{ rotate: '90deg' }] }}><Icon name="right" size={18} color={c.fg} sw={2.4} /></View></Animated.View>
      </Press>
      {open ? <Animated.View entering={FadeIn.duration(200)}>{children}</Animated.View> : null}
    </View>
  );
}

function GapRow({ gap, first }: { gap: Gap; first: boolean }) {
  const priority = PRIORITY_META[gap.priority];
  return (
    <GroupRow first={first}>
      <View style={{ flex: 1 }}>
        <Txt w={7} size={16}>{gap.skill}</Txt>
        <Txt size={13} color="dim" style={{ marginTop: 2 }}>{`Needs ${gap.needs} · You: ${gap.you}`}</Txt>
      </View>
      <Chip tone={priority.tone as Tone} h={26}>{priority.label}</Chip>
    </GroupRow>
  );
}
