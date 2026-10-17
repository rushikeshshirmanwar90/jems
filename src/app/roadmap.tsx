import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGrad, Path, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRoadmap, getStatus, nextLesson, type Roadmap as RoadmapData, type RoadmapModule } from '@/lib/jems';
import { useJemsData } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState, Loading, Notice, useToast } from '@/ui/hig';
import { Btn, DesignStage, Disp, Eyebrow, FloatingNav, go, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Bob, Confetti, DrawPath, GrowBar, Pop, Press, PulseRing, Rise } from '@/ui/motion';

/* The winding path is authored on a 390pt-wide stage: nodes alternate left / right, one module per step. */
const X = { L: 106, R: 284 };
const TOP = 120;
const STEP = 200;
const centerOf = (i: number) => ({ x: i % 2 === 0 ? X.L : X.R, y: TOP + i * STEP });

function buildPath(count: number) {
  const pts = Array.from({ length: count }, (_, i) => centerOf(i));
  const end = { x: 195, y: TOP + count * STEP };
  const all = [...pts, end];
  let d = `M${all[0].x} ${all[0].y}`;
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1];
    const b = all[i];
    d += ` C${a.x} ${a.y + STEP * 0.5} ${b.x} ${b.y - STEP * 0.5} ${b.x} ${b.y}`;
  }
  return { d, end };
}

function Phase({ top, text, hot }: { top: number; text: string; hot?: boolean }) {
  const { t } = useTheme();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top, alignItems: 'center' }} pointerEvents="none">
      <View style={{ height: 30, paddingHorizontal: 14, borderRadius: 15, backgroundColor: t.bg, borderWidth: 1, borderColor: hot ? 'rgba(249,115,22,0.6)' : t.line, justifyContent: 'center' }}>
        <Txt w={7} size={11} color={hot ? 'brand' : 'dim'} style={{ letterSpacing: 0.9 }}>{text}</Txt>
      </View>
    </View>
  );
}

/** Text block beside a node: to the right of a left node, to the left of a right node. */
const sideText = (i: number, y: number, width = 210) =>
  i % 2 === 0 ? { position: 'absolute' as const, top: y, left: X.L + 46, width } : { position: 'absolute' as const, top: y, right: 390 - X.R + 46, width, alignItems: 'flex-end' as const };

function Node({ m, i, onLocked }: { m: RoadmapModule; i: number; onLocked: () => void }) {
  const { t } = useTheme();
  const c = centerOf(i);
  const done = m.status === 'done';
  const align = i % 2 === 0 ? 'left' : 'right';
  return (
    <>
      <Press onPress={() => (done ? go(`/module?id=${m.id}`) : onLocked())} accessibilityLabel={`Module ${m.index}, ${m.title}, ${done ? 'done' : 'locked'}`}
        style={{ position: 'absolute', left: c.x - 32, top: c.y - 32, width: 64, height: 64 }}>
        {done ? (
          <Pop delay={500 + i * 120} style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', shadowColor: '#10b981', shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } }}>
            <LinearGradient colors={['#34d399', '#10b981']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            <Icon name="check" size={30} color="#052e22" sw={3} />
          </Pop>
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.surf, borderWidth: 1.5, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="lock" size={24} color={t.dim} sw={2.2} />
          </View>
        )}
      </Press>
      <Rise delay={done ? 700 + i * 120 : 0} style={sideText(i, c.y - 24)}>
        <Txt w={7} size={16} color={done ? 'fg' : 'sub'} align={align}>{m.title}</Txt>
        <Txt w={7} size={12} color={done ? 'good' : 'dim'} align={align}>{done ? `Done · ${m.weeks}` : `${m.weeks} · ~${m.hours} hrs · ${m.levelTo}`}</Txt>
      </Rise>
    </>
  );
}

function Current({ m, i }: { m: RoadmapModule; i: number }) {
  const { t } = useTheme();
  const c = centerOf(i);
  const lessonsDone = m.lessons.filter((l) => l.done).length;
  const next = nextLesson(m);
  const lastFail = m.mini.lastFail ?? null;
  const open = () => go(`/module?id=${m.id}`);
  const align = i % 2 === 0 ? 'left' : 'right';
  return (
    <>
      <Pop delay={1200} style={{ position: 'absolute', left: c.x - 36, top: c.y - 36, width: 72, height: 72 }}>
        <Press onPress={open} accessibilityLabel={`Continue module ${m.index}, ${m.title}`} style={{ width: 72, height: 72, borderRadius: 36, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <PulseRing size={72} />
          <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
          <Icon name="play" size={28} color="#fff" />
        </Press>
      </Pop>
      <Rise delay={1400} style={sideText(i, c.y - 42, 220)}>
        <Bob amp={3} duration={1200}><Txt w={7} size={11} color="eyebrow" align={align} style={{ letterSpacing: 1.3 }}>YOU ARE HERE</Txt></Bob>
        <Disp size={20} lh={22} ls={-0.02} align={align}>{m.title}</Disp>
        {lastFail && lastFail.relearn.length ? (
          <Txt w={6} size={12} color="gold" align={align} style={{ marginTop: 4 }}>{`Mini: ${lastFail.percent}% · ${lastFail.relearn.length} topic${lastFail.relearn.length === 1 ? '' : 's'} to relearn`}</Txt>
        ) : null}
        <Press onPress={open} style={{ marginTop: 8, alignSelf: align === 'left' ? 'flex-start' : 'flex-end', minHeight: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: t.inv, justifyContent: 'center' }}>
          <Txt w={8} size={13} color={t.invfg}>
            {lastFail ? 'Relearn and retake' : next ? `Resume · lesson ${lessonsDone + 1} of ${m.lessons.length}` : 'Practice and mini-test'}
          </Txt>
        </Press>
      </Rise>
    </>
  );
}

function Plan({ roadmap: r, roleLabel, insetBottom, pulling: p, onPull: pull, onLocked }: { roadmap: RoadmapData; roleLabel: string; insetBottom: number; pulling: boolean; onPull: () => void; onLocked: (m: RoadmapModule, prev?: RoadmapModule) => void }) {
  const { t } = useTheme();
  const modules = r.modules;
  const n = modules.length;
  const doneCount = modules.filter((m) => m.status === 'done').length;
  const currentIndex = modules.findIndex((m) => m.status === 'in_progress');
  const current = currentIndex >= 0 ? modules[currentIndex] : null;
  const lessonShare = current ? current.lessons.filter((l) => l.done).length / current.lessons.length : 0;
  const overall = ((doneCount + lessonShare) / n) * 100;
  const reached = currentIndex >= 0 ? currentIndex : doneCount === n ? n : 0;
  const { d, end } = buildPath(n);
  const height = end.y + 150;
  const [first, ...rest] = roleLabel.split(' ');

  return (
    <>
      <View style={{ paddingHorizontal: 24, paddingTop: 22, zIndex: 4 }}>
        <Rise style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Eyebrow>Your roadmap</Eyebrow>
          <Press onPress={() => go('/setup-profile')} accessibilityLabel="Change target role" style={{ minHeight: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: t.surf2, justifyContent: 'center' }}>
            <Txt w={7} size={12}>Change goal</Txt>
          </Press>
        </Rise>
        <Rise delay={100}><Disp size={34} lh={34} style={{ marginTop: 6 }}>{rest.length ? `${first}\n${rest.join(' ')}` : first}</Disp></Rise>
        <Rise delay={200} style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}><GrowBar pct={overall} delay={600} /></View>
          <Txt w={7} size={13} color="sub">{doneCount === n ? 'All done' : `${doneCount} of ${n} modules`}</Txt>
        </Rise>
        <Rise delay={250}><Txt size={13} color="dim" style={{ marginTop: 6 }}>{`${r.weeks} weeks to close ${r.gapCount} priority gaps`}</Txt></Rise>
      </View>
      <ScrollView style={{ flex: 1, marginTop: 10 }} contentContainerStyle={{ paddingBottom: 130 + insetBottom }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={p} onRefresh={pull} tintColor={t.brand} colors={[t.brand]} />}>
        <DesignStage height={height}>
          <Svg width={390} height={height} style={{ position: 'absolute' }}>
            <Defs>
              <SvgGrad id="pg" gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={TOP + Math.max(1, reached) * STEP}>
                <Stop offset="0" stopColor="#34d399" />
                <Stop offset="0.6" stopColor="#10b981" />
                <Stop offset="1" stopColor="#f97316" />
              </SvgGrad>
            </Defs>
            <Path d={d} fill="none" stroke={t.line} strokeWidth={8} strokeLinecap="round" strokeDasharray="1 15" />
            {reached > 0 ? <DrawPath d={d} stroke="url(#pg)" width={10} frac={reached / n} delay={400} duration={1800} /> : null}
          </Svg>
          {modules.map((m, i) => (
            <Phase key={`p-${m.id}`} top={centerOf(i).y - 82} text={`MODULE ${m.index} · ${m.weeks.toUpperCase()}`} hot={m.status === 'in_progress'} />
          ))}
          {modules.map((m, i) => (m.status === 'in_progress'
            ? <Current key={m.id} m={m} i={i} />
            : <Node key={m.id} m={m} i={i} onLocked={() => onLocked(m, modules[i - 1])} />))}
          <View style={{ position: 'absolute', left: end.x - 30, top: end.y - 30, width: 60, height: 60, borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', shadowColor: '#f59e0b', shadowOpacity: 0.6, shadowRadius: 18 }}>
            <LinearGradient colors={['#f59e0b', '#f97316']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            <Icon name="trophy" size={28} color="#111827" sw={2.2} />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, top: end.y + 42, alignItems: 'center', paddingHorizontal: 40 }}>
            <Disp size={24} ls={-0.02} color="gold">Job ready</Disp>
            <Txt size={12} lh={17} color="dim" align="center">{`Reassess at week ${r.reassessWeek} and see how far your score moved.`}</Txt>
          </View>
        </DesignStage>
      </ScrollView>
    </>
  );
}

export default function Roadmap() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { fresh } = useLocalSearchParams<{ fresh?: string }>();
  const { data: roadmap, error, reload } = useJemsData(getRoadmap);
  const { data: status } = useJemsData(getStatus);
  const [pulling, setPulling] = React.useState(false);

  // Just generated: celebrate once, then clear the flag.
  const burst = fresh === '1' && Boolean(roadmap);
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => router.setParams({ fresh: undefined } as never), 3500);
    return () => clearTimeout(timer);
  }, [burst]);

  const onPull = async () => { setPulling(true); try { await reload(); } finally { setPulling(false); } };

  return (
    <Screen scroll={false} nav={<FloatingNav kind="student" active="learn" />} glows={[{ top: -120, left: -120, size: 400 }]}
      overlay={<>{burst ? <Confetti count={26} start={400} height={880} /> : null}{toast.node}</>}>
      {error ? <View style={{ padding: 24 }}><Notice>{error}</Notice></View> : roadmap === undefined ? <Loading /> : roadmap === null ? (
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 22 }}>
          <Rise><Eyebrow>Your roadmap</Eyebrow></Rise>
          <EmptyState icon="target" title="No roadmap yet" text="Once you've taken the assessment, we turn your skill gaps into a week-by-week plan."
            action={<Btn label={status?.assessed ? 'See my skill gaps' : 'Get started'} icon="arrow" height={56}
              onPress={() => go(status?.assessed ? '/gaps' : status?.onboarded ? '/assessment' : '/setup-profile')} />} />
        </ScrollView>
      ) : (
        <Plan roadmap={roadmap} roleLabel={status?.roleLabel ?? roadmap.roleShort} insetBottom={insets.bottom} pulling={pulling} onPull={onPull}
          onLocked={(m, prev) => toast.show(prev ? `Finish Module ${prev.index} to unlock this one` : 'This module is locked')} />
      )}
    </Screen>
  );
}
