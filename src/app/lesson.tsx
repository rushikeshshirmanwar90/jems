import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { BottomCta, Btn, Chip, CodeBlock, Disp, Eyebrow, F, Grad, K, mono, ON_G, S, Screen, swap, TextLink, Txt, back, go } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Confetti, HintX, Pop, Press, Rise, Slide, Wave, Zoom } from '@/ui/motion';

const TOTAL = 6;

function Head({ n, title, copy, label }: { n: number; title: string; copy: string; label?: string }) {
  return (
    <>
      <Slide><Eyebrow>{label ?? `React Fundamentals · ${n} of 6`}</Eyebrow></Slide>
      <Slide delay={80}><Disp size={42} lh={42} style={{ marginTop: 8 }}>{title}</Disp></Slide>
      <Slide delay={160}><Txt size={16} lh={24} color="sub" style={{ marginTop: 12 }}>{copy}</Txt></Slide>
    </>
  );
}

function Block({ kind, delay, h, children }: { kind: 'g1' | 'g2' | 'g4'; delay: number; h: number; children: string }) {
  return (
    <Pop delay={delay} style={{ flex: 1 }}>
      <Grad kind={kind} style={{ height: h, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 16 }}>
        <Txt w={7} size={15} color={ON_G}>{children}</Txt>
      </Grad>
    </Pop>
  );
}

function Slide0() {
  const { t } = useTheme();
  return (
    <>
      <Head n={1} title="Everything is a component." copy="A component is a function that returns UI. Build small pieces, then compose them into a page." />
      <View style={{ marginTop: 26, borderWidth: 2, borderStyle: 'dashed', borderColor: t.brand, borderRadius: 28, padding: 16 }}>
        <Txt w={7} size={11} color="brand" style={{ letterSpacing: 1.3 }}>{'<App />'}</Txt>
        <View style={{ marginTop: 10, flexDirection: 'row' }}><Block kind="g1" delay={400} h={46}>{'<Header />'}</Block></View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Block kind="g4" delay={600} h={84}>{'<Card />'}</Block>
          <Block kind="g4" delay={800} h={84}>{'<Card />'}</Block>
        </View>
        <View style={{ marginTop: 10, flexDirection: 'row' }}><Block kind="g2" delay={1000} h={46}>{'<Footer />'}</Block></View>
      </View>
    </>
  );
}

function Slide1() {
  return (
    <>
      <Head n={2} title="JSX is HTML in JavaScript." copy="Write markup right next to your logic. Curly braces drop in any JavaScript value." />
      <Zoom delay={300} style={{ marginTop: 24 }}>
        <CodeBlock><K>function</K> <F>Hello</F>() {'{\n  '}<K>const</K> name = <S>"Aarav"</S>;{'\n  '}<K>return</K> {'<h1>Hello, {name}</h1>;\n}'}</CodeBlock>
      </Zoom>
      <Zoom delay={600} style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Chip tone="g">Renders</Chip>
        <Disp size={26}>Hello, Aarav</Disp>
      </Zoom>
    </>
  );
}

function Slide2() {
  const { t } = useTheme();
  return (
    <>
      <Head n={3} title="Props flow down." copy="Parents pass data to children as props. Children read them, never change them." />
      <Zoom delay={300} style={{ marginTop: 24 }}>
        <CodeBlock><K>function</K> <F>Card</F>{'({ title, level }) {\n  '}<K>return</K> {'<h2>{title} L{level}</h2>;\n}\n\n<'}<F>Card</F> title=<S>"React"</S> {'level={2} />'}</CodeBlock>
      </Zoom>
      <Zoom delay={600} style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Chip tone="b">parent</Chip>
        <HintX><Icon name="arrow" size={22} color={t.brand} sw={2.6} /></HintX>
        <Chip tone="g">child reads</Chip>
      </Zoom>
    </>
  );
}

function Slide3() {
  const { t } = useTheme();
  const [count, setCount] = useState(0);
  return (
    <>
      <Head n={4} title="State remembers." copy="useState gives a component memory. Change it and React re-renders." />
      <Zoom delay={300} style={{ marginTop: 24 }}>
        <CodeBlock><K>const</K> [count, setCount] = <F>useState</F>(0);{'\n\n<button onClick={() => setCount(count + 1)}>\n  Taps: {count}\n</button>'}</CodeBlock>
      </Zoom>
      <Zoom delay={600} style={{ marginTop: 16 }}>
        <Press onPress={() => setCount(count + 1)} style={{ height: 64, borderRadius: 32, backgroundColor: t.brandbg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Txt w={8} size={18} color="brand">Try it · Taps:</Txt>
          <Disp size={28} color="brand">{count}</Disp>
        </Press>
      </Zoom>
    </>
  );
}

function Slide4() {
  return (
    <>
      <Head n={5} title="Effects run after render." copy="useEffect is for side effects: fetching data, timers, subscriptions. The list says when to re-run." />
      <Zoom delay={300} style={{ marginTop: 24 }}>
        <CodeBlock><F>useEffect</F>{'(() => {\n  '}<F>fetchJobs</F>{'(skill);\n}, [skill]);'}</CodeBlock>
      </Zoom>
      <Zoom delay={600} style={{ marginTop: 14, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Chip>render</Chip><Chip tone="b">then effect</Chip><Chip tone="g">skill changes: run again</Chip>
      </Zoom>
    </>
  );
}

function Option({ text, i, pick, onPick }: { text: string; i: number; pick: number; onPick: (i: number) => void }) {
  const { t } = useTheme();
  const picked = pick === i;
  const right = i === 1;
  const wrong = picked && !right;
  const bg = picked ? (right ? t.goodbg : t.dangerbg) : pick >= 0 && right ? t.goodbg : t.surf;
  const bd = picked ? (right ? '#10b981' : '#ef4444') : pick >= 0 && right ? '#10b981' : 'transparent';
  const x = useSharedValue(0);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const press = () => {
    if (pick >= 0) return;
    onPick(i);
    if (!right) x.value = withSequence(withTiming(-8, { duration: 60 }), withTiming(8, { duration: 80 }), withTiming(-6, { duration: 80 }), withTiming(6, { duration: 80 }), withTiming(0, { duration: 60 }));
  };
  return (
    <Slide delay={200 + i * 80}>
      <Animated.View style={shake}>
        <Press onPress={press} scale={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12, minHeight: 60, borderRadius: 22, backgroundColor: bg, borderWidth: 1.5, borderColor: bd }}>
          <Txt w={7} size={16} style={{ flex: 1, fontFamily: mono }}>{text}</Txt>
          {pick >= 0 && right ? <Icon name="check" size={20} color={t.good} sw={3} /> : wrong ? <Icon name="x" size={20} color={t.danger} sw={3} /> : null}
        </Press>
      </Animated.View>
    </Slide>
  );
}

function Quiz({ pick, setPick }: { pick: number; setPick: (i: number) => void }) {
  const { t } = useTheme();
  return (
    <>
      <Slide><Eyebrow>Quick check · 6 of 6</Eyebrow></Slide>
      <Slide delay={80}><Disp size={32} lh={35} ls={-0.035} style={{ marginTop: 8 }}>Which hook stores a value that triggers a re-render when it changes?</Disp></Slide>
      <View style={{ marginTop: 22, gap: 10 }}>
        {['useRef', 'useState', 'useMemo', 'useEffect'].map((o, i) => <Option key={o} text={o} i={i} pick={pick} onPick={setPick} />)}
      </View>
      {pick >= 0 ? (
        <Zoom style={{ marginTop: 16 }}>
          <Txt w={6} size={15} lh={22} color={pick === 1 ? 'good' : 'danger'}>
            {pick === 1 ? 'Correct. useState stores a value and re-renders on change.' : 'Not quite. useState is the hook that re-renders when its value changes.'}
          </Txt>
        </Zoom>
      ) : null}
    </>
  );
}

export default function Lesson() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const [slide, setSlide] = useState(2);
  const [pick, setPick] = useState(-1);
  const [listen, setListen] = useState(false);
  const need = slide === 5 && pick < 0;

  if (slide === 6) {
    return (
      <Screen scroll={false} glows={[{ top: 60, right: -150, size: 420 }]} overlay={<Confetti count={20} start={200} height={880} />}>
        <View style={{ paddingTop: 70, paddingHorizontal: 24, alignItems: 'center' }}>
          <Pop><View style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', shadowColor: '#10b981', shadowOpacity: 0.7, shadowRadius: 30 }}><Icon name="check" size={56} color="#052e22" sw={3} /></View></Pop>
          <Rise delay={300}><Eyebrow color="good" style={{ marginTop: 28 }}>Module complete</Eyebrow></Rise>
          <Rise delay={400}><Disp size={48} lh={46} align="center" style={{ marginTop: 8 }}>React Fundamentals{'\n'}done.</Disp></Rise>
          <Rise delay={600} style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}><Chip tone="o" h={34} size={15}>+80 XP</Chip><Chip tone="g" h={34} size={15}>3 of 8 modules</Chip></Rise>
          <Rise delay={700}><Txt size={16} lh={24} color="sub" align="center" style={{ marginTop: 18, maxWidth: 300 }}>Prove it. Pass the React skill test to verify it on your profile.</Txt></Rise>
        </View>
        <BottomCta gap={4}>
          <Rise delay={900}><Btn label="Take the React test" icon="arrow" height={60} onPress={() => go('/skill-test')} /></Rise>
          <Rise delay={1000} style={{ alignItems: 'center' }}><TextLink label="Back to roadmap" color="sub" onPress={() => swap('/roadmap')} /></Rise>
        </BottomCta>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} glows={[{ top: 60, right: -150, size: 420 }]}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: insets.top, paddingHorizontal: 20, paddingTop: 14, zIndex: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Press onPress={() => back('/roadmap')} accessibilityLabel="Close lesson" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={20} color={t.fg} sw={2.4} />
          </Press>
          <Press onPress={() => setListen(!listen)} accessibilityState={{ selected: listen }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: t.surf2 }}>
            <Wave run={listen} count={6} height={22} width={4} gap={3} color={t.brand} />
            <Txt w={7} size={13}>{listen ? 'Playing' : 'Listen'}</Txt>
          </Press>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 14 }}>
          {Array.from({ length: TOTAL }).map((_, k) => <View key={k} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: k < slide ? '#10b981' : k === slide ? '#ea580c' : t.surf2 }} />)}
        </View>
      </View>
      <Press onPress={() => setSlide(Math.max(0, slide - 1))} haptic={false} scale={1} accessibilityLabel="Previous slide" style={{ position: 'absolute', left: 0, top: insets.top + 90, width: '30%', height: 440, zIndex: 4 }}><View /></Press>
      <View key={slide} style={{ flex: 1, paddingTop: 96, paddingHorizontal: 24 }}>
        {slide === 0 ? <Slide0 /> : slide === 1 ? <Slide1 /> : slide === 2 ? <Slide2 /> : slide === 3 ? <Slide3 /> : slide === 4 ? <Slide4 /> : <Quiz pick={pick} setPick={setPick} />}
      </View>
      <BottomCta>
        <View style={{ opacity: need ? 0.4 : 1 }} pointerEvents={need ? 'none' : 'auto'}>
          <Btn label={slide === 5 ? 'Finish module' : 'Continue'} icon="arrow" height={60} onPress={() => setSlide(slide + 1)} />
        </View>
      </BottomCta>
    </Screen>
  );
}
