import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BackBtn, Chip, Disp, Eyebrow, FloatingNav, go, Grad, GradKind, ON_G, Ring, Row, Screen, Txt } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { IconName } from '@/ui/iconData';
import { Press, Rise, useCountUp } from '@/ui/motion';

const TILES: [GradKind, string, number][] = [['g1', 'Frontend Developer', 7], ['g2', 'Backend Developer', 8], ['g4', 'Data Analyst', 6], ['g3', 'UI/UX Designer', 6]];
const MODS: [string, string, IconName][] = [
  ['React Fundamentals', '45 min · Intermediate · in progress', 'code'],
  ['TypeScript Essentials', '40 min · Intermediate', 'layers'],
  ['REST APIs with Express', '55 min · Intermediate', 'zap'],
];

export default function Learning() {
  const { t } = useTheme();
  const n = useCountUp(26, 1200, 300);
  return (
    <Screen nav={<FloatingNav kind="student" active="learn" />} glows={[{ top: -90, left: -160, size: 440 }]}>
      <Rise><BackBtn to="/more" /></Rise>
      <Rise delay={50} style={{ marginTop: 22 }}><Eyebrow>Learning paths</Eyebrow></Rise>
      <Rise delay={100}><Disp size={40} lh={40} style={{ marginTop: 6 }}>Learn it in{'\n'}the right order.</Disp></Rise>
      <Rise delay={180} style={{ marginTop: 18 }}>
        <Row onPress={() => go('/roadmap')} last>
          <Ring size={64} stroke={8} value={n} colors={['#f97316', '#f97316']}>
            <Disp size={17}>{n}%</Disp>
          </Ring>
          <View style={{ flex: 1 }}>
            <Eyebrow>Your path</Eyebrow>
            <Disp size={24} ls={-0.03}>Full Stack Developer</Disp>
            <Txt size={13} color="dim">2 of 8 modules done</Txt>
          </View>
          <Icon name="arrow" size={22} color={t.brand} sw={2.6} />
        </Row>
      </Rise>
      <Disp size={22} ls={-0.03} style={{ marginTop: 14 }}>Explore paths</Disp>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, marginTop: 12 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
        {TILES.map(([g, title, n2], i) => (
          <Rise key={title} delay={250 + i * 80}>
            <Press onPress={() => go('/roadmap')}>
              <Grad kind={g} style={{ width: 160, height: 190, borderRadius: 28, padding: 16, justifyContent: 'space-between' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,251,240,0.18)', alignItems: 'center', justifyContent: 'center' }}><Icon name="code" size={20} color={ON_G} /></View>
                <View>
                  <Disp size={22} lh={24} ls={-0.03} color={ON_G}>{title}</Disp>
                  <Txt size={12} color="#e7e5e4" style={{ marginTop: 6 }}>{n2} modules</Txt>
                </View>
              </Grad>
            </Press>
          </Rise>
        ))}
      </ScrollView>
      <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>Recommended modules</Disp>
      <View style={{ marginTop: 4 }}>
        {MODS.map(([title, meta, icon], i) => (
          <Rise key={title} delay={400 + i * 70}>
            <Row onPress={() => go('/lesson')} last={i === 2}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={20} color={t.fg} /></View>
              <View style={{ flex: 1 }}><Txt w={7} size={16}>{title}</Txt><Txt size={13} color="dim">{meta}</Txt></View>
              <Chip tone="o">+80 XP</Chip>
            </Row>
          </Rise>
        ))}
      </View>
    </Screen>
  );
}
