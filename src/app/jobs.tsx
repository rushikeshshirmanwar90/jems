import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, SharedValue, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Btn, Btn2, Chip, Disp, Eyebrow, FloatingNav, go, Grad, GradKind, ON_G, ON_G_SUB, Screen, swap, Toast, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, HintX, Pop, Press, Rise, Sheen } from '@/ui/motion';

type Kind = 'pass' | 'save' | 'apply';
interface Job { pct: number; role: string; co: string; initial: string; loc: string; type: string; pay: string; skills: string[]; gap: string; g: GradKind }
const JOBS: Job[] = [
  { pct: 92, role: 'Frontend Intern', co: 'Nexa Labs', initial: 'N', loc: 'Pune · Hybrid', type: 'INTERNSHIP', pay: '₹30,000 / month', skills: ['JavaScript', 'HTML & CSS', 'Git'], gap: 'No gaps. You meet every required skill.', g: 'g1' },
  { pct: 88, role: 'Junior Web Developer', co: 'Kriya Systems', initial: 'K', loc: 'Bengaluru · Remote', type: 'FULL TIME', pay: '₹6–8 LPA', skills: ['JavaScript', 'HTML & CSS', 'SQL'], gap: 'One gap: React. A 12 minute test closes it.', g: 'g2' },
  { pct: 81, role: 'QA Associate', co: 'Orbit Tech', initial: 'O', loc: 'Hyderabad · On-site', type: 'FULL TIME', pay: '₹4–6 LPA', skills: ['JavaScript', 'Git', 'SQL'], gap: 'One gap: Test automation basics.', g: 'g3' },
  { pct: 74, role: 'Backend Apprentice', co: 'Veda Cloud', initial: 'V', loc: 'Nagpur · Hybrid', type: 'APPRENTICE', pay: '₹25,000 / month', skills: ['JavaScript', 'SQL', 'Git'], gap: 'Two gaps: Node.js and REST APIs.', g: 'g4' },
];
const STAMP: Record<Kind, { text: string; color: string }> = { pass: { text: 'PASS', color: '#fca5a5' }, save: { text: 'SAVED', color: '#fcd34d' }, apply: { text: 'APPLIED', color: '#6ee7b7' } };
const THRESH = 110;

function Stamp({ kind, v }: { kind: Kind; v: { tx: SharedValue<number>; ty: SharedValue<number>; leaving: SharedValue<number> } }) {
  const a = useAnimatedStyle(() => {
    const L = v.leaving.value; // 0 none, 1 pass, 2 save, 3 apply
    const forced = (kind === 'pass' && L === 1) || (kind === 'save' && L === 2) || (kind === 'apply' && L === 3);
    let o = 0;
    if (kind === 'apply') o = interpolate(v.tx.value, [30, 90], [0, 1], 'clamp');
    if (kind === 'pass') o = interpolate(v.tx.value, [-90, -30], [1, 0], 'clamp');
    if (kind === 'save') o = interpolate(v.ty.value, [-90, -30], [1, 0], 'clamp');
    return { opacity: forced ? 1 : L ? 0 : o };
  });
  const s = STAMP[kind];
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', right: 20, top: 70, transform: [{ rotate: '-12deg' }], paddingHorizontal: 12, paddingVertical: 4, borderWidth: 3, borderColor: s.color, borderRadius: 10 }, a]}>
      <Disp size={26} ls={0.04} color={s.color}>{s.text}</Disp>
    </Animated.View>
  );
}

function Card({ job, r, w, h, leaving, onFinish, onGesture, interactive }: { job: Job; r: number; w: number; h: number; leaving: Kind | ''; onFinish: (k: Kind) => void; onGesture: (k: Kind) => void; interactive: boolean }) {
  const rv = useSharedValue(r);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const lv = useSharedValue(0);
  const fly = useSharedValue(0);
  useEffect(() => {
    rv.value = withTiming(r, { duration: 450, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  }, [r, rv]);
  useEffect(() => {
    if (!leaving) return;
    lv.value = leaving === 'pass' ? 1 : leaving === 'save' ? 2 : 3;
    if (leaving === 'save') ty.value = withTiming(-640, { duration: 420 });
    else tx.value = withTiming(leaving === 'apply' ? 460 : -460, { duration: 420 });
    fly.value = withTiming(1, { duration: 420 });
  }, [leaving, lv, tx, ty, fly]);

  const pan = Gesture.Pan()
    .enabled(interactive && !leaving)
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = Math.min(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationX > THRESH) runOnJS(onGesture)('apply');
      else if (e.translationX < -THRESH) runOnJS(onGesture)('pass');
      else if (e.translationY < -THRESH) runOnJS(onGesture)('save');
      else {
        tx.value = withSpring(0, { damping: 16 });
        ty.value = withSpring(0, { damping: 16 });
      }
    });

  const st = useAnimatedStyle(() => {
    const rr = rv.value;
    const base = Math.min(rr, 3);
    const scale = rr <= 0 ? 1 : 1 - base * 0.05 - (base >= 3 ? 0.01 : 0);
    const opacity = rr <= 0 ? 1 - fly.value : rr <= 1 ? 1 : rr <= 2 ? interpolate(rr, [1, 2], [1, 0.85]) : interpolate(rr, [2, 3], [0.85, 0], 'clamp');
    const ox = rr <= 0 ? tx.value : 0;
    const oy = rr <= 0 ? ty.value : 0;
    const rot = rr <= 0 ? (tx.value / 460) * 24 : 0;
    return {
      opacity,
      zIndex: 10 - Math.round(rr),
      transform: [{ translateX: ox }, { translateY: oy + Math.min(rr, 3.3) * 14 }, { rotate: `${rot}deg` }, { scale }],
    };
  });
  const v = { tx, ty, leaving: lv };
  return (
    <GestureDetector gesture={pan}>
      <Animated.View pointerEvents={interactive ? 'auto' : 'none'} style={[{ position: 'absolute', left: 0, top: 0, width: w, height: h, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 24, shadowOffset: { width: 0, height: 24 } }, st]}>
        <Grad kind={job.g} border style={{ flex: 1, borderRadius: 32, padding: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,251,240,0.16)', alignItems: 'center', justifyContent: 'center' }}><Disp size={20} ls={0} color={ON_G}>{job.initial}</Disp></View>
              <View><Txt w={7} size={15} color={ON_G}>{job.co}</Txt><Txt size={12} color={ON_G_SUB}>{job.loc}</Txt></View>
            </View>
            <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: 'rgba(255,251,240,0.16)', justifyContent: 'center' }}><Txt w={7} size={11} color={ON_G} style={{ letterSpacing: 0.7 }}>{job.type}</Txt></View>
          </View>
          <Disp size={76} lh={70} ls={-0.05} color={ON_G} style={{ marginTop: 26 }}>{job.pct}<Disp size={30} color="#fcd34d">%</Disp></Disp>
          <Txt w={6} size={13} color={ON_G_SUB} style={{ marginTop: 4 }}>skill match</Txt>
          <View style={{ marginTop: 10 }}><GrowBar pct={job.pct} delay={600} height={6} colors={['#10b981', '#fcd34d']} track="rgba(255,251,240,0.16)" /></View>
          <Disp size={30} lh={32} ls={-0.03} color={ON_G} style={{ marginTop: 22 }}>{job.role}</Disp>
          <Txt w={6} size={15} color="#fcd34d" style={{ marginTop: 6 }}>{job.pay}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {job.skills.map((s) => (
              <View key={s} style={{ height: 30, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 10, paddingRight: 12, borderRadius: 15, backgroundColor: 'rgba(16,185,129,0.24)' }}>
                <Icon name="check" size={14} color="#a7f3d0" sw={3} />
                <Txt w={7} size={13} color="#a7f3d0">{s}</Txt>
              </View>
            ))}
          </View>
          <Txt size={13} lh={19} color={ON_G_SUB} style={{ marginTop: 12 }}>{job.gap}</Txt>
          <Press onPress={() => go('/job-detail')} style={{ position: 'absolute', left: 22, bottom: 20, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Txt w={7} size={14} color={ON_G}>View full details</Txt>
            <HintX><Icon name="arrow" size={16} color={ON_G} sw={2.6} /></HintX>
          </Press>
          <Stamp kind="pass" v={v} /><Stamp kind="save" v={v} /><Stamp kind="apply" v={v} />
        </Grad>
      </Animated.View>
    </GestureDetector>
  );
}

export default function Jobs() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState<Kind | ''>('');
  const [saved, setSaved] = useState(0);
  const [applied, setApplied] = useState(0);
  const [toast, setToast] = useState('');
  const busy = useRef(false);
  const cw = Math.min(342, width - 48);
  const ch = Math.max(380, Math.min(470, height - insets.top - insets.bottom - 330));
  const done = idx >= JOBS.length;

  const act = (kind: Kind) => {
    if (busy.current || idx >= JOBS.length) return;
    busy.current = true;
    setLeaving(kind);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const j = JOBS[idx];
    setTimeout(() => {
      setToast(kind === 'apply' ? `Applied to ${j.role} at ${j.co}` : kind === 'save' ? `Saved ${j.role}` : `Passed on ${j.role}`);
      if (kind === 'save') setSaved((n) => n + 1);
      if (kind === 'apply') setApplied((n) => n + 1);
      setIdx((i) => i + 1);
      setLeaving('');
      busy.current = false;
    }, 420);
  };
  const restart = () => {
    setIdx(0); setLeaving(''); setSaved(0); setApplied(0); setToast('');
  };

  return (
    <Screen scroll={false} nav={<FloatingNav kind="student" active="jobs" />} glows={[{ top: 110, right: -150, size: 420 }]}>
      <View style={{ paddingHorizontal: 24, paddingTop: 22 }}>
        <Rise style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Eyebrow>Discover</Eyebrow>
          <View style={{ flexDirection: 'row', gap: 8 }}><Chip tone="o">{`Saved ${saved}`}</Chip><Chip tone="g">{`Applied ${applied}`}</Chip></View>
        </Rise>
        <Rise delay={100}><Disp size={34} lh={36} style={{ marginTop: 6 }}>Matched to{'\n'}your skills.</Disp></Rise>
      </View>
      <Toast text={toast} top={insets.top + 118} />
      {!done ? (
        <>
          <Rise delay={200} style={{ marginTop: 22, marginHorizontal: 24, height: ch + 20 }}>
            <View style={{ width: cw, height: ch, alignSelf: 'center' }}>
              {JOBS.map((j, i) => ({ j, i, r: i - idx })).filter((x) => x.r >= 0).reverse().map(({ j, i, r }) => (
                <Card key={j.role} job={j} r={r} w={cw} h={ch} leaving={r === 0 ? leaving : ''} interactive={r === 0} onFinish={() => {}} onGesture={act} />
              ))}
            </View>
          </Rise>
          <Rise delay={400} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22, marginTop: 6 }}>
            <Press onPress={() => act('pass')} accessibilityLabel="Pass" style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: t.surf, borderWidth: 1.5, borderColor: '#f87171', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={26} color={t.danger} sw={2.6} /></Press>
            <Press onPress={() => act('save')} accessibilityLabel="Save for later" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.surf, borderWidth: 1.5, borderColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' }}><Icon name="bookmark" size={24} color={t.gold} sw={2.4} /></Press>
            <Press onPress={() => act('apply')} accessibilityLabel="Apply" style={{ width: 74, height: 74, borderRadius: 37, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#c2410c' }}>
              <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
              <Sheen />
              <Icon name="check" size={32} color="#fff" sw={3} />
            </Press>
          </Rise>
        </>
      ) : (
        <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
          <Pop><View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', shadowColor: '#10b981', shadowOpacity: 0.6, shadowRadius: 24 }}><Icon name="check" size={40} color="#052e22" sw={3} /></View></Pop>
          <Rise delay={200}><Disp size={46} lh={46} style={{ marginTop: 24 }}>All caught up.</Disp></Rise>
          <Rise delay={300}><Txt size={16} lh={24} color="sub" style={{ marginTop: 14 }}>{`You applied to ${applied} and saved ${saved}. New matches appear as you verify more skills.`}</Txt></Rise>
          <Rise delay={450} style={{ marginTop: 28, gap: 12 }}>
            <Btn label="Track my applications" height={56} onPress={() => go('/applications')} />
            <Btn2 label="Verify more skills" onPress={() => swap('/skills')} />
            <View style={{ alignItems: 'center' }}><Press onPress={restart} style={{ minHeight: 44, justifyContent: 'center' }}><Txt w={7} size={15} color="sub">Start over</Txt></Press></View>
          </Rise>
        </View>
      )}
    </Screen>
  );
}
