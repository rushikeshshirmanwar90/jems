import React from 'react';
import { View } from 'react-native';
import { getAssessmentInfo } from '@/lib/jems';
import { useJems, useJemsData } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { FlowScreen, Group, GroupRow, Loading, Notice } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { Btn, Disp, go, ON_G, Txt } from '@/ui/kit';
import { Rise, useCountUp } from '@/ui/motion';
import { HeroCard } from '@/ui/parts';

export default function Assessment() {
  const { t } = useTheme();
  const { draft, attempts } = useJems();
  const { data: info, error, reload } = useJemsData(getAssessmentInfo);
  const questions = useCountUp(info?.questionCount ?? 0, 900, 200);
  const minutes = useCountUp(info?.minutes ?? 0, 900, 300);
  const skills = Object.keys(draft.ratings).length || info?.skillCount || 0;
  const resuming = Boolean(attempts.main);

  return (
    <FlowScreen title="Skill assessment" fallback="/skills" onRefresh={reload} footer={
      <Btn label={resuming ? 'Resume assessment' : 'Start assessment'} lead="play" height={58} disabled={!info} onPress={() => go('/skill-test')} />
    }>
      <Rise>
        <HeroCard kind="g2" shadow={false} sheenTone="rgba(255,255,255,0.12)">
          <Txt w={7} size={11} color="#fcd34d" style={{ letterSpacing: 1.5 }}>{`BASED ON YOUR ${skills} SKILLS`}</Txt>
          <Disp size={30} lh={32} ls={-0.03} color={ON_G} style={{ marginTop: 8 }}>Let&apos;s check what you really know</Disp>
          <Txt size={14} lh={20} color="#e7e5e4" style={{ marginTop: 8 }}>One sitting. Your result feeds the skill report and your roadmap.</Txt>
        </HeroCard>
      </Rise>

      {error ? <Notice>{error}</Notice> : !info ? <Loading /> : (
        <>
          <Rise delay={100} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[[String(questions), 'questions'], [`${minutes}`, 'minutes'], [`+${info.codeCount}`, 'code tasks']].map(([v, l], i) => (
              <React.Fragment key={l}>
                {i > 0 ? <View style={{ width: 1, height: 36, backgroundColor: t.line }} /> : null}
                <View style={{ flex: 1, alignItems: 'center' }} accessible accessibilityLabel={`${v} ${l}`}>
                  <Disp size={34} ls={-0.03}>{v}</Disp>
                  <Txt size={12} color="sub">{l}</Txt>
                </View>
              </React.Fragment>
            ))}
          </Rise>

          <Rise delay={160}>
            <Group title="What's covered">
              {info.coverage.map((item, i) => (
                <GroupRow key={item.skill} first={i === 0}>
                  <Txt w={6} size={16} style={{ flex: 1 }}>{item.skill}</Txt>
                  <Txt size={14} color="dim">{`${item.count} questions`}</Txt>
                </GroupRow>
              ))}
            </Group>
          </Rise>

          <Rise delay={220}>
            <Group title="Before you start">
              {info.rules.map((rule, i) => (
                <GroupRow key={rule} first={i === 0} inset={48} style={{ alignItems: 'flex-start' }}>
                  <Icon name="check" size={18} color={t.good} sw={2.8} />
                  <Txt size={15} lh={21} color="sub" style={{ flex: 1 }}>{rule}</Txt>
                </GroupRow>
              ))}
            </Group>
          </Rise>
        </>
      )}
    </FlowScreen>
  );
}
