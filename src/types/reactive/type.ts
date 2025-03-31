export type ExcludeMethods<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };

export type ReactiveUpdateFunction<T, S = ExcludeMethods<T>> = (state: [S, T]) => void;

export type ReactiveState<T, S = ExcludeMethods<T>> = readonly [S, T];
