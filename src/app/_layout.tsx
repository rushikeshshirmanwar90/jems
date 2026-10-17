import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JemsProvider } from '@/lib/jems-store';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontMap } from '@/ui/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

const SLIDE = [
  'job-detail', 'lesson', 'interview-session', 'resume-preview', 'co-candidate', 'fac-detail',
  'co-post-job', 'settings', 'notifications', 'more', 'learning', 'resume', 'career-analysis', 'goals',
  'sign-in', 'sign-up', 'verify-otp', 'forgot-password', 'choose-role',
  'setup-profile', 'setup-skills', 'setup-connect', 'assessment', 'gaps', 'module',
];

function ThemedStack() {
  const { t } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 220,
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      {SLIDE.map((name) => (
        <Stack.Screen key={name} name={name} options={{ animation: 'slide_from_right', animationDuration: 280 }} />
      ))}
      <Stack.Screen name="test-result" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
      {/* The test asks before leaving, so no swipe-back. */}
      <Stack.Screen name="skill-test" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fontMap);
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <JemsProvider>
            <ThemedStack />
          </JemsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
