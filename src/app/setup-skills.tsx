import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getSkillCatalog, LEVELS, MIN_SKILLS, SKILL_CATEGORIES, type Skill, type SkillCategory } from '@/lib/jems';
import { useJems } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState, FlowScreen, Group, GroupRow, Segmented, StepProgress, TitleBlock, useShake } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { Btn, Chip, go, Tabs, Txt } from '@/ui/kit';
import { BODY } from '@/ui/fonts';
import { Press, Rise } from '@/ui/motion';

export default function SetupSkills() {
  const { t } = useTheme();
  const { draft, setRating } = useJems();
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [category, setCategory] = useState(0);
  const [query, setQuery] = useState('');
  const { style: shakeStyle, shake } = useShake();

  useEffect(() => { getSkillCatalog().then(setCatalog).catch(() => {}); }, []);

  const cat: SkillCategory = SKILL_CATEGORIES[category].value;
  const q = query.trim().toLowerCase();
  const shown = q ? catalog.filter((s) => s.name.toLowerCase().includes(q)) : catalog.filter((s) => s.category === cat);
  const added = Object.keys(draft.ratings).length;
  const ready = added >= MIN_SKILLS;
  const addedIn = (c: SkillCategory) => catalog.filter((s) => s.category === c && draft.ratings[s.id]).length;

  return (
    <FlowScreen title="Your skills" fallback="/setup-profile" footer={
      <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 14 }, shakeStyle]}>
        <View style={{ flex: 1 }} accessibilityLiveRegion="polite">
          <Txt w={7} size={16}>{added === 1 ? '1 skill added' : `${added} skills added`}</Txt>
          <Txt size={13} color={ready ? 'good' : 'dim'}>{ready ? 'Nice. Add more any time.' : `Add at least ${MIN_SKILLS} to continue`}</Txt>
        </View>
        <Btn label="Continue" icon="arrow" height={54} size={16} style={{ paddingHorizontal: 22, opacity: ready ? 1 : 0.55 }} onPress={() => (ready ? go('/setup-connect') : shake())} />
      </Animated.View>
    }>
      <Rise><StepProgress step={2} /></Rise>
      <TitleBlock delay={60} title="Rate your skills" sub="Be honest. The assessment checks every skill you add here." />

      <Rise delay={120}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: 12, paddingHorizontal: 12, backgroundColor: t.surf2 }}>
          <Icon name="search" size={18} color={t.dim} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search skills, e.g. React, SQL" placeholderTextColor={t.dim}
            autoCapitalize="none" autoCorrect={false} returnKeyType="search" accessibilityLabel="Search skills" clearButtonMode="while-editing"
            style={[{ flex: 1, fontFamily: BODY[5], fontSize: 16, color: t.fg, paddingVertical: 0 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null]} />
          {query && Platform.OS !== 'ios' ? (
            <Press onPress={() => setQuery('')} accessibilityLabel="Clear search" style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} color={t.dim} />
            </Press>
          ) : null}
        </View>
      </Rise>

      {!q ? (
        <Rise delay={160}>
          <Tabs items={SKILL_CATEGORIES.map((c) => (addedIn(c.value) ? `${c.label} · ${addedIn(c.value)}` : c.label))} value={category} onChange={setCategory} style={{ marginHorizontal: -20 }} />
        </Rise>
      ) : null}

      <Animated.View key={q ? 'search' : cat} entering={FadeIn.duration(200)}>
        {catalog.length > 0 && shown.length === 0 ? (
          <EmptyState icon="search" title="No skills match" text={`Nothing called “${query.trim()}” yet. Try a shorter name.`} />
        ) : (
          <Group title={q ? 'Results' : SKILL_CATEGORIES[category].label}>
            {shown.map((skill, i) => {
              const level = draft.ratings[skill.id] ?? null;
              return (
                <GroupRow key={skill.id} first={i === 0} style={styles.row}>
                  <View style={styles.head}>
                    <Txt w={7} size={17} style={{ flex: 1 }}>{skill.name}</Txt>
                    {level ? <Chip tone="g" icon="check" h={26}>Added</Chip> : <Txt size={13} color="dim">Not added</Txt>}
                  </View>
                  <Segmented label={skill.name} options={LEVELS} value={level} onChange={(next) => setRating(skill.id, next)} clearable />
                </GroupRow>
              );
            })}
          </Group>
        )}
      </Animated.View>
      <Txt size={13} lh={18} color="dim" style={{ paddingHorizontal: 4, marginTop: -10 }}>Tap a level again to remove the skill.</Txt>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'column', alignItems: 'stretch', gap: 10, paddingVertical: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
