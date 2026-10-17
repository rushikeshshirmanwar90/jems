# JEMS — mobile app (Expo + React Native)

Bridge the gap between learning and hiring. This is the native app version of JEMS, built from the 40-board motion-first design.

## Run it

```bash
npm install
npx expo start          # press i (iOS simulator), a (Android), or scan the QR with Expo Go
```

Web preview: `npx expo start --web`. Production web build: `npx expo export -p web`.

## What is inside

- **Stack:** Expo SDK 58, React Native 0.88, expo-router (file routes in `src/app`), Reanimated 4 + worklets, gesture-handler, react-native-svg, expo-linear-gradient, expo-haptics, TypeScript.
- **Theme:** light only (warm cream palette). Tokens live in `src/theme/tokens.ts`. Feature cards keep their dark gradient look.
- **Fonts:** Bricolage Grotesque (display) and Geist (body), loaded at startup.
- **Motion kit:** `src/ui/motion.tsx` (rise/pop/slide, count-ups, drawn paths and rings, orb rings, wave bars, marquee, confetti, press feedback with haptics). Respects the OS "reduce motion" setting.
- **UI kit:** `src/ui/kit.tsx` (buttons, chips, rings, gradients, floating nav, form fields, toast, code block).

## Screens (40)

| Area | Routes |
| --- | --- |
| Start | `/` splash, `/onboarding`, `/choose-role`, `/sign-in`, `/sign-up`, `/verify-otp`, `/forgot-password` |
| Student | `/home`, `/skills`, `/skill-test`, `/test-result`, `/career-analysis`, `/goals`, `/roadmap`, `/lesson`, `/jobs` (swipe deck), `/job-detail`, `/applications`, `/interviews`, `/interview-session`, `/learning`, `/notifications`, `/profile`, `/resume`, `/resume-preview`, `/more`, `/settings` |
| Industry | `/co-home`, `/co-openings`, `/co-post-job`, `/co-candidates`, `/co-candidate`, `/co-programs` |
| Institution | `/inst-home`, `/inst-students`, `/inst-insights`, `/inst-collab` |
| Faculty | `/fac-board`, `/fac-detail`, `/fac-interests` |

## Demo logins (Sign in screen → "Try a demo portal")

| Portal | Email | Password |
| --- | --- | --- |
| Student | demo@jems.dev | Demo@1234 |
| Industry | company@jems.dev | Demo@1234 |
| Institution | institution@jems.dev | Demo@1234 |
| Faculty | faculty@jems.dev | Demo@1234 |

## Notes

- All data is local sample data matching the design. There is no backend call yet: the next step is to replace the arrays at the top of each screen with API hooks.
- Jobs: drag a card right to apply, left to pass, up to save, or use the three buttons.
- Check the code with `npx tsc --noEmit`.
