import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { errorMessage } from '@/lib/http';
import { getReport, getStatus, levelLabel, refreshSources, STRENGTH_TONE, VERDICT_META, type SkillReport } from '@/lib/jems';
import { useJemsData } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState, Group, GroupRow, Loading, Notice, openLink, Spinner, useToast } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { Btn, Chip, Disp, Eyebrow, FloatingNav, go, mono, Ring, Screen, Tone, Txt } from '@/ui/kit';
import { Confetti, GrowBar, Press, Rise, useCountUp } from '@/ui/motion';

const DIFFICULTY_COLORS: Record<string, [string, string]> = { Easy: ['#34d399', '#10b981'], Medium: ['#fbbf24', '#f59e0b'], Hard: ['#f87171', '#ef4444'] };

export default function Skills() {
  const { t } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { celebrate } = useLocalSearchParams<{ celebrate?: string }>();
  const { data: report, error, reload } = useJemsData(getReport);
  const { data: status } = useJemsData(getStatus);
  const [refreshing, setRefreshing] = useState(false);
  const [pulling, setPulling] = useState(false);

  /** Fetches the GitHub and LeetCode profiles again now, whatever their age, and rebuilds the report. */
  const refreshProfiles = useCallback(async () => {
    setRefreshing(true);
    try {
      const { refreshed, failed } = await refreshSources({ force: true });
      await reload();
      if (failed.length) toast.show(`Couldn't update ${failed.join(' and ')}. Showing the last data.`);
      else if (refreshed) toast.show('Profiles updated');
    } catch (err) {
      toast.show(errorMessage(err));
    } finally {
      setRefreshing(false);
    }
  }, [reload, toast]);

  // Fresh from the assessment: one confetti burst, then drop the flag so it doesn't replay.
  const burst = celebrate === '1' && Boolean(report);
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => router.setParams({ celebrate: undefined } as never), 3500);
    return () => clearTimeout(timer);
  }, [burst]);

  const onPull = async () => { setPulling(true); try { await (report ? refreshProfiles() : reload()); } finally { setPulling(false); } };

  return (
    <Screen scroll={false} nav={<FloatingNav kind="student" active="skills" />} glows={[{ top: -90, left: -160, size: 440 }]}
      overlay={<>{burst ? <Confetti count={26} start={300} height={880} /> : null}{toast.node}</>}>
      <ScrollView contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 130 + insets.bottom, gap: 22 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={pulling} onRefresh={onPull} tintColor={t.brand} colors={[t.brand]} />}>
        <Rise style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Eyebrow>Skill report</Eyebrow>
            {report ? <Txt size={13} color="dim" style={{ marginTop: 2 }}>{refreshing ? 'Updating…' : report.updatedLabel}</Txt> : null}
          </View>
          {report ? (
            refreshing ? <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Spinner /></View> : (
              <Press onPress={refreshProfiles} accessibilityLabel="Update GitHub and LeetCode data" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="refresh" size={20} color={t.fg} sw={2.2} />
              </Press>
            )
          ) : null}
        </Rise>

        {error ? <Notice>{error}</Notice> : report === undefined ? <Loading /> : report === null ? (
          <EmptyState icon="shield" title="No report yet" text="Take the skill assessment and your verified skill report shows up here."
            action={<Btn label={status?.onboarded ? 'Take the assessment' : 'Get started'} icon="arrow" height={56} onPress={() => go(status?.onboarded ? '/assessment' : '/setup-profile')} />} />
        ) : <ReportBody report={report} />}
      </ScrollView>
    </Screen>
  );
}

function ReportBody({ report }: { report: SkillReport }) {
  const { t } = useTheme();
  const readiness = useCountUp(report.readiness, 1500, 250);
  const solved = useCountUp(report.dsa?.solved ?? 0, 1100, 400);

  return (
    <>
      <Rise delay={60} style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <View accessible accessibilityLabel={`Overall readiness ${report.readiness} out of 100`}>
          <Ring size={136} stroke={13} value={readiness}>
            <Disp size={40} lh={40}>{readiness}<Disp size={18} color="good">%</Disp></Disp>
            <Txt w={7} size={11} color="sub">ready</Txt>
          </Ring>
        </View>
        <View style={{ flex: 1 }}>
          <Disp size={23} lh={26} ls={-0.03}>{report.headline}</Disp>
          <Txt size={14} lh={20} color="sub" style={{ marginTop: 6 }}>{report.summary}</Txt>
        </View>
      </Rise>

      <Rise delay={120} style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[['Assessment', report.scores.assessment], ['Projects', report.scores.projects], ['DSA', report.scores.dsa]].map(([label, value], i) => (
          <React.Fragment key={label as string}>
            {i > 0 ? <View style={{ width: 1, height: 38, backgroundColor: t.line }} /> : null}
            <View style={{ flex: 1, alignItems: 'center' }} accessible accessibilityLabel={`${label}: ${value === null ? 'not checked' : `${value} percent`}`}>
              <Disp size={30} ls={-0.03}>{value === null ? '–' : value}{value === null ? null : <Disp size={15} color="good">%</Disp>}</Disp>
              <Txt size={12} color="sub">{label as string}</Txt>
            </View>
          </React.Fragment>
        ))}
      </Rise>

      <Rise delay={180}>
        <Group title="Self-rated vs verified" note="What you said against what the assessment found.">
          {report.skills.map((skill, i) => {
            const verdict = VERDICT_META[skill.verdict];
            return (
              <GroupRow key={skill.name} first={i === 0} accessibilityLabel={`${skill.name}: you said ${levelLabel(skill.selfRated)}, verified ${levelLabel(skill.verified)}. ${verdict.label}.`}>
                <Txt w={7} size={16} numberOfLines={1} style={{ maxWidth: '38%' }}>{skill.name}</Txt>
                <Txt size={13} color="dim" numberOfLines={1} align="right" style={{ flex: 1 }}>{`${levelLabel(skill.selfRated)} → ${levelLabel(skill.verified)}`}</Txt>
                <Chip tone={verdict.tone as Tone} h={26}>{verdict.label}</Chip>
              </GroupRow>
            );
          })}
        </Group>
      </Rise>

      <Rise delay={240}>
        {report.dsa ? (
          <Group title={`DSA · LeetCode ${report.dsa.username}`}>
            <GroupRow first style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14, paddingVertical: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Disp size={36} ls={-0.03}>{solved}</Disp>
                <Txt size={14} color="sub">problems solved</Txt>
              </View>
              {report.dsa.byDifficulty.map((d, i) => (
                <View key={d.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }} accessible accessibilityLabel={`${d.label}: ${d.solved} solved of ${d.target} target`}>
                  <Txt size={14} color="sub" style={{ width: 62 }}>{d.label}</Txt>
                  <View style={{ flex: 1 }}><GrowBar pct={Math.min(100, (d.solved / d.target) * 100)} height={7} delay={350 + i * 150} colors={DIFFICULTY_COLORS[d.label]} /></View>
                  <Txt w={7} size={14} align="right" style={{ width: 36 }}>{d.solved}</Txt>
                </View>
              ))}
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {report.dsa.topics.map((topic) => <Chip key={topic.name} tone={STRENGTH_TONE[topic.strength] as Tone} h={26}>{topic.name}</Chip>)}
              </View>
            </GroupRow>
          </Group>
        ) : (
          <Group title="DSA">
            <GroupRow first onPress={() => go('/setup-connect')} accessibilityRole="button" accessibilityLabel="Connect LeetCode to get your DSA checked">
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.goldbg, alignItems: 'center', justifyContent: 'center' }}><Icon name="code" size={20} color={t.gold} sw={2.4} /></View>
              <View style={{ flex: 1 }}>
                <Txt w={7} size={16}>DSA not checked</Txt>
                <Txt size={13} color="dim">Connect LeetCode to get scored</Txt>
              </View>
              <Icon name="right" size={20} color={t.dim} sw={2.4} />
            </GroupRow>
          </Group>
        )}
      </Rise>

      <Rise delay={300}>
        <Group title={`Projects · ${report.projects.length} reviewed`}>
          {report.projects.map((project, i) => (
            <GroupRow key={project.name} first={i === 0} onPress={() => openLink(project.url)} accessibilityRole="link" accessibilityLabel={`${project.name} on GitHub`}
              style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10, paddingVertical: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Txt w={7} size={16} numberOfLines={1} style={{ flex: 1, fontFamily: mono }}>{project.name}</Txt>
                {project.language ? <Txt size={13} color="dim">{project.language}</Txt> : null}
                <Icon name="external" size={16} color={t.dim} />
              </View>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {project.tags.map((tag) => <Chip key={tag.label} tone={tag.tone} h={26}>{tag.label}</Chip>)}
              </View>
            </GroupRow>
          ))}
        </Group>
      </Rise>

      <Rise delay={360}>
        <Btn label="See my skill gaps" icon="arrow" height={58} onPress={() => go('/gaps')} />
      </Rise>
    </>
  );
}
