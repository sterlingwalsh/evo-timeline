import { ExcludeMethods, ReactiveUpdateFunction } from './type';

export interface ReactiveArgs<T = any, S = ExcludeMethods<T>> {
	onUpdate?: ReactiveUpdateFunction<T, S>;
}

export abstract class Reactive<T = any, S = ExcludeMethods<T>> {
	protected holdUpdates: boolean = false;
	protected shouldUpdate: boolean = false;

	isLoading = false;

	abstract createState(): S;
	_onUpdate?: ReactiveUpdateFunction<T, S>;
	setOnUpdate(onUpdate: ReactiveUpdateFunction<T, S>) {
		this._onUpdate = onUpdate;
	}

	constructor(args?: ReactiveArgs<T, S>) {
		if (args?.onUpdate) this.setOnUpdate(args.onUpdate);
	}

	handleUpdate(final?: boolean, force?: boolean) {
		if (force) {
			const state = this.createState();
			this._onUpdate?.([state, this as any]);
		} else if (this.holdUpdates && !final) {
			this.shouldUpdate = true;
		} else if (final && this.holdUpdates ? this.shouldUpdate : true) {
			const state = this.createState();
			this._onUpdate?.([state, this as any]);
			this.shouldUpdate = false;
			this.holdUpdates = false;
		} else {
			this.holdUpdates = false;
		}
	}
}
