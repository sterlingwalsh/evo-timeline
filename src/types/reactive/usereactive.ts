import { useState } from 'react';
import { Reactive } from './reactive';
import { ExcludeMethods, ReactiveState } from './type';

export const useReactive = <T extends Reactive = Reactive, S = ExcludeMethods<T>>(cls: T | (() => T)) => {
	const [state, update] = useState<ReactiveState<T, S>>(() => {
		if (!(cls instanceof Reactive)) cls = cls();
		return [cls.createState() as S, cls] as const;
	});

	if (cls instanceof Reactive && state[1] !== cls) {
		cls.setOnUpdate(update as any);
		const newState = [cls.createState() as S, cls] as ReactiveState<T, S>;
		update(newState);
		return newState;
	} else {
		state[1].setOnUpdate(update as any);
		return state;
	}
};
