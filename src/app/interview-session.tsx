import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Chip, Disp, Eyebrow, Grad, ON_G, Screen, swap, Txt, back } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Blink, OrbRings, Press, Wave } from '@/ui/motion';
import { LinearGradient } from 'expo-linear-gradient';

const QS = [
  'Explain the difference between let, const and var, and when you would pick each.',
  'How would you debounce a search input in a React app?',
  'Walk me through what happens when you type a URL and press Enter.',
];

export default function InterviewSession() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const [qi, setQi] = useState(0);
  const [ch, setCh] = useState(0);
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setCh((c) => (c < QS[qi].length ? c + 1 : c)), 32);
    return () => clearInterval(id);
  }, [qi]);
  const q = QS[qi];
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const status = rec ? 'Listening... speak your answer' : ch < q.length ? 'Your interviewer is asking' : 'Tap the mic to answer';
  const last = qi === 2;
  return (
    <Screen scroll={false} glows={[{ top: 90, left: 25, size: 340 }]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Press onPress={() => back('/interviews')} accessibilityLabel="End interview" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={20} color={t.fg} sw={2.4} /></Press>
        <Chip h={34} size={13}>Technical · Full Stack</Chip>
        <Chip h={34} size={13} icon="clock">{`${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}`}</Chip>
      </View>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <View style={{ width: 176, height: 176, alignItems: 'center', justifyContent: 'center' }}>
          <OrbRings size={176} color={t.brand} duration={2600} />
          <Grad kind="g1" style={{ width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#ea580c', shadowOpacity: 0.7, shadowRadius: 30 }}>
            <Icon name="sparkles" size={48} color={ON_G} sw={1.8} />
          </Grad>
        </View>
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Eyebrow style={{ textAlign: 'center' }}>{`Question ${qi + 1} of 3`}</Eyebrow>
        <View style={{ minHeight: 150, marginTop: 12 }}>
          <Disp size={26} lh={31} ls={-0.03} align="center">
            {q.slice(0, ch)}
          </Disp>
        </View>
      </View>
      <View style={{ height: 44, marginTop: 6, alignItems: 'center', justifyContent: 'center' }}>
        <Wave run={rec} count={14} height={34} width={5} gap={4} color={t.brand} />
      </View>
      <Txt size={14} color="sub" align="center" style={{ minHeight: 20, marginTop: 4 }}>{status}</Txt>
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 30 + Math.max(0, insets.bottom - 10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <Press onPress={() => setCh(0)} accessibilityLabel="Repeat question" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={22} color={t.fg} /></Press>
        <Press onPress={() => setRec(!rec)} accessibilityLabel={rec ? 'Stop recording' : 'Start answering'} accessibilityState={{ selected: rec }} style={{ width: 84, height: 84, borderRadius: 42, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: rec ? '#b91c1c' : '#c2410c', shadowColor: '#d4450a', shadowOpacity: 0.7, shadowRadius: 18, shadowOffset: { width: 0, height: 12 } }}>
          {!rec ? <LinearGradient colors={['#d4450a', '#b5380a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} /> : null}
          <Icon name="mic" size={36} color="#fff" sw={2} />
        </Press>
        {!last ? (
          <Press onPress={() => { setQi(qi + 1); setCh(0); setRec(false); }} accessibilityLabel="Next question" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="arrow" size={24} color={t.fg} sw={2.4} /></Press>
        ) : (
          <Press onPress={() => swap('/interviews')} accessibilityLabel="Finish interview" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={24} color="#052e22" sw={3} /></Press>
        )}
      </View>
    </Screen>
  );
}
