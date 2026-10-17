import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Chip, Disp, Eyebrow, go, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, Pop, Rise, Spin } from '@/ui/motion';

const DEFS: [string, string][] = [
  ['Skill Analyst', 'Mapped 4 verified skills'],
  ['Career Matcher', 'Scored 14 careers'],
  ['Gap Finder', 'Compared with live job demand'],
  ['Roadmap Planner', 'Ordered 8 modules'],
  ['Job Scout', 'Scanned 120 open roles'],
  ['Coach', 'Wrote your weekly plan'],
];

function Spinner() {
  const { t } = useTheme();
  return (
    <Spin duration={800}>
      <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 3, borderColor: t.surf2, borderTopColor: '#ea580c' }} />
    </Spin>
  );
}

export default function CareerAnalysis() {
  const { t } = useTheme();
  const [step, setStep] = useState(0);
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    const to = setTimeout(() => {
      iv = setInterval(() => setStep((s) => Math.min(6, s + 1)), 1100);
    }, 700);
    return () => {
      clearTimeout(to);
      clearInterval(iv);
    };
  }, []);
  const fin = step >= 6;
  return (
    <Screen bottom={130} glows={[{ top: -80, left: -160, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackBtn to="/test-result" />
        <Chip tone="b" icon="sparkles">6 AI agents</Chip>
      </Rise>
      <Rise delay={50} style={{ marginTop: 22 }}><Eyebrow>AI career analysis</Eyebrow></Rise>
      <Rise delay={100}><Disp size={40} lh={40} style={{ marginTop: 6 }}>{fin ? 'Your career fit.' : 'Reading your skills...'}</Disp></Rise>
      <View style={{ marginTop: 20 }}>
        {DEFS.map((d, i) => {
          const done = i < step;
          const run = i === step;
          return (
            <View key={d[0]} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <View style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
                {done ? (
                  <Pop><View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={18} color="#052e22" sw={3.2} /></View></Pop>
                ) : run ? (
                  <Spinner />
                ) : (
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: t.surf2 }} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={16} color={i > step ? 'dim' : 'fg'}>{d[0]}</Txt>
                <Txt size={13} color="dim">{done ? d[1] : run ? 'Working...' : 'Waiting'}</Txt>
              </View>
            </View>
          );
        })}
      </View>
      {fin ? (
        <View>
          <Rise><Eyebrow style={{ marginTop: 26 }}>Top career fits</Eyebrow></Rise>
          {[['Full Stack Developer', 91, 24, 28, true], ['Frontend Developer', 88, 20, 24, false], ['Backend Developer', 79, 20, 24, false]].map(([name, pct, fs, ps, top], i) => (
            <Rise key={name as string} delay={100 + i * 150} style={{ paddingVertical: 14, gap: 8, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: t.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Disp size={fs as number} ls={-0.03} style={{ flex: 1 }}>{name as string}</Disp>
                {top ? <Chip tone="g">Top pick</Chip> : null}
                <Disp size={ps as number} color={top ? 'good' : 'fg'}>{pct as number}%</Disp>
              </View>
              <GrowBar pct={pct as number} delay={500 + i * 200} />
            </Rise>
          ))}
          <Rise delay={500}><Txt size={14} lh={21} color="sub" style={{ marginTop: 6 }}>Biggest gaps for Full Stack: React, Node.js and TypeScript.</Txt></Rise>
        </View>
      ) : null}
      <BottomCta>
        {fin ? (
          <Pop><Btn label="Choose my goal" icon="arrow" height={60} onPress={() => go('/goals')} /></Pop>
        ) : (
          <View style={{ height: 60, borderRadius: 30, backgroundColor: t.surf2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Spin duration={800}><View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: t.surf2, borderTopColor: '#ea580c' }} /></Spin>
            <Txt w={7} size={17} color="dim">Analyzing...</Txt>
          </View>
        )}
      </BottomCta>
    </Screen>
  );
}
