import React, { useState } from 'react';
import { View } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, FloatingNav, go, GradKind, IconCircle, Row, Screen, Txt, Eyebrow, Badge as B2 } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { GrowBar, Press, Rise, Spin, useCountUp } from '@/ui/motion';
import { LinkRow, SectionHead } from '@/ui/parts';

const SKILLS: [string, number][] = [['JavaScript', 87], ['HTML & CSS', 92], ['Git', 81], ['SQL', 76]];
const PROJECTS: [string, string, GradKind, string][] = [
  ['JEMS Clone', 'Next.js · MongoDB · live', 'g1', 'J'],
  ['Weather Pulse', 'JavaScript · API · live', 'g2', 'W'],
  ['Expense Tracker', 'React · Chart.js', 'g4', 'E'],
];

export default function Profile() {
  const { t } = useTheme();
  const a = useCountUp(4, 900, 300);
  const b = useCountUp(64, 1300, 300);
  const c = useCountUp(640, 1500, 300);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Screen nav={<FloatingNav kind="student" active="profile" />} glows={[{ top: -80, right: -150, size: 440 }]}>
      <Rise style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
        <Press onPress={() => go('/more')} accessibilityLabel="More" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name="dots" size={22} color={t.fg} /></Press>
      </Rise>
      <Rise delay={60} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 }}>
        <View style={{ width: 96, height: 96 }}>
          <Spin duration={18000} style={{ position: 'absolute', left: 0, top: 0 }}>
            <Svg width={96} height={96}><Circle cx={48} cy={48} r={45} fill="none" stroke={t.brand} strokeWidth={2} strokeDasharray="3 8" strokeLinecap="round" /></Svg>
          </Spin>
          <View style={{ position: 'absolute', left: 8, top: 8 }}><Badge kind="g1" letter="A" size={80} radius={40} fontSize={38} /></View>
        </View>
        <View style={{ flex: 1 }}>
          <Disp size={32} lh={33}>Aarav{'\n'}Sharma</Disp>
          <Txt size={13} color="sub" style={{ marginTop: 6 }}>B.Tech CSE · Final year</Txt>
        </View>
      </Rise>
      <Rise delay={120} style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        <Chip tone="b" icon="target">Full Stack Developer</Chip>
        <Chip tone="g" icon="shield">Level 4</Chip>
      </Rise>
      <Rise delay={180} style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center' }}>
        {[[`${a}`, 'verified skills', false], [`${b}`, 'job ready', true], [`${c}`, 'XP earned', false]].map(([v, l, pct], i) => (
          <React.Fragment key={l as string}>
            {i > 0 ? <View style={{ width: 1, height: 40, backgroundColor: t.line }} /> : null}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Disp size={40}>{v as string}{pct ? <Disp size={18} color="good">%</Disp> : null}</Disp>
              <Txt size={12} color="sub">{l as string}</Txt>
            </View>
          </React.Fragment>
        ))}
      </Rise>
      <Rise delay={240} style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.line, borderRadius: 22, paddingVertical: 8, paddingLeft: 16, paddingRight: 8, minHeight: 60 }}>
        <IconCircle icon="share" bg={t.brandbg} color={t.brand} size={36} iconSize={18} />
        <View style={{ flex: 1 }}>
          <Txt w={7} size={11} color="dim" style={{ letterSpacing: 0.9 }}>PUBLIC PORTFOLIO</Txt>
          <Txt w={6} size={13} numberOfLines={1}>jems.exponentor.com/p/aarav-sharma</Txt>
        </View>
        <Press onPress={copy} style={{ height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: copied ? '#10b981' : t.inv, justifyContent: 'center' }}>
          <Txt w={8} size={13} color={copied ? '#052e22' : t.invfg}>{copied ? 'Copied' : 'Copy'}</Txt>
        </Press>
      </Rise>

      <Disp size={22} ls={-0.03} style={{ marginTop: 28 }}>Verified skills</Disp>
      {SKILLS.map(([n, v], i) => (
        <Rise key={n} delay={300 + i * 70} style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="check" size={16} color={t.good} sw={3} /><Txt w={7} size={15}>{n}</Txt></View>
            <Disp size={18}>{v}</Disp>
          </View>
          <View style={{ marginTop: 8 }}><GrowBar pct={v} delay={400 + i * 100} height={6} /></View>
        </Rise>
      ))}
      <Disp size={22} ls={-0.03} style={{ marginTop: 30 }}>Projects</Disp>
      <View style={{ marginTop: 6 }}>
        {PROJECTS.map(([title, meta, g, ini], i) => (
          <Rise key={title} delay={500 + i * 70}>
            <Row last={i === 2}>
              <Badge kind={g} letter={ini} size={48} radius={15} fontSize={17} />
              <View style={{ flex: 1 }}><Txt w={7} size={16}>{title}</Txt><Txt size={13} color="dim">{meta}</Txt></View>
              <Icon name="right" size={20} color={t.dim} sw={2.4} />
            </Row>
          </Rise>
        ))}
      </View>
      <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Shortcuts</Disp>
      <View style={{ marginTop: 4 }}>
        <LinkRow icon="file" title="Resume builder" sub="ATS score 82" onPress={() => go('/resume')} />
        <LinkRow icon="briefcase" title="Applications" sub="4 in progress" onPress={() => go('/applications')} />
        <LinkRow icon="mic" title="Mock interviews" sub="Last score 78" onPress={() => go('/interviews')} last />
      </View>
    </Screen>
  );
}
