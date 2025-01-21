import React, { useCallback, useState } from 'react';

type ThemeProps = React.PropsWithChildren<{
	className?: string;
}>;

export interface ThemeOptions {
	themePrefix?: string;
	storageKey?: string;
}

export function themingFactory<T extends string = string>(themes: T[] | Readonly<T[]>, initialTheme: T, options: ThemeOptions = {}) {
	const { themePrefix = 'theme__', storageKey = 'app_theme' } = options;
	const optionsWithDefaults = { themePrefix, storageKey };

	const ThemeContext = React.createContext<[T, (theme: T) => void, Required<ThemeOptions>]>([initialTheme, () => { }, optionsWithDefaults]);
	const useAppTheme = () => React.useContext(ThemeContext);

	function ThemeProvider({ children, className }: ThemeProps) {
		const [theme, setTheme] = useState<T>(() => {
			const local = window.localStorage.getItem(storageKey) as T;
			let toUse = initialTheme;
			if (local && themes.includes(local)) {
				toUse = local;
			}

			return toUse;
		});

		const themeCallback = useCallback((theme: T) => {
			setTheme(theme);
		}, []);
		return <ThemeContext.Provider value={[theme, themeCallback, optionsWithDefaults]}>
			<div className={`${themePrefix + theme}${className ? ` ${className}` : ''}`} style={{ display: 'contents' }}>
				{children}
			</div>
		</ThemeContext.Provider>;
	}
	return { ThemeProvider, useAppTheme };
}
