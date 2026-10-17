import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, BottomCta, Btn, Chip, Disp, Eyebrow, go, Ring, Row, Screen, Tone, Txt } from '@/ui/kit';
import { Press, Rise } from '@/ui/motion';

const TIPS: [string, number][] = [['Add a two line summary at the top', 5], ['Quantify impact in your projects', 4], ['Add your verified SQL score', 3], ['Link your GitHub profile', 3]];
const SECS: [string, Tone, string][] = [['Summary', 'o', 'Needs work'], ['Education', 'g', 'Complete'], ['Verified skills', 'g', 'Auto-filled'], ['Projects', 'g', '3 added'], ['Experience', '', 'Optional']];

function TipBtn({ on, onPress }: { on: boolean; onPress: () => void }) {
  const { t } = useTheme();
  return (
    <Press onPress={onPress} accessibilityState={{ selected: on }} style={{ height: 44, minWidth: 84, paddingHorizontal: 16, borderRadius: 22, backgroundColor: on ? '#10b981' : t.inv, alignItems: 'center', justifyContent: 'center' }}>
      <Txt w={8} size={13} color={on ? '#052e22' : t.invfg}>{on ? 'Done' : 'Apply'}</Txt>
    </Press>
  );
}

export default function Resume() {
  const { t } = useTheme();
  const [tips, setTips] = useState([false, false, false, false]);
  const [shown, setShown] = useState(0);
  const target = 74 + tips.reduce((a, on, i) => a + (on ? TIPS[i][1] : 0), 0);
  useEffect(() => {
    const id = setInterval(() => setShown((s) => (s < target ? s + 1 : s > target ? s - 1 : s)), 22);
    return () => clearInterval(id);
  }, [target]);
  const verdict = shown >= 90 ? 'Recruiter ready.' : shown >= 80 ? 'Looking strong.' : 'Good start.';
  return (
    <Screen bottom={150} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><BackBtn to="/profile" /></Rise>
      <Rise delay={50} style={{ marginTop: 20 }}><Eyebrow>Resume builder</Eyebrow></Rise>
      <Rise delay={100} style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 10 }}>
        <Ring size={132} stroke={13} value={shown}>
          <Disp size={44} lh={44}>{shown}</Disp>
          <Txt w={6} size={12} color="sub">ATS score</Txt>
        </Ring>
        <View style={{ flex: 1 }}>
          <Disp size={30} lh={31}>{verdict}</Disp>
          <Txt size={14} lh={20} color="sub" style={{ marginTop: 8 }}>Recruiters’ software reads your resume first. Fix the tips below.</Txt>
        </View>
      </Rise>
      <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Boost your score</Disp>
      <View style={{ marginTop: 2 }}>
        {TIPS.map(([text, pts], i) => (
          <Rise key={text} delay={200 + i * 60}>
            <Row last={i === 3}>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={15} lh={20}>{text}</Txt>
                <Chip tone="g" h={24} style={{ marginTop: 6 }}>{`+${pts} ATS`}</Chip>
              </View>
              <TipBtn on={tips[i]} onPress={() => setTips(tips.map((v, k) => (k === i ? !v : v)))} />
            </Row>
          </Rise>
        ))}
      </View>
      <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Sections</Disp>
      <View style={{ marginTop: 2 }}>
        {SECS.map(([n, tone, tag], i) => (
          <Row key={n} py={12} last={i === 4}>
            <Txt w={7} size={16} style={{ flex: 1 }}>{n}</Txt>
            <Chip tone={tone}>{tag}</Chip>
          </Row>
        ))}
      </View>
      <BottomCta><Btn label="Preview resume" lead="eye" height={60} onPress={() => go('/resume-preview')} /></BottomCta>
    </Screen>
  );
}
