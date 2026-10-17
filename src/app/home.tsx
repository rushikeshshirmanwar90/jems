import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge, Chip, Disp, Eyebrow, FloatingNav, go, Grad, ON_G, Ring, Row, Screen, Txt, IconCircle } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Bob, GrowBar, Pop, Press, PulseRing, Rise, Wiggle, useCountUp } from '@/ui/motion';
import { HeroCard, PulseButton, SectionHead } from '@/ui/parts';
import { IconName } from '@/ui/iconData';
import { getReport, getRoadmap, getStatus, nextLesson, type JemsStatus } from '@/lib/jems';
import { useJems, useJemsData } from '@/lib/jems-store';
import { Group, GroupRow } from '@/ui/hig';

type Step = { title: string; text: string; done: boolean; to: string; cta: string };

function stepsFor(status: JemsStatus): Step[] {
  return [
    { title: 'Profile and skills', text: 'Target role, skills, GitHub and LeetCode', done: status.onboarded, to: '/setup-profile', cta: 'Set up your profile' },
    { title: 'Skill assessment', text: '30 questions on the skills you added', done: status.assessed, to: '/assessment', cta: 'Take the assessment' },
    { title: 'Skill gaps', text: `Compared with ${status.roleLabel} roles at MSMEs`, done: status.roadmapReady, to: '/gaps', cta: 'See my skill gaps' },
    { title: 'Roadmap', text: 'Lessons and practice to close each gap', done: false, to: '/roadmap', cta: 'Open my roadmap' },
  ];
}

const DAYS = ['W', 'T', 'F', 'S', 'S', 'M', 'T'];

function StreakDot({ i }: { i: number }) {
  const { t } = useTheme();
  const done = i < 4;
  const today = i === 4;
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Txt w={7} size={11} color="sub">{today ? 'Today' : DAYS[i]}</Txt>
      <Pop delay={300 + i * 80}>
        <View style={{ width: 38, height: 38, borderRadius: 19, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: today ? t.brandbg : t.surf, borderWidth: 2, borderColor: today ? '#ea580c' : 'transparent' }}>
          {done ? <LinearGradient colors={['#f97316', '#f59e0b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} /> : null}
          {done ? <Icon name="check" size={18} color="#111827" sw={3} /> : today ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.brand }} /> : null}
        </View>
      </Pop>
    </View>
  );
}

const ACTIONS: { label: string; icon: IconName; to: string; tone: 'good' | 'brand' | 'gold' | 'fg' }[] = [
  { label: 'Take a test', icon: 'shield', to: '/assessment', tone: 'good' },
  { label: 'Roadmap', icon: 'target', to: '/roadmap', tone: 'brand' },
  { label: 'Interview', icon: 'mic', to: '/interviews', tone: 'gold' },
  { label: 'Resume', icon: 'file', to: '/resume', tone: 'fg' },
];

export default function Home() {
  const { t } = useTheme();
  const { draft } = useJems();
  const { data: status } = useJemsData(getStatus);
  const { data: report } = useJemsData(getReport);
  const { data: roadmap } = useJemsData(getRoadmap);
  const n = useCountUp(report?.readiness ?? 0, 1600, 300);
  const name = draft.profile.fullName.trim();
  const steps = status ? stepsFor(status) : [];
  const nextIndex = steps.findIndex((s) => !s.done);
  const next = steps[nextIndex];
  const current = roadmap?.modules.find((m) => m.status === 'in_progress');
  const lessonsDone = current ? current.lessons.filter((l) => l.done).length : 0;
  const upNext = current ? nextLesson(current) : null;
  const verified = report?.skills.filter((s) => s.verdict !== 'below') ?? [];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const tone = (k: string) => (k === 'good' ? { bg: t.goodbg, fg: t.good } : k === 'brand' ? { bg: t.brandbg, fg: t.brand } : k === 'gold' ? { bg: t.goldbg, fg: t.gold } : { bg: t.surf2, fg: t.fg });
  return (
    <Screen nav={<FloatingNav kind="student" active="home" />} glows={[{ top: -90, right: -150, size: 440 }, { top: 520, left: -200, size: 420 }]}>
      <Rise style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Badge kind="g1" letter={(name[0] ?? 'J').toUpperCase()} size={48} radius={24} fontSize={22} />
        <View style={{ flex: 1 }}>
          <Txt size={13} color="sub">{greeting}</Txt>
          <Disp size={24} lh={26} ls={-0.03} numberOfLines={1}>{name || 'Welcome to JEMS'}</Disp>
        </View>
        <Press onPress={() => go('/notifications')} accessibilityLabel="Notifications, 3 unread" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={22} color={t.fg} />
          <View style={{ position: 'absolute', right: 11, top: 10, width: 9, height: 9 }}>
            <PulseRing size={9} reach={8} />
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#ea580c', borderWidth: 2, borderColor: t.bg }} />
          </View>
        </Press>
      </Rise>

      <Rise delay={100} style={{ marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <Press onPress={() => go('/skills')} scale={0.97} accessibilityLabel={report ? `Job ready ${report.readiness} percent. Open skill report` : 'Not assessed yet. Open skill report'}>
          <Ring size={148} stroke={14} value={n}>
            {report ? <Disp size={44} lh={44}>{n}<Disp size={20} color="good">%</Disp></Disp> : <Disp size={34} lh={40} color="dim">–</Disp>}
            <Txt w={7} size={12} color="sub">{report ? 'job ready' : 'not assessed'}</Txt>
          </Ring>
        </Press>
        <View style={{ flex: 1 }}>
          <Eyebrow>Your goal</Eyebrow>
          <Disp size={24} lh={26} ls={-0.03} style={{ marginTop: 4 }}>{status?.onboarded ? status.roleLabel : 'Pick your goal'}</Disp>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {report ? <Chip tone="g" icon="shield">{`${verified.length} skills verified`}</Chip> : <Chip tone="b" icon="sparkles">{`${steps.filter((s) => s.done).length} of 4 steps done`}</Chip>}
            {roadmap ? <Chip tone="o" icon="target">{`${roadmap.modules.filter((m) => m.status === 'done').length} of ${roadmap.modules.length} modules`}</Chip> : null}
          </View>
        </View>
      </Rise>

      <Rise delay={200} style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        {DAYS.map((_, i) => <StreakDot key={i} i={i} />)}
      </Rise>

      <Rise delay={300} style={{ marginTop: 22 }}>
        <Press onPress={() => go(current ? `/module?id=${current.id}` : next?.to ?? '/roadmap')} scale={0.97}
          accessibilityLabel={current ? `Continue learning: ${current.title}` : next ? `Next step: ${next.cta}` : 'Open my roadmap'}>
          <HeroCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={11} color="#fdba74" style={{ letterSpacing: 1.5 }}>{current ? `CONTINUE LEARNING · MODULE ${current.index}` : 'YOUR NEXT STEP'}</Txt>
                <Disp size={28} lh={28} ls={-0.03} color={ON_G} style={{ marginTop: 6 }}>{current ? current.title : next ? next.cta : 'Keep going'}</Disp>
                <Txt size={13} color="#e7e5e4" style={{ marginTop: 6 }}>
                  {current ? (upNext ? `Next lesson: ${upNext.title} · ${upNext.minutes} min` : 'Practice and mini-assessment left') : next ? next.text : 'Your roadmap is complete'}
                </Txt>
              </View>
              <PulseButton><Icon name={current ? 'play' : 'arrow'} size={24} color="#c2410c" /></PulseButton>
            </View>
            {current ? (
              <View style={{ marginTop: 16, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,251,240,0.22)', overflow: 'hidden' }}>
                <GrowBar pct={(lessonsDone / current.lessons.length) * 100} delay={600} height={6} colors={['#fffbf0', '#fffbf0']} track="transparent" />
              </View>
            ) : null}
          </HeroCard>
        </Press>
      </Rise>

      {status && nextIndex >= 0 && nextIndex < 3 ? (
        <Rise delay={350} style={{ marginTop: 22 }}>
          <Group title="Your journey" note="Four steps from setup to job-ready.">
            {steps.map((step, i) => {
              const isNext = i === nextIndex;
              return (
                <GroupRow key={step.title} first={i === 0} inset={62} onPress={() => go(step.to)} style={isNext ? { backgroundColor: t.brandbg } : undefined}
                  accessibilityRole="button" accessibilityLabel={`${step.title}${step.done ? ', done' : isNext ? ', next step' : ''}`}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: step.done ? '#10b981' : isNext ? '#ea580c' : t.surf2 }}>
                    {step.done ? <Icon name="check" size={16} color="#fff" sw={3} /> : <Txt w={8} size={14} color={isNext ? '#fff' : 'dim'}>{i + 1}</Txt>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt w={7} size={16} color={isNext ? 'brand' : 'fg'}>{step.title}</Txt>
                    <Txt size={13} color="dim">{step.text}</Txt>
                  </View>
                  <Icon name="right" size={18} color={t.dim} sw={2.4} />
                </GroupRow>
              );
            })}
          </Group>
        </Rise>
      ) : null}

      <Rise delay={400} style={{ marginTop: 22, flexDirection: 'row' }}>
        {ACTIONS.map((a) => {
          const c = tone(a.tone);
          return (
            <Press key={a.label} onPress={() => go(a.to)} accessibilityLabel={a.label} style={{ flex: 1, alignItems: 'center', gap: 8, minHeight: 44 }}>
              <IconCircle icon={a.icon} bg={c.bg} color={c.fg} size={58} iconSize={26} />
              <Txt w={7} size={12}>{a.label}</Txt>
            </Press>
          );
        })}
      </Rise>

      <Rise delay={500} style={{ marginTop: 26 }}><SectionHead title="Best match today" link="See all" onLink={() => go('/jobs')} /></Rise>
      <Rise delay={550}>
        <Row onPress={() => go('/job-detail')} last py={6}>
          <Badge kind="g1" letter="N" size={50} radius={16} fontSize={20} />
          <View style={{ flex: 1 }}>
            <Txt w={7} size={17}>Frontend Intern</Txt>
            <Txt size={13} color="sub">Nexa Labs · Pune · ₹30k/mo</Txt>
            <View style={{ marginTop: 8 }}><GrowBar pct={92} delay={900} height={5} /></View>
          </View>
          <Disp size={32} color="good">92<Disp size={15} color="good">%</Disp></Disp>
        </Row>
      </Rise>

      <Rise delay={600} style={{ marginTop: 14 }}><SectionHead title="Verified skills" link={report ? 'See report' : 'Get verified'} onLink={() => go(report ? '/skills' : status?.onboarded ? '/assessment' : '/setup-profile')} /></Rise>
      <Rise delay={650} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
        {verified.length
          ? verified.map((s) => <Chip key={s.name} tone="g" icon="check" h={32} size={13}>{`${s.name} · ${s.verified[0].toUpperCase()}${s.verified.slice(1)}`}</Chip>)
          : <Txt size={14} lh={20} color="dim">Take the skill assessment to verify your skills.</Txt>}
      </Rise>
    </Screen>
  );
}
