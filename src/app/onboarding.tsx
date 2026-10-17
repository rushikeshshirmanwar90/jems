import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Btn, Chip, DesignStage, Disp, DrawRing, go, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Bob, DrawPath, FillBar, Pop, PulseRing, Rise, Slide } from '@/ui/motion';
import { Press } from '@/ui/motion';

const ROADMAP = 'M90 50 C90 110 300 110 300 170 C300 230 90 240 90 300 C90 340 195 340 195 370';

function Title({ a, b, copy }: { a: string; b: string; copy: string }) {
  return (
    <View style={{ paddingHorizontal: 28, marginTop: 20 }}>
      <Rise>
        <Disp size={40} lh={40}>{a}</Disp>
        <Disp size={40} lh={40}>{b}</Disp>
      </Rise>
      <Rise delay={150}>
        <Txt size={16} lh={24} color="sub" style={{ marginTop: 12 }}>{copy}</Txt>
      </Rise>
    </View>
  );
}

function Verified({ label, tone, style, delay, amp }: { label: string; tone: 'g' | 'o' | 'b'; style: object; delay: number; amp: number }) {
  return (
    <Pop delay={delay} style={[{ position: 'absolute' }, style]}>
      <Bob amp={amp} duration={2400}>
        <Chip tone={tone} icon="check" h={34} size={13}>{label}</Chip>
      </Bob>
    </Pop>
  );
}

function Slide0() {
  const { t } = useTheme();
  return (
    <>
      <DesignStage height={400}>
        <Pop style={{ position: 'absolute', left: 73, top: 40 }}>
          <DrawRing size={244} stroke={18} to={87}>
            <Disp size={72} lh={72}>87<Disp size={30} color="good">%</Disp></Disp>
            <Txt size={14} color="sub">JavaScript verified</Txt>
          </DrawRing>
        </Pop>
        <Verified label="HTML & CSS 92" tone="g" delay={900} amp={6} style={{ left: 14, top: 20 }} />
        <Verified label="Git 81" tone="o" delay={1100} amp={8} style={{ right: 10, top: 96 }} />
        <Verified label="SQL 76" tone="b" delay={1300} amp={5} style={{ left: 40, top: 316 }} />
      </DesignStage>
      <Title a="Prove what you" b="can do." copy="Take AI-graded skill tests. Score 70% and the skill is verified on your profile." />
    </>
  );
}

function Slide1() {
  const { t } = useTheme();
  const Node = ({ left, top, delay }: { left: number; top: number; delay: number }) => (
    <Pop delay={delay} style={{ position: 'absolute', left, top, width: 56, height: 56, borderRadius: 28, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="check" size={26} color="#052e22" sw={3} />
    </Pop>
  );
  return (
    <>
      <DesignStage height={400}>
        <Svg width={390} height={400} style={{ position: 'absolute' }}>
          <Path d={ROADMAP} fill="none" stroke={t.surf2} strokeWidth={9} strokeLinecap="round" strokeDasharray="1 14" />
          <DrawPath d={ROADMAP} stroke="#f97316" width={9} delay={200} duration={2200} />
        </Svg>
        <Node left={62} top={22} delay={400} />
        <Node left={272} top={142} delay={1100} />
        <Pop delay={1700} style={{ position: 'absolute', left: 58, top: 272, width: 64, height: 64 }}>
          <PulseRing size={64} />
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#c2410c', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="play" size={24} color="#fff" />
          </View>
        </Pop>
        <Rise delay={1900} style={{ position: 'absolute', left: 136, top: 288 }}>
          <Bob amp={5}>
            <Chip bg={t.inv} fg={t.invfg}>You are here</Chip>
          </Bob>
        </Rise>
        <Pop delay={2200} style={{ position: 'absolute', left: 165, top: 340, width: 56, height: 56, borderRadius: 28, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trophy" size={26} color="#111827" />
        </Pop>
      </DesignStage>
      <Title a="Follow a path" b="built for you." copy="Pick a career. Get phases, modules and lessons in the right order." />
    </>
  );
}

function JobRow({ letter, kind, role, co, pct, delay }: { letter: string; kind: 'g1' | 'g2' | 'g3'; role: string; co: string; pct: number; delay: number }) {
  const { t } = useTheme();
  return (
    <Slide delay={delay} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: t.line }}>
      <Badge kind={kind} letter={letter} size={48} radius={16} fontSize={20} />
      <View style={{ flex: 1 }}>
        <Txt w={7} size={18}>{role}</Txt>
        <Txt size={14} color="sub">{co}</Txt>
      </View>
      <Disp size={34} color="good">{pct}<Disp size={16} color="good">%</Disp></Disp>
    </Slide>
  );
}

function Slide2() {
  return (
    <>
      <View style={{ paddingHorizontal: 24, marginTop: 24, height: 400 }}>
        <JobRow letter="N" kind="g1" role="Frontend Intern" co="Nexa Labs · Pune" pct={92} delay={100} />
        <JobRow letter="K" kind="g2" role="Junior Web Developer" co="Kriya Systems · Remote" pct={88} delay={350} />
        <JobRow letter="O" kind="g3" role="QA Associate" co="Orbit Tech · Hyderabad" pct={81} delay={600} />
        <Slide delay={900} style={{ marginTop: 20 }}>
          <Chip tone="g" icon="shield" h={34} size={13}>Only verified skills count</Chip>
        </Slide>
      </View>
      <Title a="Get matched," b="not buried." copy="Employers see verified skills first. No more guessing from a resume." />
    </>
  );
}

export default function Onboarding() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (slide >= 2) return;
    const id = setTimeout(() => setSlide((s) => Math.min(2, s + 1)), 4800);
    return () => clearTimeout(id);
  }, [slide]);

  const next = () => setSlide((s) => Math.min(2, s + 1));
  const prev = () => setSlide((s) => Math.max(0, s - 1));

  return (
    <Screen scroll={false} glows={[{ top: 120, left: -120, size: 420 }]}>
      <View style={{ flexDirection: 'row', gap: 6, marginHorizontal: 24, marginTop: 20 }} accessibilityLabel={`Slide ${slide + 1} of 3`}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: t.surf2, overflow: 'hidden' }}>
            <FillBar duration={4800} color={t.fg} active={i === slide && slide < 2} full={i < slide || (i === 2 && slide === 2)} />
          </View>
        ))}
      </View>
      <Press onPress={() => go('/choose-role')} haptic={false} scale={0.96} style={{ position: 'absolute', right: 12, top: insets.top + 32, minHeight: 44, paddingHorizontal: 12, justifyContent: 'center', zIndex: 6 }}>
        <Txt w={7} size={14} color="sub">Skip</Txt>
      </Press>

      <View style={{ marginTop: 26 }} key={slide}>
        {slide === 0 ? <Slide0 /> : slide === 1 ? <Slide1 /> : <Slide2 />}
      </View>

      <Press onPress={prev} haptic={false} scale={1} accessibilityLabel="Previous" style={{ position: 'absolute', left: 0, width: '30%', top: insets.top + 90, height: 440, zIndex: 4 }}><View /></Press>
      <Press onPress={next} haptic={false} scale={1} accessibilityLabel="Next" style={{ position: 'absolute', right: 0, width: '50%', top: insets.top + 90, height: 440, zIndex: 4 }}><View /></Press>

      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 34 + insets.bottom, zIndex: 6 }}>
        {slide < 2 ? (
          <Btn label="Next" icon="arrow" height={60} onPress={next} sheen={false} />
        ) : (
          <Btn label="Choose your role" icon="arrow" height={60} onPress={() => go('/choose-role')} />
        )}
      </View>
    </Screen>
  );
}
