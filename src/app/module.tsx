import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { errorMessage } from '@/lib/http';
import { completeLesson, getModule, miniUnlocked, nextLesson, PRIORITY_META, setPracticeDone, type Resource, type RoadmapModule } from '@/lib/jems';
import { useJemsData } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { buzz, CheckCircle, FlowScreen, Group, GroupRow, Loading, NavBar, Notice, openLink, useShake, useToast } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Btn, Btn2, Chip, Disp, go, ON_G, Tone, Txt } from '@/ui/kit';
import { Confetti, Pop, PulseRing, Rise } from '@/ui/motion';
import { HeroCard } from '@/ui/parts';
import { RelearnGroup } from '@/ui/review';

const RESOURCE_ICON: Record<Resource['kind'], IconName> = { video: 'video', docs: 'book', article: 'file' };

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTheme();
  const toast = useToast();
  const { data: mod, setData, error, reload } = useJemsData(() => getModule(id));
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const { style: miniShake, shake } = useShake();
  const unlocked = mod ? miniUnlocked(mod) : false;

  /** Apply an update from the data layer and celebrate if it just unlocked the mini-assessment. */
  function apply(next: RoadmapModule) {
    const was = mod ? miniUnlocked(mod) : false;
    setData(next);
    if (!was && miniUnlocked(next)) {
      buzz('success');
      setBurst((b) => b + 1);
      toast.show('Mini-assessment unlocked!');
    }
  }

  async function finishLesson() {
    const lesson = mod && nextLesson(mod);
    if (!mod || !lesson) return;
    setBusy(true);
    try {
      apply(await completeLesson(mod.id, lesson.id));
      buzz('success');
      toast.show(`Lesson done: ${lesson.title}`);
    } catch (err) {
      toast.show(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function togglePractice(itemId: string, done: boolean) {
    if (!mod) return;
    buzz(done ? 'success' : 'light');
    // Optimistic: tick it now, confirm with the data layer.
    setData({ ...mod, practice: mod.practice.map((p) => (p.id === itemId ? { ...p, done } : p)) });
    try { apply(await setPracticeDone(mod.id, itemId, done)); } catch (err) { toast.show(errorMessage(err)); void reload(); }
  }

  function openMini() {
    if (!mod) return;
    if (mod.mini.passed) return toast.show('You already passed this one');
    if (!unlocked) {
      shake();
      return toast.show('Finish every lesson and practice task first');
    }
    go(`/skill-test?module=${mod.id}`);
  }

  if (error) return <FlowScreen title="Module" fallback="/roadmap"><Notice>{error}</Notice></FlowScreen>;
  if (!mod) return <FlowScreen title="Module" fallback="/roadmap"><Loading /></FlowScreen>;

  const locked = mod.status === 'locked';
  const upNext = nextLesson(mod);
  const lessonsDone = mod.lessons.filter((l) => l.done).length;
  const practiceDone = mod.practice.filter((p) => p.done).length;
  const lastFail = !mod.mini.passed ? mod.mini.lastFail ?? null : null;

  const footer = locked
    ? <Btn2 label="Finish the previous module first" lead="lock" height={58} />
    : upNext
      ? <Btn label={busy ? 'Saving…' : `Continue: ${upNext.title}`} icon="arrow" height={58} size={16} disabled={busy} onPress={finishLesson} />
      : mod.mini.passed
        ? <Btn2 label="Back to roadmap" lead="left" height={58} onPress={() => router.back()} />
        : unlocked
          ? <Btn label={lastFail ? 'Retake the mini-assessment' : 'Take the mini-assessment'} lead="target" height={58} onPress={openMini} />
          : <Btn label="Finish your practice" icon="arrow" height={58} onPress={() => scroll.current?.scrollToEnd({ animated: true })} />;

  return (
    <FlowScreen scrollRef={scroll} onRefresh={reload} footer={footer}
      nav={<NavBar title={`Module ${mod.index}`} fallback="/roadmap" right={<Txt w={6} size={13} color="dim">{mod.weeks}</Txt>} />}
      overlay={<>{burst ? <Confetti key={burst} count={22} start={100} height={880} /> : null}{toast.node}</>}>
      <Rise>
        <HeroCard kind={mod.status === 'done' ? 'g4' : 'g1'}>
          <Txt w={7} size={11} color="#fdba74" style={{ letterSpacing: 1.5 }}>{`${mod.levelFrom.toUpperCase()} → ${mod.levelTo.toUpperCase()} · ABOUT ${mod.hours} HRS`}</Txt>
          <Disp size={30} lh={32} ls={-0.03} color={ON_G} style={{ marginTop: 8 }} accessibilityRole="header">{mod.title}</Disp>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {mod.gaps.map((g) => <Chip key={g.label} tone={PRIORITY_META[g.priority].tone as Tone} h={26} bg="rgba(255,251,240,0.14)" fg={ON_G}>{`Closes gap: ${g.label}`}</Chip>)}
          </View>
        </HeroCard>
      </Rise>

      {lastFail ? (
        <Rise delay={60} style={{ gap: 14 }}>
          <Notice tone="o" icon="target">{`Your last mini-assessment scored ${lastFail.percent}% (pass is ${mod.mini.passPercent}%). Go over these topics, then retake it.`}</Notice>
          <RelearnGroup topics={lastFail.relearn} />
        </Rise>
      ) : null}

      <Rise delay={100}>
        <Group title="Why this matters">
          <GroupRow first><Txt size={16} lh={24} color="sub" style={{ flex: 1 }}>{mod.why}</Txt></GroupRow>
        </Group>
      </Rise>

      <Rise delay={150}>
        <Group title="Lessons" action={<Txt w={6} size={13} color="dim">{`${lessonsDone} of ${mod.lessons.length} done`}</Txt>}>
          {mod.lessons.map((lesson, i) => {
            const isNext = !locked && lesson.id === upNext?.id;
            const state = lesson.done ? 'done' : isNext ? 'next' : 'locked';
            const before = mod.lessons[i - 1];
            return (
              <GroupRow key={lesson.id} first={i === 0} inset={74} onPress={isNext && !busy ? finishLesson : undefined} style={isNext ? { backgroundColor: t.brandbg } : undefined}
                accessibilityRole="button" accessibilityLabel={`${lesson.title}, ${state === 'done' ? 'completed' : state === 'next' ? `up next, ${lesson.minutes} minutes. Double tap to mark done` : 'locked'}`}>
                {state === 'done' ? (
                  <Pop duration={300}><View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.goodbg, alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={22} color={t.good} sw={2.8} /></View></Pop>
                ) : state === 'next' ? (
                  <View style={{ width: 44, height: 44 }}>
                    <PulseRing size={44} />
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ea580c', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={20} color="#fff" /></View>
                  </View>
                ) : (
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="lock" size={20} color={t.dim} /></View>
                )}
                <View style={{ flex: 1 }}>
                  <Txt w={state === 'next' ? 7 : 6} size={16} color={state === 'next' ? 'brand' : state === 'locked' ? 'sub' : 'fg'}>{lesson.title}</Txt>
                  <Txt size={13} color={state === 'next' ? 'brand' : 'dim'}>
                    {state === 'done' ? 'Completed' : state === 'next' ? `Up next · ${lesson.minutes} min` : locked ? 'Unlocks with this module' : `Unlocks after ${before?.title ?? 'the previous lesson'}`}
                  </Txt>
                </View>
              </GroupRow>
            );
          })}
        </Group>
      </Rise>

      <Rise delay={200}>
        <Group title="Learn from" note={mod.resources.length ? undefined : 'Hand-picked videos, docs and articles appear here when this module opens.'}>
          {mod.resources.length === 0 ? (
            <GroupRow first><Txt size={15} color="dim">Nothing here yet</Txt></GroupRow>
          ) : mod.resources.map((resource, i) => (
            <GroupRow key={resource.id} first={i === 0} inset={74} onPress={() => openLink(resource.url, toast.show)} accessibilityRole="link" accessibilityLabel={`${resource.title}, ${resource.meta}`}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={RESOURCE_ICON[resource.kind]} size={20} color={t.fg} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt w={6} size={16}>{resource.title}</Txt>
                <Txt size={13} color="dim">{resource.meta}</Txt>
              </View>
              <Icon name="external" size={18} color={t.dim} />
            </GroupRow>
          ))}
        </Group>
      </Rise>

      <Rise delay={250}>
        <Group title="Practice" action={<Txt w={6} size={13} color="dim">{`${practiceDone} of ${mod.practice.length} done`}</Txt>}>
          {mod.practice.map((item, i) => (
            <GroupRow key={item.id} first={i === 0} inset={56} disabled={locked} onPress={() => togglePractice(item.id, !item.done)}
              accessibilityRole="checkbox" accessibilityState={{ checked: item.done, disabled: locked }} accessibilityLabel={item.title} style={{ alignItems: 'flex-start' }}>
              <CheckCircle on={item.done} />
              <View style={{ flex: 1 }}>
                <Txt w={item.done ? 4 : 6} size={16} color={item.done ? 'dim' : 'fg'} style={item.done ? { textDecorationLine: 'line-through' } : undefined}>{item.title}</Txt>
                {item.detail ? <Txt size={13} lh={18} color="dim" style={{ marginTop: 2 }}>{item.detail}</Txt> : null}
              </View>
            </GroupRow>
          ))}
        </Group>
      </Rise>

      <Rise delay={300}>
        <Animated.View style={miniShake}>
          <Group>
            <GroupRow first onPress={openMini} accessibilityRole="button" accessibilityLabel={`Mini-assessment, ${mod.mini.questions} questions${mod.mini.passed ? ', passed' : unlocked ? '' : ', locked'}`} style={{ paddingVertical: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: mod.mini.passed ? t.goodbg : t.brandbg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="target" size={24} color={mod.mini.passed ? t.good : t.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={17}>Mini-assessment</Txt>
                <Txt size={13} lh={18} color="sub" style={{ marginTop: 2 }}>
                  {`${mod.mini.questions} questions. Pass at ${mod.mini.passPercent}% to ${mod.index < 5 ? `unlock Module ${mod.index + 1}` : 'finish your roadmap'}.${lastFail ? ` Last try: ${lastFail.percent}%.` : ''}`}
                </Txt>
              </View>
              {mod.mini.passed ? <Icon name="check" size={22} color={t.good} sw={2.8} /> : unlocked ? <Pop><Icon name="arrow" size={22} color={t.brand} sw={2.4} /></Pop> : <Icon name="lock" size={20} color={t.dim} />}
            </GroupRow>
          </Group>
        </Animated.View>
      </Rise>
    </FlowScreen>
  );
}
