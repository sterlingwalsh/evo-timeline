import { themingFactory } from "./thememanager";


export const themes = ['dark', 'light'] as const;

const { ThemeProvider: prov, useAppTheme: hook } = themingFactory([...themes, 'print'], 'dark');

export const ThemeProvider = prov;
export const useAppTheme = hook;
