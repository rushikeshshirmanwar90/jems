import React from 'react';
import { View } from 'react-native';
import type { MissedQuestion, RelearnTopic } from '@/lib/jems';
import { useTheme } from '@/theme/ThemeProvider';
import { Group, GroupRow, openLink } from './hig';
import { Icon } from './Icon';
import { Chip, CodeBlock, Txt } from './kit';
import { GrowBar } from './motion';

/** Topics to go back over after a failed mini-assessment, weakest first. Each opens a study link. */
export function RelearnGroup({ topics, title = 'Topics to relearn' }: { topics: RelearnTopic[]; title?: string }) {
  const { t } = useTheme();
  if (topics.length === 0) return null;
  return (
    <Group title={title} note="Based on the questions you missed. Start at the top.">
      {topics.map((topic, i) => {
        const share = (topic.missed / topic.total) * 100;
        return (
          <GroupRow key={topic.topic} first={i === 0} onPress={() => openLink(topic.url)} accessibilityRole="link"
            accessibilityLabel={`${topic.topic}, missed ${topic.missed} of ${topic.total}${topic.lesson ? `, revisit lesson ${topic.lesson}` : ''}. Opens a study link.`}
            style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, paddingVertical: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Txt w={7} size={16} style={{ flexShrink: 1 }}>{topic.topic}</Txt>
              <Chip tone="b" h={24} size={11}>{topic.skill}</Chip>
              <View style={{ flex: 1 }} />
              <Icon name="external" size={17} color={t.dim} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}><GrowBar pct={share} height={6} delay={200} colors={share >= 50 ? ['#ef4444', '#b91c1c'] : ['#f59e0b', '#d97706']} /></View>
              <Txt size={13} color="dim">{`Missed ${topic.missed} of ${topic.total}`}</Txt>
            </View>
            {topic.lesson ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="book" size={15} color={t.brand} />
                <Txt w={6} size={13} color="brand">{`Revisit lesson: ${topic.lesson}`}</Txt>
              </View>
            ) : null}
          </GroupRow>
        );
      })}
    </Group>
  );
}

/** Each wrong or skipped question with the student's answer, the right one and why. */
export function MissedGroup({ missed }: { missed: MissedQuestion[] }) {
  const { t } = useTheme();
  if (missed.length === 0) return null;
  return (
    <Group title={`Questions you missed · ${missed.length}`}>
      {missed.map((q, i) => (
        <GroupRow key={q.id} first={i === 0} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            <Chip tone="b" h={24} size={11}>{q.skill}</Chip>
            <Chip h={24} size={11}>{q.topic}</Chip>
          </View>
          <Txt w={6} size={16} lh={22}>{q.prompt}</Txt>
          {q.code ? <CodeBlock>{q.code}</CodeBlock> : null}
          <View style={{ flexDirection: 'row', gap: 8, padding: 10, borderRadius: 14, backgroundColor: t.dangerbg }}>
            <Icon name="x" size={17} color={t.danger} sw={2.6} />
            <Txt w={6} size={14} lh={20} color="danger" style={{ flex: 1 }}>{q.yourAnswer === null ? 'Skipped' : `Your answer: ${q.yourAnswer}`}</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, padding: 10, borderRadius: 14, backgroundColor: t.goodbg }}>
            <Icon name="check" size={17} color={t.good} sw={2.6} />
            <Txt w={6} size={14} lh={20} color="good" style={{ flex: 1 }}>{`Correct: ${q.correctAnswer}`}</Txt>
          </View>
          {q.explain ? <Txt size={14} lh={21} color="sub">{q.explain}</Txt> : null}
        </GroupRow>
      ))}
    </Group>
  );
}
