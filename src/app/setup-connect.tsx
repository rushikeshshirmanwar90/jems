import React, { useEffect, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { errorMessage } from '@/lib/http';
import { GITHUB_PATTERN, LEETCODE_PATTERN, MAX_REPOS, saveOnboarding, verifyGithub, verifyLeetcode } from '@/lib/jems';
import { useJems } from '@/lib/jems-store';
import { useTheme } from '@/theme/ThemeProvider';
import { buzz, CheckCircle, FlowScreen, GithubMark, Group, GroupRow, Spinner, StepProgress, TitleBlock, useShake, useToast } from '@/ui/hig';
import { Icon } from '@/ui/Icon';
import { Btn, Chip, go, mono, Txt } from '@/ui/kit';
import { Rise } from '@/ui/motion';

type CheckState = { checking: boolean; error: string };

/** Verifies a profile link a moment after the student stops typing a valid one. */
function useLinkCheck<T>(value: string, pattern: RegExp, found: T | null, verify: (link: string) => Promise<T>, onFound: (result: T) => void): CheckState & { valid: boolean } {
  const [state, setState] = useState<CheckState>({ checking: false, error: '' });
  const valid = pattern.test(value.trim());
  useEffect(() => {
    if (!valid || found) return;
    let alive = true;
    const timer = setTimeout(() => {
      setState({ checking: true, error: '' });
      verify(value)
        .then((result) => { if (!alive) return; setState({ checking: false, error: '' }); buzz('success'); onFound(result); })
        .catch((err) => { if (!alive) return; setState({ checking: false, error: errorMessage(err) }); buzz('error'); });
    }, 700);
    return () => { alive = false; clearTimeout(timer); };
    // Re-run only when the link itself changes; the callbacks are recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, valid, found]);
  return { ...state, checking: state.checking && valid && !found, valid };
}

export default function SetupConnect() {
  const { t } = useTheme();
  const toast = useToast();
  const { draft, setLinks, lookups, setLookup } = useJems();
  const { links } = draft;
  const [touched, setTouched] = useState({ github: false, leetcode: false });
  const [showAll, setShowAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const { style: shakeStyle, shake } = useShake();
  const { style: repoShake, shake: shakeRepos } = useShake();

  const github = useLinkCheck(links.github, GITHUB_PATTERN, lookups.github, verifyGithub, (result) => setLookup('github', result));
  const leetcode = useLinkCheck(links.leetcode, LEETCODE_PATTERN, lookups.leetcode, verifyLeetcode, (result) => setLookup('leetcode', result));

  const repos = lookups.github?.repos ?? [];
  const visibleRepos = showAll ? repos : repos.slice(0, 3);

  function toggleRepo(name: string) {
    const picked = links.repos.includes(name);
    if (!picked && links.repos.length >= MAX_REPOS) {
      shakeRepos();
      toast.show(`Pick up to ${MAX_REPOS}. Untick one first.`);
      return;
    }
    buzz('light');
    setLinks({ repos: picked ? links.repos.filter((r) => r !== name) : [...links.repos, name] });
  }

  async function start() {
    if (!lookups.github || links.repos.length === 0) {
      shake();
      toast.show(!lookups.github ? 'Add your GitHub link first.' : 'Pick at least one repo.');
      return;
    }
    setSaving(true);
    try {
      await saveOnboarding(draft, lookups);
      go('/assessment');
    } catch (err) {
      toast.show(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const githubError = !lookups.github && (github.error || (touched.github && links.github && !github.valid ? 'Use a link like github.com/your-name' : ''));
  const leetcodeError = !lookups.leetcode && (leetcode.error || (touched.leetcode && links.leetcode && !leetcode.valid ? 'Use a link like leetcode.com/u/your-name' : ''));

  return (
    <FlowScreen title="Connect profiles" fallback="/setup-skills" overlay={toast.node} footer={
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="shield" size={17} color={t.brand} />
          <Txt size={13} lh={18} color="sub" style={{ flex: 1 }}>We read public data only. Analysis runs while you take the assessment.</Txt>
        </View>
        <Animated.View style={shakeStyle}>
          <Btn label={saving ? 'Saving…' : 'Start assessment'} icon="arrow" height={58} disabled={saving} onPress={start} />
        </Animated.View>
      </View>
    }>
      <Rise><StepProgress step={3} /></Rise>
      <TitleBlock delay={60} title="Show us your work" sub="Your code and problem-solving history give us a real read on projects and DSA." />

      <Rise delay={120}>
        <Animated.View layout={LinearTransition}>
          <Group title="GitHub" action={<Status checking={github.checking} verified={Boolean(lookups.github)} />}>
            <GroupRow first>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.surf2, alignItems: 'center', justifyContent: 'center' }}><GithubMark size={20} color={t.fg} /></View>
              <LinkInput value={links.github} placeholder="github.com/your-username" label="GitHub profile link" ok={Boolean(lookups.github)}
                onChange={(value) => { setLinks({ github: value, repos: [] }); if (lookups.github) setLookup('github', null); }}
                onBlur={() => setTouched((s) => ({ ...s, github: true }))} />
            </GroupRow>
            {lookups.github ? (
              <Animated.View entering={FadeInDown.duration(220)}>
                <GroupRow>
                  <Animated.View style={[{ flex: 1 }, repoShake]}>
                    <Txt size={14} lh={20} color="sub">{`${lookups.github.repoCount} public repos found. Pick up to ${MAX_REPOS} for review.`}</Txt>
                  </Animated.View>
                </GroupRow>
                {visibleRepos.map((repo) => {
                  const picked = links.repos.includes(repo.name);
                  const meta = [repo.language, repo.isFork ? 'fork' : null].filter(Boolean).join(' · ');
                  return (
                    <GroupRow key={repo.name} inset={56} onPress={() => toggleRepo(repo.name)} accessibilityRole="checkbox" accessibilityState={{ checked: picked }} accessibilityLabel={meta ? `${repo.name}, ${meta}` : repo.name}>
                      <CheckCircle on={picked} color="#ea580c" />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Txt w={picked ? 7 : 5} size={15} numberOfLines={1} style={{ fontFamily: mono }}>{repo.name}</Txt>
                        {repo.description ? <Txt size={12} color="dim" numberOfLines={1} style={{ marginTop: 2 }}>{repo.description}</Txt> : null}
                      </View>
                      {meta ? <Txt size={13} color="dim">{meta}</Txt> : null}
                    </GroupRow>
                  );
                })}
                {repos.length > 3 ? (
                  <GroupRow onPress={() => setShowAll((v) => !v)} accessibilityRole="button" style={{ justifyContent: 'center' }}>
                    <Txt w={7} size={15} color="brand">{showAll ? 'Show fewer' : `Show ${repos.length - 3} more repos`}</Txt>
                  </GroupRow>
                ) : null}
              </Animated.View>
            ) : null}
          </Group>
          {githubError ? <Txt size={13} color="danger" style={{ marginTop: 8, paddingHorizontal: 4 }}>{githubError}</Txt> : null}
        </Animated.View>
      </Rise>

      <Rise delay={180}>
        <Group title="LeetCode · optional" action={<Status checking={leetcode.checking} verified={Boolean(lookups.leetcode)} />}>
          <GroupRow first>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.goldbg, alignItems: 'center', justifyContent: 'center' }}><Icon name="code" size={20} color={t.gold} sw={2.4} /></View>
            <LinkInput value={links.leetcode} placeholder="leetcode.com/u/your-username" label="LeetCode profile link" ok={Boolean(lookups.leetcode)}
              onChange={(value) => { setLinks({ leetcode: value }); if (lookups.leetcode) setLookup('leetcode', null); }}
              onBlur={() => setTouched((s) => ({ ...s, leetcode: true }))} />
          </GroupRow>
          {lookups.leetcode ? (
            <Animated.View entering={FadeInDown.duration(220)}>
              <GroupRow>
                <Txt size={14} lh={20} color="sub" style={{ flex: 1 }}>
                  {`Profile found. ${lookups.leetcode.solved} problems solved (${lookups.leetcode.byDifficulty.map((d) => `${d.solved} ${d.label.toLowerCase()}`).join(', ')}).`}
                </Txt>
              </GroupRow>
            </Animated.View>
          ) : null}
        </Group>
        {leetcodeError ? <Txt size={13} color="danger" style={{ marginTop: 8, paddingHorizontal: 4 }}>{leetcodeError}</Txt> : null}
      </Rise>
    </FlowScreen>
  );
}

function LinkInput({ value, placeholder, label, ok, onChange, onBlur }: { value: string; placeholder: string; label: string; ok: boolean; onChange: (v: string) => void; onBlur: () => void }) {
  const { t } = useTheme();
  return (
    <TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder={placeholder} placeholderTextColor={t.dim} accessibilityLabel={label}
      autoCapitalize="none" autoCorrect={false} keyboardType="url" textContentType="URL" returnKeyType="done"
      style={[{ flex: 1, minHeight: 44, fontFamily: mono, fontSize: 15, color: ok ? t.good : t.fg, paddingVertical: 0 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null]} />
  );
}

function Status({ checking, verified }: { checking: boolean; verified: boolean }) {
  if (verified) return <Chip tone="g" icon="check" h={24} size={11}>Verified</Chip>;
  if (checking) return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Spinner /><Txt size={13} color="dim">Checking…</Txt></View>;
  return null;
}
