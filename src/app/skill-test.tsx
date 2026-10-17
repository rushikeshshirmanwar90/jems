import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { errorMessage } from '@/lib/http';
import { getPaper, submitAssessment, submitMiniAssessment, type Answer, type MiniResult, type Paper } from '@/lib/jems';
import { useJems, type Attempt } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { buzz, confirm, FlowScreen, Loading, NavBar, Notice, Sheet, useToast, WorkingOverlay } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { BottomCta, Btn, Btn2, Chip, CodeBlock, Disp, mono, Ring, Screen, Txt } from '@/ui/kit';
import { Confetti, Press, Rise, Slide, useCountUp } from '@/ui/motion';
import { MissedGroup, RelearnGroup } from '@/ui/review';

const WARN_SECONDS = 5 * 60;
const L = ['A', 'B', 'C', 'D', 'E', 'F'];
const isAnswered = (a: Answer | undefined) => (typeof a === 'number' ? true : Boolean(a?.trim()));
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Back to a tab with a clean stack (tabs replace each other in this app). */
const resetTo = (path: string) => {
  if (router.canDismiss()) router.dismissAll();
  router.replace(path as never);
};

export default function SkillTest() {
  const { module: moduleId } = useLocalSearchParams<{ module?: string }>();
  const key = moduleId ?? 'main';
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { attempts, saveAttempt } = useJems();
  useKeepAwake();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState<Attempt | null>(attempts[key] ?? null);
  const [dir, setDir] = useState(1);
  const [now, setNow] = useState(() => Date.now());
  const [navOpen, setNavOpen] = useState(false);
  const [phase, setPhase] = useState<'answering' | 'working' | 'result'>('answering');
  const [result, setResult] = useState<MiniResult | null>(null);
  const submitted = useRef(false);

  // Load the paper; start a fresh attempt unless one is already running.
  useEffect(() => {
    getPaper(moduleId).then((p) => {
      setPaper(p);
      setAttempt((a) => a ?? { answers: {}, flagged: [], current: 0, endsAt: Date.now() + p.minutes * 60_000, leftApp: 0 });
    }).catch((err) => setLoadError(errorMessage(err)));
  }, [moduleId]);

  // Keep the attempt in the store so leaving and coming back resumes it.
  useEffect(() => { if (attempt && !submitted.current) saveAttempt(key, attempt); }, [attempt, key, saveAttempt]);

  const secondsLeft = attempt ? Math.max(0, Math.round((attempt.endsAt - now) / 1000)) : 0;
  const questions = paper?.questions ?? [];
  const index = attempt?.current ?? 0;
  const question = questions[index];
  const answered = questions.filter((q) => isAnswered(attempt?.answers[q.id])).length;
  const flaggedCount = attempt?.flagged.length ?? 0;
  const isFlagged = Boolean(question && attempt?.flagged.includes(question.id));
  const last = index === questions.length - 1;

  const update = (fn: (a: Attempt) => Attempt) => setAttempt((a) => (a ? fn(a) : a));
  const goTo = (to: number) => {
    if (!attempt || to < 0 || to >= questions.length || to === index) return;
    buzz('light');
    setDir(to > index ? 1 : -1);
    update((a) => ({ ...a, current: to }));
  };
  const answer = (value: Answer) => question && update((a) => ({ ...a, answers: { ...a.answers, [question.id]: value } }));
  const toggleFlag = () => {
    if (!question) return;
    buzz(isFlagged ? 'light' : 'medium');
    update((a) => ({ ...a, flagged: isFlagged ? a.flagged.filter((id) => id !== question.id) : [...a.flagged, question.id] }));
  };

  function submit(auto: boolean) {
    if (submitted.current || !attempt) return;
    submitted.current = true;
    if (auto) toast.show("Time's up. Submitting your answers.");
    setNavOpen(false);
    setPhase('working');
  }
  // The timer calls the latest submit through this ref.
  const submitRef = useRef(submit);
  useEffect(() => { submitRef.current = submit; });

  // One tick per second; submits itself at zero.
  useEffect(() => {
    if (!attempt || phase !== 'answering') return;
    const timer = setInterval(() => {
      const ms = Date.now();
      setNow(ms);
      if (ms >= attempt.endsAt) submitRef.current(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt, phase]);

  // Leaving the app is recorded, as the intro screen says.
  const showToast = toast.show;
  useEffect(() => {
    let leftAt = 0;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') leftAt = Date.now();
      if (state === 'active' && leftAt && !submitted.current) {
        leftAt = 0;
        buzz('warning');
        setAttempt((a) => (a ? { ...a, leftApp: a.leftApp + 1 } : a));
        showToast('You left the app. That was recorded.');
      }
    });
    return () => sub.remove();
  }, [showToast]);

  async function exit() {
    if (phase !== 'answering') return;
    const ok = await confirm({ title: 'Leave the assessment?', message: 'Your answers are saved and the timer keeps running.', confirmLabel: 'Leave', cancelLabel: 'Stay', destructive: true });
    if (ok) router.back();
  }

  // Android back asks first instead of dropping the test.
  const exitRef = useRef(exit);
  useEffect(() => { exitRef.current = exit; });
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (submitted.current) return false;
      void exitRef.current();
      return true;
    });
    return () => sub.remove();
  }, []);

  async function finish() {
    const left = questions.length - answered;
    const ok = await confirm({
      title: paper?.mode === 'mini' ? 'Submit the mini-assessment?' : 'Submit your assessment?',
      message: left ? `${left} question${left === 1 ? ' is' : 's are'} still unanswered. You can't change answers after submitting.` : "Every question is answered. You can't change answers after submitting.",
      confirmLabel: 'Submit',
    });
    if (ok) submit(false);
  }

  const swipe = Gesture.Pan().activeOffsetX([-24, 24]).failOffsetY([-14, 14]).runOnJS(true)
    .onEnd((e) => { if (e.translationX < -60) goTo(index + 1); else if (e.translationX > 60) goTo(index - 1); });

  if (loadError) return <FlowScreen title="Assessment"><Notice>{loadError}</Notice><Btn2 label="Go back" onPress={() => router.back()} /></FlowScreen>;
  if (!paper || !attempt || !question) return <FlowScreen title="Assessment"><Loading /></FlowScreen>;

  if (phase === 'result' && result) {
    return <MiniResultView result={result} onRetry={() => {
      submitted.current = false;
      setResult(null);
      setAttempt({ answers: {}, flagged: [], current: 0, endsAt: Date.now() + paper.minutes * 60_000, leftApp: 0 });
      setNow(Date.now());
      setPhase('answering');
    }} />;
  }

  const low = secondsLeft <= WARN_SECONDS;
  const Enter = dir > 0 ? FadeInRight : FadeInLeft;
  const selected = attempt.answers[question.id];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <NavBar onBack={exit} backIcon="x" backLabel="Leave the assessment"
        title={`${index + 1} of ${questions.length}`}
        right={<Timer seconds={secondsLeft} low={low} />} />
      <View style={{ height: 4, backgroundColor: t.surf2 }} accessibilityElementsHidden>
        <View style={{ width: `${((index + 1) / questions.length) * 100}%`, height: 4, backgroundColor: '#ea580c' }} />
      </View>

      <GestureDetector gesture={swipe}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 150 + insets.bottom, gap: 18 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <Animated.View key={question.id} entering={Enter.duration(220)} style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Chip tone="b">{question.skill}</Chip>
              <Chip>{question.difficulty}</Chip>
              {question.kind === 'code' ? <Chip tone="o" icon="code">Write code</Chip> : null}
            </View>
            <Disp size={26} lh={30} ls={-0.03} accessibilityRole="header">{question.prompt}</Disp>
            {question.code ? <CodeBlock>{question.code}</CodeBlock> : null}
            {question.kind === 'mcq' ? (
              <View style={{ gap: 10 }} accessibilityRole="radiogroup">
                {question.options?.map((option, k) => {
                  const on = selected === k;
                  return (
                    <Slide key={option} delay={40 + k * 50}>
                      <Press onPress={() => answer(k)} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={option} scale={0.98}
                        style={[styles.option, { backgroundColor: on ? t.brandbg : t.card, borderColor: on ? '#ea580c' : t.line }]}>
                        <View style={[styles.letter, { backgroundColor: on ? '#ea580c' : t.surf2 }]}>
                          {on ? <Icon name="check" size={17} color="#fff" sw={3.2} /> : <Txt w={8} size={15}>{L[k]}</Txt>}
                        </View>
                        <Txt w={6} size={16} lh={21} style={{ flex: 1 }}>{option}</Txt>
                      </Press>
                    </Slide>
                  );
                })}
              </View>
            ) : (
              <TextInput multiline value={String(selected ?? '')} onChangeText={answer} placeholder="Write your answer here…" placeholderTextColor={t.dim}
                autoCapitalize="none" autoCorrect={false} spellCheck={false} accessibilityLabel="Your code answer" textAlignVertical="top"
                style={[{ minHeight: 180, borderRadius: 18, padding: 16, backgroundColor: '#0b1220', color: '#e7e5e4', fontFamily: mono, fontSize: 14, lineHeight: 21 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null]} />
            )}
          </Animated.View>

          <View style={[styles.summary, { backgroundColor: t.card, borderColor: t.line }]}>
            <Txt size={14} color="sub"><Txt w={8} size={14} color="good">{answered}</Txt> answered</Txt>
            <Txt size={14} color="sub"><Txt w={8} size={14} color="gold">{flaggedCount}</Txt> flagged</Txt>
            <Txt size={14} color="sub"><Txt w={8} size={14}>{questions.length - answered}</Txt> left</Txt>
            <Press onPress={() => setNavOpen(true)} accessibilityLabel="View all questions" style={{ marginLeft: 'auto', minHeight: 44, justifyContent: 'center' }}>
              <Txt w={7} size={14} color="brand">View all</Txt>
            </Press>
          </View>
          <Txt size={12} color="dim" align="center">Swipe left or right to move between questions</Txt>
        </ScrollView>
      </GestureDetector>

      <BottomCta>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <FlagButton flagged={isFlagged} onPress={toggleFlag} />
          <Btn2 label="Back" lead="left" height={56} style={{ flex: 1, opacity: index === 0 ? 0.45 : 1 }} onPress={() => goTo(index - 1)} />
          {last
            ? <Btn label="Finish" lead="check" height={56} size={16} style={{ flex: 1.2 }} onPress={finish} />
            : <Btn label="Next" icon="arrow" height={56} size={16} sheen={false} style={{ flex: 1.2 }} onPress={() => goTo(index + 1)} />}
        </View>
      </BottomCta>

      <Sheet open={navOpen} onClose={() => setNavOpen(false)} title="All questions" sub={`${answered} of ${questions.length} answered`}
        footer={<Btn label="Submit now" lead="check" height={56} onPress={() => { setNavOpen(false); void finish(); }} />}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {questions.map((q, i) => {
            const done = isAnswered(attempt.answers[q.id]);
            const flagged = attempt.flagged.includes(q.id);
            const current = i === index;
            return (
              <Press key={q.id} onPress={() => { setNavOpen(false); goTo(i); }} accessibilityLabel={`Question ${i + 1}${done ? ', answered' : ''}${flagged ? ', flagged' : ''}`}
                style={[styles.cell, { backgroundColor: done ? t.brandbg : t.card, borderColor: current ? '#ea580c' : flagged ? '#f59e0b' : t.line, borderWidth: current ? 2 : 1 }]}>
                <Txt w={7} size={15} color={done ? 'brand' : 'fg'}>{i + 1}</Txt>
                {flagged ? <View style={styles.flagDot} /> : null}
              </Press>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginTop: 18 }}>
          <Legend bg={t.brandbg} border={t.line} label="Answered" />
          <Legend bg={t.card} border="#f59e0b" label="Flagged" />
          <Legend bg={t.card} border="#ea580c" label="Current" />
        </View>
      </Sheet>

      {toast.node}

      {phase === 'working' ? (
        <WorkingOverlay
          eyebrow={paper.mode === 'mini' ? 'Mini-assessment' : 'Skill assessment'}
          title={paper.mode === 'mini' ? 'Checking your answers' : 'Building your skill report'}
          steps={paper.mode === 'mini'
            ? ['Scoring your answers', 'Finding topics to relearn', 'Updating your roadmap']
            : ['Scoring your answers', 'Reviewing your GitHub repos', 'Reading your LeetCode history', 'Comparing with MSME job roles']}
          task={async () => {
            if (paper.mode === 'mini' && moduleId) setResult(await submitMiniAssessment(moduleId, attempt.answers));
            else await submitAssessment(attempt.answers, { leftApp: attempt.leftApp });
          }}
          onDone={() => {
            saveAttempt(key, null);
            if (paper.mode === 'mini') setPhase('result');
            else resetTo('/skills?celebrate=1');
          }}
          onError={(message) => { submitted.current = false; setPhase('answering'); toast.show(message); }}
        />
      ) : null}
    </View>
  );
}

/** Countdown pill: calm, then red with a heartbeat for the last five minutes. */
function Timer({ seconds, low }: { seconds: number; low: boolean }) {
  const beat = useSharedValue(1);
  useEffect(() => {
    if (low) beat.value = withSequence(withTiming(1.06, { duration: 160 }), withTiming(1, { duration: 400 }));
  }, [low, seconds, beat]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));
  return (
    <Animated.View style={style} accessible accessibilityRole="timer" accessibilityLabel={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds left`}>
      <Chip tone={low ? 'r' : 'o'} icon="clock" h={34} size={14}>{clock(seconds)}</Chip>
    </Animated.View>
  );
}

/** Flag toggle that wiggles when a question gets flagged. */
function FlagButton({ flagged, onPress }: { flagged: boolean; onPress: () => void }) {
  const { t } = useTheme();
  const tilt = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }] }));
  return (
    <Press haptic={false} onPress={() => {
      if (!flagged) tilt.value = withSequence(withTiming(-10, { duration: 70 }), withTiming(6, { duration: 90 }), withTiming(0, { duration: 70 }));
      onPress();
    }} accessibilityLabel={flagged ? 'Remove flag' : 'Flag this question'} accessibilityState={{ selected: flagged }}
      style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: flagged ? t.goldbg : t.surf2 }}>
      <Animated.View style={style}><Icon name="flag" size={22} color={flagged ? '#f59e0b' : t.sub} sw={2.2} /></Animated.View>
    </Press>
  );
}

function Legend({ bg, border, label }: { bg: string; border: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 16, height: 16, borderRadius: 5, borderWidth: 1.5, borderColor: border, backgroundColor: bg }} />
      <Txt size={13} color="sub">{label}</Txt>
    </View>
  );
}

/** Mini-assessment result. Below the pass mark it also shows what went wrong and which topics to relearn. */
function MiniResultView({ result, onRetry }: { result: MiniResult; onRetry: () => void }) {
  const n = useCountUp(result.percent, 1300, 250);
  useEffect(() => { buzz(result.passed ? 'success' : 'warning'); }, [result.passed]);

  if (!result.passed) {
    return (
      <FlowScreen nav={<NavBar title="Mini-assessment" onBack={() => router.back()} backIcon="x" backLabel="Close" />} footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Btn2 label="Review module" height={56} style={{ flex: 1 }} onPress={() => router.back()} />
          <Btn label="Try again" lead="refresh" height={56} size={16} style={{ flex: 1 }} onPress={onRetry} />
        </View>
      }>
        <Rise style={{ alignItems: 'center', gap: 10 }}>
          <Ring size={168} stroke={14} value={n} colors={['#f59e0b', '#ea580c']}>
            <Disp size={48} lh={48}>{n}<Disp size={22} color="gold">%</Disp></Disp>
          </Ring>
          <Disp size={30} align="center" style={{ marginTop: 8 }}>Almost there</Disp>
          <Txt size={15} lh={22} color="sub" align="center">
            {`${result.correct} of ${result.total} correct. You need ${result.passPercent}% to pass. ` +
              (result.relearn.length ? `Go over ${result.relearn.length === 1 ? 'this topic' : `these ${result.relearn.length} topics`}, then try again.` : 'Review the lessons, then try again.')}
          </Txt>
        </Rise>
        <Rise delay={150}><RelearnGroup topics={result.relearn} /></Rise>
        <Rise delay={250}><MissedGroup missed={result.missed} /></Rise>
      </FlowScreen>
    );
  }

  return (
    <Screen scroll={false} glows={[{ top: -80, left: -140, size: 440 }]} overlay={<Confetti count={26} start={700} height={880} />}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 14 }}>
        <Txt w={7} size={12} color="good" style={{ letterSpacing: 2 }}>MODULE COMPLETE</Txt>
        <Ring size={210} stroke={16} value={n}>
          <Disp size={68} lh={68}>{n}<Disp size={28} color="good">%</Disp></Disp>
          <Txt size={14} color="sub">{`${result.correct} of ${result.total} correct`}</Txt>
        </Ring>
        <Disp size={40} lh={40} align="center" style={{ marginTop: 6 }}>You passed.</Disp>
        <Txt size={15} lh={22} color="sub" align="center">{result.nextModuleId ? 'The next module is unlocked.' : 'That was the last module. Time to reassess.'}</Txt>
      </View>
      <BottomCta>
        <Btn label="Back to roadmap" icon="arrow" height={60} onPress={() => resetTo('/roadmap')} />
      </BottomCta>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 14, minHeight: 60, borderRadius: 22, borderWidth: 1.5 },
  letter: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, flexWrap: 'wrap' },
  cell: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  flagDot: { position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4, backgroundColor: '#f59e0b' },
});
