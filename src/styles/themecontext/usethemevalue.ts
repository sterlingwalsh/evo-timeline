import { useCallback, useMemo, useRef } from 'react';

import { ThemeOptions } from './thememanager';
import { useAppTheme } from './theme';

export interface UseThemeValueOptions {
	theme?: string;
}

// Can be used in initialization function, prefer using useThemeValues
export const getThemeValue = (key: string) =>
	getComputedStyle(document.documentElement)?.getPropertyValue(key).trim() ?? '';
export const getREM = (rem: number = 1) => {
	const size = getComputedStyle(document.documentElement).fontSize;
	const val = parseFloat(size);
	return rem * val;
};

function getThemeValues<Key extends string = string>(themingOptions: Required<ThemeOptions>) {
	return function (variables: Key[] | Readonly<Key[]>, options: UseThemeValueOptions = {}) {
		const { theme: themeKey } = options;
		const vals: Record<string, string> = {};

		let el = document.documentElement;
		if (themeKey) {
			const div = document.createElement('div');
			div.classList.add(themingOptions.themePrefix + themeKey);
			document.documentElement.appendChild(div);
			el = div;
		}
		const style = getComputedStyle(el);
		for (let i = 0; i < variables.length; i++) {
			const v = variables[i];
			vals[v] = style.getPropertyValue(v).trim();
		}
		if (themeKey) {
			document.documentElement.removeChild(el);
		}
		return vals;
	};
}

export function useGetThemeValues() {
	const [, , themingOptions] = useAppTheme();
	const getter = useCallback(
		<Key extends string = string>(variables: Key[] | Readonly<Key[]>, options: UseThemeValueOptions = {}) => {
			return getThemeValues(themingOptions)(variables, options);
		},
		[themingOptions]
	);
	return getter;
}

// Pull css variable values updating on theme change
export function useThemeValues<Key extends string = string, Mapped = Record<Key, string>>(
	variables: Key[] | Readonly<Key[]>,
	map?: (value: Record<Key, string>) => Mapped,
	onChange?: (value: Mapped) => void,
	options: UseThemeValueOptions = {}
): Mapped | undefined {
	const { theme: themeKey } = options;
	const [theme, , themingOptions] = useAppTheme();
	const refs = useRef({ variables, onChange });
	refs.current = { onChange, variables };

	const values = useMemo(() => {
		const vals = getThemeValues(themingOptions)(variables, options);
		if (map) {
			const finalVals = map(vals);
			onChange?.(finalVals as Mapped);
			return finalVals as Mapped;
		} else {
			onChange?.(vals as Mapped);
			return vals as Mapped;
		}
	}, [theme, themeKey]);

	return values;
}
