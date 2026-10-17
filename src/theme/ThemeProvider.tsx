import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext } from 'react';
import { lightTokens, Tokens } from './tokens';

interface ThemeCtx {
  t: Tokens;
}

const Ctx = createContext<ThemeCtx>({ t: lightTokens });
const value: ThemeCtx = { t: lightTokens };

/** JEMS is light-only. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={value}>
      <StatusBar style="dark" />
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
