import { Reactive } from './reactive';

type Indexable = { [index: string]: any };

function updateFunction(target: Reactive<any>, name: string, descriptor: PropertyDescriptor, method?: 'smart' | 'wait') {
	return function replacementMethod(this: Reactive<any>, ...args: any[]) {
		if (method) this.holdUpdates = true;
		const original = descriptor.value;
		let r = original.call(this, ...args);
		if (isAsync(original)) {
			r = r.then((res: any) => {
				if (method === 'wait') this.shouldUpdate = true;
				this.handleUpdate(Boolean(method));
				return res;
			});
		} else this.handleUpdate(Boolean(method));

		return r;
	};
}
export function Update(target: Reactive<any>, name: string, descriptor: PropertyDescriptor) {
	const replacementMethod = updateFunction(target, name, descriptor, undefined);
	(target as Indexable)[name] = replacementMethod;
	return replacementMethod;
}

export function SmartUpdate(target: Reactive<any>, name: string, descriptor: PropertyDescriptor) {
	const replacementMethod = updateFunction(target, name, descriptor, 'smart');
	(target as Indexable)[name] = replacementMethod;
	return replacementMethod;
}

export function HoldUpdate(target: Reactive<any>, name: string, descriptor: PropertyDescriptor) {
	const replacementMethod = updateFunction(target, name, descriptor, 'wait');
	(target as Indexable)[name] = replacementMethod;
	return replacementMethod;
}

export const isAsync = (f?: Function) => {
	return f?.constructor.name === 'AsyncFunction' || typeof (f as any)?.then === 'function';
};
