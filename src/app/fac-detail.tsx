import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, BottomCta, Chip, Disp, Grad, ON_G, ON_G_SUB, Screen, Txt, back, go } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Glow, Pop, Press, Rise } from '@/ui/motion';
import { ArrowList, FactGrid } from '@/ui/parts';

const GLASS = 'rgba(255,251,240,0.16)';

export default function FacDetail() {
  const insets = useSafeAreaInsets();
  const [on, setOn] = useState(false);
  return (
    <Screen scroll={false} glows={[]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}>
        <Grad kind="g2" style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 26, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <Glow size={320} style={{ position: 'absolute', right: -100, top: -60 }} />
          <Press onPress={() => back('/fac-board')} accessibilityLabel="Back to board" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center' }}><Icon name="left" size={24} color={ON_G} /></Press>
          <View style={{ marginTop: 20 }}>
            <Chip bg="rgba(147,197,253,0.2)" fg="#bfdbfe">Guest lecture</Chip>
            <Disp size={38} lh={38} color={ON_G} style={{ marginTop: 12 }}>React in production.</Disp>
            <Txt size={14} color={ON_G_SUB} style={{ marginTop: 10 }}>Nexa Labs · Oct 24 · 90 minutes</Txt>
          </View>
        </Grad>
        <View style={{ padding: 24 }}>
          <Rise><FactGrid items={[['FORMAT', 'On campus'], ['AUDIENCE', '120 students'], ['YOU PROVIDE', 'Hall and slot'], ['REPLY BY', 'Oct 18']]} /></Rise>
          <Disp size={22} ls={-0.03} style={{ marginTop: 28 }}>About</Disp>
          <Txt size={16} lh={25} color="sub" style={{ marginTop: 10 }}>A senior engineer from Nexa Labs will walk students through shipping a React app: structure, state, testing and deploys. It supports the 34% rise in React demand your students are seeing.</Txt>
          <Disp size={22} ls={-0.03} style={{ marginTop: 26 }}>What the partner expects</Disp>
          <ArrowList items={['A hall for 120 students with a projector', 'Announce to third and final-year CSE and IT', 'Share attendance so students earn XP']} />
        </View>
      </ScrollView>
      <BottomCta>
        {!on ? (
          <Btn label="I am interested" lead="star" height={60} onPress={() => setOn(true)} />
        ) : (
          <Pop>
            <Press onPress={() => go('/fac-interests')} style={{ height: 60, borderRadius: 30, backgroundColor: '#10b981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Icon name="check" size={22} color="#052e22" sw={3} />
              <Txt w={8} size={17} color="#052e22">Sent. See my interests</Txt>
              <Icon name="arrow" size={20} color="#052e22" sw={2.6} />
            </Press>
          </Pop>
        )}
      </BottomCta>
    </Screen>
  );
}
